def net_profit_margin(net_profit, revenue):
    if revenue == 0:
        return None
    return round((net_profit / revenue) * 100, 2)


def expense_ratio(expenses, revenue):
    if revenue == 0:
        return None
    return round((expenses / revenue) * 100, 2)
