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
      if (JSON.stringify(hotkey) === JSON.stringify(value)) return key;
    }
    return undefined;
  }

  updateHotkeys() {
    this.hotkeyMap = new Map<HotkeyActionTypes, Hotkey>();
    this.loadHotkeysFromStore();
  }

  loadHotkeysFromStore() {
    const settings = Store.get('settings');
    Object.keys(settings.hotkeys).forEach((key) => {
      const hotkeyActionType = key as HotkeyActionTypes;
      if (hotkeyActionType)
        this.hotkeyMap.set(
          hotkeyActionType,
          settings.hotkeys[hotkeyActionType]
        );
    });
  }
}

export default new HotkeyManager();
