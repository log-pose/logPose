package pkg

import (
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

func GetRmq() *amqp.Connection {
	env := GetConfigVars()
	conn, err := amqp.Dial(env.RMQ.URL)
	if err != nil {
		log.Fatalln("Unable to connect to queue", err)
	}
	return conn
}
