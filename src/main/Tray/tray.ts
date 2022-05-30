import { app, Menu, Tray } from 'electron';
import { getAssetPath } from '../util';

let tray: Tray;

export function createTray() {
  tray = new Tray(getAssetPath('icon.png'));

  tray.setToolTip('PoE Instant Messenger');
  updateTray();
}

export function updateTray() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
    },
    {
      label: 'Patreon',
    },
    {
      label: 'Discord',
    },
    {
      label: 'Version',
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}
