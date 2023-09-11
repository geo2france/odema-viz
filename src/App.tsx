import { HashRouter, Routes, Route } from 'react-router-dom';
import TechnicalSheet from './views/TechnicalSheet/TechnicalSheet';
import DashBoard from './views/DashBoard/Dashboard';
import { IndicatorsProvider } from './context/IndicatorsContext';
import './App.css';

function App() {
  return (
    <IndicatorsProvider>
      <div className={`App-light`}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/technicalsheet/:guid" element={<TechnicalSheet />} />
          </Routes>
        </HashRouter>
      </div>
    </IndicatorsProvider>
  );
}

export default App;
