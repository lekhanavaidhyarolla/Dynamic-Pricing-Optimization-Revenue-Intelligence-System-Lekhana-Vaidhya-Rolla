import Papa from "papaparse";

const STORAGE_KEY = "pp_products";

const productImages = {
  "Premium Wireless Headphones":
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",

  "Smart Watch Pro":
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",

  "Premium Running Shoes":
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",

  "Modern Coffee Maker":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",

  "Ergonomic Office Chair":
    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80",

  "Premium Travel Backpack":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",

  "Bluetooth Speaker":
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",

  "Gaming Mouse":
    "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",

  "Mechanical Keyboard":
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",

  "Laptop Backpack":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",

  "Air Fryer":
    "https://images.unsplash.com/photo-1649933377635-9c5d8e8d8a6d?auto=format&fit=crop&w=800&q=80",

  "LED Desk Lamp":
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",

  "Yoga Mat":
    "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80",

  "Cricket Bat":
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",

  "Wireless Charger":
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",

  "Fitness Band":
    "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?auto=format&fit=crop&w=800&q=80",

  "Portable SSD":
    "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",

  "Water Bottle":
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",

  "Office Table":
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",

  "Noise Cancelling Earbuds":
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",

  "Digital Camera":
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",

  "Smart TV 43 Inch":
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",

  "Mixer Grinder":
    "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80",

  "Electric Kettle":
    "https://images.unsplash.com/photo-1594213114663-d94db9b1712c?auto=format&fit=crop&w=800&q=80",

  "Microwave Oven":
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80",

  "Casual Shoes":
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",

  "Leather Wallet":
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",

  "Men's Jacket":
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",

  "Sunglasses":
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",

  "Travel Suitcase":
    "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80",
};

export async function loadDataset() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);

    if (existing) {
      const parsed = JSON.parse(existing);

      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("Products already loaded.");
        return;
      }
    }

    const response = await fetch("/datasets/products.csv");

    if (!response.ok) {
      throw new Error(
        `Unable to load CSV: ${response.status}`
      );
    }

    const csvText = await response.text();

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const products = results.data.map((item) => {
          const currentPrice = Number(
            item.currentPrice
          );

          let recommendedPrice = currentPrice;

          if (item.demand === "Very High") {
            recommendedPrice = currentPrice * 1.12;
          } else if (item.demand === "High") {
            recommendedPrice = currentPrice * 1.08;
          } else if (item.demand === "Moderate") {
            recommendedPrice = currentPrice * 0.98;
          } else {
            recommendedPrice = currentPrice * 0.95;
          }

          return {
            id: Number(item.id),

            name: item.name,

            category: item.category,

            image:
              productImages[item.name] ||
              "",

            price: currentPrice,

            currentPrice: currentPrice,

            recommendedPrice:
              Math.round(recommendedPrice),

            demand: item.demand,

            stock: Number(item.stock),

            competitorPrice:
              Number(item.competitorPrice),

            sales: Number(item.sales),

            lastMonthSales:
              Number(item.lastMonthSales),
          };
        });

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(products)
        );

        console.log(
          `Dataset loaded successfully: ${products.length} products.`
        );
      },

      error: (error) => {
        console.error(
          "CSV parsing failed:",
          error
        );
      },
    });
  } catch (error) {
    console.error(
      "Dataset loading failed:",
      error
    );
  }
}