const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const uuid = require('uuid')
const youtubeMp3Downloader = require("youtube-mp3-downloader")
const { badRequest } = require('../lib/errors')
const redisHelper = require('../helpers/redisHelper')
const sendToQueue = require('../helpers/mq/sender')

const uploadDir = '/usr/src/shared/uploads'

module.exports = async (req, res) => {
  const { link } = req.body

  if (!_.isString(link)) {
    return badRequest(res, 'not_a_link')
  }

  let url
  let videoId
  try {
    url = new URL(link)
    videoId = url.searchParams.get('v')
  } catch (e) {
    return badRequest(res, 'not_a_link')
  }
  console.log(videoId)

  if (!videoId) {
    return badRequest(res, 'not_a_link')
  }

  const id = uuid.v4()
  const fullname = path.join(uploadDir, videoId)

  const trackData = {
    id,
    status: 'starting',
    result: {},
    fullname,
  }

  redisHelper.set(`track_${id}`, JSON.stringify(trackData))

  const YD = new youtubeMp3Downloader({
    "ffmpegPath": "ffmpeg",        // FFmpeg binary location
    "outputPath": `${uploadDir}/tmp`,    // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 1,                  // Download parallelism (default: 1)
    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
  });

  YD.on("finished", (err, data) => {
    console.log(err, data)
    if (!err) {
      const mbSize = data.stats.transferredBytes * (2 ** -20)
      if (mbSize <= 200) {
        fs.move(data.file, fullname)
          .then(() => {
            sendToQueue(trackData)
          })
      }
    }
  })

  YD.on("error", () => {
    const trackData = {
      id,
      status: 'failed',
      result: {},
      fullname,
    }

    redisHelper.set(`track_${id}`, JSON.stringify(trackData))
  })

  YD.download(videoId, videoId)

  return res.status(200).json({
    success: true,
    id,
    status: trackData.status,
    result: {}
  })
}
