import ClipboardObserver from './ClipboardObserver';
import { sendMessageFromTradeSite } from '../Message/sendMessage';

let cpo: ClipboardObserver;

const onTextChange = (text: string) => {
  // TODO: Add League Name to settings & here to test for
  if (text.match(/(@.*\s.*\(.*".*".*\))/)) {
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
