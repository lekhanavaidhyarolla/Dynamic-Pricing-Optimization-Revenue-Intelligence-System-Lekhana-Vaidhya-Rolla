import pandas as pd
import numpy as np
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

PRODUCTS_PATH = BASE_DIR / "data" / "products.csv"
OUTPUT_PATH = BASE_DIR / "data" / "sales_history.csv"


# ============================================================
# LOAD EXISTING PRODUCTS
# ============================================================

products = pd.read_csv(PRODUCTS_PATH)


# ============================================================
# REPRODUCIBLE RANDOM GENERATOR
# ============================================================

np.random.seed(42)


# ============================================================
# MONTHS
# ============================================================

months = pd.date_range(
    start="2025-01-01",
    end="2026-06-01",
    freq="MS"
)


# ============================================================
# CREATE HISTORICAL SALES
# ============================================================

records = []


for _, product in products.iterrows():

    current_sales = float(product["sales"])
    last_month_sales = float(product["lastMonthSales"])

    # Estimate a historical base from the two available
    # sales observations in the existing dataset.
    base_sales = (
        current_sales * 0.60
        +
        last_month_sales * 0.40
    )

    for month_index, month in enumerate(months):

        # Gradual growth/decline component
        trend_factor = (
            1
            +
            (month_index - len(months) / 2)
            * 0.003
        )

        # Seasonal component
        month_number = month.month

        seasonal_factor = 1.0

        # Festival / shopping season
        if month_number in [10, 11, 12]:
            seasonal_factor = 1.15

        # Summer demand
        elif month_number in [4, 5, 6]:
            seasonal_factor = 1.05

        # Early-year normalization
        elif month_number in [1, 2]:
            seasonal_factor = 0.95

        # Random variation
        noise_factor = np.random.normal(
            1.0,
            0.06
        )

        sales = (
            base_sales
            *
            trend_factor
            *
            seasonal_factor
            *
            noise_factor
        )

        sales = max(
            1,
            round(sales)
        )

        records.append({

            "date": month.strftime("%Y-%m"),

            "product_id": int(
                product["id"]
            ),

            "product_name":
                product["name"],

            "category":
                product["category"],

            "sales":
                sales,

        })


# ============================================================
# CREATE DATAFRAME
# ============================================================

sales_history = pd.DataFrame(records)


# ============================================================
# SAVE
# ============================================================

sales_history.to_csv(
    OUTPUT_PATH,
    index=False
)


print()
print("=" * 60)
print("SALES HISTORY CREATED SUCCESSFULLY")
print("=" * 60)
print()
print(f"Output: {OUTPUT_PATH}")
print(f"Rows: {len(sales_history)}")
print(f"Products: {sales_history['product_id'].nunique()}")
print(
    f"Months: {sales_history['date'].nunique()}"
)
print()
print(sales_history.head(10))
print()
print("=" * 60)