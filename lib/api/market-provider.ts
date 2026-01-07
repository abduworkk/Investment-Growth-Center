import { MarketAsset, AssetType } from "@/lib/types";

export interface MarketProvider {
    getAsset(symbol: string, type: AssetType): Promise<MarketAsset>;
    searchAssets(query: string): Promise<MarketAsset[]>;
}

export class MockMarketProvider implements MarketProvider {
    private mockAssets: Record<string, MarketAsset> = {
        BTC: {
            symbol: "BTC",
            name: "Bitcoin",
            type: "crypto",
            price: 64230.50,
            change24h: 2.4,
            lastUpdated: Date.now(),
            history: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
                value: 60000 + Math.random() * 5000,
            })),
        },
        ETH: {
            symbol: "ETH",
            name: "Ethereum",
            type: "crypto",
            price: 3150.20,
            change24h: -1.2,
            lastUpdated: Date.now(),
            history: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
                value: 3000 + Math.random() * 500,
            })),
        },
        AAPL: {
            symbol: "AAPL",
            name: "Apple Inc.",
            type: "stock",
            price: 172.40,
            change24h: 0.5,
            lastUpdated: Date.now(),
            history: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
                value: 165 + Math.random() * 20,
            })),
        },
        TSLA: {
            symbol: "TSLA",
            name: "Tesla, Inc.",
            type: "stock",
            price: 175.30,
            change24h: -3.5,
            lastUpdated: Date.now(),
            history: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
                value: 160 + Math.random() * 40,
            })),
        },
    };

    async getAsset(symbol: string, type: AssetType): Promise<MarketAsset> {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Latency
        const asset = this.mockAssets[symbol.toUpperCase()];
        if (!asset) throw new Error(`Asset ${symbol} not found`);
        return asset;
    }

    async searchAssets(query: string): Promise<MarketAsset[]> {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const q = query.toUpperCase();
        return Object.values(this.mockAssets).filter(a => a.symbol.includes(q) || a.name.toUpperCase().includes(q));
    }
}
