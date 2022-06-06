import { Tail } from 'tail';
import Direction from '../Message/Direction';
import Message from '../Message/Message';
import Store from '../Store/ElectronStore';
import Character from '../Character/Character';
import { IpcEvent } from '../IpcEvent/IpcEvent';
import { TradeStatus } from '../Character/CharacterStatus';

const DEFAULT_PATH =
  'C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt';

function isWhisperFromUser(data: string) {
  const startOfMessage = data.indexOf(': ');
  const log = data.substring(0, startOfMessage);
  const username = log.substring(log.lastIndexOf(' ') + 1);
  if (log.includes('@From') || log.includes('@To')) {
    return username;
  }
  return undefined;
}

function isTradeMessage(data: string) {
  const startOfMessage = data.indexOf(': ') - 2;
  const message = data.substring(startOfMessage);
  const isTradeCancelled = message.match('] : Trade cancelled.');
  const isTradeAccepted = message.match('] : Trade accepted.');
  if (isTradeCancelled || isTradeAccepted) {
    const tradeStatus = isTradeCancelled
      ? TradeStatus.Declined
      : TradeStatus.Accepted;
    return { isTrade: true, tradeStatus };
  }
  return { isTrade: false, tradeStatus: undefined };
}

export default function startLogWatcher(cb: (event: IpcEvent) => void) {
  const storedPath = Store.get('settings.logPath');
  const path = typeof storedPath === 'string' ? storedPath : DEFAULT_PATH;
  const tail = new Tail(path, { useWatchFile: true });

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
        if (a.unread > b.unread) {
          return -1;
        }
        if (a.unread < b.unread) {
          return 1;
        }
        return 0;
      });

      Store.set('messageStore', messageStore);
      if (message.direction === Direction.Incoming) {
        cb({
          name: 'MAIN->OVERLAY::notify',
          payload: { from: message.username, message: message.text },
        });
      }
    } else {
      const { isTrade, tradeStatus } = isTradeMessage(data);
      if (isTrade && tradeStatus) {
        messageStore = messageStore.map((entry) => {
          if (entry.tradeStatus === TradeStatus.Initiated) {
            entry.tradeStatus = tradeStatus;
          }
          return entry;
        });
        Store.set('messageStore', messageStore);
      }
    }
  });
}
