import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

type Props = {
  label: string;
  units: string[];
  selectedValue: string;
  setter: (event: any, value: string) => void;
};

export default ({ label, units, selectedValue, setter }: Props) => {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selectedValue}
        onChange={setter}
      >
        {units.map((unit, index) => (
          <FormControlLabel
            value={unit.toLowerCase()}
            control={<Radio />}
            label={unit}
            key={index}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
