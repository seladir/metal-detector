const express = require('express')
const router = require('express').Router()
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
const receiver = require('./helpers/mq/receiver')
const sender = require('./helpers/mq/sender')
const routes = require('./routes')

async function appFactory() {
  const app = express()

  app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
  }))

  app.use(cors())
  app.use(bodyParser.json())

  app.get('/api', (req, res) => {
    sender()
    res.send('Hello world!')
  })

  router.use(routes)
  app.use('/api', router);

  //
  // if (process.env.NODE_ENV === 'production' || JSON.parse(process.env.PROXY_ENABLED || 'false')) {
  //   app.set('trust proxy', process.env.PROXY_IP || 1)
  // }

  app.use(errorHandler)

  receiver()

  return app
}

module.exports = appFactory
