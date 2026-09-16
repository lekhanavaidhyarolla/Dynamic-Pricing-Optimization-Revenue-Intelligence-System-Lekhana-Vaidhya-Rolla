const API_BASE_URL = "http://127.0.0.1:8001";

export const getAIPricePrediction = async (product) => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPrice: Number(
        product.currentPrice ?? product.price ?? 0
      ),

      competitorPrice: Number(
        product.competitorPrice ?? 0
      ),

      stock: Number(
        product.stock ?? 0
      ),

      sales: Number(
        product.sales ?? 0
      ),

      lastMonthSales: Number(
        product.lastMonthSales ?? 0
      ),

      demand: product.demand ?? "Moderate",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Prediction API failed with status ${response.status}`
    );
  }

  return await response.json();
};