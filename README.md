# Node-OpenCV

Explorations using OpenCV in node.js.

## Getting Started

Clone the [repo](https://github.com/RobertMcReed/node-opencv.git), cd into the directory, and install the required packages. [opencv4nodejs](https://www.npmjs.com/package/opencv4nodejs) can take a while to download, so be patient.

```
$ git clone https://github.com/RobertMcReed/node-opencv.git
$ cd node-opencv
$ npm install
```

## Using the API

### src/lib/util.js

#### getFaceImg(image, gray=true)

Pass it an OpenCV image and it will try to detect a face. If a face is found, a cropped image showing only the face is returned. `gray` is a switch determining whether or not the image should be converted to grayscale.

If no face is found, `null` is returned.

#### getFaceRect(image)

Pass it an OpenCV image and it will try to detect a face. If a face is found, an OpenCV Rect object is returned. The Rect object has the shape { width, height, x, y }. 

If no face is found, `null` is returned.

#### exitOnFrame(frameNum)

Returns a function that can be passed as `handleKeypress` to `startVideo` to terminate the video after a given number of frames.

### src/lib/video.js

#### startVideo(handlers, options) => handleExit()

Start an OpenCV video stream. By default, the stream will be displayed and can be closed by pressing `q` while the stream is focused.

`handlers` and `options` can be passed to modify the default behavior.

##### handlers

Supports the following methods:

- `handleFrame(frame, options)`
- `handleShow(frame, options)`
- `handleKeypress(frame, options)`
- `handleExit(frame, options)`

###### handleFrame(frame, options)

A callback that will be called before the frame is displayed. Must return an OpenCV image.

###### handleShow(frame, options)

The logic that controls how the video is shown. Runs after `handleFrame`. Does not return anything.

###### handleKeypress(frame, options)

Run custom logic in response to user keypresses. Must return a boolean indicating whether the stream should continue or not.

###### handleExit()

A function to run on program exit. Returns result from `startVideo`.

##### options

An object to tweak behavior. Passed as the second argument to all handlers.

By default it has the shape { devicePort, qKey }.

`deviceShape` can be used to override the default webcam. `qKey` can be used to override the default exit key.

#### saveFaces(numFaces=10, folderPath) => [faces]

Starts the webcam and captures the given number of faces, writing them to the `folderPath` provided. If a `folderPath` is provided and the folder doesn't exist, it is created. An array of found faces is returned.
