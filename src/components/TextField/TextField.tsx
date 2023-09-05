import TextField from '@mui/material/TextField';

type Props = {
  label?: string;
  disabled?: boolean;
  value: string;
  defaultValue?: string;
  fullWidth?: boolean;
};

export default ({
  label,
  disabled = false,
  value,
  defaultValue,
  fullWidth = false,
}: Props) => {
  return (
    <TextField
      disabled={disabled}
      id={label?.toLowerCase()}
      label={label}
      value={value}
      defaultValue={defaultValue}
      fullWidth={fullWidth}
    />
  );
};
