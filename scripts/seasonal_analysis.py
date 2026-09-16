import pandas as pd
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = BASE_DIR / "data" / "sales_history.csv"

OUTPUT_PATH = BASE_DIR / "data" / "seasonal_analysis.csv"


# ============================================================
# LOAD HISTORICAL SALES DATA
# ============================================================

print()
print("=" * 60)
print("SEASONAL TREND ANALYSIS")
print("=" * 60)

df = pd.read_csv(DATA_PATH)

print()
print("Historical sales data loaded successfully!")
print(f"Rows: {len(df)}")
print(f"Products: {df['product_id'].nunique()}")
print(f"Months: {df['date'].nunique()}")


# ============================================================
# CREATE MONTH INFORMATION
# ============================================================

df["month"] = pd.to_datetime(
    df["date"]
).dt.month

df["month_name"] = pd.to_datetime(
    df["date"]
).dt.strftime("%B")


# ============================================================
# MONTHLY SEASONAL ANALYSIS
# ============================================================

seasonal = (

    df.groupby(
        [
            "month",
            "month_name"
        ]
    )["sales"]

    .agg(
        total_sales="sum",
        average_sales="mean",
        product_count="count"
    )

    .reset_index()

)


# ============================================================
# CALCULATE SEASONAL INDEX
# ============================================================

overall_average = seasonal["average_sales"].mean()

seasonal["seasonal_index"] = (

    seasonal["average_sales"]

    / overall_average

)


# ============================================================
# CLASSIFY SEASONAL TREND
# ============================================================

def classify_seasonal_trend(index):

    if index >= 1.10:

        return "High Season"

    if index <= 0.90:

        return "Low Season"

    return "Normal Season"


seasonal["seasonal_trend"] = (

    seasonal["seasonal_index"]

    .apply(classify_seasonal_trend)

)


# ============================================================
# ROUND VALUES
# ============================================================

seasonal["average_sales"] = (

    seasonal["average_sales"]

    .round(2)

)

seasonal["seasonal_index"] = (

    seasonal["seasonal_index"]

    .round(3)

)


# ============================================================
# SAVE RESULT
# ============================================================

seasonal.to_csv(
    OUTPUT_PATH,
    index=False
)


# ============================================================
# DISPLAY RESULT
# ============================================================

print()
print("=" * 60)
print("SEASONAL ANALYSIS COMPLETED")
print("=" * 60)

print()
print("Output:")
print(OUTPUT_PATH)

print()
print("Seasonal analysis rows:")
print(len(seasonal))

print()
print("Seasonal analysis preview:")
print(seasonal)

print()
print("=" * 60)