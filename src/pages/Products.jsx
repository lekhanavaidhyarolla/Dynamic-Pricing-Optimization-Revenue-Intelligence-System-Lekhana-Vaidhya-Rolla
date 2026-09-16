import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  saveProducts,
} from "../utils/productStorage";

import { getAIProducts } from "../utils/api";


/*
 * ============================================================
 * PRODUCT IMAGES
 * ============================================================
 *
 * Images are assigned using the product ID from products.csv.
 *
 * No product logic, styling, pricing logic, filtering,
 * searching, sorting, editing or deleting is changed.
 *
 * These URLs provide real product/category photographs.
 */

const productImages = {

  1:
    "https://loremflickr.com/600/400/headphones?lock=1",

  2:
    "https://loremflickr.com/600/400/smartwatch?lock=2",

  3:
    "https://loremflickr.com/600/400/runningshoes?lock=3",

  4:
    "https://loremflickr.com/600/400/coffeemaker?lock=4",

  5:
    "https://loremflickr.com/600/400/officechair?lock=5",

  6:
    "https://loremflickr.com/600/400/backpack?lock=6",

  7:
    "https://loremflickr.com/600/400/bluetoothspeaker?lock=7",

  8:
    "https://loremflickr.com/600/400/gamingmouse?lock=8",

  9:
    "https://loremflickr.com/600/400/keyboard?lock=9",

  10:
    "https://loremflickr.com/600/400/laptopbackpack?lock=10",

  11:
    "https://loremflickr.com/600/400/airfryer?lock=11",

  12:
    "https://loremflickr.com/600/400/desklamp?lock=12",

  13:
    "https://loremflickr.com/600/400/yogamat?lock=13",

  14:
    "https://loremflickr.com/600/400/cricketbat?lock=14",

  15:
    "https://loremflickr.com/600/400/wirelesscharger?lock=15",

  16:
    "https://loremflickr.com/600/400/fitnessband?lock=16",

  17:
    "https://loremflickr.com/600/400/portableSSD?lock=17",

  18:
    "https://loremflickr.com/600/400/waterbottle?lock=18",

  19:
    "https://loremflickr.com/600/400/officetable?lock=19",

  20:
    "https://loremflickr.com/600/400/earbuds?lock=20",

  21:
    "https://loremflickr.com/600/400/digitalcamera?lock=21",

  22:
    "https://loremflickr.com/600/400/smarttv?lock=22",

  23:
    "https://loremflickr.com/600/400/mixergrinder?lock=23",

  24:
    "https://loremflickr.com/600/400/electrickettle?lock=24",

  25:
    "https://loremflickr.com/600/400/microwaveoven?lock=25",

  26:
    "https://loremflickr.com/600/400/casualshoes?lock=26",

  27:
    "https://loremflickr.com/600/400/leatherwallet?lock=27",

  28:
    "https://loremflickr.com/600/400/mensjacket?lock=28",

  29:
    "https://loremflickr.com/600/400/sunglasses?lock=29",

  30:
    "https://loremflickr.com/600/400/travelsuitcase?lock=30",

};


function Products() {

  const [products, setProducts] = useState([]);

  const [aiLoading, setAiLoading] = useState(true);

  const [aiError, setAiError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sortBy, setSortBy] = useState("featured");

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);


  const [formData, setFormData] = useState({

    name: "",

    category: "",

    price: "",

    demand: "Moderate Demand",

    image: "",

  });


  /*
   * ============================================================
   * LOAD PRODUCTS + AI PRICING
   * ============================================================
   */

  const loadProducts = async () => {

    try {

      setAiLoading(true);

      setAiError("");


      /*
       * First load the existing localStorage products.
       * This preserves the user's existing catalog.
       */

      const storedProducts = getProducts();

      const localProducts =
        Array.isArray(storedProducts)
          ? storedProducts
          : [];


      /*
       * Fetch AI-priced products from FastAPI.
       */

      const aiProducts = await getAIProducts();


      console.log(
        "AI products received from FastAPI:",
        aiProducts
      );


      /*
       * Create a map of local products.
       *
       * This allows us to preserve local information
       * such as product images.
       */

      const localProductMap = new Map(

        localProducts.map(

          (product) => [

            String(product.id),

            product,

          ]

        )

      );


      /*
       * Merge FastAPI AI products with local products.
       */

      const mergedProducts = aiProducts.map(

        (aiProduct) => {

          const localProduct =
            localProductMap.get(
              String(aiProduct.id)
            );


          /*
           * Current price from API.
           */

          const currentPrice = Number(

            aiProduct.currentPrice ??

            aiProduct.price ??

            localProduct?.currentPrice ??

            localProduct?.price ??

            0

          );


          /*
           * AI recommended price.
           */

          const aiRecommendedPrice = Number(

            aiProduct.aiRecommendedPrice ??

            aiProduct.recommendedPrice ??

            localProduct?.recommendedPrice ??

            currentPrice

          );


          /*
           * IMAGE
           *
           * Existing local image gets priority.
           * If there is no local image, use the
           * image assigned to this product ID.
           */

          const productImage =

            localProduct?.image ||

            aiProduct.image ||

            productImages[
              Number(aiProduct.id)
            ] ||

            "";


          return {

            /*
             * Preserve existing local information.
             */

            ...(localProduct || {}),


            /*
             * API data takes priority for
             * the ML-generated product information.
             */

            ...aiProduct,


            /*
             * PRODUCT IMAGE
             */

            image:
              productImage,


            /*
             * Current price used by the UI.
             */

            currentPrice:
              currentPrice,


            price:
              currentPrice,


            /*
             * Existing UI reads recommendedPrice.
             */

            recommendedPrice:
              aiRecommendedPrice,


            /*
             * Keep original AI field.
             */

            aiRecommendedPrice:
              aiRecommendedPrice,

          };

        }

      );


      /*
       * ========================================================
       * KEEP LOCALLY ADDED PRODUCTS
       * ========================================================
       */

      const aiProductIds = new Set(

        aiProducts.map(

          (product) =>
            String(product.id)

        )

      );


      const localOnlyProducts =

        localProducts.filter(

          (product) =>

            !aiProductIds.has(
              String(product.id)
            )

        );


      /*
       * Final product list.
       */

      const finalProducts = [

        ...mergedProducts,

        ...localOnlyProducts,

      ];


      /*
       * Save merged products.
       */

      saveProducts(finalProducts);


      /*
       * Update React state.
       */

      setProducts(finalProducts);


      console.log(
        "Final products used by Product Catalog:",
        finalProducts
      );


    }

    catch (error) {

      console.error(
        "Error loading AI products:",
        error
      );


      /*
       * If FastAPI is unavailable, don't destroy
       * the existing local product catalog.
       */

      const storedProducts =
        getProducts();


      setProducts(

        Array.isArray(storedProducts)

          ? storedProducts

          : []

      );


      setAiError(

        "AI pricing service is currently unavailable. Showing local catalog."

      );

    }

    finally {

      setAiLoading(false);

    }

  };


  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

  useEffect(() => {

    loadProducts();

  }, []);


  /*
   * ============================================================
   * CATEGORIES
   * ============================================================
   */

  const categories = useMemo(() => {

    const uniqueCategories = [

      ...new Set(

        products

          .map(
            (product) =>
              product.category
          )

          .filter(Boolean)

      ),

    ];


    return [

      "All",

      ...uniqueCategories,

    ];

  }, [products]);


  /*
   * ============================================================
   * FILTER + SEARCH + SORT
   * ============================================================
   */

  const filteredProducts = useMemo(() => {

    let result = [...products];


    /*
     * SEARCH
     */

    if (search.trim()) {

      const searchText =
        search.toLowerCase();


      result = result.filter(

        (product) =>

          `${product.name || ""} ${product.category || ""}`

            .toLowerCase()

            .includes(searchText)

      );

    }


    /*
     * CATEGORY
     */

    if (category !== "All") {

      result = result.filter(

        (product) =>

          product.category === category

      );

    }


    /*
     * PRICE LOW TO HIGH
     */

    if (sortBy === "price-low") {

      result.sort(

        (a, b) =>

          Number(
            a.price ??
            a.currentPrice ??
            0
          )

          -

          Number(
            b.price ??
            b.currentPrice ??
            0
          )

      );

    }


    /*
     * PRICE HIGH TO LOW
     */

    if (sortBy === "price-high") {

      result.sort(

        (a, b) =>

          Number(
            b.price ??
            b.currentPrice ??
            0
          )

          -

          Number(
            a.price ??
            a.currentPrice ??
            0
          )

      );

    }


    /*
     * NAME
     */

    if (sortBy === "name") {

      result.sort(

        (a, b) =>

          (a.name || "")

            .localeCompare(
              b.name || ""
            )

      );

    }


    return result;

  }, [

    products,

    search,

    category,

    sortBy,

  ]);


  /*
   * ============================================================
   * PRICE HELPERS
   * ============================================================
   */

  const getCurrentPrice = (product) => {

    return Number(

      product.price ??

      product.currentPrice ??

      0

    );

  };


  const getRecommendedPrice = (product) => {

    return Number(

      product.recommendedPrice ??

      product.aiRecommendedPrice ??

      getCurrentPrice(product)

    );

  };


  /*
   * ============================================================
   * DASHBOARD STATISTICS
   * ============================================================
   */

  const totalProducts =
    products.length;


  const averagePrice =

    totalProducts > 0

      ?

      products.reduce(

        (sum, product) =>

          sum +

          getCurrentPrice(product),

        0

      )

      /

      totalProducts

      :

      0;


  const priceIncrease =

    products.filter(

      (product) =>

        getRecommendedPrice(product)

        >

        getCurrentPrice(product)

    ).length;


  const priceDecrease =

    products.filter(

      (product) =>

        getRecommendedPrice(product)

        <

        getCurrentPrice(product)

    ).length;


  /*
   * ============================================================
   * ADD PRODUCT FORM
   * ============================================================
   */

  const handleOpenAddForm = () => {

    setEditingProduct(null);


    setFormData({

      name: "",

      category: "",

      price: "",

      demand: "Moderate Demand",

      image: "",

    });


    setShowForm(true);

  };


  /*
   * ============================================================
   * EDIT PRODUCT
   * ============================================================
   */

  const handleOpenEditForm = (product) => {

    setEditingProduct(product);


    setFormData({

      name:
        product.name || "",


      category:
        product.category || "",


      price:
        product.price ??
        product.currentPrice ??
        "",


      demand:
        product.demand ||
        "Moderate Demand",


      image:
        product.image ||
        "",

    });


    setShowForm(true);

  };


  /*
   * ============================================================
   * FORM CHANGE
   * ============================================================
   */

  const handleFormChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData(

      (previous) => ({

        ...previous,

        [name]:
          value,

      })

    );

  };


  /*
   * ============================================================
   * SAVE / UPDATE PRODUCT
   * ============================================================
   */

  const handleFormSubmit = (e) => {

    e.preventDefault();


    /*
     * Validate required fields.
     */

    if (

      !formData.name.trim()

      ||

      !formData.category.trim()

      ||

      !formData.price

    ) {

      alert(
        "Please fill all required fields."
      );

      return;

    }


    const price =
      Number(formData.price);


    /*
     * Validate price.
     */

    if (

      Number.isNaN(price)

      ||

      price <= 0

    ) {

      alert(
        "Enter valid price."
      );

      return;

    }


    /*
     * UPDATE EXISTING PRODUCT
     */

    if (editingProduct) {

      updateProduct(

        editingProduct.id,

        {

          name:
            formData.name,

          category:
            formData.category,

          price,

          currentPrice:
            price,

          demand:
            formData.demand,

          image:
            formData.image,

        }

      );

    }

    /*
     * ADD NEW PRODUCT
     */

    else {

      addProduct({

        name:
          formData.name,

        category:
          formData.category,

        price,

        currentPrice:
          price,

        recommendedPrice:
          price,

        demand:
          formData.demand,

        image:
          formData.image,

      });

    }


    setShowForm(false);

    setEditingProduct(null);


    /*
     * Reload catalog.
     */

    loadProducts();

  };


  /*
   * ============================================================
   * DELETE PRODUCT
   * ============================================================
   */

  const handleDelete = (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );


    if (!confirmDelete) {
      return;
    }


    deleteProduct(id);


    /*
     * Reload local catalog immediately.
     */

    const updatedProducts =
      getProducts();


    setProducts(

      Array.isArray(updatedProducts)

        ? updatedProducts

        : []

    );

  };


  /*
   * ============================================================
   * PRICE DIFFERENCE
   * ============================================================
   */

  const getPriceDifference = (product) => {

    const current =
      getCurrentPrice(product);


    const recommended =
      getRecommendedPrice(product);


    if (!current) {
      return 0;
    }


    return (

      (

        (
          recommended -
          current
        )

        /

        current

      )

      *

      100

    );

  };


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (

    <DashboardLayout>

      <div className="page-container">


        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="page-header">

          <div>

            <p className="section-label">

              PRODUCT MANAGEMENT

            </p>


            <h1>

              Product Catalog

            </h1>


            <p className="page-subtitle">

              Manage products and review AI pricing recommendations.

            </p>


            {/* =================================================
                AI STATUS
            ================================================= */}

            {aiLoading && (

              <p
                style={{
                  marginTop: "10px",
                  color: "#7c3aed",
                  fontWeight: 600,
                }}
              >

                ✦ Loading AI pricing recommendations...

              </p>

            )}


            {!aiLoading && !aiError && (

              <p
                style={{
                  marginTop: "10px",
                  color: "#16a34a",
                  fontWeight: 600,
                }}
              >

                ● AI pricing engine connected — recommendations updated

              </p>

            )}


            {aiError && (

              <p
                style={{
                  marginTop: "10px",
                  color: "#dc2626",
                  fontWeight: 600,
                }}
              >

                ⚠ {aiError}

              </p>

            )}

          </div>


          <button

            className="primary-btn"

            onClick={
              handleOpenAddForm
            }

          >

            + Add New Product

          </button>

        </div>


        {/* =====================================================
            ADD / EDIT FORM
        ===================================================== */}

        {
          showForm &&

          <div className="chart-card">

            <h2>

              {
                editingProduct

                  ?

                "Edit Product"

                  :

                "Add New Product"

              }

            </h2>


            <form
              onSubmit={
                handleFormSubmit
              }
            >

              <div className="catalog-toolbar">


                <input

                  name="name"

                  placeholder="Product Name"

                  value={
                    formData.name
                  }

                  onChange={
                    handleFormChange
                  }

                />


                <input

                  name="category"

                  placeholder="Category"

                  value={
                    formData.category
                  }

                  onChange={
                    handleFormChange
                  }

                />


                <input

                  type="number"

                  name="price"

                  placeholder="Price"

                  value={
                    formData.price
                  }

                  onChange={
                    handleFormChange
                  }

                />


                <select

                  name="demand"

                  value={
                    formData.demand
                  }

                  onChange={
                    handleFormChange
                  }

                >

                  <option>
                    Low Demand
                  </option>


                  <option>
                    Moderate Demand
                  </option>


                  <option>
                    High Demand
                  </option>


                  <option>
                    Very High Demand
                  </option>

                </select>


                <input

                  name="image"

                  placeholder="Image URL"

                  value={
                    formData.image
                  }

                  onChange={
                    handleFormChange
                  }

                />

              </div>


              <div className="product-actions">


                <button

                  className="primary-btn"

                  type="submit"

                >

                  {
                    editingProduct

                      ?

                    "Update Product"

                      :

                    "Save Product"

                  }

                </button>


                <button

                  type="button"

                  className="secondary-btn"

                  onClick={() => {

                    setShowForm(false);

                    setEditingProduct(null);

                  }}

                >

                  Cancel

                </button>


              </div>

            </form>

          </div>

        }


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="stats-grid">


          {/* TOTAL PRODUCTS */}

          <div className="stat-card">

            <span>
              Total Products
            </span>


            <h2>
              {totalProducts}
            </h2>


            <small>
              Products in catalog
            </small>

          </div>


          {/* PRICE INCREASE */}

          <div className="stat-card">

            <span>
              Price Increase
            </span>


            <h2 className="positive-number">

              {priceIncrease}

            </h2>


            <small>
              AI recommendations
            </small>

          </div>


          {/* PRICE DECREASE */}

          <div className="stat-card">

            <span>
              Price Decrease
            </span>


            <h2 className="negative-number">

              {priceDecrease}

            </h2>


            <small>
              AI suggestions
            </small>

          </div>


          {/* AVERAGE PRICE */}

          <div className="stat-card">

            <span>
              Average Price
            </span>


            <h2>

              ₹

              {
                averagePrice.toLocaleString(

                  "en-IN",

                  {
                    maximumFractionDigits: 0,
                  }

                )
              }

            </h2>


            <small>
              Catalog average
            </small>

          </div>


        </div>


        {/* =====================================================
            PRODUCT SEARCH / FILTER / SORT
        ===================================================== */}

        <div className="chart-card">


          <div className="catalog-toolbar">


            <input

              placeholder="Search products..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

            />


            <select

              value={category}

              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }

            >

              {
                categories.map(

                  (item) => (

                    <option
                      key={item}
                    >

                      {item}

                    </option>

                  )

                )
              }

            </select>


            <select

              value={sortBy}

              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }

            >

              <option value="featured">

                Featured

              </option>


              <option value="price-low">

                Price Low To High

              </option>


              <option value="price-high">

                Price High To Low

              </option>


              <option value="name">

                Name

              </option>

            </select>

          </div>


          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="product-grid">


            {

              filteredProducts.map(

                (product) => (

                  <div

                    className="product-card"

                    key={
                      product.id
                    }

                  >


                    {/* PRODUCT IMAGE */}

                    {

                      product.image

                        ?

                      <img

                        src={
                          product.image
                        }

                        alt={
                          product.name
                        }

                        className="product-image"

                      />

                        :

                      <div className="product-image-placeholder">

                        📦

                      </div>

                    }


                    <div className="product-card-body">


                      {/* PRODUCT NAME */}

                      <h3>

                        {
                          product.name
                        }

                      </h3>


                      {/* DEMAND */}

                      <span className="demand-badge">

                        {
                          product.demand
                        }

                      </span>


                      {/* =================================================
                          CURRENT VS AI PRICE
                      ================================================= */}

                      <div className="price-row">


                        {/* CURRENT */}

                        <div>

                          <small>
                            Current
                          </small>


                          <strong>

                            ₹

                            {
                              getCurrentPrice(
                                product
                              ).toLocaleString(
                                "en-IN"
                              )
                            }

                          </strong>

                        </div>


                        {/* AI RECOMMENDED */}

                        <div>

                          <small>
                            AI Recommended
                          </small>


                          <strong>

                            ₹

                            {
                              getRecommendedPrice(
                                product
                              ).toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                }
                              )
                            }

                          </strong>

                        </div>


                      </div>


                      {/* =================================================
                          PRICE CHANGE
                      ================================================= */}

                      <div

                        className={

                          getPriceDifference(
                            product
                          ) > 0

                            ?

                          "price-change positive"

                            :

                          getPriceDifference(
                            product
                          ) < 0

                            ?

                          "price-change negative"

                            :

                          "price-change neutral"

                        }

                      >

                        {

                          getPriceDifference(
                            product
                          ) === 0

                            ?

                          "No pricing change"

                            :

                          `${Math.abs(
                            getPriceDifference(
                              product
                            )
                          ).toFixed(1)}%`

                        }

                      </div>


                      {/* =================================================
                          EDIT / DELETE
                      ================================================= */}

                      <div className="product-actions">


                        <button

                          className="product-edit-btn"

                          onClick={() =>
                            handleOpenEditForm(
                              product
                            )
                          }

                        >

                          Edit

                        </button>


                        <button

                          className="product-delete-btn"

                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }

                        >

                          Delete

                        </button>


                      </div>


                    </div>


                  </div>

                )

              )

            }


          </div>


        </div>


      </div>

    </DashboardLayout>

  );

}


export default Products;