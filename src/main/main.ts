import { app } from 'electron';
import setupIpcEventHandler from './IpcEvent/handler';
import { createTray } from './Tray/tray';
import {
  attachOverlayToPoeWindow,
  createMainWindow,
} from './Window/MainWindow';
import { checkForSettings } from './util';
import AppUpdater from './AppUpdater/AppUpdater';
import Store from './Store/ElectronStore';
import ClipboardObserver from './Clipboard/ClipboardObserver';
import initializeHotkeyListener from './Hotkey/hotkeys';

if (!app.requestSingleInstanceLock()) {
  app.exit();
}

if (!Store.get('settings.hardwareAccelerationEnabled')) {
  app.disableHardwareAcceleration();
  Store.set('settings.hardwareAccelerationEnabled', true);
}

// eslint-disable-next-line
new AppUpdater();

// if (process.env.NODE_ENV === 'production') {
//   const sourceMapSupport = require('source-map-support');
//   sourceMapSupport.install();
// }

// const isDebug =
//   process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// if (isDebug) {
//   require('electron-debug')();
// }

app
  .whenReady()
  .then(() => {
    checkForSettings();
    createTray();
    setupIpcEventHandler();
    createMainWindow();
    attachOverlayToPoeWindow();
    ClipboardObserver.start();
    initializeHotkeyListener();
    return null;
  })
  .catch();
