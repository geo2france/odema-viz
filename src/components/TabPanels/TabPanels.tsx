import { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export default (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};
