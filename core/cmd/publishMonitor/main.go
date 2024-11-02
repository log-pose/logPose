package main

import (
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"database/sql"

	_ "github.com/lib/pq"
	"github.com/sebzz2k2/log-pose/core/pkg"
)

type Monitor struct {
	OrgID          string                 `json:"org_id"`
	Name           string                 `json:"name"`
	MonitorTypes   string                 `json:"monitor_types"`
	PingInterval   int                    `json:"ping_interval"`
	AdditionalInfo map[string]interface{} `json:"additional_info"`
	IsActive       bool                   `json:"is_active"`
	ID             string                 `json:"id"`
	Retries        int                    `json:"retries"`
}

func getMonitors(pingInterval int, db *sql.DB) ([]Monitor, error) {
	rows, err := db.Query(`
		SELECT org_id, name, monitor_types, ping_interval, additional_info, is_active, id, retries
		FROM monitors
		WHERE ping_interval = $1 
		AND is_active = $2
	`, pingInterval, true)

	if err != nil {
		log.Printf("Error fetching monitors for pingInterval %d: %v", pingInterval, err)
		return nil, err
	}
	defer rows.Close()

	var monitors []Monitor

	for rows.Next() {
		var (
			monitor       Monitor
			additionalRaw json.RawMessage
		)
		err := rows.Scan(
			&monitor.OrgID,
			&monitor.Name,
			&monitor.MonitorTypes,
			&monitor.PingInterval,
			&additionalRaw,
			&monitor.IsActive,
			&monitor.ID,
			&monitor.Retries,
		)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}
		if err := json.Unmarshal(additionalRaw, &monitor.AdditionalInfo); err != nil {
			log.Printf("Error decoding additional_info for monitor %s: %v", monitor.ID, err)
			continue
		}
		monitors = append(monitors, monitor)
	}
	if err = rows.Err(); err != nil {
		log.Printf("Error with rows: %v", err)
		return nil, err
	}
	return monitors, nil
}

func getAllTickers() []*time.Ticker {
	tickers := make([]*time.Ticker, len(pkg.Intervals))
	for i, interval := range pkg.Intervals {
		tickers[i] = time.NewTicker(time.Duration(interval) * time.Second)
	}
	return tickers
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
	tickers := getAllTickers()
	defer func() {
		for _, ticker := range tickers {
			ticker.Stop()
		}
	}()

	// Start a goroutine for each ticker
	for i, ticker := range tickers {
		go func(i int, ticker *time.Ticker) {
			for range ticker.C {
				monitors, err := getMonitors(60, db)
				if err != nil {
					log.Fatalf("Failed to retrieve monitors: %v", err)
				}
				for _, monitor := range monitors {
					mon, err := json.Marshal(monitor)
					if err != nil {
						log.Fatalf("Error converting Monitor to JSON: %v", err)
					}
					err = queue.Publish("", pkg.PUB_MONITOR_Q, false, false, mon)
					if err != nil {
						log.Fatalf("Failed to publish message: %v", err)
					}
				}
			}
		}(i, ticker)
	}
	go func() {
		<-quit
		log.Println("Shutdown signal received. Exiting gracefully...")
		if err := db.Close(); err != nil {
			log.Println("Error closing database:", err)
		} else {
			log.Println("Database connection closed.")
		}
		for _, ticker := range tickers {
			ticker.Stop()
		}
		log.Println("Server shut down gracefully")
		os.Exit(0)
	}()

	select {} // Keep main function alive
}
