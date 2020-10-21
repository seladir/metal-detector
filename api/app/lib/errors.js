const fp = require('lodash/fp')

const transformStack = fp.compose(fp.map(fp.trim), fp.drop(1), fp.split('\n'))

function sendError(res, err, req) {
  const message = process.env.NODE_ENV === 'production'
    ? {
      code: 'error',
    }
    : {
      message: err.message,
      code: err.code,
      stack: transformStack(err.stack),
    }
  res.status(500).json(message)
  console.error(err.stack)
}

function badRequest(res, code) {
  return res.status(400).json({
    success: false,
    code,
  })
}

function notFound(res) {
  return res.status(404).json({
    success: false,
    code: 'not_found',
  })
}

function safe(res, asyncFn, req) {
  return (...args) => {
    const result = asyncFn(...args)
    if (!result) {
      console.error(`safe() did not get a promise from function ${asyncFn.name}`)
    }
    return result.catch((err) => {
      if (res.headersSent) {
        console.warn(`Cannot send an error to the client, the headers were already sent. The error: ${err}`)
        return
      }
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
    })
  }
}

module.exports = {
  safe,
  badRequest,
  notFound,
}
