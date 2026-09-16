import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  getCompetitors,
} from "../utils/api";


function Competitors() {

  const [competitors, setCompetitors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * ============================================================
   * SELECTED PRODUCT FOR COMPETITOR GRAPH
   * ============================================================
   */

  const [selectedProductId, setSelectedProductId] =
    useState("");


  /*
   * ============================================================
   * LOAD COMPETITOR DATA
   * ============================================================
   */

  useEffect(() => {

    loadCompetitors();

  }, []);


  const loadCompetitors = async () => {

    try {

      setLoading(true);

      setError("");

      const data =
        await getCompetitors();

      console.log(
        "Competitor data received:",
        data
      );

      if (
        Array.isArray(data)
      ) {

        setCompetitors(data);

      } else if (
        data &&
        Array.isArray(data.competitors)
      ) {

        setCompetitors(
          data.competitors
        );

      } else {

        setCompetitors([]);

      }

    } catch (err) {

      console.error(
        "Error loading competitors:",
        err
      );

      setError(
        "Unable to load competitor data."
      );

      setCompetitors([]);

    } finally {

      setLoading(false);

    }

  };


  /*
   * ============================================================
   * MARKET STATISTICS
   * ============================================================
   */

  const averageMarketPrice =
    useMemo(() => {

      if (!competitors.length)

        return 0;

      const total =
        competitors.reduce(

          (sum, item) =>

            sum +
            Number(
              item.competitor_price || 0
            ),

          0

        );

      return Math.round(
        total /
        competitors.length
      );

    }, [
      competitors
    ]);


  const priceAdvantage =
    useMemo(() => {

      if (!competitors.length)

        return 0;

      const total =
        competitors.reduce(

          (sum, item) =>

            sum +
            Number(
              item.price_difference_percentage ||
              0
            ),

          0

        );

      return (
        total /
        competitors.length
      ).toFixed(1);

    }, [
      competitors
    ]);


  const priceAlerts =
    useMemo(() => {

      return competitors.filter(

        item =>

          String(
            item.price_recommendation || ""
          ).toLowerCase() !==
          "maintain price"

      ).length;

    }, [
      competitors
    ]);


  /*
   * ============================================================
   * SELECTED PRODUCT
   * ============================================================
   */

  const selectedProduct =
    useMemo(() => {

      if (!selectedProductId) {

        return null;

      }

      return competitors.find(

        item =>

          String(
            item.product_id
          ) ===
          String(
            selectedProductId
          )

      );

    }, [
      competitors,
      selectedProductId
    ]);


  /*
   * ============================================================
   * SELECTED PRODUCT CHART DATA
   * ============================================================
   */

  const chartData =
    useMemo(() => {

      if (!selectedProduct) {

        return [];

      }

      return [

        {
          name:
            "Your Price",

          price:
            Number(
              selectedProduct.current_price || 0
            ),
        },

        {
          name:
            "Competitor Price",

          price:
            Number(
              selectedProduct.competitor_price || 0
            ),
        },

      ];

    }, [
      selectedProduct
    ]);


  /*
   * ============================================================
   * LOADING STATE
   * ============================================================
   */

  if (loading) {

    return (

      <DashboardLayout>

        <div className="page-container">

          <div className="page-header">

            <div>

              <p className="section-label">
                COMPETITOR INTELLIGENCE
              </p>

              <h1>
                Competitor Intelligence
              </h1>

              <p className="page-subtitle">
                Monitor competitor pricing and
                identify market opportunities.
              </p>

            </div>

          </div>


          <div className="chart-card">

            <div className="empty-state">

              <h3>
                Loading Competitor Data...
              </h3>

              <p>
                Fetching the latest market
                pricing information.
              </p>

            </div>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  /*
   * ============================================================
   * ERROR STATE
   * ============================================================
   */

  if (error) {

    return (

      <DashboardLayout>

        <div className="page-container">

          <div className="page-header">

            <div>

              <p className="section-label">
                COMPETITOR INTELLIGENCE
              </p>

              <h1>
                Competitor Intelligence
              </h1>

              <p className="page-subtitle">
                Monitor competitor pricing and
                identify market opportunities.
              </p>

            </div>

          </div>


          <div className="chart-card">

            <div className="empty-state">

              <h3>
                {error}
              </h3>

              <p>
                Make sure the FastAPI server is
                running on port 8001.
              </p>

            </div>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  /*
   * ============================================================
   * MAIN PAGE
   * ============================================================
   */

  return (

    <DashboardLayout>

      <div className="page-container">

        <div className="page-header">

          <div>

            <p className="section-label">
              COMPETITOR INTELLIGENCE
            </p>

            <h1>
              Competitor Intelligence
            </h1>

            <p className="page-subtitle">
              Monitor competitor pricing and
              identify market opportunities.
            </p>

          </div>

        </div>


        {/* =====================================================
            KPI CARDS
           ===================================================== */}

        <div className="stats-grid">

          <div className="stat-card">

            <span>
              Competitors Tracked
            </span>

            <h2>
              {competitors.length}
            </h2>

            <small>
              Products monitored
            </small>

          </div>


          <div className="stat-card">

            <span>
              Average Market Price
            </span>

            <h2>

              ₹
              {averageMarketPrice.toLocaleString(
                "en-IN"
              )}

            </h2>

            <small>
              Across tracked products
            </small>

          </div>


          <div className="stat-card">

            <span>
              Price Advantage
            </span>

            <h2 className="positive-number">

              {priceAdvantage}%

            </h2>

            <small>
              Average competitor price difference
            </small>

          </div>


          <div className="stat-card">

            <span>
              Price Alerts
            </span>

            <h2>
              {priceAlerts}
            </h2>

            <small>
              Requires attention
            </small>

          </div>

        </div>


        {/* =====================================================
            CHANGED GRAPH ONLY
           ===================================================== */}

        <div className="chart-card">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >

            <div>

              <h2>
                Competitor Pricing Overview
              </h2>

              <p className="page-subtitle">
                Compare your price with the
                competitor price for a selected product.
              </p>

            </div>


            <div
              style={{
                minWidth: "280px",
              }}
            >

              <select
                value={selectedProductId}
                onChange={(e) =>
                  setSelectedProductId(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >

                <option value="">
                  Select a product
                </option>

                {competitors.map(
                  (competitor) => (

                    <option
                      key={
                        competitor.product_id
                      }
                      value={
                        competitor.product_id
                      }
                    >
                      {
                        competitor.product_name
                      }
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          {selectedProduct ? (

            <>

              <div
                style={{
                  marginBottom: "15px",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >

                {
                  selectedProduct.product_name
                }

              </div>


              <div className="chart-container">

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
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
                        `₹${Number(
                          value
                        ).toLocaleString(
                          "en-IN"
                        )}`
                      }
                    />

                    <Bar
                      dataKey="price"
                      name="Price"
                      fill="#7c3aed"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap: "15px",
                  marginTop: "20px",
                }}
              >

                <div className="stat-card">

                  <span>
                    Your Price
                  </span>

                  <h2>

                    ₹
                    {Number(
                      selectedProduct.current_price ||
                      0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </h2>

                </div>


                <div className="stat-card">

                  <span>
                    Competitor Price
                  </span>

                  <h2>

                    ₹
                    {Number(
                      selectedProduct.competitor_price ||
                      0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </h2>

                </div>


                <div className="stat-card">

                  <span>
                    Difference
                  </span>

                  <h2>

                    ₹
                    {Number(
                      selectedProduct.price_difference ||
                      0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </h2>

                </div>

              </div>

            </>

          ) : (

            <div className="empty-state">

              <h3>
                Select a Product
              </h3>

              <p>
                Choose a product above to view
                its competitor pricing comparison.
              </p>

            </div>

          )}

        </div>


        {/* =====================================================
            EXISTING TABLE — UNCHANGED
           ===================================================== */}

        <div className="chart-card">

          <h2>
            Competitor Price Comparison
          </h2>


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
                    Competitor Price
                  </th>

                  <th>
                    Difference
                  </th>

                  <th>
                    Market Position
                  </th>

                  <th>
                    AI Recommendation
                  </th>

                </tr>

              </thead>


              <tbody>

                {competitors.map(
                  (competitor) => (

                    <tr
                      key={
                        competitor.product_id
                      }
                    >

                      <td>

                        <strong>
                          {
                            competitor.product_name
                          }
                        </strong>

                      </td>


                      <td>

                        ₹
                        {Number(
                          competitor.current_price ||
                          0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </td>


                      <td>

                        ₹
                        {Number(
                          competitor.competitor_price ||
                          0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </td>


                      <td>

                        ₹
                        {Number(
                          competitor.price_difference ||
                          0
                        ).toLocaleString(
                          "en-IN"
                        )}

                        {" "}

                        <small>

                          (
                          {
                            Number(
                              competitor.price_difference_percentage ||
                              0
                            ).toFixed(1)
                          }
                          %)

                        </small>

                      </td>


                      <td>

                        <span className="status-badge">

                          {
                            competitor.market_position
                          }

                        </span>

                      </td>


                      <td>

                        {
                          competitor.price_recommendation ||
                          "No Recommendation"
                        }

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =====================================================
            EXISTING INSIGHTS — UNCHANGED
           ===================================================== */}

        <div className="insights-grid">

          <div className="insight-card">

            <div className="insight-icon">
              📊
            </div>

            <div>

              <h3>
                Market Position
              </h3>

              <p>

                Your pricing is being compared
                against the latest competitor
                prices across your tracked
                products.

              </p>

            </div>

          </div>


          <div className="insight-card">

            <div className="insight-icon">
              ⚡
            </div>

            <div>

              <h3>
                Price Alert
              </h3>

              <p>

                {priceAlerts}
                {" "}
                products currently have
                pricing recommendations that
                require attention.

              </p>

            </div>

          </div>

        </div>


      </div>

    </DashboardLayout>

  );

}


export default Competitors;