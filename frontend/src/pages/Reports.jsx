import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";

const Reports = () => {
  const [data, setData] = useState(null);
  const [investor, setInvestor] = useState("");
  const [risk, setRisk] = useState("");
  const [forecast, setForecast] = useState("");
  const [anomaly, setAnomaly] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const dash = await axios.get("http://127.0.0.1:8000/dashboard/full");

      const inv = await axios.get("http://127.0.0.1:8000/ai/explain/investor-summary");
      const riskRes = await axios.get("http://127.0.0.1:8000/ai/explain/risk");
      const forecastRes = await axios.get("http://127.0.0.1:8000/ai/explain/forecast");
      const anomalyRes = await axios.get("http://127.0.0.1:8000/ai/explain/anomaly");
      const rec = await axios.get("http://127.0.0.1:8000/ai/explain/recommendations");

      setData(dash.data);

      setInvestor(inv.data?.investor_summary || "");
      setRisk(riskRes.data?.ai_explanation || "");
      setForecast(forecastRes.data?.ai_explanation || "");
      setAnomaly(anomalyRes.data?.ai_explanation || "");
      setRecommendations(rec.data?.recommendations || "");

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data)
    return <div className="p-6">Preparing executive report...</div>;

  const revenue = data.trends.revenue;
  const expenses = data.trends.expenses;
  const profit = revenue - expenses;
  const cash = data.metrics.working_capital;

  const health = data.summary.health_score;
  const riskBand = data.summary.risk_band;
  const cashflowHealth = data.metrics.cashflow_health;

  return (
    <div className="flex flex-col gap-10">

      {/* =========================
          HERO EXECUTIVE PANEL
      ========================= */}
      <div className="glass-card p-10">
        <div className="flex flex-col gap-4">

          <h2 className="text-3xl font-bold">
            Executive Financial Report
          </h2>

          <p className="text-sm opacity-80">
            AI-generated business health assessment and strategic intelligence overview.
          </p>

          <div className="grid grid-cols-4 gap-8 mt-6">

            <div className="health-medium p-5 rounded-xl">
              <p className="text-sm">Health Score</p>
              <h3 className="text-4xl font-bold">
                <CountUp end={health} /> /100
              </h3>
            </div>

            <div className="risk-medium p-5 rounded-xl">
              <p className="text-sm">Risk Level</p>
              <h3 className="text-xl font-bold">{riskBand}</h3>
            </div>

            <div className="p-5 rounded-xl border border-blue-300">
              <p className="text-sm">Cashflow Stability</p>
              <h3 className="text-xl font-bold">{cashflowHealth}</h3>
            </div>

            <div className="p-5 rounded-xl border border-green-400">
              <p className="text-sm">Net Profit</p>
              <h3 className="text-xl font-bold">
                ₹<CountUp end={profit} separator="," />
              </h3>
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          FINANCIAL SNAPSHOT
      ========================= */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Financial Snapshot
        </h3>

        <div className="grid grid-cols-4 gap-6">
          <div className="glass-card p-6 border-green-400">
            <p className="text-sm">Revenue</p>
            <h3 className="text-2xl font-bold">
              ₹<CountUp end={revenue} separator="," />
            </h3>
          </div>

          <div className="glass-card p-6 border-red-400">
            <p className="text-sm">Expenses</p>
            <h3 className="text-2xl font-bold">
              ₹<CountUp end={expenses} separator="," />
            </h3>
          </div>

          <div className="glass-card p-6 border-green-400">
            <p className="text-sm">Net Profit</p>
            <h3 className="text-2xl font-bold">
              ₹<CountUp end={profit} separator="," />
            </h3>
          </div>

          <div className="glass-card p-6 border-blue-400">
            <p className="text-sm">Cash Balance</p>
            <h3 className="text-2xl font-bold">
              ₹<CountUp end={cash} separator="," />
            </h3>
          </div>
        </div>
      </div>

      {/* =========================
          INVESTOR SUMMARY
      ========================= */}
      <div className="glass-card p-10">
        <h3 className="text-xl font-semibold mb-5">
          Investor Summary
        </h3>

        <div className="leading-relaxed whitespace-pre-line text-[15px] opacity-90">
          {investor}
        </div>
      </div>

      {/* =========================
          RISK + FORECAST
      ========================= */}
      <div className="grid md:grid-cols-2 gap-8">

        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold mb-4">
            Risk Assessment
          </h3>
          <p className="whitespace-pre-line leading-relaxed">
            {risk}
          </p>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold mb-4">
            Future Outlook
          </h3>
          <p className="whitespace-pre-line leading-relaxed">
            {forecast}
          </p>
        </div>

      </div>

      {/* =========================
          ANOMALY WATCH
      ========================= */}
      <div className="glass-card p-8">
        <h3 className="text-lg font-semibold mb-4">
          Financial Anomaly Watch
        </h3>
        <p className="whitespace-pre-line leading-relaxed">
          {anomaly}
        </p>
      </div>

      {/* =========================
          RECOMMENDATIONS
      ========================= */}
      <div className="glass-card p-10">
        <h3 className="text-xl font-semibold mb-5">
          Strategic Recommendations
        </h3>

        <div className="leading-relaxed whitespace-pre-line text-[15px]">
          {recommendations}
        </div>
      </div>

    </div>
  );
};

export default Reports;
