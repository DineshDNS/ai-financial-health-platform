from sqlalchemy import text


def get_financial_aggregates(db, user_id):
    """
    Aggregates all financial values from PostgreSQL
    filtered by user_id.
    """

    # -----------------------------
    # REVENUE
    # -----------------------------
    revenue = db.execute(text("""
        SELECT COALESCE(SUM(amount), 0)
        FROM revenues
        WHERE user_id = :user_id
    """), {"user_id": user_id}).scalar()

    # -----------------------------
    # EXPENSES
    # -----------------------------
    expenses = db.execute(text("""
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE user_id = :user_id
    """), {"user_id": user_id}).scalar()

    # -----------------------------
    # NET PROFIT
    # -----------------------------
    net_profit = revenue - expenses

    # -----------------------------
    # TOTAL DEBT
    # -----------------------------
    total_debt = db.execute(text("""
        SELECT COALESCE(SUM(amount), 0)
        FROM loans
        WHERE user_id = :user_id
    """), {"user_id": user_id}).scalar()

    # -----------------------------
    # INVENTORY VALUE
    # -----------------------------
    inventory_value = db.execute(text("""
        SELECT COALESCE(SUM(quantity * unit_price), 0)
        FROM inventory
        WHERE user_id = :user_id
    """), {"user_id": user_id}).scalar()

    # -----------------------------
    # CASH INFLOW
    # -----------------------------
    cash_inflow = db.execute(text("""
        SELECT COALESCE(SUM(credit), 0)
        FROM bank_transactions
        WHERE user_id = :user_id
    """), {"user_id": user_id}).scalar()

    # -----------------------------
    # CASH OUTFLOW
    # -----------------------------
    cash_outflow = db.execute(text("""
        SELECT COALESCE(SUM(debit), 0)
        FROM bank_transactions
        WHERE user_id = :user_id
    """), {"user_id": user_id}).scalar()

    # -----------------------------
    # LATEST BANK BALANCE
    # -----------------------------
    bank_balance = db.execute(text("""
        SELECT balance
        FROM bank_transactions
        WHERE user_id = :user_id
        ORDER BY date DESC
        LIMIT 1
    """), {"user_id": user_id}).scalar() or 0

    # -----------------------------
    # DERIVED SME FINANCIAL MODELS
    # -----------------------------
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
