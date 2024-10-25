package loaders

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func StartLogPose() {
	db := GetDB()
	if err := db.Ping(); err == nil {
		log.Println("Connected to database")
	}
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	// Server loop (infinite loop)
	log.Println("Starting server...")

	ticker10Sec := time.NewTicker(10 * time.Second)
	done := make(chan bool)
	go func() {
		for {
			select {
			case <-quit:
				log.Println("Shutdown signal received. Exiting gracefully...")
				if err := db.Close(); err != nil {
					log.Println("Error closing database:", err)
				} else {
					log.Println("Database connection closed.")
				}
				ticker10Sec.Stop()
				done <- true
				return
			case <-ticker10Sec.C:
				runTask10Sec()
			default:
				time.Sleep(1 * time.Second)
			}
		}
	}()
	<-done
	log.Println("Server shut down gracefully")
}

func runTask10Sec() {
	log.Println("Running 10-second task...")
}
