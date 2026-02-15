def current_ratio(current_assets, current_liabilities):
    if current_liabilities == 0:
        return None
    return round(current_assets / current_liabilities, 2)


def quick_ratio(current_assets, inventory_value, current_liabilities):
    if current_liabilities == 0:
        return None
    return round((current_assets - inventory_value) / current_liabilities, 2)


def working_capital(current_assets, current_liabilities):
    return round(current_assets - current_liabilities, 2)
