'use strict';

const fs = require('fs-extra')
const cv = require('opencv4nodejs')
const { getFaceImg, exitOnFrame } = require('./util')

const defaultOptions = {
  qKey: 113,
  devicePort: 0,
  frameCount: 0,
}

const defaultHandlers = {
  handleFrame: frame => frame,
  handleShow: frame => {
    cv.imshow('Webcam', frame)
  },
  handleKeypress: (frame, options) => {
    const key = cv.waitKey(1)
  
    return key == options.qKey ? true : false
  },
  handleExit: () => {
    console.log('[INFO] Closing stream...')
  },
}

const startVideo = (handlers, options) => {
  handlers = { ...defaultHandlers, ...handlers }
  options = { ...defaultOptions, ...options }

  const vs = new cv.VideoCapture(options.devicePort)
  let exit = false;

  while (true && !exit) {
    let frame = vs.read()
    frame = handlers.handleFrame(frame, options)
    handlers.handleShow(frame, options)
    exit = handlers.handleKeypress(frame, options)
    options.frameCount++
  }

  return handlers.handleExit()
}

const saveFaces = (options) => {
  const { 
    resize, 
    folderPath,
    numFaces=10, 
  } = options

  if (folderPath) fs.ensureDirSync(folderPath)
  const faces = []

  const handleFrame = (frame, options) => {
    const face = getFaceImg(frame)

    if (face) faces.push(face)

    return face || frame
  }

  const handleKeypress = exitOnFrame(numFaces)

  const handleExit = () => {
    if (folderPath) {
      faces.forEach((face, i) => {
        cv.imwrite(`${folderPath}/${i}.jpg`, face)
      })
    }

    return (
      resize.x && resize.y 
        ? faces.map(face => face.resize(resize.x, resize.y)) 
        : faces
    )
  }

  return startVideo({ 
    handleExit,
    handleFrame, 
    handleKeypress,
  })
}

module.exports = {
  saveFaces,
  startVideo,
}
