import { app } from 'electron';
import isDev from 'electron-is-dev';
import { createMainWindow } from './modules/createWindows';
import './modules/handleIPC';

if (require('electron-squirrel-startup')) app.quit();

/**
 * Check whether other app instance is running.
 * If true, quit the second app instance.
 */
if (!app.requestSingleInstanceLock()) app.quit();

app.on('ready', () => {
  createMainWindow();

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: string) => console.log(`extension: ${name} added`))
      .catch((err: any) => console.log(`extension: ${err}`));
  }
});

app.on('second-instance', () => {
  createMainWindow();
});

app.on('activate', (e, hasVisibleWindow) => {
  if (!hasVisibleWindow) createMainWindow();
});