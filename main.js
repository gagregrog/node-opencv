'use strict';

const { getFaceImg } = require('./src/lib/util')
const { startVideo } = require('./src/lib/video')

const handleFrame = frame => {
  const face = getFaceImg(frame)

  return face || frame
}

startVideo({ handleFrame })
