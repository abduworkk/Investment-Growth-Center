import { DriverInput, ForecastingModel, ProjectionPoint } from "@/lib/types";

// --- Default Drivers Definition ---

export const MODEL_DEFAULTS: Record<ForecastingModel, DriverInput[]> = {
    ecommerce: [
        { id: "traffic", label: "Monthly Traffic", value: 10000, min: 1000, max: 1000000, step: 1000 },
        { id: "conversion", label: "Conversion Rate", value: 2.5, min: 0.1, max: 10, step: 0.1, format: "percent" },
        { id: "aov", label: "Average Order Value", value: 50, min: 10, max: 500, step: 5, format: "currency" },
        { id: "marketing", label: "Marketing Spend", value: 2000, min: 0, max: 50000, step: 500, format: "currency" },
    ],
    saas: [
        { id: "subscribers", label: "Active Subscribers", value: 100, min: 0, max: 10000, step: 10 },
        { id: "arpu", label: "ARPU", value: 49, min: 5, max: 500, step: 1, format: "currency" },
        { id: "churn", label: "Monthly Churn", value: 5, min: 0.1, max: 20, step: 0.1, format: "percent" },
        { id: "growth", label: "Monthly Growth", value: 10, min: 0, max: 50, step: 1, format: "percent" },
    ],
    growth: [
        { id: "users", label: "Current Users", value: 500, min: 0, max: 100000, step: 100 },
        { id: "organic", label: "Organic Growth", value: 5, min: 0, max: 50, step: 1, format: "percent" },
        { id: "paid", label: "Paid Acquisition", value: 100, min: 0, max: 5000, step: 50 },
    ],
    custom: [
        { id: "base", label: "Base Revenue", value: 1000, min: 0, max: 100000, step: 100, format: "currency" },
        { id: "growth", label: "Annual Growth", value: 10, min: -20, max: 100, step: 1, format: "percent" },
    ],
};

// --- Calculation Logic ---

export function calculateForecast(
    model: ForecastingModel,
    drivers: Record<string, number>,
    months: number = 24
): ProjectionPoint[] {
    const data: ProjectionPoint[] = [];

    // Helper to safely get driver value
    const get = (id: string, fallback: number = 0) => drivers[id] ?? fallback;

    // Initial State
    let currentUsers = get("users");
    let currentSubs = get("subscribers");

    for (let m = 1; m <= months; m++) {
        let revenue = 0;
        let cost = 0;
        let metric = 0;

        if (model === "ecommerce") {
            const traffic = get("traffic"); // Assuming static traffic or we could add a growth driver
            const conversion = get("conversion") / 100;
            const aov = get("aov");
            const marketing = get("marketing");

            // Simple growth assumption: Traffic grows naturally by 2% mo if marketing > 0
            const growthFactor = marketing > 0 ? 1.02 : 1.0;
            // We aren't storing state for traffic here so it's static per month for this simple loop
            // unless we want it compouding. Let's keep it simple: constant flow model.

            const orders = traffic * conversion;
            revenue = orders * aov;
            cost = marketing; // COGS not included in this simple model
            metric = traffic;
        }
        else if (model === "saas") {
            const arpu = get("arpu");
            const churnRate = get("churn") / 100;
            const growthRate = get("growth") / 100;

            const churned = currentSubs * churnRate;
            const newSubs = currentSubs * growthRate;

            currentSubs = currentSubs + newSubs - churned;

            revenue = currentSubs * arpu;
            cost = 0; // SaaS margin high
            metric = Math.round(currentSubs);
        }
        else if (model === "growth") {
            const organicRate = get("organic") / 100;
            const paid = get("paid");

            const acquired = (currentUsers * organicRate) + paid;
            currentUsers += acquired;

            revenue = 0; // Pre-revenue
            metric = Math.round(currentUsers);
        }
        else if (model === "custom") {
            const base = get("base");
            const annualGrowth = get("growth") / 100;
            const monthlyGrowth = annualGrowth / 12;

            // Compounding logic
            const factor = Math.pow(1 + monthlyGrowth, m);
            revenue = base * factor;
            metric = revenue;
        }

        data.push({
            period: m,
            revenue,
            cost,
            profit: revenue - cost,
            metric,
        });
    }

    return data;
}
