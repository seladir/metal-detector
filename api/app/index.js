const express = require('express')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
const asyncHandler = require('./lib/asyncHandler')
const detectFile = require('./routes/detectFile')
const detectLink = require('./routes/detectLink')
const detectGet = require('./routes/detectGet')
const receiver = require('./helpers/mq/receiver')
const sender = require('./helpers/mq/sender')

async function appFactory() {
  const app = express()

  app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
  }))

  app.use(cors())
  app.use(bodyParser.json())

  app.get('/', (req, res) => {
    sender()
    res.send('Hello world!')
  })

  app.post('/detect-file', asyncHandler(detectFile))
  app.post('/detect-link', asyncHandler(detectLink))
  app.get('/detect/:id', asyncHandler(detectGet))

  //
  // if (process.env.NODE_ENV === 'production' || JSON.parse(process.env.PROXY_ENABLED || 'false')) {
  //   app.set('trust proxy', process.env.PROXY_IP || 1)
  // }

  app.use(errorHandler)

  receiver()

  return app
}

module.exports = appFactory
