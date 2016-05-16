const path = require("path");
const {app, BrowserWindow, globalShortcut} = require("electron");

// Set up command-line arguments.
const argv = require("yargs")
  .usage("usage: $0 TOPIC [--server addr] [-w num] [-h num] [-q num]")
  .demand(1)
  .default("server", "http://localhost:8080/")
  .describe("server", "Video server address")
  .default("w", 400).alias("w", "width").describe("w", "Image width")
  .default("h", 300).alias("h", "height").describe("h", "Image height")
  .default("q", 30).alias("q", "quality")
  .describe("q", "Image quality (0-100)")
  .argv;

// Keep a global reference of the window object to save it from the garbage
// collector.
let mainWindow;

app.on("ready", () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: argv.w,
    height: argv.h,
    darkTheme: true,
    icon: path.join(__dirname, "/resources/ros.ico")
  });

  // and load the index.html of the app.
  mainWindow.loadURL("file://" + __dirname + "/index.html");

  // Send command-line arguments to renderer.
  let target = {
    "host": argv.server,
    "topic": argv._[0],
    "quality": argv.q
  };
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("set-target", target);
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object.
    mainWindow = null;
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
