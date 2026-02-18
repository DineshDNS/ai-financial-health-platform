import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShieldAlert, Activity, Brain } from "lucide-react";
import {
  Radar
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RiskAnalysis = () => {
  const [riskData, setRiskData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [explain, setExplain] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRisk();
  }, []);

  const loadRisk = async () => {
    try {
      const [riskRes, explainRes, metricsRes] = await Promise.all([
        axios.get("http://localhost:8000/ai/risk"),
        axios.get("http://localhost:8000/ai/explain/risk"),
        axios.get("http://localhost:8000/dashboard/metrics"),
      ]);

      setRiskData(riskRes.data);
      setExplain(explainRes.data.ai_explanation);
      setMetrics(metricsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    if (!risk) return "from-gray-400 to-gray-500";
    if (risk.toLowerCase().includes("low")) return "from-green-500 to-emerald-600";
    if (risk.toLowerCase().includes("medium")) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-600";
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="h-28 bg-gray-300 rounded-2xl"></div>
        <div className="h-60 bg-gray-300 rounded-2xl"></div>
        <div className="h-40 bg-gray-300 rounded-2xl"></div>
      </div>
    );
  }

  if (!riskData || !metrics) {
    return <div className="p-6 text-red-500">Risk data not available</div>;
  }

  const radarData = {
    labels: [
      "Liquidity",
      "Debt Load",
      "Profitability",
      "Expense Efficiency",
      "Cashflow Strength",
      "Working Capital"
    ],
    datasets: [
      {
        label: "Risk Dimensions",
        data: [
          metrics.current_ratio || 0,
          metrics.debt_ratio || 0,
          metrics.net_profit_margin || 0,
          metrics.expense_efficiency || 0,
          metrics.cashflow_coverage || 0,
          metrics.working_capital / 100000 || 0
        ],
        backgroundColor: "rgba(59,130,246,0.25)",
        borderColor: "#3b82f6",
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HERO STRIP */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className={`p-6 rounded-2xl text-white shadow-lg bg-gradient-to-br ${getRiskColor(riskData.ai_risk_prediction)}`}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={20} />
              <h3 className="text-sm opacity-90">AI Risk Prediction</h3>
            </div>
            <div className="text-3xl font-bold">
              {riskData.ai_risk_prediction}
            </div>
            <div className="text-xs opacity-80 mt-2">
              ML-based financial pattern analysis
            </div>
          </div>

          <div className={`p-6 rounded-2xl text-white shadow-lg bg-gradient-to-br ${getRiskColor(riskData.risk_band_rule_engine)}`}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={20} />
              <h3 className="text-sm opacity-90">Rule Engine Risk</h3>
            </div>
            <div className="text-3xl font-bold">
              {riskData.risk_band_rule_engine}
            </div>
            <div className="text-xs opacity-80 mt-2">
              Ratio-based financial validation
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="text-purple-600" size={20} />
              <h3 className="text-sm text-gray-600 dark:text-gray-300">
                Financial Health Score
              </h3>
            </div>

            <div className="text-4xl font-bold mb-3">
              {Math.round(riskData.health_score)}
            </div>

            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full"
                style={{ width: `${riskData.health_score}%` }}
              />
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Overall business stability indicator
            </div>
          </div>
        </div>

        {/* RADAR PANEL */}
        <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Risk Dimension Analysis
          </h2>

          <div className="max-w-xl mx-auto">
            <Radar data={radarData} />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            Multi-factor financial risk visualization across liquidity, debt, profitability, and cashflow stability.
          </p>
        </div>

        {/* AI CFO EXPLANATION */}
        <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            🧠 AI Financial Insight (Virtual CFO)
          </h2>

          <p className="leading-relaxed whitespace-pre-line text-[15px]">
            {explain}
          </p>
        </div>

      </div>
    </div>
  );
};

export default RiskAnalysis;
