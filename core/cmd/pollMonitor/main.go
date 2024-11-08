package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	_ "github.com/lib/pq"
	"github.com/sebzz2k2/log-pose/core/pkg"
	"github.com/sebzz2k2/log-pose/core/pkg/pollers"
)

type AdditionalInfo struct {
	Method  string                 `json:"method"`
	URL     string                 `json:"url"`
	Body    map[string]interface{} `json:"body,omitempty"`
	Headers map[string]string      `json:"headers,omitempty"`
}

var message struct {
	Id             string         `json:"id"`
	Retries        int            `json:"retries"`
	AdditionalInfo AdditionalInfo `json:"additional_info"`
}

type FailedMonitor struct {
	OrgID       string `json:"org_id"`
	FailCount   int    `json:"fail_count"`
	AlertSentTs int32  `json:"alert_sent_ts"`
}

func updateFailedMonitorCount(monitorId string, db *sql.DB) int {
	ctx := context.Background()
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer tx.Rollback()
	var failedMonitor FailedMonitor
	if err = tx.QueryRowContext(ctx, "SELECT * from monitor_failed WHERE monitor_id = ? LIMIT 1", monitorId).Scan(
		&failedMonitor.OrgID,
		&failedMonitor.FailCount,
		&failedMonitor.AlertSentTs,
	); err != nil {
		if err == sql.ErrNoRows {
			log.Printf("Monitor wit id: %s does not exist", monitorId)
		}
	}
	_, err = tx.ExecContext(ctx, "UPDATE monitor_failed SET fail_count = fail_count + ? WHERE id = ?",
		1, monitorId)
	if err != nil {
		log.Printf("Update of monitor id: %s failed", monitorId)
	}
	return failedMonitor.FailCount
}

func insertMonitorStatus(db *sql.DB, startTs int64, endTs int64, monitorId string, statusCode string, success bool, resp []byte) error {
	query := `
        INSERT INTO monitor_status (start_ts, end_ts, monitor_id, status_code, success, resp)
        VALUES ($1, $2, $3, $4, $5, $6)
    `
	_, err := db.Exec(query, startTs, endTs, monitorId, statusCode, success, resp)
	if err != nil {
		return fmt.Errorf("failed to insert monitor status: %w", err)
	}
	return nil
}
func main() {
	db := pkg.GetDB()
	if err := db.Ping(); err == nil {
		log.Println("Connected to database")
	}

	rmqInstance, err := pkg.GetRmq()
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	} else {
		log.Println("Connected to queue")
	}
	defer rmqInstance.Close()
	queue, err := rmqInstance.GetQueue(pkg.PUB_MONITOR_Q)
	if err != nil {
		log.Fatalf("Failed to declare queue: %v", err)
	}
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	log.Println("Starting server")

	msgs, err := queue.Consume()
	if err != nil {
		log.Fatalf("Failed to register a consumer: %v", err)
	}

	go func() {
		for d := range msgs {
			err := json.Unmarshal(d.Body, &message)
			if err != nil {
				log.Printf("Failed to unmarshal message: %v", err)
			}
			startTs := time.Now().Unix()
			response, statusCode, err := pollers.HTTPRequest(message.AdditionalInfo.URL, message.AdditionalInfo.Method, message.AdditionalInfo.Body, message.AdditionalInfo.Headers)
			endTs := time.Now().Unix()
			if err != nil {
				log.Printf("Polling monitorId %s failed", message.Id)
			}
			success := statusCode < 400
			if err := insertMonitorStatus(db, startTs, endTs, message.Id, strconv.Itoa(statusCode), success, response); err != nil {
				log.Fatalf("failed to insert monitor status: %v", err)
			}
			failedCount := updateFailedMonitorCount(message.Id, db)
			failedCount += 1
			if failedCount == message.Retries {
				// TODO if increased fail conut >= retiries push to send notification queue
			}
		}
	}()
	go func() {
		<-quit
		log.Println("Shutdown signal received. Exiting gracefully...")
		if err := db.Close(); err != nil {
			log.Println("Error closing database:", err)
		} else {
			log.Println("Database connection closed.")
		}

		log.Println("Server shut down gracefully")
		os.Exit(0)
	}()

	select {} // Keep main function alive
}
