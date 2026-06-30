export const Helpers = {
  formatPrice(price) {
    return `S/ ${price.toFixed(2)}`;
  },

  getProductRating(productId) {
    const reviews = localStorage.getItem(`moniReviews_${productId}`);
    if (!reviews) return { rating: 4.5, count: 0 };

    const reviewsArray = JSON.parse(reviews);
    if (reviewsArray.length === 0) return { rating: 4.5, count: 0 };

    const sum = reviewsArray.reduce((acc, r) => acc + r.rating, 0);
    return {
      rating: (sum / reviewsArray.length).toFixed(1),
      count: reviewsArray.length,
    };
  },

  getProductSales(productId) {
    const savedSales = localStorage.getItem(`moniSales_${productId}`);
    return savedSales ? parseInt(savedSales) : 0;
  },

  generateStars(rating = 4.1) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return "★".repeat(fullStars) + "☆".repeat(emptyStars);
  },

  generatePriceBlock(product) {
    const { rating } = this.getProductRating(product.id);
    const soldCount = this.getProductSales(product.id) || product.sales || 0;
    const hasFreeShipping = product.price >= 25;
    const stockPercentage = product.stock
      ? Math.min((product.stock / 20) * 100, 100)
      : 100;

    // Si hay OFERTA
    if (product.originalPrice && product.discount) {
      return `
        <div class="relative h-[52px] bg-gradient-to-r from-pink-50 to-white rounded-lg overflow-hidden mb-2 border border-moni-pink/30">
          <img src="./images/ui/moniOfert.png" alt="Oferta" class="absolute right-0 top-0 h-full w-auto object-contain" />
          
          <div class="relative z-10 flex items-center gap-2 h-full pl-3 pr-16">
            <span class="text-lg font-black text-moni-brown">${this.formatPrice(product.price)}</span>
            <span class="text-[11px] text-gray-400 line-through">${this.formatPrice(product.originalPrice)}</span>
          </div>
          
          <div class="absolute top-3 -right-1 z-20">
            <span class="text-white text-sm font-bold px-4 py-1 rounded-full shadow-sm">
              -${product.discount}%
            </span>
          </div>
        </div>

        <div class="space-y-1 mb-2">
          <div class="flex items-center gap-2 text-[11px]">
            <span class="text-yellow-500">${this.generateStars(rating)}</span>
            <span class="font-bold text-moni-brown">${rating}</span>
            <span class="text-gray-400">|</span>
            <span>${soldCount} vendidos</span>
          </div>
          
          ${
            product.stock !== undefined && product.stock <= 0
              ? `
            <div class="text-[11px] text-gray-500 font-bold bg-gray-100 px-3 py-1.5 rounded-full inline-block">
              📦 Sin stock
            </div>
          `
              : product.stock
                ? `
            <div class="flex items-center gap-2">
              ${
                product.stock <= 10
                  ? `
                <img src="./images/ui/MoniFlame.png" class="w-4 h-4" />
                <div class="flex-1">
                  <div class="flex justify-between text-[10px] mb-0.5">
                    <span class="font-bold text-orange-600">¡Quedan ${product.stock}!</span>
                    <span class="text-orange-500">${Math.round(stockPercentage)}%</span>
                  </div>
                  <div class="w-full bg-orange-100 rounded-full h-1">
                    <div class="bg-gradient-to-r from-orange-400 to-orange-500 h-1 rounded-full" style="width: ${stockPercentage}%"></div>
                  </div>
                </div>
              `
                  : `
                <span class="text-green-600 text-[11px]">✓ ${product.stock} disponibles</span>
              `
              }
            </div>
          `
                : ""
          }
        </div>

        ${hasFreeShipping ? '<div class="text-[11px] text-green-600 font-bold">🚚 Envío gratis</div>' : ""}
      `;
    }

    // Sin oferta
    return `
      <div class="mb-2">
        <p class="text-lg font-black text-moni-pink mb-1">
          ${this.formatPrice(product.price)}
        </p>
        
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-[11px]">
            <span class="text-yellow-500">${this.generateStars(rating)}</span>
            <span class="font-bold text-moni-brown">${rating}</span>
            <span class="text-gray-400">|</span>
            <span>${soldCount} vendidos</span>
          </div>
          
          ${
            product.stock !== undefined && product.stock <= 0
              ? `
            <div class="text-[11px] text-gray-500 font-bold bg-gray-100 px-3 py-1.5 rounded-full inline-block">
              📦 Sin stock
            </div>
          `
              : product.stock
                ? `
            <div class="text-[11px] ${product.stock <= 10 ? "text-orange-600 font-bold" : "text-gray-600"}">
              ${product.stock <= 10 ? `⚠️ ¡Quedan ${product.stock}!` : `✓ ${product.stock} disponibles`}
            </div>
          `
                : ""
          }
        </div>

        ${hasFreeShipping ? '<div class="text-[11px] text-green-600 mt-1">🚚 Envío gratis</div>' : ""}
      </div>
    `;
  },
};

window.Helpers = Helpers;
