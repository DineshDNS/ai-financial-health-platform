def expense_efficiency(net_profit, expenses):
    if expenses == 0:
        return None
    return round(net_profit / expenses, 2)
