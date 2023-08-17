import { SyntheticEvent } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface Props {
  labels: string[];
  value: number;
  handler: (event: SyntheticEvent, newValue: number) => void;
}

export default ({ labels, value, handler }: Props) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handler}>
        {labels.map((label: string, index: number) => (
          <Tab label={label} key={index} />
        ))}
      </Tabs>
    </Box>
  );
};
