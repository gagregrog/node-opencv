'use strict';

const path = require('path')
const fs = require('fs-extra')
const cv = require('opencv4nodejs')

const util = require('./util');

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

const getImgsFromDir = (dirPath, regex) => {
  let images = fs.readdirSync(dirPath)

  if (regex) {
    const reg = RegExp(regex)

    images = images.filter(a => reg.test(a))
  }

  return images.map(img => cv.imread(path.resolve(dirPath, img)))
}

const getFacesFromDir = options =>
  getImgsFromDir(options.dirPath, options.regex)
    .map(img => getFaceImg(img, options.gray))
    .filter(img => img)
    .map(img => (
      options.resize && options.resize.x && options.resize.y 
        ? img.resize(options.resize.x, options.resize.y)
        : img
    ))

const getFacesFromDirForTraining = (dirPath, regex) =>
  getFacesFromDir({
    regex,
    dirPath,
    gray: true,
    resize: { x: 80, y: 80 }
  })

const getTestAndTrain = (imgsArr, percentage=0.75) => {
  const [test, train] = util.splitAtPercent(imgsArr, percentage)

  return { test, train }
}

module.exports = {
  getFaceImg,
  getFaceRect,
  exitOnFrame,
  getImgsFromDir,
  getFacesFromDir,
  getTestAndTrain,
  getFacesFromDirForTraining,
}
