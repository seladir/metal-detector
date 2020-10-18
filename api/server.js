const dotenv = require('dotenv')
const appFactory = require('./app')

dotenv.config()

const port = process.env.PORT

appFactory().then((app) => {
  app.listen(port, () => {
    console.log(`The server has been started on port ${port}!`)
  })
})
