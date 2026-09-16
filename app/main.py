from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
import pandas as pd


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="PricePilot AI API",
    description="AI-powered Dynamic Pricing & Revenue Intelligence API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    # Allow React/Vite frontend
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PATH CONFIGURATION
# ============================================================

# Current file:
# frontend-vite/backend/app/main.py

APP_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

# Project root:
# frontend-vite/
PROJECT_ROOT = os.path.dirname(
    os.path.dirname(APP_DIR)
)

# Actual ML data location:
# frontend-vite/ml/data/ai_priced_products.csv
DATA_PATH = os.path.join(
    PROJECT_ROOT,
    "ml",
    "data",
    "ai_priced_products.csv"
)


# ============================================================
# ROOT / HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    return {
        "message": "PricePilot AI Backend is running!",
        "status": "success"
    }


# ============================================================
# GET AI PRODUCTS
# ============================================================

@app.get("/api/products")
def get_products():

    # Check whether CSV exists
    if not os.path.exists(DATA_PATH):
        return {
            "status": "error",
            "message": "AI priced products file not found.",
            "path": DATA_PATH
        }

    try:

        # Read AI-generated pricing dataset
        df = pd.read_csv(DATA_PATH)

        # Replace NaN values
        df = df.fillna("")

        # Convert dataframe to JSON-compatible records
        products = df.to_dict(
            orient="records"
        )

        return {
            "status": "success",
            "count": len(products),
            "products": products
        }

    except Exception as e:

        return {
            "status": "error",
            "message": f"Error loading AI products: {str(e)}"
        }


# ============================================================
# API STATUS
# ============================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "message": "PricePilot AI API is healthy"
    }


# ============================================================
# DEBUG - SHOW DATA PATH
# ============================================================

@app.get("/api/debug")
def debug():

    return {
        "project_root": PROJECT_ROOT,
        "data_path": DATA_PATH,
        "file_exists": os.path.exists(DATA_PATH)
    }