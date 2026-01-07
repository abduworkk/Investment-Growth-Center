export function calculateRiskScore(aggressiveness: number): number {
    return Math.min(100, Math.max(0, aggressiveness));
}

export function getRiskLabel(score: number): { label: string; color: string } {
    if (score < 20) return { label: "Very Conservative", color: "text-blue-400" };
    if (score < 40) return { label: "Conservative", color: "text-emerald-400" };
    if (score < 60) return { label: "Balanced", color: "text-yellow-400" };
    if (score < 80) return { label: "Growth", color: "text-orange-400" };
    return { label: "High Growth", color: "text-red-400" };
}

export function calculateProjection(
    monthlyDeposit: number,
    years: number,
    aggressiveness: number
) {
    const data = [];
    let totalBalance = 0;
    let totalInvested = 0;

    // Annual return rate varies from 3% (conservative) to 12% (aggressive)
    const annualRate = 0.03 + (aggressiveness / 100) * 0.09;
    const monthlyRate = annualRate / 12;

    const totalMonths = years * 12;

    for (let month = 1; month <= totalMonths; month++) {
        totalBalance = (totalBalance + monthlyDeposit) * (1 + monthlyRate);
        totalInvested += monthlyDeposit;

        if (month % 12 === 0) {
            data.push({
                year: month / 12,
                invested: Math.round(totalInvested),
                balance: Math.round(totalBalance),
            });
        }
    }

    return data;
}
