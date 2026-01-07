"use client";

import React from "react";
import { useApp } from "@/lib/store";
import { CurrencyCode } from "@/lib/types";
import { Coins } from "lucide-react";

export function CurrencySelector() {
    const { currency, setCurrency } = useApp();

    const currencies: CurrencyCode[] = [
        "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CNY", "INR", "PKR", "SAR", "AED"
    ];

    return (
        <div className="flex items-center space-x-2">
            <div className="p-2 bg-zinc-800 rounded-lg">
                <Coins className="w-4 h-4 text-zinc-400" />
            </div>
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="h-10 px-3 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
                {currencies.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>
        </div>
    );
}
