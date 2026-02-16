import pandas as pd
from sqlalchemy.orm import Session
from app.forecasting.arima_model import run_arima_forecast
from app.models.expenses import Expense


def forecast_expenses(db: Session, steps=3):

    data = db.query(Expense.date, Expense.amount).all()

    df = pd.DataFrame(data, columns=["date", "amount"])

    if df.empty:
        return []

    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")

    monthly = df.resample("ME", on="date").sum()

    return run_arima_forecast(monthly["amount"], steps)
