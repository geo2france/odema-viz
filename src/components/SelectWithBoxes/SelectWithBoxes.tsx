import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type Props = {
  label: string;
  options: string[];
  propValue?: string[];
  handleValue: (value: any) => void;
};

export default ({ label, options, propValue, handleValue }: Props) => {
  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={propValue}
          onChange={(event: any) => handleValue(event)}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected}
          MenuProps={MenuProps}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              <Checkbox
                checked={!!propValue?.find((value) => value === option)}
              />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
