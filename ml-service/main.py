#!/usr/bin/env python3
"""
SmartSales AI - ML Pipeline
Entry point: receives uploadId + JSON data path, outputs analytics JSON
"""

import sys
import json
import pandas as pd
from analytics import compute_analytics
from forecasting import generate_forecast
from segmentation import segment_customers

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: main.py <uploadId> <jsonPath>"}))
        sys.exit(1)

    upload_id = sys.argv[1]
    json_path = sys.argv[2]

    try:
        with open(json_path, "r") as f:
            records = json.load(f)

        if not records:
            print(json.dumps({"error": "No records"}))
            sys.exit(1)

        # Load into pandas
        df = pd.DataFrame(records)
        df["date"] = pd.to_datetime(df["date"])
        df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce").fillna(0)
        df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(1)
        df = df.dropna(subset=["date", "revenue"])

        # Run all analyses
        analytics = compute_analytics(df)
        forecast = generate_forecast(df)
        segments = segment_customers(df)

        result = {
            **analytics,
            "forecastData": forecast,
            "customerSegments": segments,
        }

        print(json.dumps(result))

    except Exception as e:
        import traceback
        sys.stderr.write(traceback.format_exc())
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
