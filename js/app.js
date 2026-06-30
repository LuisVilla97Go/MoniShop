// js/app.js

import { products } from "./data/products.js";
import { Helpers } from "./utils/helpers.js";
import Header from "./components/header.js";
import Categories from "./components/categories.js";
import Catalog from "./components/catalog.js";
import About from "./components/about.js";
import Modal from "./components/modal.js";
import ProductDetail from "./components/product-detail.js";
import Cart from "./components/cart.js";
import Footer from "./components/footer.js";

function renderApp() {
  const app = document.getElementById("app");
  const hash = window.location.hash;
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");

  // 👇 SIEMPRE recargar productos desde localStorage
  const storedProducts = localStorage.getItem("moniProducts");
  if (storedProducts && storedProducts !== "[]" && storedProducts !== "null") {
    try {
      window.products = JSON.parse(storedProducts);
    } catch (e) {
      console.error("Error al cargar productos:", e);
    }
  }

  let content = "";

  content += Header.render();

  if (hash === "#/about") {
    content += About.render();
  } else if (hash === "#/cart") {
    content += Cart.render();
  } else if (hash === "#/checkout-success" && orderId) {
    content += `
      <div class="max-w-4xl mx-auto py-20 px-6 text-center animate-fade-in">
        <div class="text-9xl mb-6">🎉</div>
        <h2 class="text-5xl font-black text-moni-brown mb-4">¡Pedido Confirmado!</h2>
        <p class="text-2xl text-gray-600 mb-2">Gracias por tu compra en Moni Shop</p>
        <p class="text-gray-500 mb-8 text-lg">Número de orden: <span class="font-bold text-moni-pink text-2xl">#${orderId}</span></p>
        
        <div class="bg-moni-cream p-8 rounded-2xl max-w-2xl mx-auto mb-8 shadow-lg">
          <div class="flex items-center justify-center gap-3 mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-lg font-bold text-moni-brown">Pedido procesado correctamente</span>
          </div>
          <p class="text-sm text-gray-600 mb-2">Te hemos enviado un correo con los detalles de tu pedido.</p>
          <p class="text-sm text-gray-600">Tiempo de entrega estimado: <span class="font-bold text-moni-pink">5-7 días hábiles</span></p>
        </div>

        <div class="flex gap-4 justify-center flex-wrap">
          <a href="#/" class="bg-moni-pink text-white font-bold px-8 py-4 rounded-full hover:bg-moni-brown transition-colors shadow-lg text-lg">
            🛍️ Seguir comprando
          </a>
          <button onclick="window.print()" class="bg-moni-beige text-moni-brown font-bold px-8 py-4 rounded-full hover:bg-moni-pink/20 transition-colors shadow-lg text-lg">
            🖨️ Imprimir comprobante
          </button>
        </div>
      </div>
    `;
  } else if (hash.startsWith("#/product/")) {
    const productId = parseInt(hash.split("/")[2]);
    content += ProductDetail.render(productId);
  } else {
    content += Categories.render();
    content += Catalog.render();
  }

  content += Footer.render();
  content += Modal.render();

  app.innerHTML = content;

  Cart.updateCartCount();

  if (typeof Modal.init === "function") {
    Modal.init();
  }

  window.scrollTo(0, 0);
}

window.renderApp = renderApp;

document.addEventListener("DOMContentLoaded", () => {
  renderApp();
});

window.addEventListener("hashchange", renderApp);
