const amqp = require('amqplib')

let channel = null
const queue = 'detection-request'

async function connect() {
  await amqp.connect('amqp://mq')
    .then((connection) => {
      return connection.createChannel()
    })
    .then((ch) => {
      channel = ch

      return ch.assertQueue(queue, {
        durable: false
      })
    })
}


module.exports = async function sender(message) {
  if (channel === null) {
    await connect()
  }

  return channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
}
