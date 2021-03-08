import { BrowserWindow } from 'electron';
import windowStateKeeper from 'electron-window-state';
import isDev from 'electron-is-dev';
import path from 'path';

let settingsWindow: BrowserWindow | undefined;

export function createSettingsWindow() {
  if (settingsWindow !== undefined) {
    settingsWindow.show();
    return;
  }

  const windowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 900,
    file: 'mainWindow.json',
  });

  settingsWindow = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    title: 'TART',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      devTools: isDev,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
    resizable: false,
    backgroundColor: '#fff',
    frame: false,
  });

  windowState.manage(settingsWindow);

  if (isDev) {
    settingsWindow
      .loadURL('http://localhost:3000')
      .catch((error) => console.error(error));
    settingsWindow.webContents.openDevTools({ mode: 'undocked' });
  } else {
    const url = new URL(
      `file://${path.join(__dirname, '../../build/index.html')}`
    );
    settingsWindow
      .loadURL(url.toString())
      .catch((error) => console.error(error));
  }

  settingsWindow.once('ready-to-show', () => {
    settingsWindow?.show();
  });

  settingsWindow.once('closed', () => {
    settingsWindow = undefined;
  });
}