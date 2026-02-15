def detect_file_type(columns, sample_text=""):
    columns_lower = [c.lower() for c in columns]
    text_lower = sample_text.lower()

    scores = {
        "revenue": 0,
        "expenses": 0,
        "loans": 0,
        "inventory": 0,
        "bank": 0
    }

    # ===== STRONG RULES FIRST (HIGH CONFIDENCE) =====

    # Expense strong indicators
    if any(col in columns_lower for col in ["category", "vendor", "purchase"]):
        scores["expenses"] += 3

    # Revenue strong indicators
    if any(col in columns_lower for col in ["source", "customer", "invoice"]):
        scores["revenue"] += 3

    # Loan indicators
    if any(col in columns_lower for col in ["loan_id", "interest_rate", "emi"]):
        scores["loans"] += 4

    # Inventory indicators
    if any(col in columns_lower for col in ["item_name", "quantity", "stock"]):
        scores["inventory"] += 4

    # Bank indicators
    if any(col in columns_lower for col in ["debit", "credit", "balance"]):
        scores["bank"] += 4

    # ===== WEAK TEXT MATCHING (PDF SUPPORT) =====

    if "invoice" in text_lower:
        scores["revenue"] += 2

    if "gst" in text_lower:
        scores["revenue"] += 1

    if "vendor" in text_lower or "purchase" in text_lower:
        scores["expenses"] += 2

    if "bank" in text_lower or "statement" in text_lower:
        scores["bank"] += 3

    # ===== FINAL DECISION =====

    best_type = max(scores, key=scores.get)
    best_score = scores[best_type]

    confidence = best_score / 4

    if best_score == 0:
        return None, confidence, "needs_user_input"

    return best_type, confidence, "predicted"
