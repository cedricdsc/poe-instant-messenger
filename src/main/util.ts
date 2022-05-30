import { URL } from 'url';
import path from 'path';
import { app } from 'electron';
import Store from './Store/ElectronStore';
import { initialState } from '../renderer/background/reducer';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export const checkForSettings = () => {
  const settings = Store.get('settings');
  const messageStore = Store.get('messageStore');

  if (!settings || !messageStore) {
    Store.set('settings', initialState.settings);
    Store.set('messageStore', initialState.messageStore);
  }
};
