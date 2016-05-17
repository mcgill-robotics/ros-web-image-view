const remote = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;

let stream, download_lnk;
let hostname, topic, quality;
let win = remote.getCurrentWindow();

// Remove all previous window listeners, to fix issues when refreshing.
win.removeAllListeners();

function setHostname(url) {
  // Sets hostname.
  if (url.endsWith("/")) {
    hostname = url;
  } else {
    hostname = url + "/";
  }
}

function setTopic(name) {
  // Sets topic name.
  topic = name;
}

function setQuality(q) {
  // Sets image quality.
  quality = q;
}

function setTitle() {
  // Sets window title.
  document.title = topic + " (" + quality + "%)";
}

function play() {
  // Remove event listener to avoid firing on every frame of stream.
  stream.removeEventListener("load", play, false);

  // Set opaque.
  stream.style.opacity = 1.0;

  // Fix stream on resize.
  updateStream();
  window.addEventListener("resize", updateStream, false);

  // Set up quality shortcuts.
  document.onkeypress = onKeyPress;
  document.oncontextmenu = screenshot;
}

function getAspectRatio() {
  // Remove event listener to avoid firing on every frame of stream.
  stream.removeEventListener("load", getAspectRatio, false);

  // Keep raw dimensions of frame.
  raw_aspect_ratio = stream.width / stream.height;

  // Set window size and aspect ratio.
  win.setAspectRatio(raw_aspect_ratio);
  win.setContentSize(Math.round(window.innerHeight * raw_aspect_ratio),
                     window.innerHeight, true);

  // Set stream as visible on stream startup.
  stream.addEventListener("load", play, false);

  // Set up stream with proper dimensions.
  updateStream();
}

function updateStream() {
  // Get current window dimensions.
  width = window.innerWidth;
  height = window.innerHeight;
  if (width === 0 || height === 0) {
    return;
  }
  aspect_ratio = width / height;

  // Determine limiting dimension, and maintain aspect ratio.
  if (aspect_ratio > raw_aspect_ratio) {
    width = Math.round(height * raw_aspect_ratio);
  } else {
    height = Math.round(width / raw_aspect_ratio);
  }

  // Set dimensions.
  stream.width = width;
  stream.height = height;

  // Stream.
  stream.src = hostname + "stream?topic=" + topic +
               "&width=" + width + "&height=" + height +
               "&quality=" + quality;
}

function onKeyPress(e) {
  // Set quality.
  switch (String.fromCharCode(e.keyCode)) {
    case "1":
      setQuality(10);
      break;
    case "2":
      setQuality(20);
      break;
    case "3":
      setQuality(30);
      break;
    case "4":
      setQuality(40);
      break;
    case "5":
      setQuality(50);
      break;
    case "6":
      setQuality(60);
      break;
    case "7":
      setQuality(70);
      break;
    case "8":
      setQuality(80);
      break;
    case "9":
      setQuality(90);
      break;
    case "0":
      setQuality(100);
      break;
    case "+":
      setQuality(Math.min(100, quality + 5));
      break;
    case "-":
      setQuality(Math.max(0, quality - 5));
      break;
    default:
      return;
  }
  
  // Update stream and title.
  setTitle();
  updateStream();
}

function screenshot(e) {
  // Prevent context menu from appearing.
  e.preventDefault();

  // Create canvas.
  let canvas = document.createElement("canvas");
  canvas.width = stream.width;
  canvas.height = stream.height;

  // Draw image to canvas.
  let ctx = canvas.getContext("2d");
  ctx.drawImage(stream, 0, 0);

  // Get image data as PNG and set up download link
  let imageData = canvas.toDataURL("image/png");
  download_lnk.href = imageData.replace(/^data:image\/png/,
                                    "data:application/octet-stream");
  download_lnk.download = new Date().toJSON() + ".png";

  // Download.
  download_lnk.click();
}

window.addEventListener("load", () => {
  // Find items on page.
  stream = document.getElementById("stream");
  download_lnk = document.getElementById("download");

  // Set warning icon to show on image failure.
  stream.onerror = function () {
    document.getElementById("status").src = "../resources/icons/warning.png";
  }

  // Hide stream until ready.
  stream.style.opacity = 0;

  // Get command-line arguments.
  ipcRenderer.on("set-target", (event, message) => {
    // Set properties.
    setHostname(message["host"]);
    setTopic(message["topic"]);
    setQuality(message["quality"]);
    setTitle();

    // Get a full-size low quality snapshot to determine aspect ratio.
    stream.src = hostname + "snapshot?topic=" + topic + "&quality=0";
    stream.addEventListener("load", getAspectRatio, false);
  });
}, false);
