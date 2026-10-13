// Electron shell: the game starts as a transparent, always-on-top battle
// strip. Clicking its HUD opens the existing management window; the minus
// button returns to the strip. Both modes use the same renderer save.
const { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, screen, Tray } = require('electron');
const path = require('path');

const MANAGER_WIDTH = 360;
const MANAGER_HEIGHT = 600;
const STRIP_HEIGHT = 170;
const COLLAPSED_HEIGHT = 48;
const MARGIN = 24;

let win;
let mode = 'strip';
let interactiveRect = null;
let ignoringMouse = false;
let tray;

function windowOptions(bounds) {
  return {
    ...bounds,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
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
  // Stay on normal desktop spaces, but do not follow the user into a full-screen
  // browser/video space. The menu-bar toggle handles deliberate restores.
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });
  createTray();
  globalShortcut.register('CommandOrControl+Shift+G', toggleStrip);
  showStrip();
  setInterval(updateClickThrough, 50);
}

function createTray() {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path fill="white" d="M9 1l2.2 4.7 5.1.6-3.8 3.6 1 5.1L9 12.5 4.5 15l1-5.1-3.8-3.6 5.1-.6z"/></svg>';
  const icon = nativeImage.createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`).resize({ width: 18, height: 18 });
  icon.setTemplateImage(true);
  tray = new Tray(icon);
  tray.setToolTip('Pocket Gacha');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show / Hide Battle Strip', click: toggleStrip },
    { label: 'Open Management', click: showManager },
    { type: 'separator' },
    { label: 'Quit Pocket Gacha', click: () => app.quit() },
  ]));
  tray.on('click', toggleStrip);
  app.dock?.hide();
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
  win.showInactive();
}

function showManager() {
  if (!win) return;
  mode = 'manager';
  interactiveRect = null;
  setIgnoringMouse(false);
  setBounds(managerBounds());
  win.loadFile(path.join(__dirname, '..', 'index.html'));
  win.show();
  win.focus();
}

function hideStrip() {
  if (win && mode === 'strip') win.hide();
}

function toggleStrip() {
  if (!win) return;
  if (mode === 'strip' && win.isVisible()) hideStrip();
  else if (mode === 'strip') win.showInactive();
  else showStrip();
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
ipcMain.on('hide-strip', hideStrip);
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
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => app.quit());
