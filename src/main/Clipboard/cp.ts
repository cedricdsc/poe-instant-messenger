import ClipboardObserver from './ClipboardObserver';

let cpo: ClipboardObserver;

const onTextChange = (text: string) => {
  if (text.match(/(@.*\s.*\(.*".*".*\))/)) {
    //
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
