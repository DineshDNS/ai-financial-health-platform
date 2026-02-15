import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def train_credit_model():

    X = np.array([
        [80,0.3,1.5],
        [50,0.8,0.9],
        [30,1.5,0.5]
    ])

    y = ["Eligible","Review","Not Eligible"]

    model = RandomForestClassifier()
    model.fit(X, y)

    joblib.dump(model, "ml_models/credit_scoring/model.pkl")


if __name__ == "__main__":
    train_credit_model()
