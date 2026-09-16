import pandas as pd
import numpy as np
import joblib

from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = BASE_DIR / "data" / "sales_history.csv"

MODEL_PATH = BASE_DIR / "models" / "demand_forecast.joblib"

OUTPUT_PATH = BASE_DIR / "data" / "demand_forecasts.csv"


# ============================================================
# SETTINGS
# ============================================================

FORECAST_MONTHS = 3


# ============================================================
# LOAD DATA
# ============================================================

print()
print("=" * 60)
print("DEMAND FORECAST GENERATION")
print("=" * 60)

df = pd.read_csv(DATA_PATH)

df["date"] = pd.to_datetime(
    df["date"],
    format="%Y-%m"
)

df = df.sort_values(
    ["product_id", "date"]
).reset_index(drop=True)


# ============================================================
# LOAD MODEL
# ============================================================

model_data = joblib.load(MODEL_PATH)

model = model_data["model"]

features = model_data["features"]


print()
print("Forecasting model loaded successfully.")


# ============================================================
# GENERATE FORECASTS
# ============================================================

forecast_results = []


for product_id, product_df in df.groupby("product_id"):

    product_df = product_df.sort_values(
        "date"
    ).copy()


    product_name = product_df[
        "product_name"
    ].iloc[0]


    category = product_df[
        "category"
    ].iloc[0]


    # --------------------------------------------------------
    # Historical sales
    # --------------------------------------------------------

    sales_history = (

        product_df["sales"]
        .astype(float)
        .tolist()

    )


    last_date = product_df[
        "date"
    ].max()


    # --------------------------------------------------------
    # Generate future months
    # --------------------------------------------------------

    for month_number in range(
        1,
        FORECAST_MONTHS + 1
    ):

        future_date = (

            last_date
            + pd.DateOffset(
                months=month_number
            )

        )


        # ----------------------------------------------------
        # Previous sales
        # ----------------------------------------------------

        previous_sales = (

            sales_history[-1]

        )


        # ----------------------------------------------------
        # Sales two months ago
        # ----------------------------------------------------

        if len(sales_history) >= 2:

            sales_2_months_ago = (

                sales_history[-2]

            )

        else:

            sales_2_months_ago = (

                previous_sales

            )


        # ----------------------------------------------------
        # Rolling three month average
        # ----------------------------------------------------

        recent_sales = (

            sales_history[-3:]

        )


        rolling_3_month_avg = (

            np.mean(recent_sales)

        )


        # ----------------------------------------------------
        # Date features
        # ----------------------------------------------------

        year = future_date.year

        month = future_date.month


        month_index = (

            (
                year
                - df["date"].dt.year.min()
            )

            * 12

            + month

        )


        # ----------------------------------------------------
        # Create model input
        # ----------------------------------------------------

        input_data = pd.DataFrame(

            [[

                product_id,

                month,

                month_index,

                previous_sales,

                sales_2_months_ago,

                rolling_3_month_avg,

            ]],

            columns=features

        )


        # ----------------------------------------------------
        # Predict
        # ----------------------------------------------------

        prediction = model.predict(
            input_data
        )[0]


        prediction = max(
            0,
            round(prediction)
        )


        # ----------------------------------------------------
        # Save prediction
        # ----------------------------------------------------

        forecast_results.append({

            "date":
                future_date.strftime(
                    "%Y-%m"
                ),

            "product_id":
                product_id,

            "product_name":
                product_name,

            "category":
                category,

            "forecast_sales":
                prediction,

        })


        # ----------------------------------------------------
        # IMPORTANT
        #
        # Use the predicted value as the next
        # previous-sales value so that the
        # following month can also be predicted.
        # ----------------------------------------------------

        sales_history.append(
            prediction
        )


# ============================================================
# CREATE FORECAST DATAFRAME
# ============================================================

forecast_df = pd.DataFrame(
    forecast_results
)


# ============================================================
# SAVE FORECAST
# ============================================================

forecast_df.to_csv(
    OUTPUT_PATH,
    index=False
)


# ============================================================
# DISPLAY RESULTS
# ============================================================

print()
print("=" * 60)
print("FORECAST GENERATED SUCCESSFULLY")
print("=" * 60)

print()
print(
    f"Products: {forecast_df['product_id'].nunique()}"
)

print(
    f"Forecast months: {FORECAST_MONTHS}"
)

print(
    f"Forecast rows: {len(forecast_df)}"
)

print()
print(
    f"Output: {OUTPUT_PATH}"
)

print()
print("Sample forecasts:")
print()

print(
    forecast_df.head(15).to_string(
        index=False
    )
)

print()
print("=" * 60)