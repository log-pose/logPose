package pkg

import (
	"fmt"
	"log"
	"os"
	"regexp"

	"github.com/joho/godotenv"
)

type DBConfig struct {
	URL string
}

type Config struct {
	DB DBConfig
}

func loadEnv() {
	projectName := regexp.MustCompile(`^(.*` + ProjectDirName + `)`)
	currentWorkDirectory, _ := os.Getwd()
	rootPath := projectName.Find([]byte(currentWorkDirectory))
	err := godotenv.Load(string(rootPath) + `/.env`)

	if err != nil {
		log.Fatalf("Error loading .env file")
	}
}
func GetConfigVars() Config {
	loadEnv()
	dbHost := os.Getenv("PSQL_HOST")
	dbPort := os.Getenv("PSQL_PORT")
	dbName := os.Getenv("PSQL_DATABASE")
	dbUsername := os.Getenv("PSQL_USER")
	dbPassword := os.Getenv("PSQL_PASSWORD")

	url := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable", dbUsername, dbPassword, dbHost, dbPort, dbName)
	return Config{
		DB: DBConfig{
			URL: url,
		},
	}
}
