import { HashRouter, Routes, Route } from 'react-router-dom';
import TechnicalSheet from './views/TechnicalSheet/TechnicalSheet';
import DashBoard from './views/DashBoard/Dashboard';
import { useContext } from "react";
import { IndicatorsProvider } from './context/IndicatorsContext';
import DarkModeProvider, { DarkModeContext } from "./context/DarkModeProvider"; 
import './App.css';


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

  return (
    <div className={darkMode ? "dark" : "light"}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/technicalsheet/:guid" element={<TechnicalSheet />} />
        </Routes>
      </HashRouter>
      ;
    </div>
  );
}

export default App;
