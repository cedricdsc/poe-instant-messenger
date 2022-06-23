import Store from '../Store/ElectronStore';
import Hotkey from './Hotkey';
import HotkeyActionTypes from './HotkeyActionTypes';

interface HotkeyAssign {
  assign: boolean;
  actionType: HotkeyActionTypes | undefined;
}

class HotkeyManager {
  hotkeyMap: Map<HotkeyActionTypes, Hotkey>;

  assignMode: HotkeyAssign;

  constructor() {
    this.hotkeyMap = new Map<HotkeyActionTypes, Hotkey>();
    this.assignMode = { assign: false, actionType: undefined };
    this.loadHotkeysFromStore();
  }

  register(hotkey: Hotkey, hotkeyAction: HotkeyActionTypes) {
    if (!this.getActionFromHotkey(hotkey)) {
      this.hotkeyMap.set(hotkeyAction, hotkey);
    }
  }

  getActionFromHotkey(hotkey: Hotkey) {
    for (const [key, value] of this.hotkeyMap.entries()) {
      if (hotkey.equals(value)) return key;
    }
    return undefined;
  }

  updateHotkeys() {
    this.hotkeyMap = new Map<HotkeyActionTypes, Hotkey>();
    this.loadHotkeysFromStore();
  }

  loadHotkeysFromStore() {
    const settings = Store.get('settings');
    if (settings.hotkeys[HotkeyActionTypes.ToggleCbOberserver]) {
      this.hotkeyMap.set(
        HotkeyActionTypes.ToggleCbOberserver,
        new Hotkey({
          type: 5,
          metaKey: false,
          ctrlKey:
            settings.hotkeys[HotkeyActionTypes.ToggleCbOberserver].ctrlKey,
          altKey: settings.hotkeys[HotkeyActionTypes.ToggleCbOberserver].altKey,
          shiftKey:
            settings.hotkeys[HotkeyActionTypes.ToggleCbOberserver].shiftKey,
          keycode:
            settings.hotkeys[HotkeyActionTypes.ToggleCbOberserver].keycode,
        })
      );
    }
  }
}

export default new HotkeyManager();
