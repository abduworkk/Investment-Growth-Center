"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { calculateProjection } from "@/lib/risk-calculations";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

interface GrowthChartProps {
    aggressiveness: number;
    years: number;
    monthlyDeposit: number;
}

export function GrowthChart({
    aggressiveness,
    years,
    monthlyDeposit,
}: GrowthChartProps) {
    const data = calculateProjection(monthlyDeposit, years, aggressiveness);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
            notation: "compact",
        }).format(value);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Projected Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke="#71717a"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `Y${value}`}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#71717a"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatCurrency}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#09090b",
                                border: "1px solid #27272a",
                                borderRadius: "8px",
                                color: "#f4f4f5",
                            }}
                            formatter={(value: number) => [
                                new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(value),
                                "Balance",
                            ]}
                            labelFormatter={(label) => `Year ${label}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                            animationDuration={1000}
                        />
                        <Line
                            type="monotone"
                            dataKey="invested"
                            stroke="#52525b"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Total Invested"
                            activeDot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
