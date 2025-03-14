"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

export type TradingPair = "BTCUSDC" | "ETHUSDC" | "SOLUSDC";

interface MarketContextType {
  selectedPair: TradingPair;
  setSelectedPair: (pair: TradingPair) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPair, setSelectedPair] = useState<TradingPair>("BTCUSDC");

  const setSelectedPairCallback = useCallback((pair: TradingPair) => {
    setSelectedPair(pair);
  }, []);

  const value = useMemo(
    () => ({
      selectedPair,
      setSelectedPair: setSelectedPairCallback,
    }),
    [selectedPair, setSelectedPairCallback]
  );

  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
};
