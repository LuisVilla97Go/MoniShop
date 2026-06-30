const Modal = {
  currentProduct: null,
  currentImageIndex: 0,

  render() {
    return `
      <div id="product-modal" class="fixed inset-0 bg-black/60 hidden items-center justify-center z-[100] p-4">
        <div class="bg-white w-full max-w-4xl rounded-2xl p-6 flex flex-col md:flex-row gap-8 relative animate-bounce-in">
          
          <button id="close-modal" class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-moni-pink cursor-pointer transition-colors z-10">✕</button>
          
          <div class="w-full md:w-1/2 flex flex-col gap-4">
            <div class="relative overflow-hidden rounded-2xl bg-gray-100 h-80 flex items-center justify-center">
              <img id="modal-main-image" src="" class="w-full h-full object-contain transition-opacity duration-300" alt="Producto" />
              
              <button id="prev-image" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full cursor-pointer shadow-lg transition-all">
                <img src="./images/ui/derecha.png" class="w-6 h-6" alt="Anterior" />
              </button>
              <button id="next-image" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full cursor-pointer shadow-lg transition-all">
                <img src="./images/ui/izquierda.png" class="w-6 h-6" alt="Siguiente" />
              </button>
            </div>

            <div id="modal-thumbnails" class="flex gap-3 justify-center"></div>
          </div>

          <div class="w-full md:w-1/2 flex flex-col justify-center">
            <h2 id="modal-title" class="text-3xl font-black text-moni-brown mb-4">Nombre del Producto</h2>
            <p id="modal-description" class="text-sm text-gray-600 mb-6 leading-relaxed">Descripción del producto...</p>
            <p id="modal-price" class="text-3xl font-bold text-moni-pink mb-6">S/ 0.00</p>
            
            <div id="modal-stock-info" class="mb-4"></div>
            
            <div id="modal-quantity-section" class="mb-6">
              <label class="block text-sm font-bold text-moni-brown mb-2">Cantidad:</label>
              <div class="flex items-center gap-3">
                <button id="modal-qty-minus" class="w-10 h-10 bg-moni-beige rounded-lg font-bold text-moni-brown hover:bg-moni-pink hover:text-white transition-colors">-</button>
                <input type="number" id="modal-qty-input" value="1" min="1" class="w-20 h-10 text-center border-2 border-moni-beige rounded-lg font-bold focus:border-moni-pink focus:outline-none" />
                <button id="modal-qty-plus" class="w-10 h-10 bg-moni-beige rounded-lg font-bold text-moni-brown hover:bg-moni-pink hover:text-white transition-colors">+</button>
              </div>
              <p id="modal-max-stock" class="text-xs text-gray-500 mt-2"></p>
            </div>
            
            <div class="flex gap-3">
              <button id="modal-add-btn" class="flex-1 bg-moni-pink text-white py-4 rounded-full font-bold hover:bg-moni-brown transition-colors shadow-lg">
                Agregar al carrito
              </button>
              <button id="modal-buy-btn" class="flex-1 bg-moni-brown text-white py-4 rounded-full font-bold hover:bg-moni-pink transition-colors shadow-lg">
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    console.log("✅ Modal inicializado");
  },

  setupEventListeners() {
    const closeBtn = document.getElementById("close-modal");
    const modal = document.getElementById("product-modal");
    const prevBtn = document.getElementById("prev-image");
    const nextBtn = document.getElementById("next-image");
    const addBtn = document.getElementById("modal-add-btn");
    const buyBtn = document.getElementById("modal-buy-btn");
    const qtyMinus = document.getElementById("modal-qty-minus");
    const qtyPlus = document.getElementById("modal-qty-plus");
    const qtyInput = document.getElementById("modal-qty-input");

    if (closeBtn) {
      closeBtn.onclick = () => this.close();
    }

    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) {
          this.close();
        }
      };
    }

    if (prevBtn) {
      prevBtn.onclick = () => this.prevImage();
    }

    if (nextBtn) {
      nextBtn.onclick = () => this.nextImage();
    }

    // Selector de cantidad
    if (qtyMinus && qtyInput && this.currentProduct) {
      qtyMinus.onclick = () => {
        const currentQty = parseInt(qtyInput.value) || 1;
        if (currentQty > 1) {
          qtyInput.value = currentQty - 1;
        }
      };
    }

    if (qtyPlus && qtyInput && this.currentProduct) {
      qtyPlus.onclick = () => {
        const currentQty = parseInt(qtyInput.value) || 1;
        const maxStock = this.currentProduct.stock || 0;
        if (currentQty < maxStock) {
          qtyInput.value = currentQty + 1;
        }
      };
    }

    // Agregar al carrito con cantidad
    if (addBtn && this.currentProduct) {
      addBtn.onclick = () => {
        if (this.currentProduct.stock <= 0) {
          alert("❌ Lo sentimos, este producto está agotado");
          return;
        }

        const quantity = parseInt(qtyInput.value) || 1;

        if (quantity > this.currentProduct.stock) {
          alert(
            `❌ Solo quedan ${this.currentProduct.stock} unidades disponibles`,
          );
          return;
        }

        Cart.add(this.currentProduct.id, quantity);
        this.close();
      };
    }

    // Comprar ahora con cantidad
    if (buyBtn && this.currentProduct) {
      buyBtn.onclick = () => {
        if (this.currentProduct.stock <= 0) {
          alert("❌ Lo sentimos, este producto está agotado");
          return;
        }

        const quantity = parseInt(qtyInput.value) || 1;

        if (quantity > this.currentProduct.stock) {
          alert(
            `❌ Solo quedan ${this.currentProduct.stock} unidades disponibles`,
          );
          return;
        }

        Cart.add(this.currentProduct.id, quantity);
        this.close();
        window.location.href = "./pages/checkout.html";
      };
    }

    document.onkeydown = (e) => {
      if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
        this.close();
      }
    };
  },

  open(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    this.currentProduct = product;
    this.currentImageIndex = 0;

    const modalImage = document.getElementById("modal-main-image");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalPrice = document.getElementById("modal-price");
    const modalStockInfo = document.getElementById("modal-stock-info");
    const modalQtySection = document.getElementById("modal-quantity-section");
    const modalMaxStock = document.getElementById("modal-max-stock");
    const thumbnailsContainer = document.getElementById("modal-thumbnails");
    const qtyInput = document.getElementById("modal-qty-input");

    if (modalImage) {
      modalImage.src = product.images[0];
      modalImage.alt = product.name;
    }
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalPrice) modalPrice.textContent = `S/ ${product.price.toFixed(2)}`;

    if (modalStockInfo) {
      if (product.stock <= 0) {
        modalStockInfo.innerHTML =
          '<div class="bg-red-100 border-2 border-red-300 rounded-lg p-3 text-center"><p class="text-red-600 font-bold">❌ Producto agotado</p></div>';
      } else if (product.stock <= 10) {
        modalStockInfo.innerHTML = `<div class="bg-orange-100 border-2 border-orange-300 rounded-lg p-3 text-center"><p class="text-orange-600 font-bold">⚠️ ¡Solo quedan ${product.stock} unidades!</p></div>`;
      } else {
        modalStockInfo.innerHTML = `<div class="bg-green-100 border-2 border-green-300 rounded-lg p-3 text-center"><p class="text-green-600 font-bold">✓ ${product.stock} unidades disponibles</p></div>`;
      }
    }

    if (modalQtySection && modalMaxStock) {
      if (product.stock <= 0) {
        modalQtySection.style.display = "none";
      } else {
        modalQtySection.style.display = "block";
        modalMaxStock.textContent = `Máximo: ${product.stock} unidades`;
        if (qtyInput) {
          qtyInput.value = 1;
          qtyInput.max = product.stock;
        }
      }
    }

    if (thumbnailsContainer && product.images.length > 0) {
      thumbnailsContainer.innerHTML = product.images
        .map(
          (img, index) => `
        <button 
          class="w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${index === 0 ? "border-moni-pink" : "border-gray-300 hover:border-moni-pink"}"
          onclick="Modal.selectImage(${index}); event.stopPropagation();"
        >
          <img src="${img}" class="w-full h-full object-cover" alt="${product.name} ${index + 1}" />
        </button>
      `,
        )
        .join("");
    }

    const modal = document.getElementById("product-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
      this.setupEventListeners();
    }
  },

  close() {
    const modal = document.getElementById("product-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    }
    this.currentProduct = null;
    this.currentImageIndex = 0;
  },

  selectImage(index) {
    if (!this.currentProduct) return;
    this.currentImageIndex = index;
    this.updateMainImage();
    this.updateThumbnails();
  },

  prevImage() {
    if (!this.currentProduct || this.currentProduct.images.length <= 1) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.currentProduct.images.length) %
      this.currentProduct.images.length;
    this.updateMainImage();
    this.updateThumbnails();
  },

  nextImage() {
    if (!this.currentProduct || this.currentProduct.images.length <= 1) return;
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.currentProduct.images.length;
    this.updateMainImage();
    this.updateThumbnails();
  },

  updateMainImage() {
    const modalImage = document.getElementById("modal-main-image");
    if (modalImage && this.currentProduct) {
      modalImage.style.opacity = "0";
      setTimeout(() => {
        modalImage.src = this.currentProduct.images[this.currentImageIndex];
        modalImage.alt = this.currentProduct.name;
        modalImage.style.opacity = "1";
      }, 150);
    }
  },

  updateThumbnails() {
    const thumbnails = document.querySelectorAll("#modal-thumbnails button");
    thumbnails.forEach((thumb, index) => {
      if (index === this.currentImageIndex) {
        thumb.classList.remove("border-gray-300");
        thumb.classList.add("border-moni-pink");
      } else {
        thumb.classList.remove("border-moni-pink");
        thumb.classList.add("border-gray-300");
      }
    });
  },
};

window.Modal = Modal;
export default Modal;
