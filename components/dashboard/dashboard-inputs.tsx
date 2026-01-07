"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface DashboardInputsProps {
    aggressiveness: number;
    setAggressiveness: (val: number) => void;
    years: number;
    setYears: (val: number) => void;
    monthlyDeposit: number;
    setMonthlyDeposit: (val: number) => void;
}

export function DashboardInputs({
    aggressiveness,
    setAggressiveness,
    years,
    setYears,
    monthlyDeposit,
    setMonthlyDeposit,
}: DashboardInputsProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <Slider
                    label="Risk Tolerance"
                    min={0}
                    max={100}
                    step={1}
                    value={aggressiveness}
                    onChange={(e) => setAggressiveness(Number(e.target.value))}
                    valueDisplay={`${aggressiveness}%`}
                />

                <Slider
                    label="Time Horizon"
                    min={1}
                    max={40}
                    step={1}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    valueDisplay={`${years} Years`}
                />

                <Slider
                    label="Monthly Deposit"
                    min={100}
                    max={10000}
                    step={100}
                    value={monthlyDeposit}
                    onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                    valueDisplay={`$${monthlyDeposit.toLocaleString()}`}
                />
            </CardContent>
        </Card>
    );
}
