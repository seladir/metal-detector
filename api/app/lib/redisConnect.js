const redis = require('redis')

module.exports = function redisConnect() {
  const redisClient = redis.createClient({
    host: 'redis',
    port: 6379,
    password: undefined,
    db: 1,
    connect_timeout: 1000 * 60,
    max_attempts: 3,
  })
  redisClient.on('error', (err) => {
    console.error(`Error trying to create Redis connection: ${JSON.stringify(err)}`)
  })
  redisClient.on('connect', (ev) => {
    console.log('Connected to Redis')
  })

  return redisClient
}
