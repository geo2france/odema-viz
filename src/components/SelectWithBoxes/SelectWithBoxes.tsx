import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import './SelectWithBoxes.css'

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
  disabled: boolean;
  label: string;
  options: string[];
  propValue?: string[];
  handleValue: (value: any) => void;
  selectedAll?: boolean;
};

export default ({
  disabled,
  label,
  options,
  propValue,
  handleValue,
  selectedAll = false,
}: Props) => {
  return (
    <div>
      <FormControl >
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={propValue}
          onChange={(event: any) => handleValue(event)}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(',')}
          MenuProps={MenuProps}
          disabled={disabled}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              <Checkbox
                checked={
                  option === 'Tout'
                    ? selectedAll
                    : !!propValue?.find((value) => value === option)
                }
              />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
