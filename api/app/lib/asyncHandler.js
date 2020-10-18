const { safe } = require('./errors')

module.exports = function asyncHandler(asyncFn) {
  return (req, res, next) => safe(res, asyncFn, req)(req, res, next)
}
