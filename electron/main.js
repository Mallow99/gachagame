// Electron shell: the game starts as a transparent, always-on-top battle
// strip. Clicking its HUD opens the existing management window; the minus
// button returns to the strip. Both modes use the same renderer save.
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

const MANAGER_WIDTH = 360;
const MANAGER_HEIGHT = 600;
const STRIP_HEIGHT = 220;
const COLLAPSED_HEIGHT = 48;
const MARGIN = 24;

let win;
let mode = 'strip';
let interactiveRect = null;
let ignoringMouse = false;

function windowOptions(bounds) {
  return {
    ...bounds,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    title: 'Pocket Gacha',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  };
}

function createWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  win = new BrowserWindow(windowOptions(stripBounds(workArea)));
  win.setAlwaysOnTop(true, 'floating');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  showStrip();
  setInterval(updateClickThrough, 50);
}

function stripBounds(workArea = screen.getPrimaryDisplay().workArea) {
  return {
    x: workArea.x,
    y: workArea.y + workArea.height - STRIP_HEIGHT,
    width: workArea.width,
    height: STRIP_HEIGHT,
  };
}

function managerBounds(workArea = screen.getPrimaryDisplay().workArea) {
  return {
    x: workArea.x + workArea.width - MANAGER_WIDTH - MARGIN,
    y: workArea.y + workArea.height - MANAGER_HEIGHT - MARGIN,
    width: MANAGER_WIDTH,
    height: MANAGER_HEIGHT,
  };
}

function setBounds(bounds) {
  win.setResizable(true);
  win.setBounds(bounds);
  win.setResizable(false);
}

function showStrip() {
  if (!win) return;
  mode = 'strip';
  interactiveRect = null;
  setBounds(stripBounds());
  win.loadFile(path.join(__dirname, '..', 'strip.html'));
}

function showManager() {
  if (!win) return;
  mode = 'manager';
  interactiveRect = null;
  setIgnoringMouse(false);
  setBounds(managerBounds());
  win.loadFile(path.join(__dirname, '..', 'index.html'));
}

function setIgnoringMouse(ignore) {
  if (!win || ignore === ignoringMouse) return;
  ignoringMouse = ignore;
  win.setIgnoreMouseEvents(ignore, { forward: true });
}

// The strip spans the screen, but only its HUD should catch clicks. Polling
// the cursor keeps the HUD reachable after click-through has been enabled.
function updateClickThrough() {
  if (!win || mode !== 'strip' || !interactiveRect) return;
  const cursor = screen.getCursorScreenPoint();
  const bounds = win.getBounds();
  const inside = cursor.x >= bounds.x + interactiveRect.x
    && cursor.x <= bounds.x + interactiveRect.x + interactiveRect.width
    && cursor.y >= bounds.y + interactiveRect.y
    && cursor.y <= bounds.y + interactiveRect.y + interactiveRect.height;
  setIgnoringMouse(!inside);
}

ipcMain.on('open-manager', showManager);
ipcMain.on('open-strip', showStrip);
ipcMain.on('strip-interactive-rect', (_event, rect) => {
  if (rect && [rect.x, rect.y, rect.width, rect.height].every(Number.isFinite)) interactiveRect = rect;
});

ipcMain.on('collapse', (_event, collapsed) => {
  if (!win || mode !== 'manager') return;
  const [x, y] = win.getPosition();
  const [width, height] = win.getSize();
  const newHeight = collapsed ? COLLAPSED_HEIGHT : MANAGER_HEIGHT;
  setBounds({ x, y: y + height - newHeight, width, height: newHeight });
});

ipcMain.on('quit', () => app.quit());

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
