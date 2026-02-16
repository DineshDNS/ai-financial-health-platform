import { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getDashboardFull } from "../api/dashboardApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardFull();
        setData(res);
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error || !data) return <div className="p-6 text-red-500">Failed to load dashboard data.</div>;

  const healthScore = data.summary?.health_score ?? 0;
  const riskBand = data.summary?.risk_band ?? "Low Risk";

  const netProfit =
    (data.trends?.revenue ?? 0) - (data.trends?.expenses ?? 0);

  const revenue = data.trends?.revenue ?? 0;
  const expenses = data.trends?.expenses ?? 0;
  const cashBalance = data.metrics?.working_capital ?? 0;

  /* -------------------------
     RISK COLOR SYSTEM
  -------------------------- */
  const getRiskClass = () => {
    if (riskBand.toLowerCase().includes("high")) return "risk-high";
    if (riskBand.toLowerCase().includes("medium")) return "risk-medium";
    return "risk-low";
  };

  /* -------------------------
     HEALTH SCORE COLOR SYSTEM
  -------------------------- */
  const getHealthClass = () => {
    if (healthScore >= 75) return "health-good";
    if (healthScore >= 50) return "health-medium";
    return "health-poor";
  };

  const isDark = document.documentElement.classList.contains("dark");

  /* -------------------------
     CHART COLOR BASED ON RISK
  -------------------------- */
  let lineColor = "#22c55e"; // Low Risk → Green
  let fillColor = "rgba(34,197,94,0.18)";

  if (riskBand.toLowerCase().includes("medium")) {
    lineColor = "#f59e0b"; // Medium → Yellow
    fillColor = "rgba(245,158,11,0.22)";
  }

  if (riskBand.toLowerCase().includes("high")) {
    lineColor = "#ef4444"; // High → Red
    fillColor = "rgba(239,68,68,0.22)";
  }

  const chartData = {
    labels: ["Revenue", "Expenses", "Profit"],
    datasets: [
      {
        label: "Financial Overview",
        data: [revenue, expenses, netProfit],
        borderColor: lineColor,
        backgroundColor: fillColor,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: lineColor,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#0a7b9a" : "#13ada8",
          font: { size: 13, weight: "600" }
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#1783a4" : "#1783a4",
          font: { weight: "600" }
        },
        grid: {
          color: isDark ? "rgba(135, 232, 218, 0.08)" : "rgba(147, 232, 219, 0.08)"
        }
      },
      y: {
        ticks: {
          color: isDark ? "#1783a4" : "#1783a4",
          font: { weight: "600" }
        },
        grid: {
          color: isDark ? "rgba(147, 232, 219, 0.08)" : "rgba(147, 232, 219, 0.08)"
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* KPI ROW */}
      <div className="grid grid-cols-4 gap-6">

        <div className={`glass-card h-[130px] px-6 py-5 flex flex-col justify-center ${getHealthClass()}`}>
          <p className="text-sm text-gray-700 dark:text-gray-300">Health Score</p>
          <h2 className="text-3xl font-bold mt-1">
            <CountUp end={healthScore} duration={2} />
          </h2>
        </div>

        <div className="glass-card h-[130px] px-6 py-5 flex flex-col justify-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">Net Profit</p>
          <h2 className="text-3xl font-bold mt-1 metric-value">
            ₹<CountUp end={netProfit} duration={2} separator="," />
          </h2>
        </div>

        <div className="glass-card h-[130px] px-6 py-5 flex flex-col justify-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">Revenue</p>
          <h2 className="text-3xl font-bold mt-1 metric-value">
            ₹<CountUp end={revenue} duration={2} separator="," />
          </h2>
        </div>

        <div className="glass-card h-[130px] px-6 py-5 flex flex-col justify-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">Cash Balance</p>
          <h2 className="text-3xl font-bold mt-1 metric-value">
            ₹<CountUp end={cashBalance} duration={2} separator="," />
          </h2>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* CHART */}
        <div className="col-span-2 glass-card chart-panel p-6 h-[420px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Revenue vs Expenses Trend
          </h2>

          <div className="flex-1">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-6">

          <div className={`glass-card h-[110px] px-6 py-5 flex flex-col justify-center ${getRiskClass()}`}>
            <p className="text-sm text-gray-700 dark:text-gray-300">Risk Band</p>
            <h2 className="text-xl font-bold mt-1">
              {riskBand}
            </h2>
          </div>

          <div className="glass-card h-[110px] px-6 py-5 flex flex-col justify-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">Credit Eligibility</p>
            <h2 className="text-xl font-bold mt-1 metric-value">
              Review
            </h2>
          </div>

          <div className="glass-card h-[110px] px-6 py-5 flex flex-col justify-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">AI Confidence</p>
            <h2 className="text-xl font-bold mt-1 metric-value">
              87%
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
