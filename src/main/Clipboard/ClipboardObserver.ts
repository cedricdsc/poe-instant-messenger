import { clipboard } from 'electron';
import { sendMessageFromTradeSite } from '../Message/sendMessage';
import Store from '../Store/ElectronStore';

class ClipboardObserver {
  timer: NodeJS.Timeout | undefined;

  beforeText: string = '';

  duration: number = 500;

  textChange: ((text: string, beforeText: string) => void) | undefined;

  clipboardObservation: boolean = false;

  toggleObservation() {
    this.clipboardObservation = !this.clipboardObservation;
  }

  start() {
    this.setClipboardDefaultValue();
    this.setTimer();
  }

  stop() {
    this.setTimer();
  }

  clearTimer(): void {
    clearInterval(this.timer);
  }

  setClipboardDefaultValue() {
    this.beforeText = clipboard.readText();
  }

  setTimer() {
    this.timer = setInterval(() => {
      if (this.clipboardObservation) {
        const text = clipboard.readText();
        if (ClipboardObserver.isDiffText(this.beforeText, text)) {
          this.onTextChange(text);
          this.beforeText = text;
        }
      }
    }, this.duration);
  }

  static isDiffText(beforeText: string, afterText: string): boolean {
    return beforeText !== afterText;
  }

  onTextChange = (text: string) => {
    const league = Store.get('settings.selectedLeague');
    const searchListedItemRegExp = new RegExp(/@.*\s.*\(.*".*"(;|,).*:.*,.*\)/);
    const bulkExchangeRegExp = new RegExp(`@.*\\s.*${league}.*`);
    if (text.match(searchListedItemRegExp) || text.match(bulkExchangeRegExp)) {
      sendMessageFromTradeSite();
    }
  };
}

export default new ClipboardObserver();
