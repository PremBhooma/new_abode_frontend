// preload.js
// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//   sendToMain: (channel, data) => ipcRenderer.send(channel, data),
//   onFromMain: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
// });


// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // --- existing generic functions ---
  sendToMain: (channel, data) => ipcRenderer.send(channel, data),
  onFromMain: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),

  // --- auto-updater specific listeners ---
  onUpdateChecking: (callback) => ipcRenderer.on('update-checking', callback),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (event, info) => callback(info)),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (event, data) => callback(data)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (event, info) => callback(info)),
  onUpdateError: (callback) => ipcRenderer.on('update-error', (event, msg) => callback(msg)),

  // --- actions from renderer to main ---
  confirmDownload: () => ipcRenderer.send('confirm-download'),
  installUpdate: () => ipcRenderer.send('install-update'),
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
});
