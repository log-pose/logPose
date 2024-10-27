package pkg

import (
	"database/sql"
	"log"
)

func GetDB() *sql.DB {
	env := GetConfigVars()
	db, err := sql.Open("postgres", env.DB.URL)
	if err != nil {
		log.Fatalln("Unalble to connect to database", err)
	}
	return db
}
