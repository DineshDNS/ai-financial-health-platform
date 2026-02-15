import joblib
import numpy as np

MODEL_PATH = "ml_models/credit_scoring/model.pkl"
model = joblib.load(MODEL_PATH)


def safe(value):
    return 0 if value is None else value


def predict_credit_score(kpi_data: dict):

    kpis = kpi_data.get("kpis", {})

    X = np.array([[
        safe(kpis.get("health_score")),
        safe(kpis.get("debt_ratio")),
        safe(kpis.get("cashflow_coverage"))
    ]])

    prediction = model.predict(X)[0]

    return prediction
