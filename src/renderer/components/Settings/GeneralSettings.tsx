import { Grid } from '@mui/material';
import { StoreSchema } from '../../../main/Store/schema';
import DropdownInput, { leagueItems } from './DropdownInput';

interface GeneralSettingsProps {
  currentSettings: StoreSchema['settings'];
  updateSettings: (arg0: StoreSchema['settings']) => void;
}

export default function GeneralSettings({
  currentSettings,
  updateSettings,
}: GeneralSettingsProps) {
  return (
    <Grid
      container
      rowSpacing={4}
      columnSpacing={0.5}
      sx={{ paddingTop: '9px', width: '100%' }}
    >
      <Grid item md={6} sx={{ paddingRight: 2 }}>
        <DropdownInput
          label="Select your current League"
          dropdownItems={leagueItems}
          updateSettings={updateSettings}
          currentSettings={currentSettings}
          setting="selectedLeague"
        />
      </Grid>
    </Grid>
  );
}
