import { getAssetPath } from '../util';

const player = require('node-wav-player');

export default function playNotificationSound() {
  player.play({
    path: getAssetPath('sounds/notification_sound.wav'),
  });
}
