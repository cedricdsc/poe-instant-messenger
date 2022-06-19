import classNames from 'classnames';
import classes from './SettingsTab.module.scss';

interface SettingsTabProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function SettingsTab(props: SettingsTabProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={classNames(classes.tab, { [classes.flex]: value! === index })}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}
