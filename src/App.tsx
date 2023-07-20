import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TechnicalSheet from './views/TechnicalSheet';
import DashBoard from './views/Dashboard';
import { IndicatorsProvider } from './context/IndicatorsContext';

function App() {
  return (
    <IndicatorsProvider>
      <div className={`App-light`}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/technicalsheet/:id" element={<TechnicalSheet />} />
          </Routes>
        </BrowserRouter>
      </div>
    </IndicatorsProvider>
  );
}

export default App;
