const amqp = require('amqplib')

let channel = null
const queue = 'detection-response'

async function connect() {
  return amqp.connect('amqp://mq')
    .then((connection) => {
      return connection.createChannel()
    })
    .then((ch) => {
      channel = ch

      return ch.assertQueue(queue, {
        durable: false
      })
    })
    .then(() => {
      return channel.consume(queue, (msg) => {
        if (msg !== null) {
          console.log(msg.content.toString())
          channel.ack(msg)
        }
      })
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

module.exports = async function receiver() {
  let result = false
  do {
    await new Promise(resolve => setTimeout(resolve, 5000))
    result = await connect()
  } while (result === false)
  console.log('Connected to MQ')
}
