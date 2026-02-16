from sqlalchemy.orm import Session
from app.forecasting.revenue_forecast import forecast_revenue
from app.forecasting.expense_forecast import forecast_expenses
from app.forecasting.cashflow_forecast import forecast_cashflow


def generate_forecasts(db: Session):

    revenue_pred = forecast_revenue(db)
    expense_pred = forecast_expenses(db)
    cashflow_pred = forecast_cashflow(db)

    return {
        "revenue_forecast": revenue_pred,
        "expense_forecast": expense_pred,
        "cashflow_forecast": cashflow_pred
    }
