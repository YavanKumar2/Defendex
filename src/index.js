const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const AWS = require('aws-sdk');
const fs = require('fs');
const axios = require('axios');

AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: '',
  secretAccessKey: '',
});

// Create a new AWS S3 client
const s3Client = new AWS.S3();

// Handle the file upload request from the renderer process
ipcMain.handle('upload-file', async (event, fileName, filePath, bucketName) => {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: fs.createReadStream(filePath), // Pass the file stream instead of the entire object
    };

    const response = await s3Client.putObject(uploadParams).promise();
    return 'File uploaded successfully';
  } catch (err) {
    console.log('Error', err);
    throw err;
  }
});


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  Menu.setApplicationMenu(null);
  ipcMain.handle('fetch-data', async (event, url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error occurred during data fetch');
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
