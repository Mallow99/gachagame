// The only bridge between the game page and the desktop window.
// When the game runs in a normal browser, window.desktop is undefined.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  collapse: (collapsed) => ipcRenderer.send('collapse', collapsed),
  openManager: () => ipcRenderer.send('open-manager'),
  openStrip: () => ipcRenderer.send('open-strip'),
  reportInteractiveRect: (rect) => ipcRenderer.send('strip-interactive-rect', rect),
  quit: () => ipcRenderer.send('quit'),
});
