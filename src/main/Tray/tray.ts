import { app, Menu, Tray, shell } from 'electron';
import { getAssetPath } from '../util';
import pj from '../../../release/app/package.json';

let tray: Tray;

export function updateTray() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Version: ${pj.version}`,
      click: () => {
        shell.openExternal(
          'https://github.com/cedricdsc/poe-instant-messenger/releases'
        );
      },
    },
    {
      label: 'Join Discord',
      click: () => {
        shell.openExternal('https://discord.gg/axtZCumM');
      },
    },
    {
      label: 'Close App',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

export function createTray() {
  tray = new Tray(getAssetPath('icon.png'));

  tray.setToolTip('PoE Instant Messenger');
  updateTray();
}
