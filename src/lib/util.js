'use strict';

const cv = require('opencv4nodejs')

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2)

const getFace = (frame, getImage=false) => {
  const gray = frame.bgrToGray()
  const { objects: rects } = classifier.detectMultiScale(gray)

  if (!rects.length) return null

  return getImage ? gray.getRegion(rects[0]) : rects[0]
}

const getFaceRect = image =>
  getFace(image)

const getFaceImg = image =>
  getFace(image, true)

module.exports = {
  getFaceImg,
  getFaceRect,
}
