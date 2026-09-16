from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import joblib
import pandas as pd
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

# React/Vite production build directory
PROJECT_ROOT = BASE_DIR.parent
FRONTEND_DIST = PROJECT_ROOT / "dist"

MODEL_PATH = BASE_DIR / "models" / "pricing_model.joblib"
DATA_PATH = BASE_DIR / "data" / "products.csv"
FORECAST_DATA_PATH = BASE_DIR / "data" / "demand_forecasts.csv"
SEASONAL_DATA_PATH = BASE_DIR / "data" / "seasonal_analysis.csv"

# ============================================================
# LOAD MODEL
# ============================================================

print("Loading pricing model...")

model = joblib.load(MODEL_PATH)

print("Pricing model loaded successfully!")


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="PricePilot AI API",
    description="AI-powered dynamic pricing prediction API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HOME / HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    # In production, serve the React/Vite application.
    # During local API-only use, keep the original health response.
    if FRONTEND_DIST.exists():
        return FileResponse(FRONTEND_DIST / "index.html")

    return {
        "message": "PricePilot AI API is running!",
        "status": "success"
    }


# ============================================================
# MODEL STATUS
# ============================================================

@app.get("/model-status")
def model_status():

    return {
        "model": "Random Forest Regressor",
        "status": "loaded",
        "model_path": str(MODEL_PATH)
    }


# ============================================================
# GET PRODUCTS
# ============================================================

@app.get("/products")
def get_products():

    df = pd.read_csv(DATA_PATH)

    products = df.to_dict(orient="records")

    return {
        "count": len(products),
        "products": products
    }


# ============================================================
# PRICE PREDICTION
# ============================================================

@app.post("/predict")
def predict_price(product: dict):

    # --------------------------------------------------------
    # Convert request into DataFrame
    # --------------------------------------------------------

    current_price = float(product["currentPrice"])
    competitor_price = float(product["competitorPrice"])
    stock = float(product["stock"])
    sales = float(product["sales"])
    last_month_sales = float(product["lastMonthSales"])
    demand = product["demand"]


    # --------------------------------------------------------
    # Feature engineering
    # --------------------------------------------------------

    competitor_price_difference = (
        competitor_price - current_price
    )

    competitor_price_ratio = (
        competitor_price / current_price
        if current_price != 0
        else 0
    )

    sales_growth = (
        (sales - last_month_sales) / last_month_sales
        if last_month_sales != 0
        else 0
    )

    stock_to_sales_ratio = (
        stock / sales
        if sales != 0
        else 0
    )


    # --------------------------------------------------------
    # Create model input
    # --------------------------------------------------------

    input_data = pd.DataFrame([
        {
            "currentPrice": current_price,
            "demand": demand,
            "stock": stock,
            "competitorPrice": competitor_price,
            "sales": sales,
            "lastMonthSales": last_month_sales,
            "competitorPriceDifference":
                competitor_price_difference,
            "competitorPriceRatio":
                competitor_price_ratio,
            "salesGrowth":
                sales_growth,
            "stockToSalesRatio":
                stock_to_sales_ratio
        }
    ])


    # --------------------------------------------------------
    # AI prediction
    # --------------------------------------------------------

    prediction = model.predict(input_data)[0]

    ai_recommended_price = round(float(prediction))


    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {
        "currentPrice": round(current_price),
        "aiRecommendedPrice": ai_recommended_price,
        "priceChange": (
            ai_recommended_price -
            round(current_price)
        ),
        "priceChangePercentage": round(
            (
                (
                    ai_recommended_price -
                    current_price
                )
                / current_price
            ) * 100,
            2
        )
    }
# ============================================================
# DEMAND FORECAST
# ============================================================

@app.get("/forecast")
def get_forecast():

    df = pd.read_csv(FORECAST_DATA_PATH)

    forecasts = df.to_dict(orient="records")

    return {
        "count": len(forecasts),
        "forecasts": forecasts
    }
# ============================================================
# SEASONAL TREND ANALYSIS
# ============================================================

@app.get("/seasonal-analysis")
def get_seasonal_analysis():

    df = pd.read_csv(SEASONAL_DATA_PATH)

    seasonal_data = df.to_dict(orient="records")

    return {
        "count": len(seasonal_data),
        "seasonal_analysis": seasonal_data
    }
# ============================================================
# COMPETITOR ANALYSIS
# ============================================================

@app.get("/competitors")
def get_competitors():

    df = pd.read_csv(
        BASE_DIR / "data" / "ai_priced_products.csv"
    )

    competitors = []

    for _, row in df.iterrows():

        current_price = float(
            row["currentPrice"]
        )

        competitor_price = float(
            row["competitorPrice"]
        )

        price_difference = (
            competitor_price -
            current_price
        )

        if current_price != 0:

            price_difference_percentage = (
                price_difference /
                current_price
            ) * 100

        else:

            price_difference_percentage = 0

        if price_difference > 0:

            market_position = "Lower"

        elif price_difference < 0:

            market_position = "Higher"

        else:

            market_position = "Market Average"

        competitors.append({

            "product_id":
                int(row["id"]),

            "product_name":
                row["name"],

            "category":
                row["category"],

            "current_price":
                current_price,

            "competitor_price":
                competitor_price,

            "price_difference":
                round(
                    price_difference,
                    2
                ),

            "price_difference_percentage":
                round(
                    price_difference_percentage,
                    2
                ),

            "market_position":
                market_position,

            "ai_recommended_price":
                float(
                    row["aiRecommendedPrice"]
                ),

            "price_recommendation":
                row["priceRecommendation"],

            "demand":
                row["demand"]

        })

    return {

        "count":
            len(competitors),

        "competitors":
            competitors

    }
# ============================================================
# REVENUE OPTIMIZATION
# ============================================================

@app.get("/revenue-optimization")
def get_revenue_optimization():

    df = pd.read_csv(
        BASE_DIR / "data" / "ai_priced_products.csv"
    )

    products = []

    total_current_revenue = 0
    total_recommended_revenue = 0
    total_current_profit = 0
    total_recommended_profit = 0

    for _, row in df.iterrows():

        current_price = float(
            row["currentPrice"]
        )

        recommended_price = float(
            row["aiRecommendedPrice"]
        )

        sales = float(
            row["sales"]
        )

        current_revenue = (
            current_price * sales
        )

        recommended_revenue = (
            recommended_price * sales
        )

        current_profit = (
            current_revenue * 0.20
        )

        recommended_profit = (
            recommended_revenue * 0.20
        )

        revenue_opportunity = (
            recommended_revenue -
            current_revenue
        )

        total_current_revenue += (
            current_revenue
        )

        total_recommended_revenue += (
            recommended_revenue
        )

        total_current_profit += (
            current_profit
        )

        total_recommended_profit += (
            recommended_profit
        )

        products.append({

            "product_id":
                int(row["id"]),

            "product_name":
                row["name"],

            "category":
                row["category"],

            "current_price":
                round(current_price, 2),

            "recommended_price":
                round(recommended_price, 2),

            "sales":
                round(sales, 2),

            "current_revenue":
                round(
                    current_revenue,
                    2
                ),

            "recommended_revenue":
                round(
                    recommended_revenue,
                    2
                ),

            "revenue_opportunity":
                round(
                    revenue_opportunity,
                    2
                ),

            "current_profit":
                round(
                    current_profit,
                    2
                ),

            "recommended_profit":
                round(
                    recommended_profit,
                    2
                ),

            "profit_opportunity":
                round(
                    recommended_profit -
                    current_profit,
                    2
                ),

            "price_recommendation":
                row["priceRecommendation"]

        })

    total_revenue_opportunity = (
        total_recommended_revenue -
        total_current_revenue
    )

    total_profit_opportunity = (
        total_recommended_profit -
        total_current_profit
    )

    return {

        "total_products":
            len(products),

        "current_revenue":
            round(
                total_current_revenue,
                2
            ),

        "recommended_revenue":
            round(
                total_recommended_revenue,
                2
            ),

        "revenue_opportunity":
            round(
                total_revenue_opportunity,
                2
            ),

        "current_profit":
            round(
                total_current_profit,
                2
            ),

        "recommended_profit":
            round(
                total_recommended_profit,
                2
            ),

        "profit_opportunity":
            round(
                total_profit_opportunity,
                2
            ),

        "products":
            products

    }

# ============================================================
# SERVE REACT FRONTEND
# ============================================================

# When the Vite production build exists, FastAPI can serve the
# React application from the same public URL.
if FRONTEND_DIST.exists():

    # Serve Vite-generated JavaScript/CSS/images.
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets",
    )

    # Serve existing frontend files and fall back to index.html
    # so React Router client-side routes work on refresh.
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):

        file_path = FRONTEND_DIST / full_path

        if file_path.is_file():
            return FileResponse(file_path)

        return FileResponse(FRONTEND_DIST / "index.html")

