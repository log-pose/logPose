package loaders

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	"github.com/sebzz2k2/log-pose/relay/src/config"
)

func GetDB() *sql.DB {
	env := config.GetConfigVars()
	db, err := sql.Open("postgres", env.DB.URL)
	if err != nil {
		log.Fatalln("Unalble to connect to database", err)
	}
	return db
}
