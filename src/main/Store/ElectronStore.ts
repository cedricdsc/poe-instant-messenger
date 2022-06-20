import ElectronStore from 'electron-store';
import Character from '../Character/Character';
import { initialState } from '../../renderer/background/reducer';
import schema, { instaceOfSettings } from './schema';

const Store = new ElectronStore({
  schema,
  watch: true,
  clearInvalidConfig: true,
});

const settings = Store.get('settings');
const msgStore = Store.get('messageStore');

if (
  settings === undefined ||
  msgStore === undefined ||
  !instaceOfSettings(settings) ||
  Object.values(settings.hotkeys).length !==
    Object.values(initialState.settings.hotkeys).length ||
  (Array.isArray(msgStore) &&
    msgStore.length > 0 &&
    msgStore.every((item) => {
      return item instanceof Character;
    }))
) {
  Store.set(initialState);
}

type CallBack = () => void;

const callbacks: CallBack[] = [];

Store.onDidAnyChange(() => {
  callbacks.forEach((cb) => {
    cb();
  });
});

export function addCallbackOnAnyChange(cb: CallBack) {
  callbacks.push(cb);
}

export default Store;
