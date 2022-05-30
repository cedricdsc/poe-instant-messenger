import { BrowserWindow } from 'electron';
import { overlayWindow } from 'electron-overlay-window';
import Store from '../Store/ElectronStore';

class PoeWindow {
  isActive = false;

  attach(window: BrowserWindow) {
    overlayWindow.on('focus', () => {
      this.isActive = true;
    });
    overlayWindow.on('blur', () => {
      this.isActive = false;
    });
    overlayWindow.attachTo(window, Store.get('settings.windowTitle'));
  }

  focusPoe() {
    overlayWindow.focusTarget();
    this.isActive = true;
  }

  activateOverlay() {
    overlayWindow.activateOverlay();
    this.isActive = false;
  }
}

export default new PoeWindow();
