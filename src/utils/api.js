const API_BASE_URL = "http://127.0.0.1:8001";

export const getAIProducts = async () => {
  const response = await fetch(
    `${API_BASE_URL}/products`
  );

  if (!response.ok) {
    throw new Error(
      `AI Products API failed with status ${response.status}`
    );
  }

  const data = await response.json();

  console.log("FastAPI response:", data);

  return Array.isArray(data.products)
    ? data.products
    : [];
};


/*
 * ============================================================
 * DEMAND FORECAST API
 * ============================================================
 */

export const getDemandForecast = async () => {

  const response = await fetch(
    `${API_BASE_URL}/forecast`
  );

  if (!response.ok) {
    throw new Error(
      `Demand Forecast API failed with status ${response.status}`
    );
  }

  const data = await response.json();

  console.log(
    "Demand Forecast API response:",
    data
  );

  return Array.isArray(data.forecasts)
    ? data.forecasts
    : [];
};


/*
 * ============================================================
 * SEASONAL TREND ANALYSIS API
 * ============================================================
 */

export const getSeasonalAnalysis = async () => {

  const response = await fetch(
    `${API_BASE_URL}/seasonal-analysis`
  );

  if (!response.ok) {
    throw new Error(
      `Seasonal Analysis API failed with status ${response.status}`
    );
  }

  const data = await response.json();

  console.log(
    "Seasonal Analysis API response:",
    data
  );

  return Array.isArray(data.seasonal_analysis)
    ? data.seasonal_analysis
    : [];
};


/*
 * ============================================================
 * COMPETITOR ANALYSIS API
 * ============================================================
 */

export const getCompetitors = async () => {

  const response = await fetch(
    `${API_BASE_URL}/competitors`
  );

  if (!response.ok) {

    throw new Error(
      `Competitor API failed with status ${response.status}`
    );

  }

  const data = await response.json();

  console.log(
    "Competitor API response:",
    data
  );

  return Array.isArray(data.competitors)
    ? data.competitors
    : [];

};
/*
 * ============================================================
 * REVENUE OPTIMIZATION API
 * ============================================================
 */

export const getRevenueOptimization = async () => {

  const response = await fetch(
    `${API_BASE_URL}/revenue-optimization`
  );

  if (!response.ok) {

    throw new Error(
      `Revenue Optimization API failed with status ${response.status}`
    );

  }

  const data = await response.json();

  console.log(
    "Revenue Optimization API response:",
    data
  );

  return data;

};
