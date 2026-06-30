const Header = {
  render() {
    // Detectar página activa para resaltar el enlace
    const currentHash = window.location.hash || "#/";
    const isAboutActive = currentHash === "#/about";
    const isShopActive = currentHash === "#/" || currentHash === "";

    return `
      <header id="main-header" class="bg-[#F8F4E8]/95 backdrop-blur-md p-4 shadow-sm sticky top-0 z-50 transition-all duration-300 border-b border-moni-beige/50">
        <nav class="max-w-6xl mx-auto flex flex-wrap md:flex-nowrap justify-between items-center gap-y-4 gap-x-6">
          
          <!-- 1. Logo (Izquierda) -->
          <a href="#/" class="flex items-center gap-3 flex-shrink-0 group">
            <img src="./images/icons/monito_icon.png" alt="Logo" class="w-12 h-12 object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" />
            <div class="flex flex-col">
              <h1 class="text-2xl md:text-3xl font-black text-moni-brown tracking-tight leading-none">
                MONI SHOP
              </h1>
              <span class="bg-gradient-to-r from-moni-pink to-pink-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full w-fit tracking-widest uppercase shadow-sm mt-1">
                TODO EN UN SOLO LUGAR
              </span>
            </div>
          </a>

          <!-- 2. Buscador (Centro) -->
          <div class="hidden md:flex flex-1 max-w-xl items-center bg-white rounded-full px-4 py-2 border-2 border-moni-cream focus-within:border-moni-pink focus-within:shadow-md shadow-sm transition-all duration-300 group">
            <svg class="w-5 h-5 text-moni-pink mr-2 flex-shrink-0 group-focus-within:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" id="search-desktop" placeholder="Buscar productos kawaii..." class="bg-transparent outline-none w-full text-sm text-moni-brown placeholder-gray-400" />
          </div>

          <!-- 3. Navegación y Carrito (Derecha) -->
          <div class="flex items-center gap-6 font-bold text-moni-brown relative" style="z-index: 50;">
            
            <!-- Enlace Nosotros con indicador activo -->
            <a href="#/about" 
               class="relative text-sm md:text-base transition-all duration-300 hover:text-moni-pink ${isAboutActive ? "text-moni-pink" : ""}"
               style="z-index: 60; pointer-events: auto;">
              Nosotros
              ${isAboutActive ? '<span class="absolute -bottom-1 left-0 w-full h-0.5 bg-moni-pink rounded-full"></span>' : ""}
            </a>

            <!-- Enlace Tienda con indicador activo -->
            <a href="#/" 
               class="relative text-sm md:text-base transition-all duration-300 hover:text-moni-pink ${isShopActive ? "text-moni-pink" : ""}"
               style="z-index: 60; pointer-events: auto;">
              Tienda
              ${isShopActive ? '<span class="absolute -bottom-1 left-0 w-full h-0.5 bg-moni-pink rounded-full"></span>' : ""}
            </a>
            
            <!-- Carrito con animación -->
            <a href="#/cart" 
               class="relative cursor-pointer hover:scale-110 transition-transform flex-shrink-0 group" 
               style="z-index: 60; pointer-events: auto;">
              <img src="./images/ui/carrito-de-compras-rosa.png" class="w-8 h-8 group-hover:rotate-6 transition-transform duration-300" alt="Carrito">
              <span id="cart-count" class="absolute -top-2 -right-2 bg-gradient-to-r from-moni-pink to-pink-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white hidden animate-bounce">0</span>
            </a>
          </div>

          <!-- Buscador Móvil -->
          <div class="flex md:hidden w-full">
            <div class="flex items-center bg-white rounded-full px-4 py-2 border-2 border-moni-cream focus-within:border-moni-pink focus-within:shadow-md shadow-sm transition-all w-full">
              <svg class="w-5 h-5 text-moni-pink mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input type="text" id="search-mobile" placeholder="Buscar..." class="bg-transparent outline-none w-full text-sm text-moni-brown placeholder-gray-400" />
            </div>
          </div>
        </nav>
      </header>
    `;
  },
};

export default Header;
