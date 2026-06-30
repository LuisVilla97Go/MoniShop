const Cart = {
  getCart() {
    const cart = localStorage.getItem("moniCart");
    return cart ? JSON.parse(cart) : [];
  },

  saveCart(cart) {
    localStorage.setItem("moniCart", JSON.stringify(cart));
    this.updateCartCount();
  },

  add(productId, quantity = 1) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
      alert("❌ Lo sentimos, este producto está agotado");
      return;
    }

    const cart = this.getCart();
    const existingItem = cart.find((item) => item.id === productId);

    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const totalQtyRequested = currentQtyInCart + quantity;

    if (totalQtyRequested > product.stock) {
      alert(
        `⚠️ Solo quedan ${product.stock} unidades disponibles. Ya tienes ${currentQtyInCart} en el carrito.`,
      );
      return;
    }

    if (existingItem) {
      existingItem.quantity = totalQtyRequested;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.images[0],
        quantity: quantity,
        color: "Azul acero",
        size: "M",
      });
    }

    this.saveCart(cart);
    this.showAddedFeedback(productId);
  },

  showAddedFeedback(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in";
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-bold">¡${product.name} agregado al carrito!</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  },

  remove(productId) {
    const cart = this.getCart().filter((item) => item.id !== productId);
    this.saveCart(cart);

    if (window.location.hash === "#/cart" && window.renderApp) {
      window.renderApp();
    }
  },

  updateQuantity(productId, newQuantity) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const cart = this.getCart();
    const item = cart.find((item) => item.id === productId);

    if (!item) return;

    if (newQuantity < 1) {
      this.remove(productId);
      return;
    }

    if (newQuantity > product.stock) {
      alert(`⚠️ Solo quedan ${product.stock} unidades disponibles`);
      return;
    }

    item.quantity = newQuantity;
    this.saveCart(cart);

    if (window.location.hash === "#/cart" && window.renderApp) {
      window.renderApp();
    }
  },

  getTotal() {
    return this.getCart().reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  },

  getItemCount() {
    return this.getCart().reduce((count, item) => count + item.quantity, 0);
  },

  updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (countEl) {
      const count = this.getItemCount();
      countEl.textContent = count;
      countEl.classList.toggle("hidden", count === 0);
    }
  },

  render() {
    const cart = this.getCart();

    if (cart.length === 0) {
      return `
    <div class="max-w-4xl mx-auto py-20 px-6 text-center relative">

      <div class="absolute top-20 left-10 w-32 h-32 bg-moni-pink/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-40 h-40 bg-moni-beige/50 rounded-full blur-3xl"></div>
      
      <div class="relative mb-8">
        <img src="./images/icons/monito_ve_a_comprar.png" alt="Carrito vacío" class="w-64 h-64 mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
      </div>
      

      <h2 class="text-4xl font-black text-moni-brown mb-3">
        Tu carrito está vacío
      </h2>
      
      <p class="text-gray-500 mb-10 text-lg">
        ¡Agrega productos <span class="text-moni-pink font-bold">kawaii</span> para comenzar!
      </p>
      

      <a href="#/" class="inline-flex items-center gap-2 bg-gradient-to-r from-moni-pink to-pink-500 text-white font-bold px-12 py-4 rounded-full hover:from-moni-brown hover:to-moni-brown transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        ¡Ir de compras!
      </a>
      

      <p class="text-sm text-gray-400 mt-6">
        🚚 Envío gratis en compras mayores a S/ 50
      </p>
    </div>
  `;
    }

    const total = this.getTotal();
    const shipping = total >= 50 ? 0 : 27.9;
    const freeShippingProgress = Math.min((total / 50) * 100, 100);

    return `
      <div class="max-w-6xl mx-auto py-8 px-4">
        <h1 class="text-4xl font-black text-moni-brown mb-8 text-center">🛒 Carrito de compras</h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Productos -->
          <div class="lg:col-span-2 space-y-4">
            ${cart
              .map((item) => {
                const product = products.find((p) => p.id === item.id);
                const currentStock = product ? product.stock : 0;

                return `
              <div class="bg-white rounded-3xl p-6 shadow-lg border-2 border-moni-beige hover:border-moni-pink/50 transition-all">
                <div class="flex gap-4">
                  <div class="flex items-start">
                    <input type="checkbox" checked class="w-5 h-5 rounded border-moni-pink text-moni-pink focus:ring-moni-pink mt-1 cursor-pointer" />
                  </div>
                  
                  <div class="relative">
                    <img src="${item.image}" alt="${item.name}" class="w-28 h-28 object-cover rounded-2xl border-2 border-moni-beige" />
                    ${
                      currentStock <= 10 && currentStock > 0
                        ? `
                      <div class="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        ¡QUEDAN ${currentStock}!
                      </div>
                    `
                        : currentStock <= 0
                          ? `
                      <div class="absolute -top-2 -left-2 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        SIN STOCK
                      </div>
                    `
                          : ""
                    }
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        ${
                          item.originalPrice
                            ? `
                          <span class="bg-moni-pink text-white text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block shadow-sm">
                            ✨ OFERTA DEL DÍA
                          </span>
                        `
                            : ""
                        }
                        <h3 class="font-bold text-moni-brown text-lg">${item.name}</h3>
                        <p class="text-sm text-gray-500 mt-1">Color: ${item.color}, Talla: ${item.size}</p>
                      </div>
                      <button onclick="Cart.remove(${item.id})" class="text-gray-400 hover:text-moni-pink transition-colors p-2 hover:bg-moni-beige rounded-full">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                    
                    <div class="flex justify-between items-end mt-4">
                      <div class="flex items-center gap-3">
                        <div class="flex items-center border-2 border-moni-beige rounded-full overflow-hidden">
                          <button onclick="Cart.updateQuantity(${item.id}, ${item.quantity - 1})" class="px-4 py-2 hover:bg-moni-pink hover:text-white transition-colors text-moni-brown font-bold bg-moni-beige">−</button>
                          <span class="px-4 py-2 font-bold text-moni-brown bg-white">${item.quantity}</span>
                          <button onclick="Cart.updateQuantity(${item.id}, ${item.quantity + 1})" class="px-4 py-2 hover:bg-moni-pink hover:text-white transition-colors text-moni-brown font-bold bg-moni-beige" ${item.quantity >= currentStock ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ""}>+</button>
                        </div>
                        <span class="text-xs text-gray-500">${currentStock} disponibles</span>
                      </div>
                      
                      <div class="text-right">
                        ${item.originalPrice ? `<div class="text-sm text-gray-400 line-through">S/ ${item.originalPrice.toFixed(2)}</div>` : ""}
                        <div class="text-2xl font-black text-moni-brown">S/ ${(item.price * item.quantity).toFixed(2)}</div>
                        ${
                          item.discount
                            ? `
                          <span class="bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mt-1 shadow-sm">
                            ${item.discount}% OFF
                          </span>
                        `
                            : ""
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
              })
              .join("")}
            
            <div class="bg-white rounded-3xl p-6 shadow-lg border-2 border-moni-beige">
              <div class="flex justify-between items-center mb-3">
                <span class="font-bold text-moni-brown text-lg">📦 Envío</span>
                <div class="text-right">
                  <span class="text-gray-400 line-through">S/ ${shipping.toFixed(2)}</span>
                  <span class="text-green-600 font-bold ml-2 text-lg">${shipping === 0 ? "¡Gratis!" : ""}</span>
                </div>
              </div>
              <div class="w-full bg-moni-beige rounded-full h-3 mb-3 overflow-hidden">
                <div class="bg-gradient-to-r from-moni-pink to-moni-brown h-3 rounded-full transition-all duration-500" style="width: ${freeShippingProgress}%"></div>
              </div>
              <p class="text-sm text-gray-600">
                ${
                  total >= 50
                    ? '✅ <span class="font-bold text-green-600">¡Envío gratis aplicado!</span>'
                    : `Aprovecha tu <span class="font-bold text-moni-pink">envío gratis</span> agregando S/ ${(50 - total).toFixed(2)} más. <a href="#/" class="text-moni-pink font-bold hover:underline">Ver productos ›</a>`
                }
              </p>
            </div>
          </div>
          
          <div class="lg:col-span-1">
            <div class="bg-white rounded-3xl p-6 shadow-lg border-2 border-moni-beige sticky top-24">
              <h2 class="text-2xl font-black text-moni-brown mb-6">📋 Resumen de compra</h2>
              
              <div class="space-y-4 mb-6">
                <div class="flex justify-between text-sm border-b border-moni-beige pb-3">
                  <span class="text-gray-600">Producto${cart.length > 1 ? "s" : ""}</span>
                  <span class="font-bold text-moni-brown">S/ ${total.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm border-b border-moni-beige pb-3">
                  <span class="text-gray-600">Envío</span>
                  <span class="font-bold ${shipping === 0 ? "text-green-600" : "text-gray-400 line-through"}">
                    ${shipping === 0 ? "Gratis" : `S/ ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div class="pt-2">
                  <button class="text-sm text-blue-600 hover:text-moni-pink font-bold transition-colors flex items-center gap-1 mb-4">
                    🏷️ Ingresar código de cupón
                  </button>
                </div>
                <div class="border-t-2 border-moni-beige pt-4">
                  <div class="flex justify-between items-center">
                    <span class="text-xl font-black text-moni-brown">Total</span>
                    <span class="text-3xl font-black text-moni-pink">S/ ${(total + shipping).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <a href="./pages/checkout.html" class="block w-full bg-moni-pink text-white font-black py-4 rounded-full hover:bg-moni-brown transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg text-center">
                Continuar (${this.getItemCount()}) ✨
              </a>
              
              <a href="#/" class="block text-center mt-4 text-moni-pink font-bold hover:underline transition-colors">
                ← Seguir comprando
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

window.Cart = Cart;
export default Cart;
