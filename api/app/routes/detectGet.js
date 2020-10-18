const uuid = require('uuid')
const redisHelper = require('../helpers/redisHelper')
const { badRequest } = require('../lib/errors')

module.exports = async (req, res) => {
  const id = req.params.id
  if (!uuid.validate(id)) {
    return badRequest(res, 'incorrect_id')
  }

  let trackData = {}

  try {
    const encodedData = await redisHelper.get(`track_${id}`)
    if (!encodedData) {
      throw new Error('no_data')
    }
    trackData = JSON.parse(encodedData)
  } catch (e) {
    return badRequest(res, 'no_data')
  }

  let result = {}
  if (trackData.status === 'finished') {
    let firstProb = 0
    let secondProb = 0
    let firstGenre = 0
    let secondGenre = 0

    trackData.result.probs.forEach((prob, i) => {
      if (prob > firstProb) {
        secondProb = firstProb
        secondGenre = firstGenre
        firstProb = prob
        firstGenre = i
      } else if (prob > secondProb) {
        secondProb = prob
        secondGenre = i
      }
    })

    result = {
      first: {
        genre: firstGenre + 1,
        probability: firstProb,
      },
      second: {
        genre: secondGenre + 1,
        probability: secondProb,
      },
    }
  }

  return res.status(200).json({
    success: true,
    status: trackData.status,
    result
  })
}
