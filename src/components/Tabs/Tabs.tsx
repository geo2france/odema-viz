import { SyntheticEvent } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

type Label = { name: string; disabled: boolean };
interface Props {
  tabLabels: Label[];
  value: number;
  handler: (event: SyntheticEvent, newValue: number) => void;
}

export default ({ tabLabels, value, handler }: Props) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handler}>
        {tabLabels.map((label: Label, index: number) => (
          <Tab label={label.name} key={index} disabled={label.disabled} />
        ))}
      </Tabs>
    </Box>
  );
};
