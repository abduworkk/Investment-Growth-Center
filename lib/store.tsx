"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    CurrencyCode,
    MarketAsset,
    ForecastingModel,
} from "@/lib/types";
import { MockFxProvider } from "@/lib/api/fx-provider";

interface AppState {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    fxRates: Record<CurrencyCode, number>;

    forecastingModel: ForecastingModel;
    setForecastingModel: (model: ForecastingModel) => void;

    linkedAssets: MarketAsset[];
    addLinkedAsset: (asset: MarketAsset) => void;
    removeLinkedAsset: (symbol: string) => void;

    convertAmount: (amount: number) => number;
    formatCurrency: (amount: number) => string;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<CurrencyCode>("USD");
    const [fxRates, setFxRates] = useState<Record<CurrencyCode, number>>({});
    const [forecastingModel, setForecastingModel] = useState<ForecastingModel>(
        "growth"
    );
    const [linkedAssets, setLinkedAssets] = useState<MarketAsset[]>([]);

    useEffect(() => {
        const fxProvider = new MockFxProvider();
        fxProvider.getRates("USD").then(setFxRates).catch(console.error);
    }, []);

    const addLinkedAsset = (asset: MarketAsset) => {
        setLinkedAssets((prev) => {
            if (prev.find((a) => a.symbol === asset.symbol)) return prev;
            return [...prev, asset];
        });
    };

    const removeLinkedAsset = (symbol: string) => {
        setLinkedAssets((prev) => prev.filter((a) => a.symbol !== symbol));
    };

    const convertAmount = (amount: number): number => {
        const rate = fxRates[currency] || 1;
        return amount * rate;
    };

    const formatCurrency = (amount: number): string => {
        const converted = convertAmount(amount);
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(converted);
    };

    return (
        <AppContext.Provider
      value= {{
        currency,
            setCurrency,
            fxRates,
            forecastingModel,
            setForecastingModel,
            linkedAssets,
            addLinkedAsset,
            removeLinkedAsset,
            convertAmount,
            formatCurrency,
      }
}
    >
    { children }
    </AppContext.Provider>
  );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
