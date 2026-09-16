import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# --------------------------------------------------
# 1. PATHS
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "products.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

os.makedirs(MODEL_DIR, exist_ok=True)


# --------------------------------------------------
# 2. LOAD DATASET
# --------------------------------------------------

print("Loading dataset...")

df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully!")
print("Dataset shape:", df.shape)


# --------------------------------------------------
# 3. FEATURE ENGINEERING
# --------------------------------------------------

print("\nCreating features...")

df["competitorPriceDifference"] = (
    df["competitorPrice"] - df["currentPrice"]
)

df["competitorPriceRatio"] = (
    df["competitorPrice"] /
    df["currentPrice"]
)

df["salesGrowth"] = (
    (df["sales"] - df["lastMonthSales"]) /
    df["lastMonthSales"]
)

df["stockToSalesRatio"] = (
    df["stock"] /
    df["sales"]
)


# --------------------------------------------------
# 4. CREATE TARGET
# --------------------------------------------------

print("\nCreating target recommended price...")

def calculate_recommended_price(row):

    price = row["currentPrice"]
    competitor = row["competitorPrice"]
    demand = row["demand"]
    sales_growth = row["salesGrowth"]
    stock = row["stock"]

    recommended = price

    # Very high demand
    if demand == "Very High":
        recommended *= 1.12

    # High demand
    elif demand == "High":
        recommended *= 1.08

    # Moderate demand
    elif demand == "Moderate":
        recommended *= 0.98

    # Low demand
    else:
        recommended *= 0.95

    # Sales growth adjustment
    if sales_growth > 0.10:
        recommended *= 1.03

    elif sales_growth < -0.05:
        recommended *= 0.97

    # Competitor adjustment
    if competitor > recommended:
        recommended *= 1.02

    elif competitor < recommended:
        recommended *= 0.98

    # Stock adjustment
    if stock < 30:
        recommended *= 1.03

    elif stock > 100:
        recommended *= 0.97

    return round(recommended)


df["recommendedPrice"] = df.apply(
    calculate_recommended_price,
    axis=1
)


# --------------------------------------------------
# 5. FEATURES
# --------------------------------------------------

features = [
    "currentPrice",
    "demand",
    "stock",
    "competitorPrice",
    "sales",
    "lastMonthSales",
    "competitorPriceDifference",
    "competitorPriceRatio",
    "salesGrowth",
    "stockToSalesRatio"
]

target = "recommendedPrice"


X = df[features]
y = df[target]


# --------------------------------------------------
# 6. CATEGORICAL + NUMERICAL FEATURES
# --------------------------------------------------

categorical_features = [
    "demand"
]

numeric_features = [
    "currentPrice",
    "stock",
    "competitorPrice",
    "sales",
    "lastMonthSales",
    "competitorPriceDifference",
    "competitorPriceRatio",
    "salesGrowth",
    "stockToSalesRatio"
]


# --------------------------------------------------
# 7. PREPROCESSOR
# --------------------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "numerical",
            "passthrough",
            numeric_features
        )
    ]
)


# --------------------------------------------------
# 8. RANDOM FOREST MODEL
# --------------------------------------------------

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
    max_depth=10
)


# --------------------------------------------------
# 9. PIPELINE
# --------------------------------------------------

pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),
        (
            "model",
            model
        )
    ]
)


# --------------------------------------------------
# 10. TRAIN / TEST SPLIT
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# --------------------------------------------------
# 11. TRAIN MODEL
# --------------------------------------------------

print("\nTraining Random Forest model...")

pipeline.fit(
    X_train,
    y_train
)

print("Model training completed!")


# --------------------------------------------------
# 12. PREDICTIONS
# --------------------------------------------------

predictions = pipeline.predict(X_test)


# --------------------------------------------------
# 13. EVALUATION
# --------------------------------------------------

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

print("\n-----------------------------")
print("MODEL PERFORMANCE")
print("-----------------------------")

print(
    f"MAE  : ₹{mae:.2f}"
)

print(
    f"RMSE : ₹{rmse:.2f}"
)

print(
    f"R²   : {r2:.4f}"
)


# --------------------------------------------------
# 14. TRAIN FINAL MODEL
# --------------------------------------------------

print("\nTraining final model on full dataset...")

pipeline.fit(
    X,
    y
)


# --------------------------------------------------
# 15. SAVE MODEL
# --------------------------------------------------

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "pricing_model.joblib"
)

joblib.dump(
    pipeline,
    MODEL_PATH
)

print("\nModel saved successfully!")

print(
    "Model location:"
)

print(
    MODEL_PATH
)


# --------------------------------------------------
# 16. SAVE PREDICTIONS
# --------------------------------------------------

df["aiRecommendedPrice"] = pipeline.predict(
    X
).round().astype(int)

OUTPUT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed_products.csv"
)

df.to_csv(
    OUTPUT_PATH,
    index=False
)

print(
    "\nProcessed dataset saved:"
)

print(
    OUTPUT_PATH
)

print("\nTraining pipeline completed successfully!")