package config

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
	fmt.Println(string(rootPath) + `/.env`)
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

	url := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s", dbUsername, dbPassword, dbHost, dbPort, dbName)
	fmt.Println(url)
	return Config{
		DB: DBConfig{
			URL: url,
		},
	}
}
