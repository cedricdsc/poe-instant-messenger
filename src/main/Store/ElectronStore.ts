import ElectronStore from 'electron-store';
import schema from './schema';

const Store = new ElectronStore({ schema, watch: true });

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
