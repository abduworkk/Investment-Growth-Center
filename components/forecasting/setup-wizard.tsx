"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
    ForecastingModel,
    DriverInput,
} from "@/lib/types";
import { MODEL_DEFAULTS } from "@/lib/forecasting/engine";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
    BriefcaseBusiness,
    TrendingUp,
    ShoppingCart,
    Users,
    Settings2,
} from "lucide-react";

interface SetupWizardProps {
    onDriversChange: (drivers: Record<string, number>) => void;
}

const MODELS: { id: ForecastingModel; label: string; icon: any; desc: string }[] =
    [
        {
            id: "ecommerce",
            label: "E-commerce",
            icon: ShoppingCart,
            desc: "Revenue based on traffic & conversion.",
        },
        {
            id: "saas",
            label: "SaaS / Subscription",
            icon: BriefcaseBusiness,
            desc: "MRR based on subs, churn & ARPU.",
        },
        {
            id: "growth",
            label: "User Growth",
            icon: Users,
            desc: "Audience scaling via organic + paid.",
        },
        {
            id: "custom",
            label: "Custom / Simple",
            icon: Settings2,
            desc: "Manual base & growth rate.",
        },
    ];

export function SetupWizard({ onDriversChange }: SetupWizardProps) {
    const { forecastingModel, setForecastingModel, formatCurrency } = useApp();
    const [drivers, setDrivers] = useState<Record<string, number>>({});

    // Initialize drivers when model changes
    useEffect(() => {
        const defaultDrivers = MODEL_DEFAULTS[forecastingModel];
        const initialValues: Record<string, number> = {};
        defaultDrivers.forEach((d) => {
            initialValues[d.id] = d.value;
        });
        setDrivers(initialValues);
        onDriversChange(initialValues);
    }, [forecastingModel]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDriverChange = (id: string, value: number) => {
        const newDrivers = { ...drivers, [id]: value };
        setDrivers(newDrivers);
        onDriversChange(newDrivers);
    };

    const currentInputs = MODEL_DEFAULTS[forecastingModel];

    return (
        <div className="space-y-6">
            {/* Model Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MODELS.map((m) => {
                    const Icon = m.icon;
                    const isSelected = forecastingModel === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => setForecastingModel(m.id)}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center space-y-2 h-32",
                                isSelected
                                    ? "bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50"
                            )}
                        >
                            <Icon className={cn("w-8 h-8", isSelected ? "text-emerald-400" : "text-zinc-500")} />
                            <div className="font-semibold text-sm">{m.label}</div>
                            <div className="text-xs text-zinc-500 line-clamp-2 leading-tight">
                                {m.desc}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Driver Inputs */}
            <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-lg flex items-center space-x-2">
                        <Settings2 className="w-5 h-5 text-emerald-400" />
                        <span>Target Drivers</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                    {currentInputs.map((input) => (
                        <Slider
                            key={input.id}
                            label={input.label}
                            min={input.min}
                            max={input.max}
                            step={input.step}
                            value={drivers[input.id] || input.value}
                            onChange={(e) => handleDriverChange(input.id, Number(e.target.value))}
                            valueDisplay={
                                input.format === "currency"
                                    ? formatCurrency(drivers[input.id] || input.value)
                                    : input.format === "percent"
                                        ? `${(drivers[input.id] || input.value).toFixed(1)}%`
                                        : (drivers[input.id] || input.value).toLocaleString()
                            }
                        />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
