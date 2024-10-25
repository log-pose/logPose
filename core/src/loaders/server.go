package loaders

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	tickers "github.com/sebzz2k2/log-pose/core/src/services"
)

func StartLogPose() {
	db := GetDB()
	if err := db.Ping(); err == nil {
		log.Println("Connected to database")
	}
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	log.Println("Starting server...")
	tickers := tickers.GetAllTickers()
	defer func() {
		for _, ticker := range tickers {
			ticker.Stop()
		}
	}()

	// Start a goroutine for each ticker
	for i, ticker := range tickers {
		go func(i int, ticker *time.Ticker) {
			for tick := range ticker.C {
				log.Printf("Ticker %d triggered at %v", i, tick)
				// Place task logic for each interval here
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
