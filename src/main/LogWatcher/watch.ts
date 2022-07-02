import { Tail } from 'tail';
import Direction from '../Message/Direction';
import Message from '../Message/Message';
import Store from '../Store/ElectronStore';
import Character from '../Character/Character';
import { IpcEvent } from '../IpcEvent/IpcEvent';
import playNotificationSound from './playNotificationSound';

let tail: Tail;

function isWhisperFromUser(data: string) {
  const startOfMessage = data.indexOf(': ');
  const log = data.substring(0, startOfMessage);
  const username = log.substring(log.lastIndexOf(' ') + 1);
  if (log.includes('@From') || log.includes('@To')) {
    return username;
  }
  return undefined;
}

export default function startLogWatcher(cb: (event: IpcEvent) => void) {
  const settings = Store.get('settings');
  const { logPath } = settings;
  if (tail !== undefined) tail.unwatch();
  tail = new Tail(logPath, {
    follow: false,
    useWatchFile: true,
    fsWatchOptions: { interval: 200 },
  });

  tail.on('line', (data: string) => {
    let messageStore = Store.get('messageStore');
    if (!messageStore) messageStore = [];

    const username = isWhisperFromUser(data);
    if (username) {
      let currentCharacter;
      const characterIndex = messageStore.findIndex(
        (character) => character.username === username
      );

      if (characterIndex !== -1) {
        currentCharacter = messageStore[characterIndex];
      } else {
        currentCharacter = new Character(username);
      }

      const message = new Message(data, username);
      currentCharacter.messages.push(message);

      if (message.direction === Direction.Incoming) {
        currentCharacter.unread += 1;
      }

      if (characterIndex !== -1) {
        messageStore[characterIndex] = currentCharacter;
      } else {
        messageStore.push(currentCharacter);
      }

      messageStore.sort((a, b) => {
        if (
          new Date(a.messages[a.messages.length - 1].timestamp).getTime() >
          new Date(b.messages[b.messages.length - 1].timestamp).getTime()
        ) {
          return -1;
        }
        if (
          new Date(a.messages[a.messages.length - 1].timestamp).getTime() <
          new Date(b.messages[b.messages.length - 1].timestamp).getTime()
        ) {
          return 1;
        }
        return 0;
      });

      Store.set('messageStore', messageStore);
      if (message.direction === Direction.Incoming) {
        playNotificationSound();
        cb({
          name: 'MAIN->OVERLAY::notify',
          payload: { from: message.username, message: message.text },
        });
      }
    }
  });
}
