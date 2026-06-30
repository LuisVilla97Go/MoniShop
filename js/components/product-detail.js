const ProductDetail = {
  currentImageIndex: 0,
  currentProductId: null,

  getReviews(productId) {
    const reviews = localStorage.getItem(`moniReviews_${productId}`);
    return reviews ? JSON.parse(reviews) : [];
  },

  saveReview(productId, review) {
    const reviews = this.getReviews(productId);
    reviews.push({
      ...review,
      date: new Date().toISOString(),
      id: Date.now(),
    });
    localStorage.setItem(`moniReviews_${productId}`, JSON.stringify(reviews));
  },

  getAverageRating(productId) {
    const reviews = this.getReviews(productId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  },

  notifyWhenAvailable(productId) {
    const product = window.products.find((p) => p.id === productId);
    if (!product) return;

    const email = prompt(
      `📧 Te avisaremos cuando "${product.name}" esté disponible.\n\nIngresa tu correo:`,
    );

    if (email && email.includes("@")) {
      const notifications = JSON.parse(
        localStorage.getItem("moniNotifications") || "[]",
      );
      const alreadyRegistered = notifications.some(
        (n) => n.productId === productId && n.email === email,
      );

      if (!alreadyRegistered) {
        notifications.push({
          productId: productId,
          productName: product.name,
          email: email,
          date: new Date().toISOString(),
        });
        localStorage.setItem(
          "moniNotifications",
          JSON.stringify(notifications),
        );
        alert(
          `✅ ¡Perfecto!\n\nTe enviaremos un correo a ${email} cuando "${product.name}" vuelva a estar en stock. 🎉`,
        );
      } else {
        alert(
          `ℹ️ Ya estás registrado para recibir notificaciones sobre "${product.name}".`,
        );
      }
    } else if (email) {
      alert("❌ Por favor ingresa un correo válido");
    }
  },

  render(productId) {
    this.currentProductId = productId;
    this.currentImageIndex = 0;

    const product = window.products.find((p) => p.id === productId);
    const reviews = this.getReviews(productId);
    const avgRating = this.getAverageRating(productId);

    if (!product) {
      return `<div class="text-center py-20">Producto no encontrado</div>`;
    }

    let stockInfo = "";
    if (product.stock !== undefined) {
      if (product.stock <= 0) {
        stockInfo = `
          <div class="bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl p-4 mb-4 text-center shadow-sm">
            <p class="text-gray-600 font-bold text-lg mb-1">📦 Sin stock</p>
            <p class="text-gray-500 text-sm">Pero puedes avisarnos para cuando llegue</p>
          </div>
        `;
      } else if (product.stock <= 10) {
        stockInfo = `
          <div class="bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-300 rounded-xl p-4 mb-4 text-center shadow-sm">
            <p class="text-orange-600 font-bold text-lg mb-1">⚠️ ¡Solo quedan ${product.stock}!</p>
            <p class="text-orange-500 text-sm">Compra rápido antes de que se agote</p>
          </div>
        `;
      } else {
        stockInfo = `
          <div class="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300 rounded-xl p-4 mb-4 text-center shadow-sm">
            <p class="text-green-600 font-bold">✓ ${product.stock} unidades disponibles</p>
          </div>
        `;
      }
    }

    const thumbnailsHTML = product.images
      .map(
        (img, index) => `
      <div onclick="ProductDetail.changeImage(${index})" 
           class="w-20 h-20 bg-moni-beige rounded border-2 ${index === this.currentImageIndex ? "border-moni-pink" : "border-moni-brown/20"} cursor-pointer hover:border-moni-pink overflow-hidden">
        <img src="${img}" class="w-full h-full object-cover" alt="Miniatura ${index + 1}" />
      </div>
    `,
      )
      .join("");

    const reviewsHTML =
      reviews.length > 0
        ? reviews
            .map(
              (review) => `
          <div class="bg-moni-cream p-4 rounded-lg border border-moni-pink/20">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-moni-pink/50 flex items-center justify-center text-white font-bold text-xs">
                  ${review.name.charAt(0).toUpperCase()}
                </div>
                <span class="font-bold">${review.name}</span>
              </div>
              <span class="text-xs text-gray-500">${new Date(review.date).toLocaleDateString()}</span>
            </div>
            <p class="text-yellow-500 text-sm">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</p>
            <p class="text-sm mt-2 italic">"${review.comment}"</p>
          </div>
        `,
            )
            .join("")
        : `<p class="text-gray-500 text-center py-8">Aún no hay reseñas. ¡Sé el primero en opinar!</p>`;

    const priceBlockHTML = product.originalPrice
      ? `
        <div class="mb-6 overflow-hidden rounded-xl shadow-lg border-2 border-moni-pink/30">
          <div class="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4">
            <img src="./images/ui/MoniBan.png" alt="Moni Ofertas" class="absolute inset-0 w-full h-full object-cover opacity-30" onerror="this.style.display='none'" />
            <div class="relative z-10 flex items-center justify-between">
              <div>
                <h3 class="text-white font-black text-xl drop-shadow-md">🔥 Moni Ofertas</h3>
                <p class="text-white/90 text-xs">¡Termina pronto!</p>
              </div>
              <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span class="text-white text-xs font-bold">Termina en:</span>
                <div id="countdown" class="flex gap-1 font-mono font-bold text-white text-lg">
                  <span id="hours">07</span>:<span id="minutes">15</span>:<span id="seconds">38</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-4 border-x border-b border-moni-pink rounded-b-xl">
            <div class="flex items-baseline gap-3">
              <span class="text-4xl font-black text-moni-brown">${Helpers.formatPrice(product.price)}</span>
              <span class="text-sm text-gray-500 line-through">${Helpers.formatPrice(product.originalPrice)}</span>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <span class="inline-block bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                Inferior a los últimos 90 días
              </span>
              <span class="inline-block bg-moni-pink text-white text-xs font-bold px-2 py-1 rounded">
                -${product.discount}% OFF
              </span>
            </div>
          </div>
        </div>
      `
      : `
        <div class="mb-6 p-4 bg-moni-cream rounded-xl border border-moni-pink/30">
          <div class="text-4xl font-black text-moni-pink">${Helpers.formatPrice(product.price)}</div>
        </div>
      `;

    const buyPanelHTML =
      product.stock > 0
        ? `
      <div class="lg:col-span-3 border border-moni-beige rounded-2xl p-5 h-fit shadow-lg bg-gradient-to-b from-white to-moni-cream/30">
        <p class="text-sm font-bold mb-4">Vendido por: <span class="text-blue-600 font-bold">Moni Shop Oficial</span></p>
        
        ${stockInfo}
        
        <div class="space-y-3 mb-6 border-t border-moni-beige pt-4 text-sm font-medium">
          <p class="text-green-700 flex items-center gap-2"><span class="text-lg">🚚</span> Envío gratis</p>
          <p class="text-moni-brown/70 flex items-center gap-2"><span class="text-lg">📦</span> Entrega en 15 días</p>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-bold text-moni-brown mb-2">Cantidad:</label>
          <div class="flex items-center gap-3">
            <button onclick="ProductDetail.changeQuantity(-1)" class="w-12 h-12 bg-moni-beige rounded-xl font-bold text-moni-brown hover:bg-moni-pink hover:text-white transition-all text-xl shadow-md">-</button>
            <input type="number" id="detail-qty-input" value="1" min="1" max="${product.stock}" class="flex-1 h-12 text-center border-2 border-moni-beige rounded-xl font-bold focus:border-moni-pink focus:outline-none text-lg shadow-sm" onchange="ProductDetail.validateQuantity()" />
            <button onclick="ProductDetail.changeQuantity(1)" class="w-12 h-12 bg-moni-beige rounded-xl font-bold text-moni-brown hover:bg-moni-pink hover:text-white transition-all text-xl shadow-md">+</button>
          </div>
          <p class="text-xs text-gray-500 mt-2 text-center">Máximo: ${product.stock} unidades disponibles</p>
        </div>
        
        <button onclick="ProductDetail.addToCart(${product.id})" class="w-full bg-gradient-to-r from-moni-pink to-pink-500 text-white font-bold py-4 rounded-xl mb-2 hover:from-moni-brown hover:to-brown-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg">
          🛒 Agregar al carrito
        </button>
        <button onclick="ProductDetail.buyNow(${product.id})" class="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-4 rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg">
          ⚡ Comprar ahora
        </button>
      </div>
    `
        : `
      <div class="lg:col-span-3 border-2 border-gray-200 rounded-2xl p-5 h-fit shadow-lg bg-gradient-to-b from-gray-50 to-gray-100">
        <p class="text-sm font-bold mb-4">Vendido por: <span class="text-blue-600 font-bold">Moni Shop Oficial</span></p>
        
        ${stockInfo}
        
        <div class="space-y-3 mb-6 border-t border-gray-300 pt-4 text-sm font-medium">
          <p class="text-gray-600 flex items-center gap-2"><span class="text-lg">📦</span> Entrega en 15 días cuando haya stock</p>
        </div>
        
        <button onclick="ProductDetail.notifyWhenAvailable(${product.id})" class="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-4 rounded-xl mb-2 hover:from-blue-500 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg flex items-center justify-center gap-2">
          🔔 Avisarme cuando llegue
        </button>
        
        <button onclick="window.location.hash='#/'" class="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-purple-500 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg flex items-center justify-center gap-2">
          🛍️ Ver otros productos
        </button>
      </div>
    `;

    return `
      <div class="max-w-6xl mx-auto space-y-8 py-8 px-4">
        <button onclick="window.history.back()" class="flex items-center gap-2 text-moni-brown hover:text-moni-pink font-bold mb-4 transition-colors">
          ← Volver a la tienda
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-2xl shadow-xl border border-moni-beige">
          
          <div class="lg:col-span-5">
            <div class="aspect-square bg-moni-beige rounded-2xl overflow-hidden mb-4 flex items-center justify-center border-2 border-moni-pink/20 shadow-inner">
              <img id="main-product-image" src="${product.images[this.currentImageIndex]}" alt="${product.name}" class="w-full h-full object-cover">
            </div>
            
            <div class="flex gap-2">
              ${thumbnailsHTML}
            </div>
          </div>

          <div class="lg:col-span-4">
            <h1 class="text-2xl font-black mb-2 text-moni-brown">${product.name}</h1>
            <div class="text-sm text-yellow-600 mb-4 flex items-center gap-1 font-bold">
              <span>${"★".repeat(Math.round(avgRating))}${"☆".repeat(5 - Math.round(avgRating))}</span>
              <span class="text-moni-brown/60 font-normal">${avgRating} (${reviews.length} valoraciones | ${product.sales || 0} vendidos)</span>
            </div>
            
            ${priceBlockHTML}

            <div class="mb-6 space-y-4">
              <p class="font-bold text-lg">Descripción:</p>
              <p class="text-moni-brown/70 leading-relaxed">${product.description}</p>
            </div>
          </div>

          ${buyPanelHTML}
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-lg border border-moni-beige">
          <h2 class="text-2xl font-black mb-6 text-moni-brown border-b-2 border-moni-pink/30 pb-4">Reseñas de clientes</h2>

          <div class="mb-8 bg-gradient-to-r from-moni-cream to-moni-beige p-6 rounded-2xl border-2 border-moni-pink/30">
            <h3 class="font-black mb-4 text-lg">Escribe tu reseña</h3>
            <form id="review-form" onsubmit="ProductDetail.submitReview(event, ${product.id})">
              <div class="mb-4">
                <label class="block text-sm font-bold text-moni-brown mb-2">Tu nombre:</label>
                <input type="text" id="review-name" required class="w-full px-4 py-3 rounded-xl border-2 border-moni-beige focus:border-moni-pink focus:outline-none transition-colors" placeholder="Ej: María G." />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-bold text-moni-brown mb-2">Calificación:</label>
                <div class="flex gap-2 text-3xl flex-row-reverse justify-end">
                  ${[5, 4, 3, 2, 1]
                    .map(
                      (star) => `
                    <input type="radio" name="rating" value="${star}" id="star-${star}" required class="hidden peer" />
                    <label for="star-${star}" class="cursor-pointer text-gray-300 peer-checked:text-yellow-500 hover:text-yellow-500 hover:scale-125 transition-all">★</label>
                    `,
                    )
                    .join("")}
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-bold text-moni-brown mb-2">Tu opinión sobre ${product.name}:</label>
                <textarea id="review-comment" required rows="3" class="w-full px-4 py-3 rounded-xl border-2 border-moni-beige focus:border-moni-pink focus:outline-none transition-colors" placeholder="Cuéntanos tu experiencia con este producto..."></textarea>
              </div>
              <button type="submit" class="bg-gradient-to-r from-moni-pink to-pink-500 text-white font-bold px-8 py-3 rounded-xl hover:from-moni-brown hover:to-brown-600 transition-all shadow-lg">
                Publicar reseña ✨
              </button>
            </form>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${reviewsHTML}
          </div>
        </div>
      </div>
    `;
  },

  changeQuantity(delta) {
    const input = document.getElementById("detail-qty-input");
    if (!input) return;

    const product = window.products.find((p) => p.id === this.currentProductId);
    if (!product) return;

    const currentQty = parseInt(input.value) || 1;
    const newQty = currentQty + delta;

    if (newQty < 1) {
      input.value = 1;
    } else if (newQty > product.stock) {
      input.value = product.stock;
      alert(`❌ Solo quedan ${product.stock} unidades disponibles`);
    } else {
      input.value = newQty;
    }
  },

  validateQuantity() {
    const input = document.getElementById("detail-qty-input");
    if (!input) return;

    const product = window.products.find((p) => p.id === this.currentProductId);
    if (!product) return;

    let qty = parseInt(input.value) || 1;

    if (qty < 1) qty = 1;
    if (qty > product.stock) {
      qty = product.stock;
      alert(`❌ Solo quedan ${product.stock} unidades disponibles`);
    }

    input.value = qty;
  },

  addToCart(productId) {
    const input = document.getElementById("detail-qty-input");
    const quantity = input ? parseInt(input.value) || 1 : 1;

    Cart.add(productId, quantity);
  },

  buyNow(productId) {
    const input = document.getElementById("detail-qty-input");
    const quantity = input ? parseInt(input.value) || 1 : 1;

    const product = window.products.find((p) => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
      alert("❌ Lo sentimos, este producto está agotado");
      return;
    }

    if (quantity > product.stock) {
      alert(`❌ Solo quedan ${product.stock} unidades disponibles`);
      return;
    }

    Cart.add(productId, quantity);
    window.location.href = "./pages/checkout.html";
  },

  changeImage(index) {
    if (!this.currentProductId) return;

    this.currentImageIndex = index;

    const product = window.products.find((p) => p.id === this.currentProductId);
    if (!product) return;

    const mainImage = document.getElementById("main-product-image");
    if (mainImage) {
      mainImage.src = product.images[index];
      mainImage.alt = product.name;
    }

    const thumbnails = document.querySelectorAll(".w-20.h-20");
    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.remove("border-moni-brown/20");
        thumb.classList.add("border-moni-pink");
      } else {
        thumb.classList.remove("border-moni-pink");
        thumb.classList.add("border-moni-brown/20");
      }
    });
  },

  submitReview(event, productId) {
    event.preventDefault();

    const name = document.getElementById("review-name").value;
    const comment = document.getElementById("review-comment").value;
    const rating = parseInt(
      document.querySelector('input[name="rating"]:checked').value,
    );

    this.saveReview(productId, { name, comment, rating });

    const app = document.getElementById("app");
    app.innerHTML = this.render(productId);

    this.startCountdown();
  },

  startCountdown() {
    const countdownEl = document.getElementById("countdown");
    if (!countdownEl) return;

    let hours = 7;
    let minutes = 15;
    let seconds = 38;

    setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
          if (hours < 0) hours = 23;
        }
      }

      const hoursEl = document.getElementById("hours");
      const minutesEl = document.getElementById("minutes");
      const secondsEl = document.getElementById("seconds");

      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
      if (minutesEl)
        minutesEl.textContent = minutes.toString().padStart(2, "0");
      if (secondsEl)
        secondsEl.textContent = seconds.toString().padStart(2, "0");
    }, 1000);
  },
};

const originalRender = ProductDetail.render;
ProductDetail.render = function (productId) {
  setTimeout(() => this.startCountdown(), 100);
  return originalRender.call(this, productId);
};

window.ProductDetail = ProductDetail;
export default ProductDetail;
