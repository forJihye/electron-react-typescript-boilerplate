const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { default: menu } = require('./context-menu');

const isDev = process.env.NODE_ENV === 'development';
const PORT = process.argv[2];

const winURL = isDev ? `http://localhost:${PORT}` : `file://${path.join(__dirname, "../../dist/index.html")}` //`file://${__dirname}/../../dist/index.html`;

let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    frame: isDev,
    fullscreen: !isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // global is not defined
      webSecurity: isDev ? false : true,
    }
  })

  mainWindow.loadURL(winURL)
  if (isDev) mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('show-context-menu', (event) => {
    menu.popup(BrowserWindow.fromWebContents(event.sender))
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
