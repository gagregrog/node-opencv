'use strict';

const cv = require('opencv4nodejs')

const defaultOptions = {
  devicePort: 0,
  qKey: 113,
}

const defaultHandlers = {
  handleFrame: frame => frame,
  handleShow: frame => {
    cv.imshow('Webcam', frame)
  },
  handleKeypress: (frame, options) => {
    const key = cv.waitKey(1)
  
    return key == options.qKey ? true : false
  }
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
  }
}

module.exports = {
  startVideo
}
