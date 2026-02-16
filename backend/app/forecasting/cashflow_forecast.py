import pandas as pd
from sqlalchemy.orm import Session
from app.forecasting.arima_model import run_arima_forecast
from app.models.bank import BankTransaction


def forecast_cashflow(db: Session, steps=3):

    data = db.query(
        BankTransaction.date,
        BankTransaction.credit,
        BankTransaction.debit
    ).all()

    df = pd.DataFrame(data, columns=["date", "credit", "debit"])

    if df.empty:
        return []

    df["date"] = pd.to_datetime(df["date"])
    df["net"] = df["credit"] - df["debit"]

    df = df.sort_values("date")

    monthly = df.resample("ME", on="date").sum()

    return run_arima_forecast(monthly["net"], steps)
