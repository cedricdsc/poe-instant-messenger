import { app } from 'electron';
import Store from './Store/ElectronStore';
import setupIpcEventHandler from './IpcEvent/handler';
import { createTray } from './Tray/tray';
import {
  attachOverlayToPoeWindow,
  createMainWindow,
} from './Window/MainWindow';
import { checkForSettings } from './util';

if (!app.requestSingleInstanceLock()) {
  app.exit();
}

if (!Store.get('settings.hardwareAccelerationEnabled')) {
  app.disableHardwareAcceleration();
  Store.set('settings.hardwareAccelerationEnabled', true);
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// const isDebug =
//   process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// if (isDebug) {
//   require('electron-debug')();
// }

app.whenReady().then(() => {
  checkForSettings();
  createTray();
  setupIpcEventHandler();
  createMainWindow();
  attachOverlayToPoeWindow();
});
