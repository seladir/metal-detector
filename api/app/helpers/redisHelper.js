const redisConnect = require('../lib/redisConnect')

const client = redisConnect()

class redisHelper {
  static async get(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, reply) => {
        if (err) {
          return reject(err)
        }
        return resolve(reply)
      })
    })
  }

  static async hgetall(key) {
    return new Promise((resolve, reject) => {
      client.hgetall(key, (err, reply) => {
        if (err) {
          return reject(err)
        }
        return resolve(reply)
      })
    })
  }

  static set(key, value) {
    client.set(key, value)
  }

  static reset(key) {
    client.set(key, 0)
  }

  static async del(key) {
    return new Promise((resolve, reject) => {
      client.del(key, (err, reply) => {
        if (err) {
          return reject(err)
        }
        return resolve(reply)
      })
    })
  }

  static async incr(key) {
    return new Promise((resolve, reject) => {
      client.incr(key, (err, reply) => {
        if (err) {
          return reject(err)
        }
        return resolve(reply)
      })
    })
  }

  static async incrby(key, value) {
    return new Promise((resolve, reject) => {
      client.incrby(key, value, (err, reply) => {
        if (err) {
          return reject(err)
        }
        return resolve(reply)
      })
    })
  }

  static async decr(key) {
    return new Promise((resolve, reject) => {
      client.decr(key, (err, reply) => {
        if (err) {
          return reject(err)
        }
        return resolve(reply)
      })
    })
  }

  static async getset(key, value) {
    return new Promise((resolve, reject) => {
      client.getset(key, value, (err, reply) => {
        if (err) {
          return reject(err)
        }
        return resolve(reply)
      })
    })
  }

  static async lrange(key, start, stop) {
    return new Promise((resolve, reject) => {
      client.lrange(key, start, stop, (err, reply) => {
        if (err) {
          return reject(err)
        }
        return resolve(reply)
      })
    })
  }

  static async multyLrange(keys, start, stop) {
    const multi = client.multi()
    keys.forEach((key) => {
      multi.lrange(key, start, stop)
    })
    return new Promise((resolve, reject) => {
      multi.exec((err, replies) => {
        if (err) {
          return reject(err)
        }
        return resolve(replies)
      })
    })
  }

  static async multyHincr(key, fields) {
    const multi = client.multi()
    fields.forEach((field) => {
      multi.hincrby(key, field, 1)
    })
    return new Promise((resolve, reject) => {
      multi.exec((err, replies) => {
        if (err) {
          return reject(err)
        }
        return resolve(replies)
      })
    })
  }

  static async multyLpush(keys, value) {
    const multi = client.multi()
    keys.forEach((key) => {
      multi.lpush(key, value)
    })
    return new Promise((resolve, reject) => {
      multi.exec((err, replies) => {
        if (err) {
          return reject(err)
        }
        return resolve(replies)
      })
    })
  }
}

module.exports = redisHelper
