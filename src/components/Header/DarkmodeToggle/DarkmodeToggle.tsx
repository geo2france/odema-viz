import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeProvider";
import { DarkModeSwitch } from 'react-toggle-dark-mode';

import "./DarkmodeToggle.css";



export default function ToggleButton() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  
  return(
    <DarkModeSwitch
        checked={darkMode}
        onChange={toggleDarkMode}
      size={40}
      moonColor={"white"}
      sunColor={"white"}

    />
  )

   
}