const Checkout = {
  cart: [],
  formData: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "PE",
    paymentMethod: "card",
  },

  render() {
    const cartData = localStorage.getItem("moniCart");
    this.cart = cartData ? JSON.parse(cartData) : [];

    if (this.cart.length === 0) {
      return `
        <div class="text-center py-20 animate-fade-in">
          <div class="text-8xl mb-6">🛒</div>
          <h2 class="text-3xl font-black text-moni-brown mb-4">Tu carrito está vacío</h2>
          <p class="text-gray-500 mb-8">Agrega productos antes de continuar</p>
          <a href="../index.html" class="inline-block bg-moni-pink text-white font-bold px-8 py-3 rounded-full hover:bg-moni-brown transition-colors">
            🛍️ Ir a la tienda
          </a>
        </div>
      `;
    }

    const subtotal = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal >= 50 ? 0 : 27.9;
    const total = subtotal + shipping;

    return `
      <form id="checkout-form" class="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
        
        <div class="lg:col-span-3 space-y-6">
          
          <div class="bg-white p-6 rounded-2xl shadow-lg border-2 border-moni-beige">
            <h2 class="text-2xl font-black text-moni-brown mb-6 flex items-center gap-3">
              <span class="w-10 h-10 bg-moni-pink text-white rounded-full flex items-center justify-center text-lg font-bold">1</span>
              Datos Personales
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-moni-brown mb-2">Nombre completo *</label>
                <input type="text" id="fullName" required 
                       class="w-full px-4 py-3 rounded-lg border-2 border-moni-beige focus:border-moni-pink focus:outline-none transition-colors"
                       placeholder="Ej: María García López"
                       value="${this.formData.fullName}" />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-moni-brown mb-2">Correo electrónico *</label>
                  <input type="email" id="email" required 
                         class="w-full px-4 py-3 rounded-lg border-2 border-moni-beige focus:border-moni-pink focus:outline-none transition-colors"
                         placeholder="maria@email.com"
                         value="${this.formData.email}" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-moni-brown mb-2">Teléfono *</label>
                  <input type="tel" id="phone" required 
                         class="w-full px-4 py-3 rounded-lg border-2 border-moni-beige focus:border-moni-pink focus:outline-none transition-colors"
                         placeholder="999 888 777"
                         value="${this.formData.phone}" />
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-lg border-2 border-moni-beige">
            <h2 class="text-2xl font-black text-moni-brown mb-6 flex items-center gap-3">
              <span class="w-10 h-10 bg-moni-pink text-white rounded-full flex items-center justify-center text-lg font-bold">2</span>
              Dirección de Envío
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-moni-brown mb-2">Dirección completa *</label>
                <input type="text" id="address" required 
                       class="w-full px-4 py-3 rounded-lg border-2 border-moni-beige focus:border-moni-pink focus:outline-none transition-colors"
                       placeholder="Av. Principal 123, Depto 4B"
                       value="${this.formData.address}" />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-bold text-moni-brown mb-2">Ciudad *</label>
                  <input type="text" id="city" required 
                         class="w-full px-4 py-3 rounded-lg border-2 border-moni-beige focus:border-moni-pink focus:outline-none transition-colors"
                         placeholder="Lima"
                         value="${this.formData.city}" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-moni-brown mb-2">Código Postal *</label>
                  <input type="text" id="zipCode" required 
                         class="w-full px-4 py-3 rounded-lg border-2 border-moni-beige focus:border-moni-pink focus:outline-none transition-colors"
                         placeholder="15001"
                         value="${this.formData.zipCode}" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-moni-brown mb-2">País</label>
                  <select id="country" class="w-full px-4 py-3 rounded-lg border-2 border-moni-beige focus:border-moni-pink focus:outline-none transition-colors">
                    <option value="PE" ${this.formData.country === "PE" ? "selected" : ""}>Perú</option>
                    <option value="CO" ${this.formData.country === "CO" ? "selected" : ""}>Colombia</option>
                    <option value="MX" ${this.formData.country === "MX" ? "selected" : ""}>México</option>
                    <option value="AR" ${this.formData.country === "AR" ? "selected" : ""}>Argentina</option>
                    <option value="CL" ${this.formData.country === "CL" ? "selected" : ""}>Chile</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-lg border-2 border-moni-beige">
            <h2 class="text-2xl font-black text-moni-brown mb-6 flex items-center gap-3">
              <span class="w-10 h-10 bg-moni-pink text-white rounded-full flex items-center justify-center text-lg font-bold">3</span>
              Método de Pago
            </h2>
            
            <div class="space-y-3">
              <label class="flex items-center gap-4 p-4 border-2 border-moni-beige rounded-lg cursor-pointer hover:border-moni-pink transition-all ${this.formData.paymentMethod === "card" ? "border-moni-pink bg-moni-pink/5" : ""}">
                <input type="radio" name="payment" value="card" ${this.formData.paymentMethod === "card" ? "checked" : ""} class="w-5 h-5 text-moni-pink" />
                <div class="flex-1">
                  <span class="font-bold text-moni-brown text-lg">💳 Tarjeta de Crédito/Débito</span>
                  <p class="text-xs text-gray-500">Visa, Mastercard, American Express</p>
                </div>
              </label>
              
              <label class="flex items-center gap-4 p-4 border-2 border-moni-beige rounded-lg cursor-pointer hover:border-moni-pink transition-all ${this.formData.paymentMethod === "cash" ? "border-moni-pink bg-moni-pink/5" : ""}">
                <input type="radio" name="payment" value="cash" ${this.formData.paymentMethod === "cash" ? "checked" : ""} class="w-5 h-5 text-moni-pink" />
                <div class="flex-1">
                  <span class="font-bold text-moni-brown text-lg">💵 Pago contra entrega</span>
                  <p class="text-xs text-gray-500">Paga en efectivo al recibir tu pedido</p>
                </div>
              </label>
              
              <label class="flex items-center gap-4 p-4 border-2 border-moni-beige rounded-lg cursor-pointer hover:border-moni-pink transition-all ${this.formData.paymentMethod === "transfer" ? "border-moni-pink bg-moni-pink/5" : ""}">
                <input type="radio" name="payment" value="transfer" ${this.formData.paymentMethod === "transfer" ? "checked" : ""} class="w-5 h-5 text-moni-pink" />
                <div class="flex-1">
                  <span class="font-bold text-moni-brown text-lg">🏦 Transferencia bancaria</span>
                  <p class="text-xs text-gray-500">BCP, Interbank, BBVA, Scotia</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-white p-6 rounded-2xl shadow-lg border-2 border-moni-beige sticky top-24">
            <h2 class="text-2xl font-black text-moni-brown mb-6 flex items-center gap-2">
              <span>📋</span> Resumen de Compra
            </h2>
            
            <div class="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
              ${this.cart
                .map(
                  (item) => `
                <div class="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <img src="../${item.image?.replace("./", "") || "https://via.placeholder.com/80"}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg border border-gray-200" onerror="this.src='https://via.placeholder.com/80?text=Producto'" />
                  <div class="flex-1">
                    <h4 class="font-bold text-sm text-moni-brown line-clamp-2">${item.name}</h4>
                    <p class="text-xs text-gray-500 mt-1">Cantidad: ${item.quantity}</p>
                    <p class="text-moni-pink font-bold text-sm mt-1">S/ ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>

            <div class="space-y-3 pt-4 border-t-2 border-moni-beige">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-bold">S/ ${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Envío</span>
                <span class="font-bold ${shipping === 0 ? "text-green-600" : ""}">
                  ${shipping === 0 ? "¡Gratis! " : `S/ ${shipping.toFixed(2)}`}
                </span>
              </div>
              ${
                shipping > 0
                  ? `
                <div class="bg-moni-pink/10 border border-moni-pink/30 rounded-lg p-3 text-xs text-moni-brown">
                  💡 Agrega S/ ${(50 - subtotal).toFixed(2)} más para envío gratis
                </div>
              `
                  : ""
              }
              <div class="flex justify-between text-2xl font-black text-moni-brown pt-3 border-t border-gray-200">
                <span>Total</span>
                <span class="text-moni-pink">S/ ${total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" 
                    class="w-full bg-gradient-to-r from-moni-pink to-pink-500 text-white font-black py-4 rounded-full mt-6 hover:shadow-xl hover:scale-105 transition-all text-lg flex items-center justify-center gap-2">
              <span>✨</span>
              <span>Confirmar Pedido - S/ ${total.toFixed(2)}</span>
            </button>

            <p class="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Pago 100% seguro • Cancela cuando quieras
            </p>
          </div>
        </div>
      </form>
    `;
  },

  init() {
    console.log("🔍 Checkout init llamado");

    setTimeout(() => {
      this.setupEventListeners();
    }, 200);
  },

  setupEventListeners() {
    console.log("️ Configurando event listeners...");

    const form = document.getElementById("checkout-form");
    if (!form) {
      console.error("❌ No se encontró el formulario checkout-form");
      return;
    }

    console.log("✅ Formulario encontrado, agregando event listener...");

    form.addEventListener("submit", (e) => {
      console.log(" Formulario enviado");
      e.preventDefault();
      this.processOrder();
    });

    [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "zipCode",
      "country",
    ].forEach((field) => {
      const input = document.getElementById(field);
      if (input) {
        input.addEventListener("input", (e) => {
          this.formData[field] = e.target.value;
        });
      }
    });

    document.querySelectorAll('input[name="payment"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.formData.paymentMethod = e.target.value;
        const content = document.getElementById("checkout-content");
        content.innerHTML = this.render();
        this.init();
      });
    });
  },

  processOrder() {
    console.log(" Procesando orden...");

    if (
      !this.formData.fullName ||
      !this.formData.email ||
      !this.formData.phone ||
      !this.formData.address
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const subtotal = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal >= 50 ? 0 : 27.9;

    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: { ...this.formData },
      items: [...this.cart],
      subtotal: subtotal,
      shipping: shipping,
      total: subtotal + shipping,
      status: "completed",
      paymentMethod: this.formData.paymentMethod,
    };

    console.log("📦 Orden creada:", order);

    let productsData = JSON.parse(localStorage.getItem("moniProducts") || "[]");

    if (
      productsData.length === 0 &&
      window.products &&
      window.products.length > 0
    ) {
      productsData = [...window.products];
    }

    console.log(" Productos antes:", productsData);

    this.cart.forEach((cartItem) => {
      const productIndex = productsData.findIndex((p) => p.id === cartItem.id);
      if (productIndex !== -1) {
        if (productsData[productIndex].stock !== undefined) {
          productsData[productIndex].stock = Math.max(
            0,
            productsData[productIndex].stock - cartItem.quantity,
          );
        }

        if (productsData[productIndex].sales !== undefined) {
          productsData[productIndex].sales += cartItem.quantity;
        }
      }
    });

    console.log("📦 Productos después:", productsData);

    localStorage.setItem("moniProducts", JSON.stringify(productsData));
    window.products = productsData;

    const orders = JSON.parse(localStorage.getItem("moniOrders") || "[]");
    orders.push(order);
    localStorage.setItem("moniOrders", JSON.stringify(orders));

    console.log("✅ Orden guardada:", order.id);

    localStorage.removeItem("moniCart");

    window.location.href = `../index.html#/checkout-success?orderId=${order.id}`;
  },
};

window.Checkout = Checkout;

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Checkout DOM ready");

  const content = document.getElementById("checkout-content");
  if (content) {
    content.innerHTML = Checkout.render();
    Checkout.init();
  }
});

export default Checkout;
