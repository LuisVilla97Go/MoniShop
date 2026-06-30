import { Helpers } from "../utils/helpers.js";

const Catalog = {
  currentCategory: "all",

  getFilteredProducts() {
    const productsList = window.products || [];

    if (this.currentCategory === "all") {
      return productsList;
    }

    if (this.currentCategory === "ofertas") {
      return productsList.filter((p) => p.originalPrice && p.discount);
    }

    return productsList.filter((p) => p.category === this.currentCategory);
  },

  render() {
    const filteredProducts = this.getFilteredProducts();

    const productsHTML = filteredProducts
      .map(
        (product, index) => `
        <div class="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all relative flex flex-col group animate-fadeIn" 
             style="animation: fadeIn 0.5s ease-out ${index * 0.1}s both;">
          
          <div onclick="Modal.open(${product.id})" class="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded-md text-[10px] font-bold z-10 cursor-pointer hover:bg-black/80 transition-colors">
            🙈 Vista rápida
          </div>

          <div onclick="window.location.hash='#/product/${product.id}'" class="mb-3 mt-6 cursor-pointer group">
            <img src="${product.images[0]}" class="w-full h-56 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x250?text=Moni+Shop'" />
            <h3 class="font-bold text-moni-brown mt-2 text-sm">${product.name}</h3>
            <p class="text-[11px] text-gray-500 truncate">${product.description}</p>
          </div>

          <div class="mt-auto mb-3">
            ${Helpers.generatePriceBlock(product)}
          </div>

          <div class="flex gap-2">
            ${
              product.stock > 0
                ? `
              <button onclick="Cart.add(${product.id})" class="flex-1 bg-moni-pink text-white py-2.5 rounded-xl cursor-pointer hover:bg-moni-brown transition-colors flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span class="text-xs font-bold">Agregar</span>
              </button>
              <button onclick="Catalog.buyNow(${product.id})" class="flex-1 bg-moni-brown text-white py-2.5 rounded-xl font-bold cursor-pointer hover:bg-moni-pink transition-colors text-xs">
                Comprar
              </button>
            `
                : `
              <button onclick="ProductDetail.notifyWhenAvailable(${product.id})" class="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2.5 rounded-xl font-bold cursor-pointer hover:from-blue-500 hover:to-blue-600 transition-all text-xs flex items-center justify-center gap-1 shadow-lg">
                🔔 Avisarme
              </button>
              <button onclick="window.location.hash='#/'" class="flex-1 bg-gradient-to-r from-purple-400 to-purple-500 text-white py-2.5 rounded-xl font-bold cursor-pointer hover:from-purple-500 hover:to-purple-600 transition-all text-xs flex items-center justify-center gap-1 shadow-lg">
                🛍️ Ver más
              </button>
            `
            }
          </div>
        </div>
      `,
      )
      .join("");

    const emptyMessage =
      filteredProducts.length === 0
        ? `<div class="col-span-full text-center py-20">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-2xl font-black text-moni-brown mb-2">No hay productos en esta categoría</h3>
          <p class="text-gray-500">Prueba con otra categoría</p>
          <button onclick="Catalog.setCategory('all')" class="mt-6 bg-moni-pink text-white font-bold px-8 py-3 rounded-full hover:bg-moni-brown transition-colors">
            Ver todos los productos
          </button>
         </div>`
        : "";

    const filterBadge =
      this.currentCategory !== "all"
        ? `
      <div class="flex justify-center mb-6">
        <div class="inline-flex items-center gap-2 bg-gradient-to-r from-moni-pink/10 to-pink-100 border border-moni-pink/30 rounded-full px-5 py-2 shadow-sm">
          <span class="text-moni-brown/70 text-sm">Filtrando por:</span>
          <span class="text-moni-pink font-black text-sm uppercase tracking-wide">${this.getCategoryName(this.currentCategory)}</span>
          <button onclick="Catalog.setCategory('all')" class="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-moni-pink/20 text-moni-pink hover:bg-moni-pink hover:text-white transition-all font-bold text-xs">
            ✕
          </button>
        </div>
      </div>
    `
        : "";

    return `
      <main id="catalogo" class="max-w-6xl mx-auto py-12 px-6">
        <h2 class="text-3xl font-black mb-8 text-center text-moni-brown">Nuestros Productos</h2>
        
        ${filterBadge}
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          ${productsHTML}
          ${emptyMessage}
        </div>
      </main>
      
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      </style>
    `;
  },

  buyNow(productId) {
    const product = window.products.find((p) => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
      alert("❌ Lo sentimos, este producto está agotado");
      return;
    }

    Modal.open(productId);
  },

  setCategory(category) {
    this.currentCategory = category;
    const catalogoSection = document.getElementById("catalogo");
    if (catalogoSection) {
      const scrollPosition = window.scrollY;
      catalogoSection.outerHTML = this.render();
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  },

  getCategoryName(category) {
    const names = {
      all: "Todos",
      accesorios: "Accesorios",
      belleza: "Belleza",
      hogar: "Hogar",
      ropa: "Ropa",
      tecnologia: "Tecnología",
      papeleria: "Papelería",
      ofertas: "Ofertas",
    };
    return names[category] || category;
  },
};

window.addEventListener("categoryFilter", (event) => {
  Catalog.setCategory(event.detail);
});

window.Catalog = Catalog;
export default Catalog;
