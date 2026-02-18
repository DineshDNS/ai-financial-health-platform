import pandas as pd
from statsmodels.tsa.arima.model import ARIMA


def run_arima_forecast(series, steps=3):
    """
    Generic ARIMA forecasting function
    Works even with small datasets
    """

    series = series.dropna()

    if len(series) == 0:
        return []

    # If only 1–2 months of data → simple trend projection
    if len(series) < 3:
        last_value = series.iloc[-1]
        return [float(last_value)] * steps

    model = ARIMA(series, order=(1, 1, 1))
    model_fit = model.fit()

    forecast = model_fit.forecast(steps=steps)

    return forecast.tolist()
