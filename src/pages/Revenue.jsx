import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  getRevenueOptimization,
} from "../utils/api";


function Revenue() {

  const [
    revenueOptimization,
    setRevenueOptimization
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    loadRevenueOptimization();

  }, []);


  const loadRevenueOptimization = async () => {

    try {

      setLoading(true);

      setError("");

      const data =
        await getRevenueOptimization();

      setRevenueOptimization(data);

      console.log(
        "Revenue Optimization data:",
        data
      );

    } catch (error) {

      console.error(
        "Error loading revenue optimization:",
        error
      );

      setError(
        "Unable to load revenue optimization data."
      );

      setRevenueOptimization(null);

    } finally {

      setLoading(false);

    }

  };


  const products =
    revenueOptimization?.products || [];


  const currentRevenue =
    Number(
      revenueOptimization?.current_revenue || 0
    );


  const recommendedRevenue =
    Number(
      revenueOptimization?.recommended_revenue || 0
    );


  const revenueOpportunity =
    Number(
      revenueOptimization?.revenue_opportunity || 0
    );


  const currentProfit =
    Number(
      revenueOptimization?.current_profit || 0
    );


  const recommendedProfit =
    Number(
      revenueOptimization?.recommended_profit || 0
    );


  const profitOpportunity =
    Number(
      revenueOptimization?.profit_opportunity || 0
    );


  const productsToOptimize =
    useMemo(() => {

      return products.filter(

        product =>

          product.price_recommendation

      );

    }, [
      products
    ]);


  const revenueData =
    useMemo(() => {

      return products.map(

        product => ({

          name:
            product.product_name,

          current:
            Number(
              product.current_revenue || 0
            ),

          recommended:
            Number(
              product.recommended_revenue || 0
            ),

        })

      );

    }, [
      products
    ]);


  const formatCurrency = (value) => {

    return `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    )}`;

  };


  const formatLakhs = (value) => {

    const number =
      Number(value || 0);

    if (number >= 10000000) {

      return `₹${(
        number / 10000000
      ).toFixed(2)}Cr`;

    }

    if (number >= 100000) {

      return `₹${(
        number / 100000
      ).toFixed(2)}L`;

    }

    if (number >= 1000) {

      return `₹${(
        number / 1000
      ).toFixed(1)}K`;

    }

    return `₹${number.toLocaleString(
      "en-IN"
    )}`;

  };


  if (loading) {

    return (

      <DashboardLayout>

        <div className="page-container">

          <div className="page-header">

            <div>

              <p className="section-label">
                REVENUE INTELLIGENCE
              </p>

              <h1>
                Revenue Analytics
              </h1>

              <p className="page-subtitle">
                Monitor revenue performance and
                identify AI-powered growth
                opportunities.
              </p>

            </div>

          </div>


          <div className="chart-card">

            <div className="empty-state">

              <h3>
                Loading Revenue Analytics...
              </h3>

              <p>
                Fetching AI revenue optimization data.
              </p>

            </div>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  if (error) {

    return (

      <DashboardLayout>

        <div className="page-container">

          <div className="page-header">

            <div>

              <p className="section-label">
                REVENUE INTELLIGENCE
              </p>

              <h1>
                Revenue Analytics
              </h1>

              <p className="page-subtitle">
                Monitor revenue performance and
                identify AI-powered growth
                opportunities.
              </p>

            </div>

          </div>


          <div className="chart-card">

            <div className="empty-state">

              <h3>
                Revenue Data Unavailable
              </h3>

              <p>
                {error}
              </p>

            </div>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  return (

    <DashboardLayout>

      <div className="page-container">

        <div className="page-header">

          <div>

            <p className="section-label">
              REVENUE INTELLIGENCE
            </p>

            <h1>
              Revenue Analytics
            </h1>

            <p className="page-subtitle">
              Monitor revenue performance and
              identify AI-powered growth
              opportunities.
            </p>

          </div>

        </div>


        <div className="stats-grid">

          <div className="stat-card">

            <span>
              Current Product Value
            </span>

            <h2>
              {formatLakhs(
                currentRevenue
              )}
            </h2>

            <small>
              Current catalog revenue
            </small>

          </div>


          <div className="stat-card">

            <span>
              Recommended Value
            </span>

            <h2>
              {formatLakhs(
                recommendedRevenue
              )}
            </h2>

            <small>
              AI optimized revenue
            </small>

          </div>


          <div className="stat-card">

            <span>
              Revenue Opportunity
            </span>

            <h2 className="positive-number">

              +{formatLakhs(
                revenueOpportunity
              )}

            </h2>

            <small>
              Potential additional revenue
            </small>

          </div>


          <div className="stat-card">

            <span>
              Products to Optimize
            </span>

            <h2>
              {productsToOptimize.length}
            </h2>

            <small>
              AI recommendations available
            </small>

          </div>

        </div>


        <div className="chart-card">

          <h2>
            Revenue Performance
          </h2>

          <p className="page-subtitle">
            Current revenue compared with
            AI-optimized revenue potential.
          </p>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <LineChart
                data={revenueData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(value)
                  }
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="current"
                  name="Current Revenue"
                  stroke="#64748b"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="recommended"
                  name="Recommended Revenue"
                  stroke="#7c3aed"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        <div className="insights-grid">

          <div className="insight-card">

            <div className="insight-icon">
              📈
            </div>

            <div>

              <h3>
                Revenue Opportunity
              </h3>

              <p>

                AI analysis identifies
                approximately{" "}

                <strong>
                  {formatCurrency(
                    revenueOpportunity
                  )}
                </strong>

                {" "}in potential additional
                revenue through optimized
                pricing.

              </p>

            </div>

          </div>


          <div className="insight-card">

            <div className="insight-icon">
              🤖
            </div>

            <div>

              <h3>
                AI Recommendation
              </h3>

              <p>

                AI pricing optimization
                identifies{" "}

                <strong>
                  {productsToOptimize.length}
                </strong>

                {" "}products with pricing
                recommendations. The current
                profit opportunity is{" "}

                <strong>
                  {formatCurrency(
                    profitOpportunity
                  )}
                </strong>

                .

              </p>

            </div>

          </div>

        </div>


        <div className="chart-card">

          <h2>
            Profitability Overview
          </h2>

          <p className="page-subtitle">
            Current profit compared with
            AI-optimized profit potential.
          </p>


          <div className="stats-grid">

            <div className="stat-card">

              <span>
                Current Profit
              </span>

              <h2>
                {formatLakhs(
                  currentProfit
                )}
              </h2>

            </div>


            <div className="stat-card">

              <span>
                Recommended Profit
              </span>

              <h2>
                {formatLakhs(
                  recommendedProfit
                )}
              </h2>

            </div>


            <div className="stat-card">

              <span>
                Profit Opportunity
              </span>

              <h2 className="positive-number">

                +{formatLakhs(
                  profitOpportunity
                )}

              </h2>

            </div>

          </div>

        </div>


        <div className="chart-card">

          <h2>
            Pricing Strategy Recommendations
          </h2>

          <p className="page-subtitle">
            AI-generated pricing recommendations
            based on revenue and profitability
            optimization.
          </p>


          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Current Price
                  </th>

                  <th>
                    AI Recommended Price
                  </th>

                  <th>
                    Revenue Opportunity
                  </th>

                  <th>
                    Profit Opportunity
                  </th>

                  <th>
                    Strategy
                  </th>

                </tr>

              </thead>


              <tbody>

                {products.map(
                  (product) => (

                    <tr
                      key={
                        product.product_id
                      }
                    >

                      <td>

                        <strong>
                          {
                            product.product_name
                          }
                        </strong>

                      </td>


                      <td>

                        {formatCurrency(
                          product.current_price
                        )}

                      </td>


                      <td>

                        {formatCurrency(
                          product.recommended_price
                        )}

                      </td>


                      <td>

                        {formatCurrency(
                          product.revenue_opportunity
                        )}

                      </td>


                      <td>

                        {formatCurrency(
                          product.profit_opportunity
                        )}

                      </td>


                      <td>

                        <span className="status-badge">

                          {
                            product.price_recommendation ||
                            "No Recommendation"
                          }

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ============================================================
            EXECUTIVE BUSINESS INTELLIGENCE
        ============================================================ */}

        <div className="chart-card">

          <h2>
            Executive Business Intelligence
          </h2>

          <p className="page-subtitle">
            AI-generated summary of revenue, profitability,
            pricing opportunities, and recommended actions.
          </p>


          <div className="insights-grid">

            <div className="insight-card">

              <div className="insight-icon">
                📊
              </div>

              <div>

                <h3>
                  Revenue Performance
                </h3>

                <p>

                  Current revenue is{" "}

                  <strong>
                    {formatCurrency(
                      currentRevenue
                    )}
                  </strong>

                  {" "}with an AI-optimized potential of{" "}

                  <strong>
                    {formatCurrency(
                      recommendedRevenue
                    )}
                  </strong>

                  . This represents an additional revenue
                  opportunity of{" "}

                  <strong>
                    {formatCurrency(
                      revenueOpportunity
                    )}
                  </strong>

                  .

                </p>

              </div>

            </div>


            <div className="insight-card">

              <div className="insight-icon">
                💰
              </div>

              <div>

                <h3>
                  Profitability
                </h3>

                <p>

                  Current profit is{" "}

                  <strong>
                    {formatCurrency(
                      currentProfit
                    )}
                  </strong>

                  {" "}and could increase to{" "}

                  <strong>
                    {formatCurrency(
                      recommendedProfit
                    )}
                  </strong>

                  {" "}with the recommended pricing strategy.

                </p>

              </div>

            </div>


            <div className="insight-card">

              <div className="insight-icon">
                🎯
              </div>

              <div>

                <h3>
                  Pricing Actions
                </h3>

                <p>

                  AI recommendations are available
                  for{" "}

                  <strong>
                    {productsToOptimize.length}
                  </strong>

                  {" "}products. These recommendations
                  should be reviewed before applying
                  pricing changes.

                </p>

              </div>

            </div>


            <div className="insight-card">

              <div className="insight-icon">
                🤖
              </div>

              <div>

                <h3>
                  Management Recommendation
                </h3>

                <p>

                  Prioritize products with the highest
                  revenue and profit opportunities while
                  monitoring competitor pricing and
                  demand conditions.

                </p>

              </div>

            </div>

          </div>

        </div>


      </div>

    </DashboardLayout>

  );

}


export default Revenue;