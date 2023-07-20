import { createContext, useState, ReactNode } from 'react';
import { Indicator } from '../models/Indicator';

export type IndicatorsContextModel = {
  indicators: Indicator | null;
  fetchIndicators: (indicators: Indicator | null) => void;
};
export const IndicatorsContext = createContext<IndicatorsContextModel | null>(
  null
);

export const IndicatorsProvider = ({ children }: { children: ReactNode }) => {
  const [indicators, setIndicators] = useState<Indicator | null>(null);

  const fetchIndicators = (indicators: Indicator | null) => {
    setIndicators(indicators);
  };

  return (
    <IndicatorsContext.Provider value={{ indicators, fetchIndicators }}>
      {children}
    </IndicatorsContext.Provider>
  );
};
