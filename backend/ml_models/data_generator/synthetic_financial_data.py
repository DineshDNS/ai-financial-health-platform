import numpy as np
import pandas as pd
import random


def generate_company_profile():
    return random.choice([
        "growing",
        "stable",
        "loss_making",
        "high_debt",
        "seasonal"
    ])


def generate_time_series(profile, months=24):
    revenue = []
    expenses = []
    debt = []
    cashflow = []

    base_revenue = random.randint(50000, 200000)

    for m in range(months):

        growth = 1

        if profile == "growing":
            growth += m * 0.03

        elif profile == "loss_making":
            growth -= m * 0.01

        elif profile == "seasonal":
            growth += np.sin(m / 3) * 0.2

        rev = base_revenue * growth + random.randint(-5000, 5000)
        exp = rev * random.uniform(0.6, 0.9)

        if profile == "loss_making":
            exp = rev * random.uniform(0.9, 1.2)

        d = random.randint(10000, 150000)
        cash = rev - exp

        revenue.append(rev)
        expenses.append(exp)
        debt.append(d)
        cashflow.append(cash)

    return revenue, expenses, debt, cashflow


def generate_dataset(num_companies=2000):

    rows = []

    for cid in range(num_companies):

        profile = generate_company_profile()
        revenue, expenses, debt, cashflow = generate_time_series(profile)

        for i in range(len(revenue)):

            rows.append({
                "revenue": revenue[i],
                "expenses": expenses[i],
                "debt": debt[i],
                "cashflow": cashflow[i],
                "profit": revenue[i] - expenses[i],
                "profile": profile
            })

    return pd.DataFrame(rows)
