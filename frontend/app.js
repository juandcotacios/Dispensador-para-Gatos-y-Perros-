let video = null;
let detector = null;
let detections = [];
let videoVisibility = true;
let detecting = false;
let lastDetectionTime = 0;
const detectionInterval = 5000; // 5 segundos de intervalo entre detecciones

const videoAction = document.getElementById('videoAction');
const detectionAction = document.getElementById('detectionAction');

document.body.style.cursor = 'wait';

function preload() {
  detector = ml5.objectDetector('cocossd');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
}

function draw() {
  if (!video || !detecting) return;
  image(video, 0, 0);
  for (let i = 0; i < detections.length; i++) {
    drawResult(detections[i]);
  }
}

function drawResult(object) {
  if (object.label === 'cat' || object.label === 'dog') {
    boundingBox(object);
    drawLabel(object);
  }
}

function boundingBox(object) {
  stroke('blue');
  strokeWeight(6);
  noFill();
  rect(object.x, object.y, object.width, object.height);
}

function drawLabel(object) {
  noStroke();
  fill('white');
  textSize(34);
  text(object.label, object.x + 15, object.y + 34);
}

function onDetected(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;

  let currentTime = millis();
  let petDetected = false;

  detections.forEach((object) => {
    if ((object.label === 'cat' || object.label === 'dog') && (currentTime - lastDetectionTime > detectionInterval)) {
      petDetected = true;
      lastDetectionTime = currentTime;
    }
  });

  if (petDetected) {
    fetch('/pet-detected', { method: 'POST' });
    detecting = false;
    setTimeout(() => {
      detecting = true;
      detect();
    }, detectionInterval);
  }

  if (detecting) {
    detect();
  }
}

function detect() {
  detector.detect(video, onDetected);
}

function toggleVideo() {
  if (!video) return;
  if (videoVisibility) {
    video.hide();
    videoAction.innerText = 'Activar Video';
  } else {
    video.show();
    videoAction.innerText = 'Desactivar Video';
  }
  videoVisibility = !videoVisibility;
}

function toggleDetecting() {
  if (!video || !detector) return;
  if (!detecting) {
    detect();
    detectionAction.innerText = 'Parar...';
  } else {
    detectionAction.innerText = 'Detectar Objetos';
  }
  detecting = !detecting;
}
