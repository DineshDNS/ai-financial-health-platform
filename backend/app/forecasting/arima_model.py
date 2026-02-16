import pandas as pd
from statsmodels.tsa.arima.model import ARIMA


def run_arima_forecast(series, steps=3):
    """
    Generic ARIMA forecasting function
    series: pandas Series with datetime index
    steps: months to predict
    """

    if len(series) < 3:
        return []

    model = ARIMA(series, order=(1, 1, 1))
    model_fit = model.fit()

    forecast = model_fit.forecast(steps=steps)

    return forecast.tolist()
