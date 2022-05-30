import MainProcess from './mainProcess';

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
