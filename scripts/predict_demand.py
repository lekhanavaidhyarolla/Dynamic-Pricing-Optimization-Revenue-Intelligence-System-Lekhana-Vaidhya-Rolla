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

CONTEXT_PATH = (
    BASE_DIR
    / "data"
    / "product_forecast_context.csv"
)


# ============================================================
# SETTINGS
# ============================================================

SHORT_TERM_MONTHS = 3

MEDIUM_TERM_MONTHS = 6

LONG_TERM_MONTHS = 12

FORECAST_MONTHS = LONG_TERM_MONTHS


# ============================================================
# LOAD DATA
# ============================================================

print()
print("=" * 60)
print("DEMAND FORECAST GENERATION")
print("=" * 60)

df = pd.read_csv(DATA_PATH)

context_df = pd.read_csv(
    CONTEXT_PATH
)

df["date"] = pd.to_datetime(
    df["date"],
    format="%Y-%m"
)

df = df.sort_values(
    ["product_id", "date"]
).reset_index(drop=True)

product_context = (

    context_df
    .set_index("id")
    .to_dict("index")

)


# ============================================================
# LOAD MODEL
# ============================================================

model_data = joblib.load(
    MODEL_PATH
)

model = model_data["model"]

features = model_data["features"]


print()
print(
    "Forecasting model loaded successfully."
)


# ============================================================
# GENERATE FORECASTS
# ============================================================

forecast_results = []


for product_id, product_df in df.groupby(
    "product_id"
):

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

            np.mean(
                recent_sales
            )

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
        # Product context features
        # ----------------------------------------------------

        current_price = product_context[
            product_id
        ]["currentPrice"]


        stock = product_context[
            product_id
        ]["stock"]


        competitor_price = product_context[
            product_id
        ]["competitorPrice"]


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

                current_price,

                stock,

                competitor_price,

            ]],

            columns=features

        )


        # ----------------------------------------------------
        # Predict
        # ----------------------------------------------------

        tree_predictions = np.array([

            tree.predict(
                input_data.values
            )[0]

            for tree in model.estimators_

        ])


        prediction = np.mean(
            tree_predictions
        )


        prediction_std = np.std(
            tree_predictions
        )


        prediction = max(
            0,
            round(prediction)
        )


        # ----------------------------------------------------
        # Forecast confidence
        # ----------------------------------------------------

        if prediction == 0:

            confidence_score = 0

        else:

            uncertainty_ratio = (

                prediction_std
                / prediction

            )


            confidence_score = (

                100
                * (
                    1
                    - uncertainty_ratio
                )

            )


            confidence_score = max(
                0,
                min(
                    100,
                    round(
                        confidence_score,
                        2
                    )
                )
            )


        # ----------------------------------------------------
        # Determine forecast horizon
        # ----------------------------------------------------

        if month_number <= SHORT_TERM_MONTHS:

            forecast_horizon = "Short-term"

        elif month_number <= MEDIUM_TERM_MONTHS:

            forecast_horizon = "Medium-term"

        else:

            forecast_horizon = "Long-term"


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

            "forecast_horizon":
                forecast_horizon,

            "forecast_sales":
                prediction,

            "confidence_score":
                confidence_score,

            "currentPrice":
                product_context[
                    product_id
                ]["currentPrice"],

            "stock":
                product_context[
                    product_id
                ]["stock"],

            "competitorPrice":
                product_context[
                    product_id
                ]["competitorPrice"],

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
    f"Products: "
    f"{forecast_df['product_id'].nunique()}"
)

print(
    "Forecast horizons: "
    "Short-term = 3 months, "
    "Medium-term = 6 months, "
    "Long-term = 12 months"
)

print(
    f"Forecast rows: "
    f"{len(forecast_df)}"
)

print()

print(
    f"Output: "
    f"{OUTPUT_PATH}"
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