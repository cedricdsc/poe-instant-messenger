import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useRef, useState } from 'react';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { StoreSchema } from '../../../main/Store/schema';
import HotkeyActionTypes from '../../../main/Hotkey/HotkeyActionTypes';
import MainProcess from '../../background/mainProcess';
import { getTheme } from '../../background/util';
import classes from './HotkeyInput.module.scss';
import { useStore } from '../../background/store';

interface HotkeyInputProps {
  label: string;
  hotkeyActionType: HotkeyActionTypes;
  currentSettings: StoreSchema['settings'];
  updateSettings: (arg0: StoreSchema['settings']) => void;
}

interface Combinator {
  key: string;
  name: string;
}

const validCombinators = [
  { key: 'ctrlKey', name: 'Ctrl' },
  { key: 'altKey', name: 'Alt' },
  { key: 'shiftKey', name: 'Shift' },
];

export default function HotkeyInput({
  label,
  hotkeyActionType,
  currentSettings,
  updateSettings,
}: HotkeyInputProps) {
  const { store } = useStore();
  const [open, setOpen] = useState(false);
  const [waitForInput, setWaitForInput] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const hotkey = currentSettings.hotkeys[hotkeyActionType];

  const getCurrentCombinator = (): Combinator | undefined => {
    if (hotkey.ctrlKey) return { key: 'ctrlKey', name: 'Ctrl' };
    if (hotkey.altKey) return { key: 'altKey', name: 'Alt' };
    if (hotkey.shiftKey) return { key: 'shiftKey', name: 'Shift' };
    return undefined;
  };

  const currentCombinator = getCurrentCombinator();

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleInputToggle = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::listenForHotkey',
      payload: { isWaitingForInput: !waitForInput },
    });
    setWaitForInput(!waitForInput);
  };

  MainProcess.onEvent('MAIN->OVERLAY::hotkeySet', (payload) => {
    setWaitForInput(!waitForInput);
    const newSettings = { ...currentSettings };
    newSettings.hotkeys[hotkeyActionType] = {
      ...newSettings.hotkeys[hotkeyActionType],
      keycode: payload.hotkey.keycode,
      keyName: payload.hotkey.keyName,
    };
    updateSettings(newSettings);
  });

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    const newSettings = { ...currentSettings };
    newSettings.hotkeys[hotkeyActionType].ctrlKey = false;
    newSettings.hotkeys[hotkeyActionType].altKey = false;
    newSettings.hotkeys[hotkeyActionType].shiftKey = false;
    if (validCombinators[index].key === 'ctrlKey')
      newSettings.hotkeys[hotkeyActionType].ctrlKey = true;
    if (validCombinators[index].key === 'altKey')
      newSettings.hotkeys[hotkeyActionType].altKey = true;
    if (validCombinators[index].key === 'shiftKey')
      newSettings.hotkeys[hotkeyActionType].shiftKey = true;

    updateSettings(newSettings);
    setOpen(false);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classNames(classes.wrapper)}>
      <Typography
        variant="caption"
        sx={{ color: getTheme(store).palette.text.primary }}
      >
        {label}
      </Typography>
      <ButtonGroup variant="contained" ref={anchorRef}>
        <Button
          onClick={handleToggle}
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          sx={{
            paddingRight: '8px',
            width: '96px',
            justifyContent: 'space-between',
          }}
        >
          {currentCombinator ? currentCombinator.name : 'None'}
          <ArrowDropDownIcon />
        </Button>
        <Button variant="contained" onClick={handleInputToggle}>
          {!waitForInput ? hotkey.keyName : '...'}
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} disablePortal>
        <Paper sx={{ width: '96px' }}>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList id="split-button-menu">
              {validCombinators.map((combinator, index) => (
                <MenuItem
                  value={combinator.key}
                  key={uuidv4()}
                  selected={currentCombinator?.key === combinator.key}
                  onClick={(event) => handleMenuItemClick(event, index)}
                >
                  {combinator.name}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
}
