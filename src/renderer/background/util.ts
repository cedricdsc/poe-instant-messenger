import MainProcess from './mainProcess';

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export function onElementEnter() {
  MainProcess.sendEvent({
    name: 'OVERLAY->MAIN::mouseEnter',
    payload: { mouseEntered: true },
  });
}

export function onElementLeave() {
  MainProcess.sendEvent({
    name: 'OVERLAY->MAIN::mouseLeave',
    payload: { mouseLeft: true },
  });
}
