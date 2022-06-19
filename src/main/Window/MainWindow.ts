import path from 'path';
import { BrowserWindow, ipcMain, IpcMainEvent, app } from 'electron';
import PoeWindow from './PoeWindow';
import { IpcEvent, IpcEventPayload } from '../IpcEvent/IpcEvent';
import { getAssetPath, resolveHtmlPath } from '../util';
import startLogWatcher from '../LogWatcher/watch';
import Store, { addCallbackOnAnyChange } from '../Store/ElectronStore';

let MainWindow: BrowserWindow | null = null;
let mainIsActive = false;

export function isMainActive() {
  return mainIsActive;
}

export function getMainWindow() {
  if (MainWindow) return MainWindow;
  return undefined;
}

export function disableOverlayPointerEvents(forward?: boolean) {
  if (MainWindow) {
    if (!forward) MainWindow.setIgnoreMouseEvents(true);
    else MainWindow.setIgnoreMouseEvents(true, { forward });
  }
}

export function enableOverlayPointerEvents() {
  if (MainWindow) {
    MainWindow.setIgnoreMouseEvents(false);
  }
}

export function focusOverlay() {
  if (!MainWindow) return;

  enableOverlayPointerEvents();
  PoeWindow.activateOverlay();
  mainIsActive = true;
}

export function focusPoE() {
  if (!MainWindow) return;

  disableOverlayPointerEvents(true);
  PoeWindow.focusPoe();
  mainIsActive = false;
}

export function attachOverlayToPoeWindow() {
  if (MainWindow) {
    PoeWindow.attach(MainWindow);
    focusPoE();
  }
}

export function isPoeFocused() {
  return !mainIsActive && !MainWindow?.isFocused() && PoeWindow.isActive;
}

export function overlayOnEvent<Name extends IpcEvent['name']>(
  name: Name,
  cb: (e: IpcMainEvent, payload: IpcEventPayload<Name>) => void
) {
  ipcMain.on(name, cb);
}

export function overlaySendEvent(event: IpcEvent) {
  if (MainWindow) MainWindow.webContents.send('named-event', event);
}

export function sendUpdateStoreEvent() {
  overlaySendEvent({
    name: 'MAIN->OVERLAY::main-store-changed',
    payload: { Store: Store.store },
  });
}

export function createMainWindow() {
  MainWindow = new BrowserWindow({
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../.erb/dll/preload.js'),
    },
    frame: false,
    show: false,
    transparent: true,
    resizable: false,
    fullscreenable: false,
  });

  MainWindow.loadURL(resolveHtmlPath('index.html'));

  /**
   * Add event listeners
   */
  MainWindow.on('ready-to-show', () => {
    if (!MainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    sendUpdateStoreEvent();
  });

  MainWindow.on('closed', () => {
    MainWindow = null;
  });

  if (Store.get('settings.setUp')) startLogWatcher(overlaySendEvent);

  addCallbackOnAnyChange(() => {
    sendUpdateStoreEvent();
  });
}
