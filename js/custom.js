let cameraPermissionGranted = false;

function requestCameraPermission() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      cameraPermissionGranted = true;
      console.log('Camera access granted');
    })
    .catch((err) => {
      cameraPermissionGranted = false;
      console.error('Camera access denied', err);
    });
}

window.addEventListener('load', () => {
  requestCameraPermission();

  document.getElementById('getStartedButton').addEventListener('click', (event) => {
    if (cameraPermissionGranted) {
      window.location.href = 'app.html';
    } else {
      alert('Camera permission is required to proceed.');
      event.preventDefault();
    }
  });
});