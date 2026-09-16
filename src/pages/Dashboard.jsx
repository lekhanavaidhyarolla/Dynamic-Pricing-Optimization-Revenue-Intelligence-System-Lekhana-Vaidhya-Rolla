import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { getProducts } from "../utils/productStorage";

import "./Dashboard.css";


function Dashboard() {

  const navigate = useNavigate();

  const [
    products,
    setProducts,
  ] = useState([]);


  /*
  ==========================================
  LOAD PRODUCTS
  ==========================================
  */

  const loadProducts = () => {

    try {

      const storedProducts =
        getProducts();

      setProducts(
        Array.isArray(
          storedProducts
        )
          ? storedProducts
          : []
      );

    } catch (error) {

      console.error(
        "Error loading dashboard products:",
        error
      );

      setProducts([]);

    }

  };


  /*
  ==========================================
  INITIAL LOAD
  ==========================================
  */

  useEffect(() => {

    loadProducts();

  }, []);


  /*
  ==========================================
  REFRESH DASHBOARD WHEN USER RETURNS
  ==========================================
  */

  useEffect(() => {

    const handleFocus = () => {

      loadProducts();

    };


    const handleStorageChange = () => {

      loadProducts();

    };


    window.addEventListener(
      "focus",
      handleFocus
    );


    window.addEventListener(
      "storage",
      handleStorageChange
    );


    return () => {

      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

    };

  }, []);


  /*
  ==========================================
  PRICE HELPERS
  ==========================================
  */

  const getCurrentPrice = (
    product
  ) => {

    return Number(
      product.price ??
      product.currentPrice ??
      0
    );

  };


  const getRecommendedPrice = (
    product
  ) => {

    return Number(
      product.recommendedPrice ??
      getCurrentPrice(product)
    );

  };


  /*
  ==========================================
  DYNAMIC KPI CALCULATIONS
  ==========================================
  */

  const totalProducts =
    products.length;


  const averagePrice =
    totalProducts > 0
      ? products.reduce(
          (
            total,
            product
          ) =>
            total +
            getCurrentPrice(
              product
            ),
          0
        ) /
        totalProducts
      : 0;


  const currentCatalogValue =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        getCurrentPrice(
          product
        ),
      0
    );


  const recommendedCatalogValue =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        getRecommendedPrice(
          product
        ),
      0
    );


  const revenueOpportunity =
    recommendedCatalogValue -
    currentCatalogValue;


  const priceIncrease =
    products.filter(
      (product) =>
        getRecommendedPrice(
          product
        ) >
        getCurrentPrice(
          product
        )
    ).length;


  const priceDecrease =
    products.filter(
      (product) =>
        getRecommendedPrice(
          product
        ) <
        getCurrentPrice(
          product
        )
    ).length;


  const aiRecommendations =
    products.filter(
      (product) =>
        getRecommendedPrice(
          product
        ) !==
        getCurrentPrice(
          product
        )
    ).length;


  const highDemandProducts =
    products.filter(
      (product) => {

        const demand =
          (
            product.demand ||
            ""
          ).toLowerCase();

        return (
          demand.includes(
            "high"
          )
        );

      }
    ).length;


  /*
  ==========================================
  DEMAND DISTRIBUTION
  ==========================================
  */

  const demandData =
    useMemo(() => {

      const demandLevels = [
        "Very High Demand",
        "High Demand",
        "Moderate Demand",
        "Low Demand",
      ];


      return demandLevels.map(
        (level) => ({

          name: level,

          value:
            products.filter(
              (product) =>
                (
                  product.demand ||
                  "Moderate Demand"
                ) === level
            ).length,

        })
      );

    }, [products]);


  /*
  ==========================================
  PRICE COMPARISON DATA
  ==========================================
  */

  const priceComparisonData =
    useMemo(() => {

      return products
        .map(
          (product) => ({

            name:
              product.name ||
              "Unnamed Product",

            Current:
              getCurrentPrice(
                product
              ),

            Recommended:
              getRecommendedPrice(
                product
              ),

          })
        )
        .slice(
          0,
          8
        );

    }, [products]);


  /*
  ==========================================
  PRICING OPPORTUNITY DATA
  ==========================================
  */

  const pricingOpportunities =
    useMemo(() => {

      return products
        .map(
          (product) => {

            const current =
              getCurrentPrice(
                product
              );


            const recommended =
              getRecommendedPrice(
                product
              );


            const change =
              current > 0
                ? (
                    (
                      recommended -
                      current
                    ) /
                    current
                  ) *
                  100
                : 0;


            let type =
              "Stable";


            if (
              change > 0
            ) {

              type =
                "Increase";

            } else if (
              change < 0
            ) {

              type =
                "Decrease";

            }


            return {

              id:
                product.id,

              name:
                product.name ||
                "Unnamed Product",

              current,

              recommended,

              change,

              type,

              demand:
                product.demand ||
                "Moderate Demand",

            };

          }
        )
        .filter(
          (item) =>
            item.type !==
            "Stable"
        )
        .sort(
          (
            a,
            b
          ) =>
            Math.abs(
              b.change
            ) -
            Math.abs(
              a.change
            )
        )
        .slice(
          0,
          5
        );

    }, [products]);


  /*
  ==========================================
  PRODUCTS REQUIRING ATTENTION
  ==========================================
  */

  const attentionProducts =
    useMemo(() => {

      return products
        .map(
          (product) => {

            const current =
              getCurrentPrice(
                product
              );


            const recommended =
              getRecommendedPrice(
                product
              );


            const change =
              current > 0
                ? (
                    (
                      recommended -
                      current
                    ) /
                    current
                  ) *
                  100
                : 0;


            const demand =
              (
                product.demand ||
                ""
              ).toLowerCase();


            let priority =
              0;


            if (
              demand.includes(
                "very high"
              )
            ) {

              priority += 3;

            } else if (
              demand.includes(
                "high"
              )
            ) {

              priority += 2;

            }


            if (
              Math.abs(
                change
              ) >= 5
            ) {

              priority += 3;

            }


            if (
              Math.abs(
                change
              ) >= 8
            ) {

              priority += 2;

            }


            return {

              ...product,

              current,

              recommended,

              change,

              priority,

            };

          }
        )
        .filter(
          (product) =>
            product.priority >
            0
        )
        .sort(
          (
            a,
            b
          ) =>
            b.priority -
            a.priority
        )
        .slice(
          0,
          4
        );

    }, [products]);


  /*
  ==========================================
  AI INSIGHTS
  ==========================================
  */

  const aiInsights =
    useMemo(() => {

      const insights = [];


      if (
        totalProducts === 0
      ) {

        return [

          {
            icon: "📦",

            title:
              "Add Products",

            text:
              "Add products to your catalog to unlock pricing intelligence and dashboard insights.",

          },

        ];

      }


      if (
        priceIncrease > 0
      ) {

        insights.push({

          icon: "📈",

          title:
            "Price Increase Opportunity",

          text:
            `${priceIncrease} product${
              priceIncrease > 1
                ? "s"
                : ""
            } have a higher recommended price than the current price.`,

        });

      }


      if (
        priceDecrease > 0
      ) {

        insights.push({

          icon: "📉",

          title:
            "Price Reduction Opportunity",

          text:
            `${priceDecrease} product${
              priceDecrease > 1
                ? "s"
                : ""
            } have a lower recommended price based on the current pricing analysis.`,

        });

      }


      if (
        highDemandProducts > 0
      ) {

        insights.push({

          icon: "🔥",

          title:
            "Strong Demand Detected",

          text:
            `${highDemandProducts} product${
              highDemandProducts > 1
                ? "s"
                : ""
            } currently show high or very high demand.`,

        });

      }


      if (
        revenueOpportunity >
        0
      ) {

        insights.push({

          icon: "💰",

          title:
            "Revenue Opportunity",

          text:
            `The current recommended catalog value is approximately ₹${revenueOpportunity.toLocaleString(
              "en-IN"
            )} higher than the current catalog value.`,

        });

      }


      if (
        insights.length ===
        0
      ) {

        insights.push({

          icon: "🤖",

          title:
            "Pricing Stable",

          text:
            "Current product prices are aligned with their recommended prices. Continue monitoring demand and market conditions.",

        });

      }


      return insights.slice(
        0,
        4
      );

    }, [

      totalProducts,

      priceIncrease,

      priceDecrease,

      highDemandProducts,

      revenueOpportunity,

    ]);


  /*
  ==========================================
  FORMAT CURRENCY
  ==========================================
  */

  const formatCurrency = (
    value
  ) => {

    return `₹${Number(
      value
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    )}`;

  };


  /*
  ==========================================
  EMPTY DASHBOARD
  ==========================================
  */

  if (
    totalProducts === 0
  ) {

    return (

      <DashboardLayout>

        <div className="page-container pricepilot-dashboard">

          <section className="dashboard-hero dashboard-empty-hero">

            <div className="dashboard-hero-glow"></div>

            <div className="dashboard-hero-content">

              <div className="dashboard-ai-badge">
                <span className="dashboard-ai-spark">✦</span>
                AI-POWERED PRICING INTELLIGENCE
              </div>

              <p className="section-label">
                OVERVIEW
              </p>

              <h1>
                PricePilot AI Dashboard
              </h1>

              <p className="page-subtitle">
                Welcome to your intelligent pricing and revenue intelligence workspace.
              </p>

            </div>

          </section>


          <section className="dashboard-empty-card">

            <div className="dashboard-empty-orbit">

              <div className="dashboard-empty-icon">
                📦
              </div>

            </div>

            <span className="dashboard-badge">
              GET STARTED
            </span>

            <h3>
              Your Pricing Intelligence Starts Here
            </h3>

            <p>
              Add products to your catalog and let PricePilot AI analyze pricing, demand signals, and revenue opportunities.
            </p>

            <button
              className="primary-btn dashboard-main-action"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
            >
              Add Your First Product
              <span>→</span>
            </button>

          </section>

        </div>

      </DashboardLayout>

    );

  }


  /*
  ==========================================
  MAIN DASHBOARD
  ==========================================
  */

  return (

    <DashboardLayout>

      <div className="page-container pricepilot-dashboard">


        {/* ==========================================
            PREMIUM HERO
        ========================================== */}

        <section className="dashboard-hero">

          <div className="dashboard-hero-grid"></div>

          <div className="dashboard-hero-glow dashboard-glow-one"></div>

          <div className="dashboard-hero-glow dashboard-glow-two"></div>

          <div className="dashboard-hero-content">

            <div className="dashboard-ai-badge">
              <span className="dashboard-ai-spark">
                ✦
              </span>

              AI-POWERED PRICING INTELLIGENCE

              <span className="dashboard-live-pill">
                LIVE
              </span>

            </div>

            <p className="section-label">
              EXECUTIVE OVERVIEW
            </p>

            <h1>
              PricePilot AI Dashboard
            </h1>

            <p className="page-subtitle">
              Monitor your catalog, understand demand signals, discover pricing opportunities, and make smarter revenue decisions with AI-powered intelligence.
            </p>

            <div className="dashboard-hero-meta">

              <div className="dashboard-meta-item">

                <span className="dashboard-meta-icon">
                  ✦
                </span>

                <span>
                  AI pricing engine analyzing catalog
                </span>

              </div>

              <div className="dashboard-meta-item">

                <span className="dashboard-meta-icon">
                  ◉
                </span>

                <span>
                  Real-time product insights
                </span>

              </div>

            </div>

          </div>


          <div className="dashboard-hero-status">

            <div className="dashboard-status-pulse">

              <span className="status-dot"></span>

            </div>

            <div>

              <strong>
                Intelligence System Active
              </strong>

              <span>
                Analyzing your product catalog
              </span>

            </div>

          </div>

        </section>


        {/* ==========================================
            KPI OVERVIEW
        ========================================== */}

        <section className="dashboard-kpi-section">

          <div className="dashboard-section-intro">

            <div>

              <span className="dashboard-section-kicker">
                BUSINESS OVERVIEW
              </span>

              <h2>
                Your pricing performance at a glance
              </h2>

              <p>
                A real-time snapshot of your catalog, pricing opportunities, demand, and revenue potential.
              </p>

            </div>

            <div className="dashboard-overview-chip">
              <span>●</span>
              LIVE CATALOG DATA
            </div>

          </div>


          <div className="dashboard-kpi-grid">


            {/* TOTAL PRODUCTS */}

            <div className="dashboard-kpi-card dashboard-kpi-purple">

              <div className="dashboard-kpi-top">

                <div className="dashboard-kpi-icon purple-icon">
                  📦
                </div>

                <span className="dashboard-kpi-label">
                  CATALOG
                </span>

              </div>

              <div className="dashboard-kpi-value">
                {totalProducts}
              </div>

              <div className="dashboard-kpi-description">
                Total Products
              </div>

              <div className="dashboard-kpi-footer">
                Products currently in catalog
              </div>

              <div className="dashboard-card-accent"></div>

            </div>


            {/* AVERAGE PRICE */}

            <div className="dashboard-kpi-card dashboard-kpi-blue">

              <div className="dashboard-kpi-top">

                <div className="dashboard-kpi-icon blue-icon">
                  ₹
                </div>

                <span className="dashboard-kpi-label">
                  PRICING
                </span>

              </div>

              <div className="dashboard-kpi-value">
                {formatCurrency(
                  averagePrice
                )}
              </div>

              <div className="dashboard-kpi-description">
                Average Product Price
              </div>

              <div className="dashboard-kpi-footer">
                Current catalog average
              </div>

              <div className="dashboard-card-accent"></div>

            </div>


            {/* REVENUE OPPORTUNITY */}

            <div className="dashboard-kpi-card dashboard-kpi-highlight">

              <div className="dashboard-kpi-top">

                <div className="dashboard-kpi-icon green-icon">
                  💰
                </div>

                <span className="dashboard-kpi-label">
                  OPPORTUNITY
                </span>

              </div>

              <div
                className={
                  revenueOpportunity >= 0
                    ? "dashboard-kpi-value positive-number"
                    : "dashboard-kpi-value negative-number"
                }
              >
                {formatCurrency(
                  Math.abs(
                    revenueOpportunity
                  )
                )}
              </div>

              <div className="dashboard-kpi-description">
                Revenue Opportunity
              </div>

              <div className="dashboard-kpi-footer">
                Estimated pricing impact
              </div>

              <div className="dashboard-card-accent"></div>

            </div>


            {/* AI RECOMMENDATIONS */}

            <div className="dashboard-kpi-card dashboard-ai-kpi">

              <div className="dashboard-kpi-top">

                <div className="dashboard-kpi-icon ai-icon">
                  ✦
                </div>

                <span className="dashboard-kpi-label">
                  AI ENGINE
                </span>

              </div>

              <div className="dashboard-kpi-value">
                {aiRecommendations}
              </div>

              <div className="dashboard-kpi-description">
                AI Recommendations
              </div>

              <div className="dashboard-kpi-footer">
                Products requiring pricing review
              </div>

              <div className="dashboard-card-accent"></div>

            </div>


            {/* PRICE INCREASE */}

            <div className="dashboard-mini-kpi positive-kpi">

              <div className="dashboard-mini-icon">
                ↑
              </div>

              <div>

                <strong>
                  {priceIncrease}
                </strong>

                <span>
                  Price Increase Opportunities
                </span>

              </div>

              <div className="dashboard-mini-arrow">
                ↗
              </div>

            </div>


            {/* PRICE DECREASE */}

            <div className="dashboard-mini-kpi negative-kpi">

              <div className="dashboard-mini-icon">
                ↓
              </div>

              <div>

                <strong>
                  {priceDecrease}
                </strong>

                <span>
                  Price Decrease Opportunities
                </span>

              </div>

              <div className="dashboard-mini-arrow">
                ↘
              </div>

            </div>


            {/* HIGH DEMAND */}

            <div className="dashboard-mini-kpi demand-kpi">

              <div className="dashboard-mini-icon">
                🔥
              </div>

              <div>

                <strong>
                  {highDemandProducts}
                </strong>

                <span>
                  High Demand Products
                </span>

              </div>

              <div className="dashboard-mini-arrow">
                ↗
              </div>

            </div>


            {/* CATALOG VALUE */}

            <div className="dashboard-mini-kpi value-kpi">

              <div className="dashboard-mini-icon">
                💎
              </div>

              <div>

                <strong>
                  {formatCurrency(
                    currentCatalogValue
                  )}
                </strong>

                <span>
                  Current Catalog Value
                </span>

              </div>

              <div className="dashboard-mini-arrow">
                →
              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            PRICE COMPARISON ANALYTICS
        ========================================== */}

        <section className="dashboard-panel dashboard-main-analytics">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-section-kicker">
                PRICING INTELLIGENCE
              </span>

              <h2>
                Current Price vs AI Recommended Price
              </h2>

              <p>
                Compare current product pricing with intelligent recommendations generated from your pricing data.
              </p>

            </div>

            <div className="dashboard-header-badge">
              <span>✦</span>
              AI ANALYSIS
            </div>

          </div>


          <div className="dashboard-chart-container dashboard-main-chart">

            {priceComparisonData.length >
            0 ? (

              <ResponsiveContainer
                width="100%"
                height={380}
              >

                <BarChart
                  data={
                    priceComparisonData
                  }
                  margin={{
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 20,
                  }}
                  barGap={8}
                >

                  <CartesianGrid
                    strokeDasharray="4 6"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 12,
                      fill: "#64748b",
                      fontWeight: 500,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: "#64748b",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    formatter={(
                      value
                    ) =>
                      formatCurrency(
                        value
                      )
                    }
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow:
                        "0 20px 50px rgba(15, 23, 42, 0.15)",
                      background:
                        "rgba(255,255,255,0.98)",
                      padding: "12px 16px",
                    }}
                    cursor={{
                      fill:
                        "rgba(124,58,237,0.04)",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      paddingTop: "18px",
                      fontSize: "13px",
                    }}
                  />

                  <Bar
                    dataKey="Current"
                    name="Current Price"
                    fill="#94a3b8"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                    maxBarSize={42}
                  />

                  <Bar
                    dataKey="Recommended"
                    name="AI Recommended Price"
                    fill="#7c3aed"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                    maxBarSize={42}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="empty-state">

                <h3>
                  No Pricing Data Available
                </h3>

              </div>

            )}

          </div>

        </section>


        {/* ==========================================
            DEMAND + AI INSIGHTS
        ========================================== */}

        <div className="dashboard-two-column">


          {/* DEMAND DISTRIBUTION */}

          <section className="dashboard-panel">

            <div className="dashboard-section-header compact">

              <div>

                <span className="dashboard-section-kicker">
                  DEMAND INTELLIGENCE
                </span>

                <h2>
                  Demand Distribution
                </h2>

                <p>
                  Current demand levels across your product catalog.
                </p>

              </div>

              <div className="dashboard-panel-icon dashboard-fire-icon">
                🔥
              </div>

            </div>


            <div className="dashboard-chart-container dashboard-demand-chart">

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={
                      demandData
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={105}
                    innerRadius={58}
                    paddingAngle={4}
                    label
                  >

                    {demandData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={
                            `cell-${index}`
                          }
                          fill={
                            [
                              "#6d28d9",
                              "#7c3aed",
                              "#a78bfa",
                              "#c4b5fd",
                            ][
                              index %
                              4
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "14px",
                      border:
                        "1px solid #e2e8f0",
                      boxShadow:
                        "0 15px 40px rgba(15,23,42,0.12)",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </section>


          {/* AI INSIGHTS */}

          <section className="dashboard-panel dashboard-ai-panel">

            <div className="dashboard-section-header compact">

              <div>

                <span className="dashboard-section-kicker ai-kicker">
                  AI INTELLIGENCE
                </span>

                <h2>
                  AI Pricing Insights
                </h2>

                <p>
                  Intelligent signals generated from your current product and pricing data.
                </p>

              </div>

              <div className="dashboard-ai-symbol">
                ✦
              </div>

            </div>


            <div className="dashboard-ai-insights-list">

              {aiInsights.map(
                (
                  insight,
                  index
                ) => (

                  <div
                    className="dashboard-insight-card"
                    key={
                      index
                    }
                  >

                    <div className="dashboard-insight-icon">
                      {
                        insight.icon
                      }
                    </div>

                    <div className="dashboard-insight-content">

                      <div className="dashboard-insight-heading">

                        <h3>
                          {
                            insight.title
                          }
                        </h3>

                        <span className="dashboard-insight-badge">
                          AI INSIGHT
                        </span>

                      </div>

                      <p>
                        {
                          insight.text
                        }
                      </p>

                    </div>

                    <span className="dashboard-insight-arrow">
                      →
                    </span>

                  </div>

                )
              )}

            </div>

          </section>

        </div>


        {/* ==========================================
            PRICING OPPORTUNITIES
        ========================================== */}

        <section className="dashboard-panel dashboard-opportunity-panel">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-section-kicker">
                REVENUE INTELLIGENCE
              </span>

              <h2>
                Top Pricing Opportunities
              </h2>

              <p>
                Products with the largest recommended pricing changes identified by the AI pricing engine.
              </p>

            </div>

            <button
              className="secondary-btn dashboard-header-action"
              onClick={() =>
                navigate(
                  "/pricing"
                )
              }
            >
              View Full Pricing Analysis
              <span>→</span>
            </button>

          </div>


          {pricingOpportunities.length ===
          0 ? (

            <div className="empty-state dashboard-section-empty">

              <div className="empty-icon">
                📊
              </div>

              <h3>
                No Pricing Opportunities
              </h3>

              <p>
                Your current prices are aligned with the recommended prices.
              </p>

            </div>

          ) : (

            <div className="table-wrapper dashboard-table-wrapper">

              <table className="data-table dashboard-professional-table">

                <thead>

                  <tr>

                    <th>
                      Product
                    </th>

                    <th>
                      Current Price
                    </th>

                    <th>
                      Recommended Price
                    </th>

                    <th>
                      Change
                    </th>

                    <th>
                      Demand
                    </th>

                    <th>
                      Recommendation
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {pricingOpportunities.map(
                    (
                      item
                    ) => (

                      <tr
                        key={
                          item.id
                        }
                      >

                        <td>

                          <div className="dashboard-product-cell">

                            <div className="dashboard-product-avatar">
                              {(
                                item.name ||
                                "P"
                              ).charAt(0).toUpperCase()}
                            </div>

                            <strong>
                              {
                                item.name
                              }
                            </strong>

                          </div>

                        </td>


                        <td>
                          {
                            formatCurrency(
                              item.current
                            )
                          }
                        </td>


                        <td>

                          <strong className="dashboard-recommended-price">
                            {
                              formatCurrency(
                                item.recommended
                              )
                            }
                          </strong>

                        </td>


                        <td>

                          <span
                            className={
                              item.change >
                              0
                                ? "price-change positive dashboard-change-badge"
                                : "price-change negative dashboard-change-badge"
                            }
                          >

                            {item.change >
                            0
                              ? "↑ "
                              : "↓ "}

                            {Math.abs(
                              item.change
                            ).toFixed(
                              1
                            )}

                            %

                          </span>

                        </td>


                        <td>

                          <span className="dashboard-demand-badge">

                            {
                              item.demand
                            }

                          </span>

                        </td>


                        <td>

                          <span
                            className={
                              item.type ===
                              "Increase"
                                ? "dashboard-status-badge increase-status"
                                : "dashboard-status-badge decrease-status"
                            }
                          >

                            {item.type ===
                            "Increase"
                              ? "↑ Increase"
                              : "↓ Decrease"}

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* ==========================================
            PRODUCTS REQUIRING ATTENTION
        ========================================== */}

        <section className="dashboard-panel dashboard-attention-panel">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-section-kicker attention-kicker">
                ACTION REQUIRED
              </span>

              <h2>
                Products Requiring Attention
              </h2>

              <p>
                Products identified using demand levels and pricing opportunity signals.
              </p>

            </div>

            <div className="dashboard-attention-badge">
              ⚠️ REVIEW
            </div>

          </div>


          {attentionProducts.length ===
          0 ? (

            <div className="empty-state dashboard-section-empty">

              <div className="empty-icon">
                ✅
              </div>

              <h3>
                No Immediate Attention Required
              </h3>

              <p>
                No products currently meet the attention criteria.
              </p>

            </div>

          ) : (

            <div className="dashboard-attention-grid">

              {attentionProducts.map(
                (
                  product
                ) => (

                  <div
                    className="dashboard-attention-card"
                    key={
                      product.id
                    }
                  >

                    <div className="dashboard-attention-card-top">

                      <div className="dashboard-product-avatar attention-avatar">
                        {(
                          product.name ||
                          "P"
                        ).charAt(0).toUpperCase()}
                      </div>

                      <div>

                        <h3>
                          {
                            product.name
                          }
                        </h3>

                        <span className="dashboard-demand-badge">
                          {
                            product.demand
                          }
                        </span>

                      </div>

                    </div>


                    <div className="dashboard-price-comparison">

                      <div>

                        <small>
                          Current Price
                        </small>

                        <strong>
                          {
                            formatCurrency(
                              product.current
                            )
                          }
                        </strong>

                      </div>


                      <div className="dashboard-price-arrow">
                        →
                      </div>


                      <div>

                        <small>
                          AI Recommended
                        </small>

                        <strong className="ai-price">
                          {
                            formatCurrency(
                              product.recommended
                            )
                          }
                        </strong>

                      </div>

                    </div>


                    <div
                      className={
                        product.change >
                        0
                          ? "price-change positive dashboard-attention-change"
                          : "price-change negative dashboard-attention-change"
                      }
                    >

                      {product.change >
                      0
                        ? "↑ "
                        : "↓ "}

                      {Math.abs(
                        product.change
                      ).toFixed(
                        1
                      )}

                      %

                      <span>
                        Recommended Price Change
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}

        <section className="dashboard-actions-panel">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-section-kicker">
                TAKE ACTION
              </span>

              <h2>
                Quick Actions
              </h2>

              <p>
                Access the key PricePilot AI intelligence modules.
              </p>

            </div>

          </div>


          <div className="dashboard-action-grid">


            {/* PRODUCTS */}

            <button
              className="dashboard-action-card"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
            >

              <div className="dashboard-action-icon">
                📦
              </div>

              <div className="dashboard-action-content">

                <strong>
                  Add / Manage Products
                </strong>

                <span>
                  Manage your product catalog
                </span>

              </div>

              <span className="dashboard-action-arrow">
                →
              </span>

            </button>


            {/* AI PRICING */}

            <button
              className="dashboard-action-card ai-action"
              onClick={() =>
                navigate(
                  "/pricing"
                )
              }
            >

              <div className="dashboard-action-icon">
                ✦
              </div>

              <div className="dashboard-action-content">

                <strong>
                  Run AI Pricing Analysis
                </strong>

                <span>
                  Review intelligent pricing recommendations
                </span>

              </div>

              <span className="dashboard-action-arrow">
                →
              </span>

            </button>


            {/* DEMAND */}

            <button
              className="dashboard-action-card"
              onClick={() =>
                navigate(
                  "/demand-forecast"
                )
              }
            >

              <div className="dashboard-action-icon">
                📊
              </div>

              <div className="dashboard-action-content">

                <strong>
                  View Demand Forecast
                </strong>

                <span>
                  Explore demand intelligence
                </span>

              </div>

              <span className="dashboard-action-arrow">
                →
              </span>

            </button>


            {/* COMPETITORS */}

            <button
              className="dashboard-action-card"
              onClick={() =>
                navigate(
                  "/competitors"
                )
              }
            >

              <div className="dashboard-action-icon">
                🎯
              </div>

              <div className="dashboard-action-content">

                <strong>
                  Competitor Intelligence
                </strong>

                <span>
                  Explore competitor pricing insights
                </span>

              </div>

              <span className="dashboard-action-arrow">
                →
              </span>

            </button>


            {/* REVENUE */}

            <button
              className="dashboard-action-card"
              onClick={() =>
                navigate(
                  "/revenue"
                )
              }
            >

              <div className="dashboard-action-icon">
                💰
              </div>

              <div className="dashboard-action-content">

                <strong>
                  Revenue Analytics
                </strong>

                <span>
                  Explore revenue intelligence
                </span>

              </div>

              <span className="dashboard-action-arrow">
                →
              </span>

            </button>

          </div>

        </section>

      </div>

    </DashboardLayout>

  );

}


export default Dashboard;