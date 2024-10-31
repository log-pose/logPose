package pkg

import (
	"fmt"
	"log"
	"os"
	"regexp"

	"github.com/joho/godotenv"
)

type URLConfig struct {
	URL string
}

type Config struct {
	DB  URLConfig
	RMQ URLConfig
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

	rmqUser := os.Getenv("RMQ_USER")
	rmqPass := os.Getenv("RMQ_PASSWORD")
	rmqPort := os.Getenv("RMQ_PORT")
	rmqHost := os.Getenv("RMQ_HOST")

	dbURL := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable", dbUsername, dbPassword, dbHost, dbPort, dbName)
	rmqURL := fmt.Sprintf("amqp://%s:%s@%s:%s/", rmqUser, rmqPass, rmqHost, rmqPort)
	return Config{
		DB: URLConfig{
			URL: dbURL,
		},
		RMQ: URLConfig{
			URL: rmqURL,
		},
	}
}
