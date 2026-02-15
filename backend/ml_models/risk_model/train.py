import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def train_risk_model():

    X = np.array([
        [2.5,1.8,50000,0.25,0.60,0.3,0.4,1.5,85],
        [1.2,0.9,20000,0.10,0.75,0.8,0.7,0.8,40],
        [0.8,0.5,-10000,-0.05,0.90,1.5,0.9,0.3,20]
    ])

    y = ["Low","Medium","High"]

    model = RandomForestClassifier()
    model.fit(X, y)

    joblib.dump(model, "ml_models/risk_model/model.pkl")


if __name__ == "__main__":
    train_risk_model()
