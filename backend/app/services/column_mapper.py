COLUMN_PATTERNS = {
    "date": ["date", "txn_date", "transaction_date", "invoice_date"],
    "amount": ["amount", "total", "value", "net_amount"],
    "gst": ["gst", "tax", "gst_amount", "cgst", "sgst", "igst"]
}

def normalize_columns(df):
    renamed = {}

    for standard, patterns in COLUMN_PATTERNS.items():
        for col in df.columns:
            if col.lower() in patterns:
                renamed[col] = standard

    return df.rename(columns=renamed)
