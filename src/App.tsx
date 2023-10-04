import { HashRouter, Routes, Route } from 'react-router-dom';
import TechnicalSheet from './views/TechnicalSheet/TechnicalSheet';
import DashBoard from './views/DashBoard/Dashboard';
import { useContext } from "react";
import { IndicatorsProvider } from './context/IndicatorsContext';
import DarkModeProvider, { DarkModeContext } from "./context/DarkModeProvider"; 
import {ConfigProvider} from 'antd';
import { darkThemeConfig } from './theme/darkThemeConfig';
import { lightThemeConfig } from "./theme/lightThemeConfig";

import './App.css';



function App() {
  // engloble les context
  const { darkMode } = useContext(DarkModeContext);
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
  return (
    <div className={darkMode ? "dark" : "light"}>
      <ConfigProvider theme={darkMode ? darkThemeConfig : lightThemeConfig}>{/* gestion du thème */}
        <HashRouter>
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/technicalsheet/:guid" element={<TechnicalSheet />} />
          </Routes>
        </HashRouter>
      </ConfigProvider>
      ;
    </div>
  );
}

export default App;
