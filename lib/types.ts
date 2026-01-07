export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CNY" | "INR" | "PKR" | "SAR" | "AED";

export interface Currency {
    code: CurrencyCode;
    symbol: string;
    name: string;
    rateToUSD: number; // 1 USD = X Currency
    lastUpdated: number;
}

export type ForecastingModel = "growth" | "saas" | "ecommerce" | "custom";

export interface DriverInput {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    format?: "currency" | "percent" | "number";
    description?: string;
}

export interface Scenario {
    id: "conservative" | "base" | "aggressive";
    label: string;
    color: string;
    drivers: Record<string, number>; // Overrides for base drivers
}

export type AssetType = "stock" | "crypto" | "index";

export interface MarketAsset {
    symbol: string;
    name: string;
    type: AssetType;
    price: number;
    change24h: number;
    lastUpdated: number;
    history: { date: string; value: number }[]; // For sparklines
}

export interface ProjectionPoint {
    period: number; // Month index (1-N)
    revenue: number;
    cost: number;
    profit: number;
    metric: number; // Primary metric (e.g. Users, Subscribers)
}
