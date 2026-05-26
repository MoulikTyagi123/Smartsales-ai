"""
Core analytics computation using Pandas
"""

import pandas as pd
import numpy as np


def compute_analytics(df: pd.DataFrame) -> dict:
    total_revenue = float(df["revenue"].sum())
    total_orders = len(df)
    avg_order_value = float(df["revenue"].mean()) if total_orders > 0 else 0

    # Top categories
    cat_revenue = (
        df.groupby("category")["revenue"]
        .sum()
        .sort_values(ascending=False)
        .head(8)
    )
    top_categories = [
        {"name": str(k), "revenue": round(float(v), 2)}
        for k, v in cat_revenue.items()
    ]

    # Top cities
    city_revenue = (
        df.groupby("city")["revenue"]
        .sum()
        .sort_values(ascending=False)
        .head(8)
    )
    top_cities = [
        {"name": str(k), "revenue": round(float(v), 2)}
        for k, v in city_revenue.items()
    ]

    # Monthly revenue
    df["month_key"] = df["date"].dt.to_period("M")
    monthly = (
        df.groupby("month_key")["revenue"]
        .sum()
        .sort_index()
    )
    monthly_revenue = [
        {"month": str(k), "revenue": round(float(v), 2)}
        for k, v in monthly.items()
    ]

    # Revenue growth (last month vs previous)
    revenue_growth = 0.0
    if len(monthly_revenue) >= 2:
        prev = monthly_revenue[-2]["revenue"]
        curr = monthly_revenue[-1]["revenue"]
        revenue_growth = round(((curr - prev) / prev) * 100, 2) if prev > 0 else 0

    # Customer stats
    customer_counts = df.groupby("customer").size()
    unique_customers = int(customer_counts.count())
    repeat_customers = int((customer_counts > 1).sum())

    return {
        "totalRevenue": round(total_revenue, 2),
        "totalOrders": total_orders,
        "avgOrderValue": round(avg_order_value, 2),
        "topCategories": top_categories,
        "topCities": top_cities,
        "monthlyRevenue": monthly_revenue,
        "revenueGrowth": revenue_growth,
        "uniqueCustomers": unique_customers,
        "repeatCustomers": repeat_customers,
    }
