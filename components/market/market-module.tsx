"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Assuming we have Input or will use standard input
import { Button } from "@/components/ui/button"; // Assuming Button
import { useApp } from "@/lib/store";
import { MockMarketProvider } from "@/lib/api/market-provider";
import { MarketAsset } from "@/lib/types";
import { TrendingUp, TrendingDown, Search, Plus, X } from "lucide-react";

export function MarketModule() {
    const { linkedAssets, addLinkedAsset, removeLinkedAsset, formatCurrency, convertAmount } = useApp();
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<MarketAsset[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!query) return;
        setIsSearching(true);
        try {
            const provider = new MockMarketProvider();
            const results = await provider.searchAssets(query);
            setSearchResults(results);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Market Data</span>
                    <span className="text-xs font-normal text-zinc-500">Real-time</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search stocks/crypto..."
                            className="w-full h-9 pl-9 pr-4 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-200/90 h-9 px-4 py-2"
                    >
                        {isSearching ? "..." : "Find"}
                    </button>
                </div>

                {/* Results */}
                {searchResults.length > 0 && (
                    <div className="space-y-2 p-2 bg-zinc-900/50 rounded-lg max-h-40 overflow-y-auto">
                        <div className="text-xs font-semibold text-zinc-500 px-1">Search Results</div>
                        {searchResults.map(asset => (
                            <div key={asset.symbol} className="flex justify-between items-center p-2 hover:bg-zinc-800 rounded cursor-pointer group">
                                <div>
                                    <div className="font-bold text-sm">{asset.symbol}</div>
                                    <div className="text-xs text-zinc-400">{asset.name}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-mono">{formatCurrency(asset.price)}</div>
                                    <button
                                        onClick={() => {
                                            addLinkedAsset(asset);
                                            setSearchResults([]);
                                            setQuery("");
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 bg-emerald-500/20 text-emerald-400 rounded transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Linked Assets */}
                <div className="space-y-3">
                    {linkedAssets.length === 0 && (
                        <div className="text-center py-8 text-zinc-500 text-sm">
                            No market assets linked.
                        </div>
                    )}
                    {linkedAssets.map(asset => {
                        const isPositive = asset.change24h >= 0;
                        return (
                            <div key={asset.symbol} className="p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-white flex items-center gap-2">
                                        {asset.symbol}
                                        <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>
                                            {isPositive ? "+" : ""}{asset.change24h}%
                                        </span>
                                    </div>
                                    <div className="text-xs text-zinc-500">{asset.name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold text-lg text-white">
                                        {formatCurrency(asset.price)}
                                    </div>
                                    <div className="text-xs text-zinc-600">
                                        Updated just now
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeLinkedAsset(asset.symbol)}
                                    className="ml-2 text-zinc-600 hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// Utility for class merging locally if needed, but imported from utils usually.
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
