package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

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
			msgBody := d.Body
			var message struct {
				AdditionalInfo AdditionalInfo `json:"additional_info"`
			}

			err := json.Unmarshal(msgBody, &message)
			if err != nil {
				log.Printf("Failed to unmarshal message: %v", err)
				return
			}

			url := message.AdditionalInfo.URL
			method := message.AdditionalInfo.Method
			headers := message.AdditionalInfo.Headers
			body := message.AdditionalInfo.Body
			response, statusCode, err := pollers.HTTPRequest(url, method, body, headers)
			if err != nil {
				log.Printf("HTTP request failed: %v", err)
			}
			fmt.Printf("Status Code: %d\nResponse: %s\n", statusCode, response)
			// TODO save to db
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
