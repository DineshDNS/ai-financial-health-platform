import joblib
import numpy as np
from sklearn.ensemble import IsolationForest

def train_anomaly_model():

    X = np.random.rand(100,3)

    model = IsolationForest(contamination=0.05)
    model.fit(X)

    joblib.dump(model, "ml_models/anomaly_detection/model.pkl")


if __name__ == "__main__":
    train_anomaly_model()
