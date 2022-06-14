import fs from 'fs';
import wav from 'wav';
import Speaker from 'speaker';
import { getAssetPath } from '../util';

let isSoundPlaying = false;

export default function playNotificationSound() {
  if (!isSoundPlaying) {
    const reader = new wav.Reader();

    reader.on('format', (format) => {
      reader.pipe(new Speaker(format));
    });

    const file = fs.createReadStream(
      getAssetPath('sounds/notification_sound.wav')
    );
    file.pipe(reader);
    isSoundPlaying = true;
    setTimeout(() => {
      isSoundPlaying = false;
    }, 2000);
  }
}
