const defaultProducts = [
  {
    id: 1,
    name: "Dispensador de Granos",
    description: "Contenedor de 2L ideal para cocina",
    price: 36.98,
    originalPrice: 45.0,
    discount: 18,
    stock: 8,
    category: "hogar",
    sales: 244,
    images: [
      "./images/products/DISPENSADOR.avif",
      "./images/products/DISPENSADOR MEDIDA.avif",
    ],
  },
  {
    id: 2,
    name: "Polo cuello alto",
    description: "Camiseta de cuello medio alto ajustada",
    price: 45.0,
    originalPrice: null,
    discount: null,
    stock: 15,
    category: "ropa",
    sales: 182,
    images: [
      "./images/products/FOTO ROPA MODEL.avif",
      "./images/products/FOTO ROPA MODEL BLANCO.avif",
    ],
  },
  {
    id: 3,
    name: "Rotuladores",
    description: "Set de 60 marcadores profesionales",
    price: 25.0,
    originalPrice: 35.0,
    discount: 29,
    stock: 12,
    category: "papeleria",
    sales: 206,
    images: [
      "./images/products/ROTULADORES.avif",
      "./images/products/ROTULADORES MEDIDA.avif",
    ],
  },
  {
    id: 4,
    name: "Tomatodo",
    description: "1000ml con diseño de oso kawaii",
    price: 15.0,
    originalPrice: null,
    discount: null,
    stock: 20,
    category: "accesorios",
    sales: 247,
    images: [
      "./images/products/TOMATODO KAWAI.avif",
      "./images/products/TOMATODO KAWAI MEDIDAS.avif",
    ],
  },
];

function getProducts() {
  const storedProducts = localStorage.getItem("moniProducts");

  if (!storedProducts || storedProducts === "[]" || storedProducts === "null") {
    localStorage.setItem("moniProducts", JSON.stringify(defaultProducts));
    console.log("✅ Productos iniciales guardados en localStorage");
    return defaultProducts;
  }

  try {
    const parsed = JSON.parse(storedProducts);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem("moniProducts", JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return parsed;
  } catch (e) {
    console.error("❌ Error al cargar productos:", e);
    localStorage.setItem("moniProducts", JSON.stringify(defaultProducts));
    return defaultProducts;
  }
}

export const products = getProducts();

window.products = products;

window.reloadProducts = function () {
  window.products = getProducts();
  return window.products;
};
