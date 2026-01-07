import { Currency, CurrencyCode } from "@/lib/types";

export interface FxProvider {
    getRates(base: CurrencyCode): Promise<Record<CurrencyCode, number>>;
}

export class MockFxProvider implements FxProvider {
    // Static mock rates relative to USD
    private rates: Record<CurrencyCode, number> = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 151.5,
        CAD: 1.36,
        AUD: 1.52,
        CNY: 7.23,
        INR: 83.5,
        PKR: 278.0,
        SAR: 3.75,
        AED: 3.67,
    };

    async getRates(base: CurrencyCode): Promise<Record<CurrencyCode, number>> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const baseRate = this.rates[base];
        if (!baseRate) throw new Error(`Base currency ${base} not supported`);

        // Convert all rates to be relative to the requested base
        // If USD=1 and EUR=0.92, then 1 EUR = 1/0.92 USD.
        // We want 1 BASE = X TARGET.
        // X TARGET = (1 USD * Rate_Target) / (1 USD * Rate_Base)

        const rebasedRates: Partial<Record<CurrencyCode, number>> = {};

        (Object.keys(this.rates) as CurrencyCode[]).forEach((code) => {
            rebasedRates[code] = this.rates[code] / baseRate;
        });

        return rebasedRates as Record<CurrencyCode, number>;
    }
}

// Placeholder for real provider
export class OpenExchangeProvider implements FxProvider {
    constructor(private apiKey: string) { }

    async getRates(base: CurrencyCode): Promise<Record<CurrencyCode, number>> {
        // TODO: Implement actual fetch
        console.warn("Real FX provider not yet implemented, using Mock");
        return new MockFxProvider().getRates(base);
    }
}
