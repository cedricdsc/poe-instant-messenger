import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import classes from './BottomBar.module.scss';
import classNames from 'classnames';

export default function BottomBar() {
  return (
    <AppBar className={classNames(classes.ctaBottom)} position="static">
      <Toolbar variant="dense">
        <Tooltip title="Settings">
          <IconButton disabled>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Search">
          <IconButton disabled>
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Software Information">
          <IconButton disabled>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
