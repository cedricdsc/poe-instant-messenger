import Store from '../Store/ElectronStore';
import Hotkey from './Hotkey';
import { HotkeyAction, HotkeyActionTypes } from './HotkeyAction';

class HotkeyManager {
  hotkeyMap: Map<HotkeyAction, Hotkey>;

  constructor() {
    this.hotkeyMap = new Map<HotkeyAction, Hotkey>();

    this.loadHotskeyFromStore();
  }

  register(hotkey: Hotkey, hotkeyAction: HotkeyAction) {
    if (!this.getActionFromHotkey(hotkey)) {
      this.hotkeyMap.set(hotkeyAction, hotkey);
    }
  }

  getActionFromHotkey(hotkey: Hotkey) {
    for (const [key, value] of this.hotkeyMap.entries()) {
      if (JSON.stringify(hotkey) === JSON.stringify(value)) return key;
    }
    return undefined;
  }

  loadHotskeyFromStore() {
    const settings = Store.get('settings');
    if (settings.hotkeys[HotkeyActionTypes.ToggleCbOberserver]) {
      this.hotkeyMap.set(
        { name: HotkeyActionTypes.ToggleCbOberserver },
        settings.hotkeys[HotkeyActionTypes.ToggleCbOberserver]
      );
    }
  }
}

export default new HotkeyManager();
