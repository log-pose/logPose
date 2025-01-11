package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/sebzz2k2/log-pose/core/pkg"
)

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
	queue, err := rmqInstance.GetQueue(pkg.PUB_NOTIFICATION_Q)
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
		log.Println(msgs)
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
