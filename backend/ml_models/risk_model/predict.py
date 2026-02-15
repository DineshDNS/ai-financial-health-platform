import joblib
import numpy as np
from ml_models.common.feature_builder import build_feature_vector

MODEL_PATH = "ml_models/risk_model/model.pkl"

model = joblib.load(MODEL_PATH)

def predict_risk_from_kpis(kpi_data: dict):

    features = build_feature_vector(kpi_data)

    X = np.array([features])

    prediction = model.predict(X)[0]

    return prediction
