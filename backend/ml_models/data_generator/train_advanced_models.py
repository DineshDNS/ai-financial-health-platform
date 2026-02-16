import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split


def generate_kpi_dataset(n=50000):

    data = []

    for _ in range(n):

        current_ratio = np.random.uniform(0.5, 3)
        quick_ratio = np.random.uniform(0.3, 2.5)
        working_capital = np.random.uniform(-50000, 200000)
        net_profit_margin = np.random.uniform(-0.3, 0.4)
        expense_ratio = np.random.uniform(0.4, 1.2)
        debt_to_equity = np.random.uniform(0, 3)
        debt_ratio = np.random.uniform(0, 1)
        cashflow_coverage = np.random.uniform(-1, 3)
        expense_efficiency = np.random.uniform(0.5, 1.5)

        # Risk logic
        risk = "Low"

        if net_profit_margin < 0 or debt_ratio > 0.7:
            risk = "Medium"

        if net_profit_margin < -0.1 or debt_ratio > 0.9:
            risk = "High"

        data.append([
            current_ratio,
            quick_ratio,
            working_capital,
            net_profit_margin,
            expense_ratio,
            debt_to_equity,
            debt_ratio,
            cashflow_coverage,
            expense_efficiency,
            risk
        ])

    return np.array(data)


def train_advanced_risk_model():

    dataset = generate_kpi_dataset()

    X = dataset[:, :-1].astype(float)
    y = dataset[:, -1]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(n_estimators=300)
    model.fit(X_train, y_train)

    joblib.dump(model, "ml_models/risk_model/model.pkl")

    print("Advanced KPI-based Risk Model Trained & Saved")


if __name__ == "__main__":
    train_advanced_risk_model()
