package services

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
)

func GetMonitors(pingInterval int, db *sql.DB) {
	// log.Println(pingInterval)
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
		var pingInterval int
		var additionalInfo json.RawMessage
		var isActive bool

		err = rows.Scan(&orgID, &name, &monitorTypes, &pingInterval, &additionalInfo, &isActive, &id)
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
