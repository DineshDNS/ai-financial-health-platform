import joblib
import numpy as np
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "model.pkl"
)

model = joblib.load(MODEL_PATH)


def detect_anomaly(expense, revenue, cashflow):

    features = np.array([[expense, revenue, cashflow]])

    prediction = model.predict(features)[0]

    if prediction == -1:
        return "Anomaly Detected"
    else:
        return "Normal"
