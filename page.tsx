"use client";

import { useApp } from "@/lib/store";
import { SetupWizard } from "@/components/forecasting/setup-wizard";
// import { GrowthChart } from "@/components/dashboard/growth-chart"; // We need to update this or wrap it
import { MarketModule } from "@/components/market/market-module";
import { CurrencySelector } from "@/components/shared/currency-selector";
import { TrendingUp, ShieldCheck } from "lucide-react";
import { AppProvider } from "@/lib/store";
import { useState } from "react";
import { calculateForecast } from "@/lib/forecasting/engine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Inner component to access Context
function DashboardContent() {
  const { forecastingModel, formatCurrency } = useApp();
  const [drivers, setDrivers] = useState<Record<string, number>>({});

  const forecastData = calculateForecast(forecastingModel, drivers, 24);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Growth Command Center</h1>
            <p className="text-zinc-400">Driver-based forecasting with real-time market data.</p>
          </div>
        </div>
        <CurrencySelector />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Setup & Drivers */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-200">1. Select Model & Inputs</h2>
            <SetupWizard onDriversChange={setDrivers} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-200">2. Projected Growth</h2>
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle>Forecast ({forecastingModel.toUpperCase()})</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="period" stroke="#71717a" tickFormatter={(v) => `M${v}`} minTickGap={30} />
                    <YAxis
                      stroke="#71717a"
                      width={80}
                      tickFormatter={(val) =>
                        new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(val)
                      }
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a" }}
                      formatter={(val: number) => [formatCurrency(val), "Revenue"]}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillUrl="#colorMetric" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right Col: Market Data & Summary */}
        <div className="lg:col-span-4 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-200">3. Market Context</h2>
            <MarketModule />
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Confidence Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end space-x-2 mb-2">
                  <span className="text-4xl font-bold font-mono text-white">85</span>
                  <span className="text-zinc-500 pb-1">/ 100</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]"></div>
                </div>
                <p className="text-sm text-zinc-500 mt-4">
                  High confidence based on granular driver inputs. Connect more market assets to improve correlation tracking.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <AppProvider>
        <DashboardContent />
      </AppProvider>
    </main>
  );
}
