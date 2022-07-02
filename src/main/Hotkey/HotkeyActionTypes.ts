enum HotkeyActionTypes {
  ToggleCbOberserver = 'toggle-cb-observer',
  JoinOwnHideout = 'join-own-hideout',
}

export function isHotkeyActionType(object: any): object is HotkeyActionTypes {
  return Object.values(HotkeyActionTypes).includes(object);
}

export default HotkeyActionTypes;
