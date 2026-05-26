"""
Sales forecasting using Linear Regression on monthly aggregates.
Interview line: "I implemented a lightweight forecasting pipeline using 
scikit-learn's LinearRegression to predict future revenue based on 
historical monthly trends."
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import calendar


def generate_forecast(df: pd.DataFrame, months_ahead: int = 6) -> list:
    try:
        # Aggregate monthly
        df["month_key"] = df["date"].dt.to_period("M")
        monthly = df.groupby("month_key")["revenue"].sum().reset_index()
        monthly = monthly.sort_values("month_key")

        if len(monthly) < 2:
            # Not enough data — flat forecast
            avg = float(df["revenue"].mean())
            result = []
            now = datetime.now()
            for i in range(1, months_ahead + 1):
                future = now + timedelta(days=30 * i)
                result.append({
                    "month": future.strftime("%Y-%m"),
                    "predicted": round(avg, 2)
                })
            return result

        # Encode months as integers (0, 1, 2, ...)
        monthly["x"] = range(len(monthly))
        X = monthly[["x"]].values
        y = monthly["revenue"].values

        model = LinearRegression()
        model.fit(X, y)

        # Predict future months
        last_x = len(monthly) - 1
        last_period = monthly["month_key"].iloc[-1]

        forecast = []
        for i in range(1, months_ahead + 1):
            x_pred = np.array([[last_x + i]])
            predicted = float(model.predict(x_pred)[0])
            predicted = max(0, predicted)  # no negative revenue

            # Calculate future month label
            future_period = last_period + i
            forecast.append({
                "month": str(future_period),
                "predicted": round(predicted, 2)
            })

        return forecast

    except Exception as e:
        import sys
        sys.stderr.write(f"Forecast error: {e}\n")
        return []
