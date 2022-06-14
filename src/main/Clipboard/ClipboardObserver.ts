import { clipboard } from 'electron';

interface Options {
  duration?: number;
  textChange?: (text: string, beforeText: string) => void;
}

export default class ClipboardObserver {
  timer: NodeJS.Timeout | undefined;

  beforeText: string = '';

  duration: number = 500;

  textChange: ((text: string, beforeText: string) => void) | undefined;

  constructor(options: Options) {
    const { duration, textChange } = options;

    if (duration) this.duration = duration;
    if (textChange) this.textChange = textChange;

    if (this.textChange) {
      this.start();
    }
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
    if (this.textChange) {
      this.beforeText = clipboard.readText();
    }
  }

  setTimer() {
    this.timer = setInterval(() => {
      if (this.textChange) {
        const text = clipboard.readText();
        if (ClipboardObserver.isDiffText(this.beforeText, text)) {
          this.textChange(text, this.beforeText);
          this.beforeText = text;
        }
      }
    }, this.duration);
  }

  static isDiffText(beforeText: string, afterText: string): boolean {
    return beforeText !== afterText;
  }
}
