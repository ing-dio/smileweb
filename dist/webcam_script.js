const video = document.getElementById("video");

Promise.all([
  console.log("Loading models..."),
  faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  faceapi.nets.faceExpressionNet.loadFromUri("./models"),
]).then(setupCamera);

async function setupCamera() {
  const video = document.createElement('video');
  video.width = 480;
  video.height = 360;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {}
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function detectFace() {
  const video = await setupCamera();
  video.play();

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(video, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
      
      if (detections.length > 0) {
        const detection = detections[0];
        const expressions = detection.expressions;
        const happy = expressions.happy;
        const confidence = detection.detection.score; // Get the confidence score of the detection
  
        // Check if there is a hand on the face
        const landmarks = detection.landmarks;
        const jawOutline = landmarks.getJawOutline();
        const handOnFace = jawOutline.some(point => point.y < detection.detection.box.top || point.y > detection.detection.box.bottom);
  
        if (happy > 0.5 && confidence > 0.8 && !handOnFace) { // Add a confidence threshold and check for hand on face
          $('#laughModal').modal('show');
      }
    }
  }, 100);
}

window.addEventListener('load', () => {
  detectFace();
});
