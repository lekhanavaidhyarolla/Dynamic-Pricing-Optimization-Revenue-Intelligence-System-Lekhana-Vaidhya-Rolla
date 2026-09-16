import pandas as pd
from pathlib import Path


# --------------------------------------------------
# 1. Locate dataset
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = BASE_DIR / "data" / "products.csv"


# --------------------------------------------------
# 2. Load dataset
# --------------------------------------------------

print("Loading dataset...")

df = pd.read_csv(DATA_PATH)


print("\nOriginal dataset shape:")
print(df.shape)


# --------------------------------------------------
# 3. Create competitor price difference
# --------------------------------------------------

df["competitorPriceDifference"] = (
    df["competitorPrice"] - df["currentPrice"]
)


# --------------------------------------------------
# 4. Create competitor price ratio
# --------------------------------------------------

df["competitorPriceRatio"] = (
    df["competitorPrice"] /
    df["currentPrice"]
)


# --------------------------------------------------
# 5. Create sales growth
# --------------------------------------------------

df["salesGrowth"] = (
    (df["sales"] - df["lastMonthSales"]) /
    df["lastMonthSales"]
)


# --------------------------------------------------
# 6. Create stock-to-sales ratio
# --------------------------------------------------

df["stockToSalesRatio"] = (
    df["stock"] /
    df["sales"]
)


# --------------------------------------------------
# 7. Display engineered features
# --------------------------------------------------

print("\nEngineered features:")

print(
    df[
        [
            "name",
            "currentPrice",
            "competitorPrice",
            "competitorPriceDifference",
            "competitorPriceRatio",
            "sales",
            "lastMonthSales",
            "salesGrowth",
            "stock",
            "stockToSalesRatio",
        ]
    ].head()
)


# --------------------------------------------------
# 8. Check for invalid values
# --------------------------------------------------

print("\nMissing values after feature engineering:")

print(df.isnull().sum())


# --------------------------------------------------
# 9. Check data types
# --------------------------------------------------

print("\nData types:")

print(df.dtypes)


# --------------------------------------------------
# 10. Final dataset shape
# --------------------------------------------------

print("\nFinal dataset shape:")

print(df.shape)


print("\nFeature engineering completed successfully!")