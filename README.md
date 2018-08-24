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

### src/lib/cv-util.js

#### getFaceImg(image, gray=true)

Pass it an OpenCV image and it will try to detect a face. If a face is found, a cropped image showing only the face is returned. `gray` is a switch determining whether or not the image should be converted to grayscale.

If no face is found, `null` is returned.

#### getFaceRect(image)

Pass it an OpenCV image and it will try to detect a face. If a face is found, an OpenCV Rect object is returned. The Rect object has the shape { width, height, x, y }. 

If no face is found, `null` is returned.

#### exitOnFrame(frameNum)

Returns a function that can be passed as `handleKeypress` to `startVideo` to terminate the video after a given number of frames.

#### getImgsFromDir(dirPath, regex) => [Mat]

Take all images from the `dirPath` directory that match the regext string passed (if passed) and return an array of OpenCV Image Mats.

#### getFacesFromDir(options) => [Mat]

Same as `getImgsFromDir`, but returns faces found in the images (filtering out images that don't have a face). `options` must contain a key `dirPath`. `options` can include `regex`, `gray`, and `resize`. `gray` is a boolean, `resize` is an object `{ x, y }`

#### getFacesFromDirForTraining(dirPath, regex) => [Mat]

Same as `getFacesFromDir`, but grayscales the image and resizes it to 80x80.

#### getTestAndTrain = (imgsArr, percentage=0.75) => ({ train, test })

Takes an array of images, splitting it at the provided percentage [0, 1] and returning the first as `train` and the second as `test`.

const trainFaceClassifiers = imageSets => {
#### getTestAndTrain = (imgsArr, percentage=0.75) => ({ train, test })

Takes an array of metadata/data and returns the Eigen, Fisher, and LBPH face detectors trained on the images referenced in the argument `imageSets`. 

`imageSets` should be an array containing objects with the following shape:

```
{
   label: 'someLabel',
   dirPath: './some/path',
   regex: 'some-pattern',
   faces: [<array of mats>]
 }
```

`label` is required and should describe the collection, ie the name of the person in the images. If you already have an array of faces formatted for detection (for example, from calling `saveFacesFromVideo` or `getFacesFromDir` and resizing to a square) then you can pass the array in directly. Otherwise, you must describe a `dirPath` with the optional `regex` string to read in and detect images from a directory.

The return is an object containing three different predictor functions. The object has this shape:

```
{ eigenPredict, fisherPredict, lbphPredict }
```


Pass an OpenCV Image Mat into any of the predictors and get an object containing the corresponding `label` and `confidence` of the prediction.

### src/lib/util.js

#### shuffleArray(array) => [...]

Takes an array and randomly shuffles its contents, returning a new array.

#### splitAtPercent = (arr, percent=0.75) => [[...], [...]]

Takes an array and splits it at the provided percentage [0, 1]. Returns an array of arrays containing the contents.

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

#### saveFacesFromVideo(options) => [faces]

Starts the webcam and captures a given number of faces, returning them in an array. 

##### options

- Write the faces to disk by providing a `folderPath`. If the folder doesn't exist, it is created.
- Capture 10 faces by default or provide your own number as `numFaces`.
- Resize the faces by providing `resize: { x: int, y: int }` in options.

options = { 
  resize,
  folderPath,
  numFaces=10, 
}
