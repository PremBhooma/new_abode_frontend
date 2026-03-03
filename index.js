// const { autoUpdater, AppUpdater } = require("electron-updater");

// const path = require('path');
// const isDev = process.env.NODE_ENV === 'development';

// if (isDev) {
//   require('electron-reload')(__dirname, {
//     electron: require(`${__dirname}/node_modules/electron`)
//   });
// }

// const { app, BrowserWindow, ipcMain, Menu } = require('electron');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       contextIsolation: true,
//       preload: path.join(__dirname, 'preload.js'),
//     },
//     icon: path.join(__dirname, 'app/public/assets', 'icon.png'),
//     autoHideMenuBar: false
//   });

//   Menu.setApplicationMenu(null);

//   if (isDev) {
//     win.loadURL('http://localhost:5173');
//     win.webContents.openDevTools();
//   } else {
//     win.loadFile(path.join(__dirname, 'dist', 'app', 'index.html'));
//     // win.webContents.openDevTools(); // Remove after fixing
//   }
// }

// ipcMain.on('my-message', (event, arg) => {
//   console.log('Message from renderer:', arg);
//   event.reply('my-reply', 'Hello from main process!');
// });

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });



// index.js
const { app, BrowserWindow, ipcMain, Menu, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
  });
}



let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "app/public/assets", "icon.png"),
    autoHideMenuBar: false,
    show: false, // Don't show until ready-to-show
  });

  Menu.setApplicationMenu(null);

  // First, load the loading.html page
  mainWindow.loadFile(path.join(__dirname, "loading.html")).then(() => {
    mainWindow.show();

    // Once loading screen is displayed, load the main application
    if (isDev) {
      mainWindow.loadURL("http://localhost:5173").catch(err => {
        console.error("Failed to load dev server:", err);
      });
      // Optionally open devtools in dev mode:
      // mainWindow.webContents.openDevTools();
    } else {
      mainWindow.loadFile(path.join(__dirname, "dist", "app", "index.html")).catch(err => {
        console.error("Failed to load production index.html:", err);
        dialog.showErrorBox("Failed to load application", err.message || JSON.stringify(err));
        mainWindow.webContents.openDevTools();
      });
    }
  }).catch(err => {
    console.error("Failed to load loading.html:", err);
  });

  // Handle errors during page load
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorDescription} (${errorCode})`);

    // Only show error dialog and devtools if not the loading page
    if (!mainWindow.webContents.getURL().includes('loading.html')) {
      // Only open devtools once to investigate
      if (!mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.openDevTools();
      }
      console.log("App load failed. See DevTools for details.");
    }
  });

  mainWindow.webContents.on('crashed', (event, killed) => {
    console.error(`Renderer process crashed. Killed: ${killed}`);
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.openDevTools();
    }
  });
}

// -----------------------------
// AUTO UPDATER CONFIG
// -----------------------------
function setupAutoUpdater() {
  autoUpdater.autoDownload = false; // We'll show prompt before downloading

  autoUpdater.on("checking-for-update", () => {
    mainWindow.webContents.send("update-checking");
  });

  autoUpdater.on("update-available", (info) => {
    mainWindow.webContents.send("update-available", info);
  });

  autoUpdater.on("update-not-available", () => {
    mainWindow.webContents.send("update-not-available");
  });

  autoUpdater.on("error", (err) => {
    mainWindow.webContents.send("update-error", err.message);
  });

  autoUpdater.on("download-progress", (progress) => {
    mainWindow.webContents.send("update-progress", progress);
  });

  autoUpdater.on("update-downloaded", (info) => {
    mainWindow.webContents.send("update-downloaded", info);
  });

  ipcMain.on("confirm-download", () => {
    autoUpdater.downloadUpdate();
  });

  ipcMain.on("install-update", () => {
    autoUpdater.quitAndInstall();
  });
}

// app.whenReady().then(() => {
//   createWindow();
//   setupAutoUpdater();

//   // Trigger update check (only in production)
//   if (!isDev) {
//     setTimeout(() => {
//       autoUpdater.checkForUpdates();
//     }, 3000);
//   }

//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });



app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();

  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


