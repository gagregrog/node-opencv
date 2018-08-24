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

const trainFaceClassifiers = imageSets => {
  // [{
  //   label: 'someLabel',
  //   dirPath: './some/path',
  //   regex: 'some-pattern',
  //   faces: [<array of mats>]
  // }]

  let labels = []
  let faces = []
  const labelMap = []

  imageSets.forEach(({ dirPath, label, regex, faces: setFaces }, i) => {
    if (!setFaces) setFaces = getFacesFromDirForTraining(dirPath, regex)

    const setLabels = setFaces.map(() => i)
    labels = [...labels, ...setLabels]
    faces = [...faces, ...setFaces]
    labelMap.push(label)
  })

  const eigen = new cv.EigenFaceRecognizer()
  const fisher = new cv.FisherFaceRecognizer()
  const lbph = new cv.LBPHFaceRecognizer()

  eigen.train(train, labels)
  fisher.train(train, labels)
  lbph.train(train, labels)
  
  const predict = (recognizer) => (img) => {
    const result = recognizer.predict(img)
    console.log(`Predicted: ${result.label == 0 ? 'Rob' : 'Musk'} Confidence: ${result.confidence}`)

    return { label: labels[result.label], confidence: result.confidence }
  }

  const eigenPredict = predict(eigen)
  const fisherPredict = predict(fisher)
  const lbphPredict = predict(lbph)

  return { eigenPredict, fisherPredict, lbphPredict }
}

module.exports = {
  getFaceImg,
  getFaceRect,
  exitOnFrame,
  getImgsFromDir,
  getFacesFromDir,
  getTestAndTrain,
  trainFaceClassifiers,
  getFacesFromDirForTraining,
}
