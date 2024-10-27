package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"database/sql"

	_ "github.com/lib/pq"
	"github.com/sebzz2k2/log-pose/core/pkg"
)

func getMonitors(pingInterval int, db *sql.DB) {
	rows, err := db.Query(`
		SELECT * from monitors
		WHERE ping_interval = $1
	`, pingInterval)

	if err != nil {
		log.Println(err)
		log.Fatalf("Error while fetching monitors for pingInterval %d", pingInterval)
	}
	defer rows.Close()

	// Loop through each row
	for rows.Next() {
		var orgID, name, monitorTypes, id string
		var pingInterval, retries int
		var additionalInfo json.RawMessage
		var isActive bool

		err = rows.Scan(&orgID, &name, &monitorTypes, &pingInterval, &additionalInfo, &isActive, &id, &retries)
		if err != nil {
			log.Println("Error scanning row:", err)
			continue
		}

		var additionalData map[string]interface{}
		if err := json.Unmarshal(additionalInfo, &additionalData); err != nil {
			log.Println("Error decoding additional_info:", err)
		}

		fmt.Printf("org_id: %s, name: %s, monitor_types: %s, ping_interval: %d, additional_info: %v, is_active: %t, id: %s\n",
			orgID, name, monitorTypes, pingInterval, additionalData, isActive, id)
	}

	if err = rows.Err(); err != nil {
		log.Println("Error with rows:", err)
	}
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
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	log.Println("Starting server...")
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
				// Place task logic for each interval here
				getMonitors(60, db)
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
