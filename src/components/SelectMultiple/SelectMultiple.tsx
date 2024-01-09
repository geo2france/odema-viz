import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import './SelectMultiple.css'

type Props = {
  label: string;
  options: string[];
  setFunction: (value: any) => void;
  values: string[];
  placeHolder?: string;
  inputValue: string;
  setInputValue: (value: any) => void;
};

export default function SelectMultiple({
  label,
  options,
  values,
  setFunction,
  placeHolder = "",
  inputValue,
  setInputValue,
}: Props) {
  return (
    <Autocomplete
      multiple
      limitTags={4}
      size="small"
      options={options}
      getOptionLabel={(option) => option}
      defaultValue={[options[0], options[1], options[2]]}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeHolder} />
      )}
      
      onChange={(_event: any, newValue: any) => setFunction(newValue)}
      value={values}
      inputValue={inputValue}
      onInputChange={(_event: any, newInputValue: any) =>
        setInputValue(newInputValue)
      }
      placeholder={placeHolder}
    />
  );
}
