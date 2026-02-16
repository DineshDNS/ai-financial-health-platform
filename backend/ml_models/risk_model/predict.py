import joblib
import numpy as np
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "model.pkl"
)

model = joblib.load(MODEL_PATH)


def predict_risk(kpi_data: dict):

    kpis = kpi_data.get("kpis", {})

    features = np.array([[
        kpis.get("current_ratio", 0),
        kpis.get("quick_ratio", 0),
        kpis.get("working_capital", 0),
        kpis.get("net_profit_margin", 0),
        kpis.get("expense_ratio", 0),
        kpis.get("debt_to_equity", 0),
        kpis.get("debt_ratio", 0),
        kpis.get("cashflow_coverage", 0),
        kpis.get("expense_efficiency", 0),
    ]])

    prediction = model.predict(features)[0]

    return prediction
