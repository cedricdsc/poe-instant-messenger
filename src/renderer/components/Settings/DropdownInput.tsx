import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { StoreSchema } from '../../../main/Store/schema';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownInputProps {
  label: string;
  dropdownItems: DropdownItem[];
  currentSettings: StoreSchema['settings'];
  updateSettings: (arg0: StoreSchema['settings']) => void;
  setting: keyof StoreSchema['settings'];
}

export const leagueItems: DropdownItem[] = [
  { label: 'Sentinel', value: 'Sentinel' },
  { label: 'Hardcore Sentinel', value: 'Hardcore Sentinel' },
  { label: 'Standard', value: 'Standard' },
  { label: 'Hardcore', value: 'Hardcore' },
];

export default function DropdownInput({
  label,
  dropdownItems,
  currentSettings,
  updateSettings,
  setting,
}: DropdownInputProps) {
  const labelId = label.toLowerCase().replace(' ', '-');

  const handleChange = (event: SelectChangeEvent) => {
    const newSettings = { ...currentSettings };
    newSettings.selectedLeague = event.target.value;
    updateSettings(newSettings);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={labelId}
        value={currentSettings[setting].toString()}
        label={label}
        onChange={handleChange}
      >
        {dropdownItems.map((item) => (
          <MenuItem key={uuidv4()} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
