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
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  getProducts,
} from "../utils/productStorage";

import {
  getDemandForecast,
  getSeasonalAnalysis,
} from "../utils/api";


function DemandForecast() {

  const [products, setProducts] = useState([]);

  const [forecasts, setForecasts] = useState([]);

  const [seasonalData, setSeasonalData] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");


  useEffect(() => {

    loadProducts();

    loadForecast();

    loadSeasonalAnalysis();

  }, []);


  const loadProducts = () => {

    const data = getProducts();

    setProducts(
      Array.isArray(data)
        ? data
        : []
    );

  };


  const loadForecast = async () => {

    try {

      const data = await getDemandForecast();

      setForecasts(
        Array.isArray(data)
          ? data
          : []
      );

      console.log(
        "Forecast data received:",
        data
      );

    } catch (error) {

      console.error(
        "Error loading demand forecast:",
        error
      );

      setForecasts([]);

    }

  };


  const loadSeasonalAnalysis = async () => {

    try {

      const data = await getSeasonalAnalysis();

      setSeasonalData(
        Array.isArray(data)
          ? data
          : []
      );

      console.log(
        "Seasonal analysis data received:",
        data
      );

    } catch (error) {

      console.error(
        "Error loading seasonal analysis:",
        error
      );

      setSeasonalData([]);

    }

  };


  const getDemandCategory = (demand) => {

    const value =
      (demand || "").toLowerCase();

    if (value.includes("very high"))
      return "Very High Demand";

    if (value.includes("high"))
      return "High Demand";

    if (value.includes("low"))
      return "Low Demand";

    return "Moderate Demand";

  };


  const demandData = useMemo(() => {

    const result = {

      "Low Demand": 0,

      "Moderate Demand": 0,

      "High Demand": 0,

      "Very High Demand": 0,

    };

    products.forEach(product => {

      const category =
        getDemandCategory(
          product.demand
        );

      result[category]++;

    });

    return Object.keys(result).map(

      key => ({

        name: key,

        Products: result[key],

      })

    );

  }, [products]);


  const forecastChartData = useMemo(() => {

    const result = {};

    forecasts.forEach((item) => {

      const date = item.date;

      if (!result[date]) {

        result[date] = {
          date: date,
        };

      }

      result[date][
        item.product_name
      ] = Number(
        item.forecast_sales || 0
      );

    });

    return Object.values(result);

  }, [forecasts]);


  const seasonalChartData = useMemo(() => {

    return seasonalData.map((item) => ({

      month: item.month_name,

      seasonalIndex:
        Number(
          item.seasonal_index || 0
        ),

      trend:
        item.seasonal_trend ||
        "Normal Season",

    }));

  }, [seasonalData]);


  /*
   * ============================================================
   * SELECTED PRODUCT
   * ============================================================
   */

  useEffect(() => {

    if (
      !selectedProductId &&
      products.length > 0
    ) {

      setSelectedProductId(
        String(products[0].id)
      );

    }

  }, [
    products,
    selectedProductId
  ]);


  const selectedProduct = useMemo(() => {

    return products.find(

      product =>
        String(product.id) ===
        String(selectedProductId)

    );

  }, [
    products,
    selectedProductId
  ]);


  const selectedProductForecasts = useMemo(() => {

    if (!selectedProductId)

      return [];

    return forecasts

      .filter(

        item =>
          String(item.product_id) ===
          String(selectedProductId)

      )

      .sort(

        (a, b) =>
          a.date.localeCompare(b.date)

      );

  }, [
    forecasts,
    selectedProductId
  ]);


  /*
   * ============================================================
   * FORECAST CONFIDENCE
   * ============================================================
   */

  const averageConfidence = useMemo(() => {

    if (!selectedProductForecasts.length)

      return 0;

    const total =
      selectedProductForecasts.reduce(

        (sum, item) =>

          sum +

          Number(
            item.confidence_score || 0
          ),

        0

      );

    return Math.round(

      total /
      selectedProductForecasts.length

    );

  }, [
    selectedProductForecasts
  ]);


  /*
   * ============================================================
   * FORECAST HORIZON
   * ============================================================
   */

  const forecastHorizons = useMemo(() => {

    return [

      ...new Set(

        selectedProductForecasts.map(

          item =>
            item.forecast_horizon

        )

      )

    ];

  }, [
    selectedProductForecasts
  ]);


  const selectedForecastChartData = useMemo(() => {

    return selectedProductForecasts.map(

      item => ({

        date: item.date,

        forecastSales:
          Number(
            item.forecast_sales || 0
          ),

      })

    );

  }, [
    selectedProductForecasts
  ]);


  const forecastTrend = useMemo(() => {

    if (
      selectedProductForecasts.length < 2
    ) {

      return "Not Enough Data";

    }

    const first =
      Number(
        selectedProductForecasts[0]
          .forecast_sales || 0
      );

    const last =
      Number(
        selectedProductForecasts[
          selectedProductForecasts.length - 1
        ].forecast_sales || 0
      );

    if (last > first)

      return "Increasing";

    if (last < first)

      return "Decreasing";

    return "Stable";

  }, [
    selectedProductForecasts
  ]);


  const peakSeason = useMemo(() => {

    if (!seasonalData.length)

      return null;

    return seasonalData.reduce(

      (highest, current) =>

        Number(
          current.seasonal_index || 0
        )

        >

        Number(
          highest.seasonal_index || 0
        )

          ?

          current

          :

          highest

    );

  }, [
    seasonalData
  ]);


  const lowSeason = useMemo(() => {

    if (!seasonalData.length)

      return null;

    return seasonalData.reduce(

      (lowest, current) =>

        Number(
          current.seasonal_index || 0
        )

        <

        Number(
          lowest.seasonal_index || 0
        )

          ?

          current

          :

          lowest

    );

  }, [
    seasonalData
  ]);


  const highDemandProducts =

    products.filter(

      product => {

        const demand =
          getDemandCategory(
            product.demand
          );

        return (

          demand === "High Demand"

          ||

          demand === "Very High Demand"

        );

      }

    );


  const lowDemandProducts =

    products.filter(

      product =>

        getDemandCategory(
          product.demand
        )

        ===

        "Low Demand"

    );


  const mostCommonDemand = useMemo(() => {

    if (!products.length)

      return "No Data";

    let max = 0;

    let category =
      "Moderate Demand";

    demandData.forEach(item => {

      if (item.Products > max) {

        max =
          item.Products;

        category =
          item.name;

      }

    });

    return category;

  }, [
    products,
    demandData
  ]);


  if (products.length === 0) {

    return (

      <DashboardLayout>

        <div className="page-container">

          <div className="page-header">

            <div>

              <p className="section-label">

                DEMAND INTELLIGENCE

              </p>

              <h1>

                Demand Forecast

              </h1>

              <p className="page-subtitle">

                Analyze product demand patterns.

              </p>

            </div>

          </div>


          <div className="chart-card">

            <div className="empty-state">

              <h3>

                No Product Data Available

              </h3>

              <p>

                Add products with demand values.

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

              DEMAND INTELLIGENCE

            </p>

            <h1>

              Demand Forecast

            </h1>

            <p className="page-subtitle">

              Understand current demand patterns and future sales trends.

            </p>

          </div>

        </div>


        <div className="stats-grid">

          <div className="stat-card">

            <span>
              Total Products
            </span>

            <h2>
              {products.length}
            </h2>

          </div>


          <div className="stat-card">

            <span>
              High Demand
            </span>

            <h2 className="positive-number">

              {highDemandProducts.length}

            </h2>

          </div>


          <div className="stat-card">

            <span>
              Low Demand
            </span>

            <h2 className="negative-number">

              {lowDemandProducts.length}

            </h2>

          </div>


          <div className="stat-card">

            <span>
              Dominant Category
            </span>

            <h2>

              {mostCommonDemand}

            </h2>

          </div>

        </div>


        <div className="chart-card">

          <h2>

            Demand Distribution

          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={demandData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="Products"
                fill="#7c3aed"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* =====================================================
            PRODUCT FORECAST SELECTION
            ===================================================== */}

        <div className="chart-card">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "24px"
            }}
          >

            <div>

              <h2 style={{ marginBottom: "6px" }}>

                AI Demand Forecast

              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px"
                }}
              >

                Select a product to view its 3-month AI sales forecast.

              </p>

            </div>


            <select

              value={selectedProductId}

              onChange={(event) =>

                setSelectedProductId(
                  event.target.value
                )

              }

              style={{
                minWidth: "260px",
                padding: "11px 14px",
                border: "1px solid #d8dce8",
                borderRadius: "10px",
                background: "#ffffff",
                color: "#111827",
                fontSize: "14px",
                fontWeight: "500",
                outline: "none",
                cursor: "pointer"
              }}

            >

              {

                products.map(product => (

                  <option
                    key={product.id}
                    value={product.id}
                  >

                    {product.name}

                  </option>

                ))

              }

            </select>

          </div>


          {

            selectedProduct && (

              <>

                <div
                  className="stats-grid"
                  style={{
                    marginBottom: "24px"
                  }}
                >

                  <div className="stat-card">

                    <span>
                      Selected Product
                    </span>

                    <h2
                      style={{
                        fontSize: "18px"
                      }}
                    >

                      {selectedProduct.name}

                    </h2>

                  </div>


                  <div className="stat-card">

                    <span>
                      Current Demand
                    </span>

                    <h2
                      className={
                        getDemandCategory(
                          selectedProduct.demand
                        ).includes("High")

                          ?

                          "positive-number"

                          :

                          ""
                      }
                    >

                      {selectedProduct.demand}

                    </h2>

                  </div>


                  <div className="stat-card">

                    <span>
                      Current Sales
                    </span>

                    <h2>

                      {selectedProduct.sales}

                    </h2>

                  </div>


                  <div className="stat-card">

                    <span>
                      Forecast Trend
                    </span>

                    <h2
                      className={
                        forecastTrend === "Increasing"

                          ?

                          "positive-number"

                          :

                          forecastTrend === "Decreasing"

                            ?

                            "negative-number"

                            :

                            ""
                      }
                    >

                      {forecastTrend}

                    </h2>

                  </div>


                  <div className="stat-card">

                    <span>
                      Forecast Confidence
                    </span>

                    <h2 className="positive-number">

                      {averageConfidence}%

                    </h2>

                  </div>
                  <div className="stat-card">

                    <span>
                      Forecast Horizon
                    </span>

                    <h2>

                      {
                        forecastHorizons.length
                          ? forecastHorizons.join(" / ")
                          : "No Data"
                      }

                    </h2>

                  </div>
                  <div className="stat-card">

                    <span>
                      Seasonal Trend
                    </span>

                    <h2>

                      {

                        peakSeason &&
                        lowSeason

                          ?

                          peakSeason.month_name ===
                          lowSeason.month_name

                            ?

                            "Normal Season"

                            :

                            peakSeason.seasonal_index > 1

                              ?

                              "High Season"

                              :

                              "Normal Season"

                          :

                          "No Data"

                      }

                    </h2>

                  </div>

                </div>


                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, minmax(0, 1fr))",
                    gap: "16px",
                    marginBottom: "24px"
                  }}
                >

                  {

                    selectedProductForecasts.map(

                      item => (

                        <div
                          className="recommendation-card"
                          key={item.date}
                          style={{
                            textAlign: "center"
                          }}
                        >

                          <span
                            style={{
                              display: "block",
                              fontSize: "13px",
                              color: "#64748b",
                              marginBottom: "8px"
                            }}
                          >

                            {item.date}

                          </span>


                          <h3
                            style={{
                              fontSize: "24px",
                              marginBottom: "4px"
                            }}
                          >

                            {item.forecast_sales}

                          </h3>


                          <p
                            style={{
                              margin: 0,
                              color: "#64748b"
                            }}
                          >

                            Forecast Sales

                          </p>

                        </div>

                      )

                    )

                  }

                </div>


                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <LineChart
                    data={selectedForecastChartData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="forecastSales"
                      name="Forecast Sales"
                      stroke="#7c3aed"
                      strokeWidth={3}
                      dot={{
                        r: 5
                      }}
                      activeDot={{
                        r: 7
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </>

            )

          }

        </div>


        {/* =====================================================
            SEASONAL TREND ANALYSIS
            ===================================================== */}

        <div className="chart-card">

          <div
            style={{
              marginBottom: "24px"
            }}
          >

            <h2 style={{ marginBottom: "6px" }}>

              Seasonal Trend Analysis

            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px"
              }}
            >

              Monthly seasonal demand patterns calculated from historical sales.

            </p>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "24px"
            }}
          >

            <div className="stat-card">

              <span>
                Peak Season
              </span>

              <h2 className="positive-number">

                {

                  peakSeason

                    ?

                    peakSeason.month_name

                    :

                    "No Data"

                }

              </h2>


              {

                peakSeason && (

                  <p
                    style={{
                      marginTop: "6px",
                      color: "#64748b"
                    }}
                  >

                    Seasonal Index:{" "}

                    {peakSeason.seasonal_index}

                  </p>

                )

              }

            </div>


            <div className="stat-card">

              <span>
                Lowest Season
              </span>

              <h2 className="negative-number">

                {

                  lowSeason

                    ?

                    lowSeason.month_name

                    :

                    "No Data"

                }

              </h2>


              {

                lowSeason && (

                  <p
                    style={{
                      marginTop: "6px",
                      color: "#64748b"
                    }}
                  >

                    Seasonal Index:{" "}

                    {lowSeason.seasonal_index}

                  </p>

                )

              }

            </div>

          </div>


          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <AreaChart
              data={seasonalChartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
              />

              <YAxis
                domain={[
                  0,
                  "auto"
                ]}
              />

              <Tooltip
                formatter={(
                  value,
                  name
                ) => [

                  value,

                  name === "seasonalIndex"

                    ?

                    "Seasonal Index"

                    :

                    name

                ]}

              />

              <Area
                type="monotone"
                dataKey="seasonalIndex"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.2}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>


        <div className="recommendation-grid">

          <div className="chart-card">

            <h2>

              🔥 High Demand Products

            </h2>

            {

              highDemandProducts.map(product => (

                <div
                  className="recommendation-card"
                  key={product.id}
                >

                  <h3>

                    {product.name}

                  </h3>

                  <p>

                    {product.demand}

                  </p>

                </div>

              ))

            }

          </div>


          <div className="chart-card">

            <h2>

              ⚠️ Low Demand Products

            </h2>

            {

              lowDemandProducts.map(product => (

                <div
                  className="recommendation-card"
                  key={product.id}
                >

                  <h3>

                    {product.name}

                  </h3>

                  <p>

                    {product.demand}

                  </p>

                </div>

              ))

            }

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}


export default DemandForecast;

