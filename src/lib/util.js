'use strict';

const cv = require('opencv4nodejs')

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2)

const getFace = (frame, getImage=false, toGray=false) => {
  const gray = toGray ? frame.bgrToGray() : frame
  const { objects: rects } = classifier.detectMultiScale(gray)

  if (!rects.length) return null

  return getImage ? gray.getRegion(rects[0]) : rects[0]
}

const getFaceRect = image =>
  getFace(image)

const getFaceImg = (image, gray=true) => 
  getFace(image, true, gray)

const exitOnFrame = frameNum => (frame, options) => {
  cv.waitKey(1)
  
  return options.frameCount === frameNum
}

module.exports = {
  getFaceImg,
  getFaceRect,
  exitOnFrame,
}
