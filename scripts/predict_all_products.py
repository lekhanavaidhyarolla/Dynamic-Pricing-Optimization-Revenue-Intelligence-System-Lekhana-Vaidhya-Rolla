import os
import joblib
import pandas as pd

# --------------------------------------------------
# PROJECT PATH
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "models",
    "pricing_model.joblib"
)

DATA_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "data",
    "processed_products.csv"
)

OUTPUT_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "data",
    "ai_priced_products.csv"
)

# --------------------------------------------------
# LOAD MODEL
# --------------------------------------------------

print("Loading trained model...")

model = joblib.load(MODEL_PATH)

print("Model loaded successfully!")
print()

# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

print("Loading processed dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset loaded successfully!")
print(f"Products: {len(df)}")
print()

# --------------------------------------------------
# GET MODEL FEATURES
# --------------------------------------------------

feature_columns = list(model.feature_names_in_)

print("Model features:")
print(feature_columns)
print()

# --------------------------------------------------
# CREATE PREDICTIONS
# --------------------------------------------------

print("Generating AI recommended prices...")
print()

df["aiRecommendedPrice"] = model.predict(
    df[feature_columns]
)

# Round prices
df["aiRecommendedPrice"] = df["aiRecommendedPrice"].round(2)

# --------------------------------------------------
# PRICE DIFFERENCE
# --------------------------------------------------

df["priceDifference"] = (
    df["aiRecommendedPrice"] - df["currentPrice"]
).round(2)

# --------------------------------------------------
# RECOMMENDATION
# --------------------------------------------------

def get_recommendation(row):

    difference = row["priceDifference"]

    if difference > 0:
        return "Increase price"

    elif difference < 0:
        return "Decrease price"

    else:
        return "Keep current price"


df["priceRecommendation"] = df.apply(
    get_recommendation,
    axis=1
)

# --------------------------------------------------
# DISPLAY RESULTS
# --------------------------------------------------

print("-----------------------------------------------")
print("AI PRICING RESULTS")
print("-----------------------------------------------")

for _, row in df.iterrows():

    print(
        f"{row['name']}"
    )

    print(
        f"Current Price     : ₹{row['currentPrice']:.2f}"
    )

    print(
        f"AI Recommended    : ₹{row['aiRecommendedPrice']:.2f}"
    )

    print(
        f"Difference        : ₹{row['priceDifference']:.2f}"
    )

    print(
        f"Recommendation    : {row['priceRecommendation']}"
    )

    print("-----------------------------------------------")

# --------------------------------------------------
# SAVE RESULTS
# --------------------------------------------------

df.to_csv(
    OUTPUT_PATH,
    index=False
)

print()
print("All predictions generated successfully!")
print()

print("Output file:")
print(OUTPUT_PATH)