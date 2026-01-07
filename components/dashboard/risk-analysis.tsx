"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { calculateRiskScore, getRiskLabel } from "@/lib/risk-calculations";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";

interface RiskAnalysisProps {
    aggressiveness: number;
}

export function RiskAnalysis({ aggressiveness }: RiskAnalysisProps) {
    const score = calculateRiskScore(aggressiveness);
    const { label, color } = getRiskLabel(score);

    const getIcon = () => {
        if (score < 30) return <ShieldCheck className="w-12 h-12 text-emerald-400" />;
        if (score > 70) return <ShieldAlert className="w-12 h-12 text-red-400" />;
        return <Shield className="w-12 h-12 text-yellow-400" />;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 shadow-inner">
                    {getIcon()}
                </div>

                <div className="text-center space-y-2">
                    <h4 className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Risk Score</h4>
                    <div className="text-5xl font-bold font-mono text-white">{score}</div>
                </div>

                <div className={cn("text-lg font-medium px-4 py-1 rounded-full bg-zinc-900 border border-zinc-800", color)}>
                    {label}
                </div>

            </CardContent>
        </Card>
    );
}
