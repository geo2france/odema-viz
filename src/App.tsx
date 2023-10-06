import { HashRouter, Routes, Route } from "react-router-dom";
import TechnicalSheet from "./views/TechnicalSheet/TechnicalSheet";
import DashBoard from "./views/DashBoard/Dashboard";
import { useContext } from "react";
import { IndicatorsProvider } from "./context/IndicatorsContext";
import DarkModeProvider, { DarkModeContext } from "./context/DarkModeProvider";
import { darkThemeConfig } from "./theme/darkThemeConfig";
import { lightThemeConfig } from "./theme/lightThemeConfig";
import { ThemeProvider } from "@mui/material/styles";

import "./App.css";

function App() {
  // engloble les context
  return (
    <IndicatorsProvider>
      <DarkModeProvider>
        <AppContent />
      </DarkModeProvider>
    </IndicatorsProvider>
  );
}

function AppContent() {
  const { darkMode } = useContext(DarkModeContext);
  var bodyElement = document.body;
  // Utilisez toggle pour ajouter ou retirer la classe en fonction de darkMode
  bodyElement.classList.toggle("dark", darkMode);
  bodyElement.classList.toggle("light", !darkMode);
  return (
    <div>
      {/* gestion du thème ANT */}
      <ThemeProvider theme={darkMode ? darkThemeConfig : lightThemeConfig}>
        {/* gestion du thème MU */}
        <HashRouter>
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/technicalsheet/:guid" element={<TechnicalSheet />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
