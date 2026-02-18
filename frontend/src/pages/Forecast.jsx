import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const formatCurrency = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "—";
  return "₹" + Math.round(num).toLocaleString();
};

const getTrend = (arr) => {
  if (!arr || arr.length < 2) return "—";
  return arr[arr.length - 1] > arr[0] ? "↑" : "↓";
};

const Forecast = () => {
  const [forecast, setForecast] = useState(null);
  const [past, setPast] = useState(null);
  const [explain, setExplain] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      const res = await axios.get("http://localhost:8000/ai/forecast");
      setForecast(res.data);

      const trends = await axios.get("http://localhost:8000/dashboard/trends");
      setPast(trends.data);

      const exp = await axios.get("http://localhost:8000/ai/explain/forecast");

      setExplain(
        exp.data?.content ||
        exp.data?.ai_explanation?.content ||
        exp.data?.ai_explanation ||
        exp.data ||
        ""
      );
    } catch (err) {
      console.error("Forecast load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="h-60 bg-gray-300 rounded-2xl"></div>
        <div className="h-60 bg-gray-300 rounded-2xl"></div>
      </div>
    );

  if (!forecast) {
    return <div className="p-6 text-red-500">Forecast data not available</div>;
  }

  const lastRevenue = forecast.revenue_forecast?.slice(-1)[0];
  const lastExpense = forecast.expense_forecast?.slice(-1)[0];
  const lastCash = forecast.cashflow_forecast?.slice(-1)[0];

  const labels =
    forecast.revenue_forecast?.map((_, i) => `M${i + 1}`) || [];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue Forecast",
        data: forecast.revenue_forecast || [],
        borderColor: "#10b981",
        backgroundColor: "#10b98122",
        tension: 0.4,
      },
      {
        label: "Expense Forecast",
        data: forecast.expense_forecast || [],
        borderColor: "#ef4444",
        backgroundColor: "#ef444422",
        tension: 0.4,
      },
      {
        label: "Cashflow Projection",
        data: forecast.cashflow_forecast || [],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f622",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-8">

      {/* ================= HERO METRICS ================= */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Revenue */}
        <div className="glass-card p-6">
          <p className="text-sm opacity-70">Revenue Outlook</p>
          <h2 className="text-3xl font-bold text-green-600">
            {formatCurrency(lastRevenue)}
          </h2>
          <div className="text-sm mt-2">
            Trend {getTrend(forecast.revenue_forecast)}
          </div>
        </div>

        {/* Expenses */}
        <div className="glass-card p-6">
          <p className="text-sm opacity-70">Expense Outlook</p>
          <h2 className="text-3xl font-bold text-red-600">
            {formatCurrency(lastExpense)}
          </h2>
          <div className="text-sm mt-2">
            Trend {getTrend(forecast.expense_forecast)}
          </div>
        </div>

        {/* Cashflow */}
        <div className="glass-card p-6">
          <p className="text-sm opacity-70">Cashflow Outlook</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {formatCurrency(lastCash)}
          </h2>
          <div className="text-xs mt-2 opacity-70">
            {!lastCash && "Not enough transaction data"}
          </div>
        </div>

      </div>

      {/* ================= MAIN CHART ================= */}
      <div className="glass-card chart-panel p-8 h-[420px]">
        <h2 className="text-lg font-semibold">
          Future Financial Projection
        </h2>

        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { font: { size: 13, weight: "600" } },
              },
            },
          }}
        />
      </div>

      {/* ================= PAST VS FUTURE ================= */}
      {past && (
        <div className="grid md:grid-cols-3 gap-6">

          <div className="glass-card p-6">
            <p className="text-sm opacity-70">Last Revenue</p>
            <h2 className="text-xl font-bold">
              {formatCurrency(past.revenue)}
            </h2>
          </div>

          <div className="glass-card p-6">
            <p className="text-sm opacity-70">Last Expenses</p>
            <h2 className="text-xl font-bold">
              {formatCurrency(past.expenses)}
            </h2>
          </div>

          <div className="glass-card p-6">
            <p className="text-sm opacity-70">Last Profit</p>
            <h2 className="text-xl font-bold">
              {formatCurrency(past.revenue - past.expenses)}
            </h2>
          </div>

        </div>
      )}

      {/* ================= AI INTERPRETATION ================= */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-4">
          AI Forecast Interpretation
        </h2>

        <p className="whitespace-pre-line leading-relaxed opacity-80">
          {explain || "AI interpretation not available"}
        </p>
      </div>

    </div>
  );
};

export default Forecast;
