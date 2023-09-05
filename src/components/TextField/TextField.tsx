import TextField from '@mui/material/TextField';

type Props = {
  label?: string;
  disabled?: boolean;
  value: string;
  defaultValue?: string;
};

export default ({ label, disabled = false, value, defaultValue }: Props) => {
  return (
    <TextField
      disabled={disabled}
      id={label?.toLowerCase()}
      label={label}
      value={value}
      defaultValue={defaultValue}
    />
  );
};
