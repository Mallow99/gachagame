// Electron shell: a small frameless window that floats in the bottom-right
// corner above everything else. The game itself is plain web code in ../src.
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

const WIDTH = 360;
const HEIGHT = 600;
const COLLAPSED_HEIGHT = 48;
const MARGIN = 24;

let win;

function createWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  win = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    x: workArea.x + workArea.width - WIDTH - MARGIN,
    y: workArea.y + workArea.height - HEIGHT - MARGIN,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: false,
    alwaysOnTop: true,
    title: 'Pocket Gacha',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });
  // 'floating' + visibleOnFullScreen keeps it above full-screen apps on macOS
  // (e.g. slides in class).
  win.setAlwaysOnTop(true, 'floating');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.loadFile(path.join(__dirname, '..', 'index.html'));
}

// Collapse to just the top bar, keeping the bottom edge where it was.
ipcMain.on('collapse', (_event, collapsed) => {
  if (!win) return;
  const [x, y] = win.getPosition();
  const [w, h] = win.getSize();
  const newHeight = collapsed ? COLLAPSED_HEIGHT : HEIGHT;
  win.setResizable(true);
  win.setSize(w, newHeight);
  win.setResizable(false);
  win.setPosition(x, y + h - newHeight);
});

ipcMain.on('quit', () => app.quit());

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
