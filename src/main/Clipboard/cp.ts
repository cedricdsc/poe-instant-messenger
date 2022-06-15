import ClipboardObserver from './ClipboardObserver';
import { sendMessageFromTradeSite } from '../Message/sendMessage';
import Store from '../Store/ElectronStore';

let cpo: ClipboardObserver;

const onTextChange = (text: string) => {
  const league = Store.get('settings.selectedLeague');
  const searchListedItemRegExp = new RegExp(/@.*\s.*\(.*".*"(;|,).*:.*,.*\)/);
  const bulkExchangeRegExp = new RegExp(`@.*\\s.*${league}.*`);
  if (text.match(searchListedItemRegExp) || text.match(bulkExchangeRegExp)) {
    sendMessageFromTradeSite();
  }
};

export function initializeClipboard() {
  cpo = new ClipboardObserver({ textChange: onTextChange });
}

export function cpStop() {
  cpo.stop();
}

export function cpStart() {
  cpo.start();
}
