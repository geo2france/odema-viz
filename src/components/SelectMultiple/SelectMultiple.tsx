import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

type TerritoryCategory = {
  name: string;
  territories: string[];
};

type Props = {
  label: string;
  options: TerritoryCategory[];
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
      groupBy={(option) => option.name}
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
      isOptionEqualToValue={(option, value) =>
        option.territories.includes(value)
      }
      renderOption={(_props, option, { selected }) => (
        
        <React.Fragment key={option.name}>
          <List>
            {option.territories.map((territory: string) => (
              <ListItem
                dense
                button
                selected={selected && values.includes(territory)}
                onClick={() => {
                  const selectedTerritories = [...values];
                  const territoryIndex = selectedTerritories.indexOf(territory);
                  if (territoryIndex === -1) {
                    selectedTerritories.push(territory);
                  } else {
                    selectedTerritories.splice(territoryIndex, 1);
                  }
                  setFunction(selectedTerritories);
                }}
                key={territory}
              >
                <ListItemText primary={territory} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </React.Fragment>
      )}
    />
  );
}
