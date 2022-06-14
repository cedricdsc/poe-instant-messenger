import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { dialog } from 'electron';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Install Update on next Launch'],
        title: 'New PoE Instant Messenger Update available',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
          'A new version has been downloaded. Restart the application to apply the updates.',
      };

      dialog
        .showMessageBox(dialogOpts)
        .then((returnValue) => {
          if (returnValue.response === 0) autoUpdater.quitAndInstall();

          return null;
        })
        .catch((_err) => {});
    });

    autoUpdater.checkForUpdates();
  }
}
