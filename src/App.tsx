import { HashRouter, Routes, Route } from "react-router-dom";
import TechnicalSheet from "./views/TechnicalSheet/TechnicalSheet";
import IndicateurOjbectif from "./views/IndicateurOjbectif/IndicateurOjbectif";

import DashBoard from "./views/DashBoard/Dashboard";
import { useContext } from "react";
import { IndicatorsProvider } from "./context/IndicatorsContext";
import DarkModeProvider, { DarkModeContext } from "./context/DarkModeProvider";
import { darkThemeConfig } from "./theme/darkThemeConfig";
import { lightThemeConfig } from "./theme/lightThemeConfig";
import { antdThemeConfig } from "./theme/antdThemeConfig";

import { ThemeProvider } from "@mui/material/styles";
import frFR from "antd/locale/fr_FR"
import { ConfigProvider } from "antd";

import "./App.css";

function App() {
  // engloble les context
  return (
    <IndicatorsProvider>
      <DarkModeProvider>
        <ConfigProvider
          locale={frFR}
          theme={antdThemeConfig}
        >
          <AppContent />
        </ConfigProvider>
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
            <Route path="/indicateur_objectif" element={<IndicateurOjbectif />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
