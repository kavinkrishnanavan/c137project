let video;
let objectDetector;
let objects = [];
let status = "";
let objectToDetect = "";  // Will be set by user input
let synth = window.speechSynthesis;

function setup() {
    let canvas = createCanvas(640, 480);
    canvas.parent('p5canvas');
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("model-status").innerHTML = "Status: Initializing COCO-SSD...";
}

function modelLoaded() {
    console.log("Model Loaded!");
    status = true;
    document.getElementById("model-status").innerHTML = "Status: Model Loaded";
}

function start() {
    objectToDetect = document.getElementById("objectName").value.toLowerCase();
    document.getElementById("object-status").innerHTML = "Status: Detecting Objects";
    objectDetector.detect(video, gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    }
    objects = results;
    if (status) {
        objectDetector.detect(video, gotResult);
    }
}

function draw() {
    image(video, 0, 0);

    if (status !== "") {
        for (let i = 0; i < objects.length; i++) {
            let object = objects[i];
            let confidence = floor(object.confidence * 100);
            let label = object.label.toLowerCase();

            fill(0, 255, 0);
            noStroke();
            text(label + " " + confidence + "%", object.x + 5, object.y + 15);
            noFill();
            stroke(0, 255, 0);
            rect(object.x, object.y, object.width, object.height);

            if (label === objectToDetect) {
                video.stop();
                status = "";
                objectDetector = null;
                document.getElementById("object-status").innerHTML = `Status: ${objectToDetect} found`;
                let utterThis = new SpeechSynthesisUtterance(`${objectToDetect} found`);
                synth.speak(utterThis);
                break;
            } else {
                document.getElementById("object-status").innerHTML = `Status: ${objectToDetect} not found`;
            }
        }
    }
}
