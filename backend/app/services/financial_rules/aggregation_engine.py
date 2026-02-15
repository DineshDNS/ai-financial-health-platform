from sqlalchemy import text
from app.core.database import SessionLocal


def get_financial_aggregates():
    db = SessionLocal()

    try:
        # Revenue
        revenue = db.execute(text(
            "SELECT COALESCE(SUM(amount),0) FROM revenues"
        )).scalar()

        # Expenses
        expenses = db.execute(text(
            "SELECT COALESCE(SUM(amount),0) FROM expenses"
        )).scalar()

        # Net Profit
        net_profit = revenue - expenses

        # Total Debt
        total_debt = db.execute(text(
            "SELECT COALESCE(SUM(amount),0) FROM loans"
        )).scalar()

        # Inventory Value
        inventory_value = db.execute(text(
            "SELECT COALESCE(SUM(quantity * unit_price),0) FROM inventory"
        )).scalar()

        # Cash Inflow
        cash_inflow = db.execute(text(
            "SELECT COALESCE(SUM(credit),0) FROM bank_transactions"
        )).scalar()

        # Cash Outflow
        cash_outflow = db.execute(text(
            "SELECT COALESCE(SUM(debit),0) FROM bank_transactions"
        )).scalar()

        # Latest Bank Balance
        bank_balance = db.execute(text("""
            SELECT balance
            FROM bank_transactions
            ORDER BY date DESC
            LIMIT 1
        """)).scalar() or 0

        # Derived SME Models (APPROVED)
        equity = net_profit
        current_assets = bank_balance + inventory_value
        current_liabilities = total_debt * 0.2

        return {
            "revenue": revenue,
            "expenses": expenses,
            "net_profit": net_profit,
            "total_debt": total_debt,
            "inventory_value": inventory_value,
            "cash_inflow": cash_inflow,
            "cash_outflow": cash_outflow,
            "bank_balance": bank_balance,
            "equity": equity,
            "current_assets": current_assets,
            "current_liabilities": current_liabilities,
        }

    finally:
        db.close()
