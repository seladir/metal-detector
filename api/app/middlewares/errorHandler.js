const { sendError } = require('../lib/errors')

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  if (err.status) {
    if (err.headers) {
      Object.entries(err.headers).forEach(([key, value]) => {
        res.set(key, value)
      })
    }
    res.status(err.status).json(err.json || {})
    return
  }
  sendError(res, err, req)
}
