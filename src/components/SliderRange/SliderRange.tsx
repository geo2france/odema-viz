import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

type Props = {
  value: number[];
  minValue: number;
  maxValue: number;
  setter: (_event: Event, newValue: any) => void;
};

export default ({ value, minValue, maxValue, setter }: Props) => {
  return (
    <Box sx={{ width: 300, margin: '10px 60px' }}>
      <Typography id="range-slider" gutterBottom>
        Années : {value[0]} - {value[1]}
      </Typography>
      <Slider
        value={value}
        onChange={setter}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        min={minValue}
        max={maxValue}
      />
    </Box>
  );
};
