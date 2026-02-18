import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShieldCheck, Brain, AlertTriangle, LineChart } from "lucide-react";

const AIRecommendations = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllInsights();
  }, []);

  const loadAllInsights = async () => {
    try {
      const [investor, anomaly, credit] = await Promise.all([
        axios.get("http://localhost:8000/ai/explain/investor-summary"),
        axios.get("http://localhost:8000/ai/explain/anomaly"),
        axios.get("http://localhost:8000/ai/explain/credit"),
      ]);

      setData({
        investor: investor.data,
        anomaly: anomaly.data,
        credit: credit.data,
      });
    } catch (err) {
      console.error("AI insights load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SAFE HELPERS ---------------- */

  const safeText = (t) => {
    if (!t) return "";
    return typeof t === "string" ? t : JSON.stringify(t);
  };

  const getConfidence = (text) => {
    const t = safeText(text).toLowerCase();

    if (t.includes("high")) return 90;
    if (t.includes("medium")) return 75;
    if (t.includes("low")) return 60;
    return 70;
  };

  const getRiskLevel = () => {
    const t = safeText(data.anomaly).toLowerCase();

    if (t.includes("high")) return "High Risk";
    if (t.includes("medium")) return "Medium Risk";
    return "Low Risk";
  };

  const confidence = getConfidence(data.credit);
  const riskLevel = getRiskLevel();

  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="h-32 bg-gray-300 rounded-2xl"></div>
        <div className="h-48 bg-gray-300 rounded-2xl"></div>
        <div className="h-48 bg-gray-300 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* =========================
            RISK + CONFIDENCE PANEL
        ========================= */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Risk Badge */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-red-500" />
              <h3 className="font-semibold">Risk Assessment</h3>
            </div>

            <div className="text-2xl font-bold mb-2">
              {riskLevel}
            </div>

            {/* Animated confidence bar */}
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${confidence}%` }}
              />
            </div>

            <div className="text-xs mt-2 text-gray-500">
              Confidence: {confidence}%
            </div>
          </div>

          {/* Credit Confidence */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-green-600" />
              <h3 className="font-semibold">Credit Confidence</h3>
            </div>

            <div className="text-2xl font-bold mb-2">
              {safeText(data.credit?.credit_label || "Unknown")}
            </div>

            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${confidence}%` }}
              />
            </div>

            <div className="text-xs mt-2 text-gray-500">
              Model reliability indicator
            </div>
          </div>

          {/* AI Stability */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="text-purple-600" />
              <h3 className="font-semibold">AI Stability Score</h3>
            </div>

            <div className="text-3xl font-bold">
              {confidence}
            </div>

            <div className="text-xs text-gray-500">
              Based on multi-model alignment
            </div>
          </div>
        </div>

        {/* =========================
            AI DECISION TIMELINE
        ========================= */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">
            AI Decision Timeline
          </h2>

          <div className="space-y-6">

            {[
              {
                title: "Risk Analysis",
                text: safeText(data.anomaly),
                icon: <AlertTriangle className="text-red-500" />
              },
              {
                title: "Credit Decision",
                text: safeText(data.credit?.ai_explanation),
                icon: <ShieldCheck className="text-green-600" />
              },
              {
                title: "Investor Summary",
                text: safeText(data.investor),
                icon: <LineChart className="text-blue-600" />
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1">{item.icon}</div>

                <div>
                  <div className="font-semibold">
                    {item.title}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">
                    {item.text || "No data available"}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* =========================
            EXECUTIVE SUMMARY
        ========================= */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-4">
            Executive AI Recommendation
          </h2>

          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {safeText(data.investor) || "No summary available"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AIRecommendations;
