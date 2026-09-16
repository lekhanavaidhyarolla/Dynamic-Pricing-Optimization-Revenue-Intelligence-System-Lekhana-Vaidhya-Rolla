import os
import joblib
import pandas as pd

# Get project root directory
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

# Model and dataset paths
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

print("Loading trained model...")

model = joblib.load(MODEL_PATH)

print("Model loaded successfully!")
print()

# Load processed product data
print("Loading processed dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset loaded successfully!")
print(f"Number of products: {len(df)}")
print()

# Display columns
print("Available features:")
print(df.columns.tolist())
print()

# Get the feature names used by the trained model
if hasattr(model, "feature_names_in_"):
    feature_columns = list(model.feature_names_in_)
else:
    print("Could not determine model feature names.")
    exit()

print("Model expects these features:")
print(feature_columns)
print()

# Use first product for testing
product = df.iloc[0]

print("--------------------------------")
print("TEST PRODUCT")
print("--------------------------------")

if "name" in df.columns:
    print("Product:", product["name"])

if "currentPrice" in df.columns:
    print("Current Price: ₹", product["currentPrice"])

print()

# Create input dataframe
input_data = pd.DataFrame(
    [[product[column] for column in feature_columns]],
    columns=feature_columns
)

# Make prediction
predicted_price = model.predict(input_data)[0]

# Round price
predicted_price = round(float(predicted_price), 2)

print("--------------------------------")
print("AI PRICE PREDICTION")
print("--------------------------------")

print("Current Price   : ₹", product["currentPrice"])
print("Recommended Price: ₹", predicted_price)

# Calculate difference
difference = predicted_price - product["currentPrice"]

print("Price Difference : ₹", round(difference, 2))

if difference > 0:
    print("Recommendation   : Increase price")
elif difference < 0:
    print("Recommendation   : Decrease price")
else:
    print("Recommendation   : Keep current price")

print()
print("Prediction completed successfully!")