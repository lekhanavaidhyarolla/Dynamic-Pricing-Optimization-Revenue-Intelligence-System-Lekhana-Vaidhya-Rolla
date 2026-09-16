// src/utils/pricingEngine.js

export function calculateAIPrice(product) {
  let recommendedPrice = Number(product.currentPrice);

  let confidence = 70;

  const reasons = [];

  // -------------------------
  // Demand Analysis
  // -------------------------
  switch (product.demand) {
    case "Very High":
      recommendedPrice *= 1.12;
      confidence += 10;
      reasons.push("Very high customer demand");
      break;

    case "High":
      recommendedPrice *= 1.08;
      confidence += 8;
      reasons.push("High customer demand");
      break;

    case "Moderate":
      recommendedPrice *= 1.00;
      confidence += 5;
      reasons.push("Stable market demand");
      break;

    default:
      recommendedPrice *= 0.95;
      confidence += 3;
      reasons.push("Low market demand");
  }

  // -------------------------
  // Stock Analysis
  // -------------------------
  if (product.stock < 30) {
    recommendedPrice *= 1.05;
    confidence += 5;
    reasons.push("Limited stock available");
  }

  if (product.stock > 120) {
    recommendedPrice *= 0.96;
    confidence += 3;
    reasons.push("Excess inventory");
  }

  // -------------------------
  // Competitor Analysis
  // -------------------------
  if (product.competitorPrice > recommendedPrice) {
    recommendedPrice *= 1.03;
    confidence += 4;
    reasons.push("Competitor price is higher");
  }

  if (product.competitorPrice < recommendedPrice) {
    recommendedPrice *= 0.98;
    confidence += 4;
    reasons.push("Competitor price is lower");
  }

  // -------------------------
  // Sales Trend Analysis
  // -------------------------
  if (product.sales > product.lastMonthSales) {
    recommendedPrice *= 1.03;
    confidence += 5;
    reasons.push("Sales are increasing");
  }

  if (product.sales < product.lastMonthSales) {
    recommendedPrice *= 0.97;
    confidence += 5;
    reasons.push("Sales are decreasing");
  }

  // -------------------------
  // Revenue Prediction
  // -------------------------
  const expectedRevenue =
    Math.round(recommendedPrice) * product.sales;

  const currentRevenue =
    product.currentPrice * product.sales;

  const revenueIncrease =
    expectedRevenue - currentRevenue;

  return {
    recommendedPrice: Math.round(recommendedPrice),
    confidence: Math.min(confidence, 99),
    reasons,
    expectedRevenue,
    revenueIncrease,
  };
}