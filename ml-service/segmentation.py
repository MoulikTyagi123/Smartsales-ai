"""
Customer segmentation using revenue-based percentile bucketing.
Interview line: "I segmented customers into high/medium/low value tiers
using percentile-based revenue thresholds computed with Pandas."
"""

import pandas as pd


def segment_customers(df: pd.DataFrame) -> dict:
    try:
        # Total revenue per customer
        customer_revenue = df.groupby("customer")["revenue"].sum()

        if customer_revenue.empty:
            return {"highValue": 0, "mediumValue": 0, "lowValue": 0}

        # Percentile thresholds
        p66 = customer_revenue.quantile(0.66)
        p33 = customer_revenue.quantile(0.33)

        high = int((customer_revenue >= p66).sum())
        medium = int(((customer_revenue >= p33) & (customer_revenue < p66)).sum())
        low = int((customer_revenue < p33).sum())

        return {
            "highValue": high,
            "mediumValue": medium,
            "lowValue": low,
        }
    except Exception as e:
        import sys
        sys.stderr.write(f"Segmentation error: {e}\n")
        return {"highValue": 0, "mediumValue": 0, "lowValue": 0}
