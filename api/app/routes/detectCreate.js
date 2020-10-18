const path = require('path')
const uuid = require('uuid')
const { badRequest } = require('../lib/errors')
const redisHelper = require('../helpers/redisHelper')
const sendToQueue = require('../helpers/mq/sender')

const uploadDir = '/usr/src/shared/uploads'

module.exports = async (req, res) => {
  if (!req.files || !req.files.track) {
    return badRequest(res, 'no_file')
  }

  const uploadedFile = req.files.track

  const mbSize = uploadedFile.size * (2 ** -20)
  if (mbSize > 200) {
    return badRequest(res, 'too_large_file')
  }

  const filename = uploadedFile.md5
  await uploadedFile.mv(path.join(uploadDir, filename))

  const id = uuid.v4()

  const trackData = {
    id,
    status: 'scheduled',
    result: {},
    filename,
  }

  redisHelper.set(`track_${id}`, JSON.stringify(trackData))

  await sendToQueue(trackData)

  return res.status(200).json({
    success: true,
    id,
    status: trackData.status,
    result: {}
  })
}
