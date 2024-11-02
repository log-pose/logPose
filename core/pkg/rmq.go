package pkg

import (
	"sync"

	amqp "github.com/rabbitmq/amqp091-go"
)

var (
	rmqInstance *RMQ
	once        sync.Once
	queueCache  = make(map[string]*Queue)
	mu          sync.Mutex
)

type RMQ struct {
	conn    *amqp.Connection
	channel *amqp.Channel
}

type Queue struct {
	channel *amqp.Channel
	name    string
}

func GetRmq() (*RMQ, error) {
	env := GetConfigVars()
	var err error
	once.Do(func() {
		conn, e := amqp.Dial(env.RMQ.URL)
		if e != nil {
			err = e
			return
		}
		ch, e := conn.Channel()
		if e != nil {
			conn.Close()
			err = e
			return
		}
		rmqInstance = &RMQ{
			conn:    conn,
			channel: ch,
		}
	})
	return rmqInstance, err
}

func (r *RMQ) GetQueue(queueName string) (*Queue, error) {
	mu.Lock()
	defer mu.Unlock()

	if queue, exists := queueCache[queueName]; exists {
		return queue, nil
	}

	_, err := r.channel.QueueDeclare(
		queueName, // name
		true,      // durable
		false,     // delete when unused
		false,     // exclusive
		false,     // no-wait
		nil,       // arguments
	)
	if err != nil {
		return nil, err
	}

	queue := &Queue{
		channel: r.channel,
		name:    queueName,
	}
	queueCache[queueName] = queue
	return queue, nil
}

func (q *Queue) Publish(exchange, routingKey string, mandatory, immediate bool, body []byte) error {
	err := q.channel.PublishWithContext(
		nil,        // context (nil means no timeout)
		exchange,   // exchange
		routingKey, // routing key
		mandatory,  // mandatory
		immediate,  // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        body,
		},
	)
	return err
}

func (r *RMQ) Close() {
	if r.channel != nil {
		r.channel.Close()
	}
	if r.conn != nil {
		r.conn.Close()
	}
}
