import pandas as pd
import numpy as np
import joblib

from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = BASE_DIR / "data" / "sales_history.csv"

PRODUCT_DATA_PATH = BASE_DIR / "data" / "products.csv"

MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "demand_forecast.joblib"


# ============================================================
# LOAD DATA
# ============================================================

print()
print("=" * 60)
print("DEMAND FORECASTING MODEL TRAINING")
print("=" * 60)

df = pd.read_csv(DATA_PATH)

product_df = pd.read_csv(
    PRODUCT_DATA_PATH
)
print()
print("Dataset loaded successfully!")
print(f"Rows: {len(df)}")
print(f"Products: {df['product_id'].nunique()}")
print(f"Months: {df['date'].nunique()}")

print()
print("Product context loaded successfully!")
print(f"Product records: {len(product_df)}")
# ============================================================
# MERGE PRODUCT CONTEXT
# ============================================================

df = df.merge(

    product_df[
        [
            "id",
            "currentPrice",
            "stock",
            "competitorPrice",
        ]
    ],

    left_on="product_id",

    right_on="id",

    how="left"

)


df = df.drop(
    columns=["id"]
)


print()
print("Product context merged successfully!")

print(
    f"Missing currentPrice: "
    f"{df['currentPrice'].isna().sum()}"
)

print(
    f"Missing stock: "
    f"{df['stock'].isna().sum()}"
)

print(
    f"Missing competitorPrice: "
    f"{df['competitorPrice'].isna().sum()}"
)
# ============================================================
# DATE FEATURES
# ============================================================

df["date"] = pd.to_datetime(
    df["date"],
    format="%Y-%m"
)

df["year"] = df["date"].dt.year

df["month"] = df["date"].dt.month

df["month_index"] = (
    (df["year"] - df["year"].min()) * 12
    + df["month"]
)


# ============================================================
# SORT DATA
# ============================================================

df = df.sort_values(
    ["product_id", "date"]
).reset_index(drop=True)


# ============================================================
# LAG FEATURES
# ============================================================

df["previous_sales"] = (

    df.groupby("product_id")["sales"]
      .shift(1)

)

df["sales_2_months_ago"] = (

    df.groupby("product_id")["sales"]
      .shift(2)

)


# ============================================================
# ROLLING FEATURES
# ============================================================

df["rolling_3_month_avg"] = (

    df.groupby("product_id")["sales"]
      .transform(
          lambda x:
          x.shift(1).rolling(3).mean()
      )

)


# ============================================================
# REMOVE ROWS WITH MISSING FEATURES
# ============================================================

df = df.dropna().reset_index(drop=True)


# ============================================================
# FEATURES
# ============================================================

features = [

    "product_id",

    "month",

    "month_index",

    "previous_sales",

    "sales_2_months_ago",

    "rolling_3_month_avg",
    
    "currentPrice",

    "stock",

    "competitorPrice",

]


target = "sales"


X = df[features]

y = df[target]


# ============================================================
# TIME-BASED TRAIN / TEST SPLIT
# ============================================================

split_index = int(
    len(df) * 0.80
)


X_train = X.iloc[:split_index]

X_test = X.iloc[split_index:]


y_train = y.iloc[:split_index]

y_test = y.iloc[split_index:]


print()
print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")


# ============================================================
# RANDOM FOREST MODEL
# ============================================================

print()
print("Training Random Forest forecasting model...")


model = RandomForestRegressor(

    n_estimators=200,

    max_depth=12,

    min_samples_leaf=2,

    random_state=42,

    n_jobs=-1

)


model.fit(
    X_train,
    y_train
)


# ============================================================
# PREDICTION
# ============================================================

predictions = model.predict(
    X_test
)


# ============================================================
# EVALUATION
# ============================================================

mae = mean_absolute_error(
    y_test,
    predictions
)


rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)


r2 = r2_score(
    y_test,
    predictions
)


print()
print("=" * 60)
print("FORECAST MODEL PERFORMANCE")
print("=" * 60)

print(
    f"MAE  : {mae:.2f}"
)

print(
    f"RMSE : {rmse:.2f}"
)

print(
    f"R²   : {r2:.4f}"
)


# ============================================================
# SAVE MODEL
# ============================================================

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)


joblib.dump(
    {
        "model": model,

        "features": features,

        "model_name":
            "Random Forest Demand Forecasting Model"

    },
    MODEL_PATH
)


print()
print("=" * 60)
print("MODEL SAVED SUCCESSFULLY")
print("=" * 60)

print()
print(
    f"Model: {MODEL_PATH}"
)

print()