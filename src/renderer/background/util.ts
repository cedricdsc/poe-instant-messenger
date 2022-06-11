import { darkTheme, lightTheme } from '../globals/theme';
import MainProcess from './mainProcess';
import { Store } from './reducer';

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

export function getTheme(store: Store) {
  const isDarkTheme = store.state.settings.darkTheme;
  return isDarkTheme ? darkTheme : lightTheme;
}
