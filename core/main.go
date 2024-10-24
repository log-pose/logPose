package main

import (
	"fmt"

	"github.com/sebzz2k2/log-pose/core/src/config"
	// "database/sql"
	// "github.com/lib/pq"
)

func main() {
	env := config.GetConfigVars()
	fmt.Println(env)
	fmt.Println("Running the TestApp")
}
