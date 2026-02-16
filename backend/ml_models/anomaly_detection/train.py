import joblib
import numpy as np
from sklearn.ensemble import IsolationForest


def generate_anomaly_dataset(n=50000):

    data = []

    for _ in range(n):

        revenue = np.random.uniform(50000, 300000)
        expenses = revenue * np.random.uniform(0.5, 1.2)
        cashflow = revenue - expenses

        data.append([expenses, revenue, cashflow])

    return np.array(data)


def train_anomaly_model():

    X = generate_anomaly_dataset()

    model = IsolationForest(
        n_estimators=200,
        contamination=0.05,
        random_state=42
    )

    model.fit(X)

    joblib.dump(model, "ml_models/anomaly_detection/model.pkl")

    print("Advanced Anomaly Model Trained & Saved")


if __name__ == "__main__":
    train_anomaly_model()
