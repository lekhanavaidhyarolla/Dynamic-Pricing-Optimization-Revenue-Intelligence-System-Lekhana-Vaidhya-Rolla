const STORAGE_KEY = "pp_products";

const defaultProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 2499,
    currentPrice: 2499,
    recommendedPrice: 2499,
    demand: "High",
    image: "",
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    category: "Smart Devices",
    price: 3999,
    currentPrice: 3999,
    recommendedPrice: 3999,
    demand: "Moderate",
    image: "",
  },
  {
    id: 3,
    name: "Premium Running Shoes",
    category: "Fashion",
    price: 2999,
    currentPrice: 2999,
    recommendedPrice: 2999,
    demand: "Very High",
    image: "",
  },
  {
    id: 4,
    name: "Modern Coffee Maker",
    category: "Home Appliances",
    price: 4599,
    currentPrice: 4599,
    recommendedPrice: 4599,
    demand: "Moderate",
    image: "",
  },
  {
    id: 5,
    name: "Ergonomic Office Chair",
    category: "Furniture",
    price: 8999,
    currentPrice: 8999,
    recommendedPrice: 8999,
    demand: "High",
    image: "",
  },
  {
    id: 6,
    name: "Premium Travel Backpack",
    category: "Accessories",
    price: 1999,
    currentPrice: 1999,
    recommendedPrice: 1999,
    demand: "Moderate",
    image: "",
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 1799,
    currentPrice: 1799,
    recommendedPrice: 1799,
    demand: "High",
    image: "",
  },
  {
    id: 8,
    name: "Gaming Mouse",
    category: "Electronics",
    price: 1299,
    currentPrice: 1299,
    recommendedPrice: 1299,
    demand: "Very High",
    image: "",
  },
  {
    id: 9,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 3499,
    currentPrice: 3499,
    recommendedPrice: 3499,
    demand: "High",
    image: "",
  },
  {
    id: 10,
    name: "Laptop Backpack",
    category: "Accessories",
    price: 1499,
    currentPrice: 1499,
    recommendedPrice: 1499,
    demand: "Moderate",
    image: "",
  },
  {
    id: 11,
    name: "Air Fryer",
    category: "Home Appliances",
    price: 5999,
    currentPrice: 5999,
    recommendedPrice: 5999,
    demand: "High",
    image: "",
  },
  {
    id: 12,
    name: "LED Desk Lamp",
    category: "Furniture",
    price: 999,
    currentPrice: 999,
    recommendedPrice: 999,
    demand: "Moderate",
    image: "",
  },
  {
    id: 13,
    name: "Yoga Mat",
    category: "Sports",
    price: 799,
    currentPrice: 799,
    recommendedPrice: 799,
    demand: "Very High",
    image: "",
  },
  {
    id: 14,
    name: "Cricket Bat",
    category: "Sports",
    price: 2499,
    currentPrice: 2499,
    recommendedPrice: 2499,
    demand: "High",
    image: "",
  },
  {
    id: 15,
    name: "Wireless Charger",
    category: "Electronics",
    price: 899,
    currentPrice: 899,
    recommendedPrice: 899,
    demand: "Moderate",
    image: "",
  },
  {
    id: 16,
    name: "Fitness Band",
    category: "Smart Devices",
    price: 2299,
    currentPrice: 2299,
    recommendedPrice: 2299,
    demand: "High",
    image: "",
  },
  {
    id: 17,
    name: "Portable SSD",
    category: "Electronics",
    price: 5499,
    currentPrice: 5499,
    recommendedPrice: 5499,
    demand: "High",
    image: "",
  },
  {
    id: 18,
    name: "Water Bottle",
    category: "Accessories",
    price: 499,
    currentPrice: 499,
    recommendedPrice: 499,
    demand: "Low",
    image: "",
  },
  {
    id: 19,
    name: "Office Table",
    category: "Furniture",
    price: 12999,
    currentPrice: 12999,
    recommendedPrice: 12999,
    demand: "Moderate",
    image: "",
  },
  {
    id: 20,
    name: "Noise Cancelling Earbuds",
    category: "Electronics",
    price: 4999,
    currentPrice: 4999,
    recommendedPrice: 4999,
    demand: "Very High",
    image: "",
  },
  {
    id: 21,
    name: "Digital Camera",
    category: "Electronics",
    price: 45999,
    currentPrice: 45999,
    recommendedPrice: 45999,
    demand: "Moderate",
    image: "",
  },
  {
    id: 22,
    name: "Smart TV 43 Inch",
    category: "Electronics",
    price: 32999,
    currentPrice: 32999,
    recommendedPrice: 32999,
    demand: "High",
    image: "",
  },
  {
    id: 23,
    name: "Mixer Grinder",
    category: "Home Appliances",
    price: 3499,
    currentPrice: 3499,
    recommendedPrice: 3499,
    demand: "Moderate",
    image: "",
  },
  {
    id: 24,
    name: "Electric Kettle",
    category: "Home Appliances",
    price: 1599,
    currentPrice: 1599,
    recommendedPrice: 1599,
    demand: "High",
    image: "",
  },
  {
    id: 25,
    name: "Microwave Oven",
    category: "Home Appliances",
    price: 8999,
    currentPrice: 8999,
    recommendedPrice: 8999,
    demand: "Moderate",
    image: "",
  },
  {
    id: 26,
    name: "Casual Shoes",
    category: "Fashion",
    price: 2199,
    currentPrice: 2199,
    recommendedPrice: 2199,
    demand: "Moderate",
    image: "",
  },
  {
    id: 27,
    name: "Leather Wallet",
    category: "Fashion",
    price: 999,
    currentPrice: 999,
    recommendedPrice: 999,
    demand: "Low",
    image: "",
  },
  {
    id: 28,
    name: "Men's Jacket",
    category: "Fashion",
    price: 3499,
    currentPrice: 3499,
    recommendedPrice: 3499,
    demand: "High",
    image: "",
  },
  {
    id: 29,
    name: "Sunglasses",
    category: "Fashion",
    price: 1799,
    currentPrice: 1799,
    recommendedPrice: 1799,
    demand: "High",
    image: "",
  },
  {
    id: 30,
    name: "Travel Suitcase",
    category: "Accessories",
    price: 4999,
    currentPrice: 4999,
    recommendedPrice: 4999,
    demand: "Moderate",
    image: "",
  },
];


export function getProducts() {
  try {
    const storedProducts = localStorage.getItem(STORAGE_KEY);

    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);

      if (Array.isArray(parsedProducts)) {
        return parsedProducts;
      }
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultProducts)
    );

    return defaultProducts;

  } catch (error) {
    console.error("Error loading products:", error);

    return defaultProducts;
  }
}


export function saveProducts(products) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products)
    );

    return products;

  } catch (error) {
    console.error("Error saving products:", error);

    return products;
  }
}


export function addProduct(product) {
  const products = getProducts();

  const nextId =
    products.length > 0
      ? Math.max(
          ...products.map(
            item => Number(item.id) || 0
          )
        ) + 1
      : 1;

  const newProduct = {
    id: nextId,
    ...product,
  };

  const updatedProducts = [
    ...products,
    newProduct,
  ];

  saveProducts(updatedProducts);

  return newProduct;
}


export function updateProduct(id, updatedData) {
  const products = getProducts();

  const updatedProducts = products.map(
    product =>
      String(product.id) === String(id)
        ? {
            ...product,
            ...updatedData,
            id: product.id,
          }
        : product
  );

  saveProducts(updatedProducts);

  return updatedProducts.find(
    product =>
      String(product.id) === String(id)
  );
}


export function deleteProduct(id) {
  const products = getProducts();

  const updatedProducts = products.filter(
    product =>
      String(product.id) !== String(id)
  );

  saveProducts(updatedProducts);

  return updatedProducts;
}