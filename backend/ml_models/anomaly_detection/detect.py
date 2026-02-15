import joblib
import numpy as np

MODEL_PATH = "ml_models/anomaly_detection/model.pkl"

model = joblib.load(MODEL_PATH)

def detect_anomaly(expense, revenue, cashflow):

    X = np.array([[expense, revenue, cashflow]])

    result = model.predict(X)[0]

    return "Anomaly" if result == -1 else "Normal"
