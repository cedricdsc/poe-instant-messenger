import Store from '../Store/ElectronStore';
import Hotkey from './Hotkey';
import HotkeyActionTypes from './HotkeyActionTypes';

class HotkeyManager {
  hotkeyMap: Map<HotkeyActionTypes, Hotkey>;

  constructor() {
    this.hotkeyMap = new Map<HotkeyActionTypes, Hotkey>();

    this.loadHotskeyFromStore();
  }

  register(hotkey: Hotkey, hotkeyAction: HotkeyActionTypes) {
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
        HotkeyActionTypes.ToggleCbOberserver,
        settings.hotkeys[HotkeyActionTypes.ToggleCbOberserver]
      );
    }
  }
}

export default new HotkeyManager();
