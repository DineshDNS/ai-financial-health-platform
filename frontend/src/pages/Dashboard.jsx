import { useEffect, useState } from "react";
import CountUp from "react-countup";
import axios from "axios";
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
  const [credit, setCredit] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getDashboardFull();
      setData(res);

      const creditRes = await axios.get("http://127.0.0.1:8000/ai/credit");
      setCredit(creditRes.data.credit_decision);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  const healthScore = data.summary.health_score;
  const riskBand = data.summary.risk_band;

  const revenue = data.trends.revenue;
  const expenses = data.trends.expenses;
  const profit = revenue - expenses;
  const cash = data.metrics.working_capital;

  const cashflowHealth = data.metrics.cashflow_health;
  const debtRatio = data.metrics.debt_ratio;
  const currentRatio = data.metrics.current_ratio;

  /* =========================
     COLOR SYSTEM
  ========================= */

  const healthClass =
    healthScore >= 75
      ? "health-good"
      : healthScore >= 50
      ? "health-medium"
      : "health-poor";

  const riskClass =
    riskBand.includes("High")
      ? "risk-high"
      : riskBand.includes("Medium")
      ? "risk-medium"
      : "risk-low";

  const creditClass =
    credit === "Eligible"
      ? "credit-good"
      : credit === "Review"
      ? "credit-review"
      : "credit-bad";

  const cashflowClass =
    cashflowHealth === "Strong"
      ? "health-good"
      : cashflowHealth === "Stable"
      ? "health-medium"
      : "health-poor";

  const profitClass =
    profit > 0 ? "border-green-400" : "border-red-400";

  const cashClass =
    cash > 100000
      ? "border-green-400"
      : cash > 0
      ? "border-yellow-400"
      : "border-red-400";

  const debtClass =
    debtRatio > 2
      ? "border-red-400"
      : debtRatio > 1
      ? "border-yellow-400"
      : "border-green-400";

  const currentRatioClass =
    currentRatio > 1.5
      ? "border-green-400"
      : currentRatio > 1
      ? "border-yellow-400"
      : "border-red-400";

  /* =========================
     CHART DATA
  ========================= */

  const chartData = {
    labels: ["Revenue", "Expenses", "Profit"],
    datasets: [
      {
        label: "Financial Overview",
        data: [revenue, expenses, profit],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.18)",
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { size: 13, weight: "600" }
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* HERO LAYER */}
      <div className="grid grid-cols-4 gap-6">

        <div className={`glass-card p-6 ${healthClass}`}>
          <p>Health Score</p>
          <h2 className="text-3xl font-bold">
            <CountUp end={healthScore} />
          </h2>
        </div>

        <div className={`glass-card p-6 ${riskClass}`}>
          <p>Risk Band</p>
          <h2 className="text-xl font-bold">{riskBand}</h2>
        </div>

        <div className={`glass-card p-6 ${creditClass}`}>
          <p>Credit Eligibility</p>
          <h2 className="text-xl font-bold">{credit}</h2>
        </div>

        <div className={`glass-card p-6 ${cashflowClass}`}>
          <p>Cashflow Health</p>
          <h2 className="text-xl font-bold">{cashflowHealth}</h2>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* CHART */}
        <div className="col-span-2 glass-card chart-panel p-6 h-[515px] flex flex-col">
          <h2 className="text-lg font-semibold">
            Financial Overview
          </h2>

          <div className="flex-1">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* RIGHT SIDE CARDS */}
        <div className="flex flex-col gap-7">

          <div className="glass-card p-6 border-green-400">
            <p>Revenue</p>
            <h2 className="text-2xl font-bold">
              ₹<CountUp end={revenue} separator="," />
            </h2>
          </div>

          <div className="glass-card p-6 border-red-400">
            <p>Expenses</p>
            <h2 className="text-2xl font-bold">
              ₹<CountUp end={expenses} separator="," />
            </h2>
          </div>

          <div className={`glass-card p-6 ${profitClass}`}>
            <p>Net Profit</p>
            <h2 className="text-2xl font-bold">
              ₹<CountUp end={profit} separator="," />
            </h2>
          </div>

          <div className={`glass-card p-6 ${cashClass}`}>
            <p>Cash Balance</p>
            <h2 className="text-2xl font-bold">
              ₹<CountUp end={cash} separator="," />
            </h2>
          </div>

        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-4 gap-6">

        <div className="glass-card p-6">
          <p>Profit Margin</p>
          <h2 className="text-xl font-bold">
            {data.metrics.net_profit_margin}%
          </h2>
        </div>

        <div className="glass-card p-6">
          <p>Expense Ratio</p>
          <h2 className="text-xl font-bold">
            {data.metrics.expense_ratio}%
          </h2>
        </div>

        <div className={`glass-card p-6 ${debtClass}`}>
          <p>Debt Ratio</p>
          <h2 className="text-xl font-bold">
            {debtRatio}
          </h2>
        </div>

        <div className={`glass-card p-6 ${currentRatioClass}`}>
          <p>Current Ratio</p>
          <h2 className="text-xl font-bold">
            {currentRatio?.toFixed(2)}
          </h2>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
