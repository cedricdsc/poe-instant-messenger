import { app } from 'electron';
import setupIpcEventHandler from './IpcEvent/handler';
import { createTray } from './Tray/tray';
import {
  attachOverlayToPoeWindow,
  createMainWindow,
} from './Window/MainWindow';
import { checkForSettings, installExtensions } from './util';
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

app
  .whenReady()
  .then(() => {
    installExtensions();
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
