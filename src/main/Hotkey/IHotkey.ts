export default interface IHotkey {
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  keycode: number;
  keyName: string;
}

export function instanceOfHotkey(object: any): object is IHotkey {
  return (
    'altKey' in object &&
    typeof object.altKey === 'boolean' &&
    'ctrlKey' in object &&
    typeof object.ctrlKey === 'boolean' &&
    'shiftKey' in object &&
    typeof object.shiftKey === 'boolean' &&
    'keycode' in object &&
    typeof object.keycode === 'number' &&
    'keyName' in object &&
    typeof object.keyName === 'string'
  );
}
