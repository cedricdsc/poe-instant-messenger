import ElectronStore from 'electron-store';
import Character from '../Character/Character';
import { initialState } from '../../renderer/background/reducer';
import schema, { instanceOfSettings } from './schema';

const Store = new ElectronStore({
  schema,
  watch: true,
  clearInvalidConfig: true,
});

const settings = Store.get('settings');
const msgStore = Store.get('messageStore');

if (settings === undefined || !instanceOfSettings(settings)) {
  Store.set('settings', initialState.settings);
}

if (
  msgStore === undefined ||
  (Array.isArray(msgStore) &&
    msgStore.length > 0 &&
    msgStore.every((item) => item instanceof Character))
) {
  Store.set('messageStore', initialState.messageStore);
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
