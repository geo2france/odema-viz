import {createTheme} from '@mui/material/styles';

export const darkThemeConfig = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff7700",
    },
    text: {
      primary: "#FFFFFF",
    },
  },
  typography: {
    allVariants: {
      color: "white",
    },
  },
});

