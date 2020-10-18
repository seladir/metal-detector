const uuid = require('uuid')

module.exports = async (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (!uuid.validate(id)) {
    return res.status(200).json({
      success: false,
      code: 'incorrect_id',
    })
  }

  const status = 'scheduled'
  const result = {}

  return res.status(200).json({
    success: true,
    status,
    result
  })
}
