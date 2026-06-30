const Categories = {
  render() {
    const categories = [
      {
        id: "accesorios",
        name: "Accesorios",
        icon: "./images/icons/monito_cat_accesorio.png",
        bg: "bg-rose-200",
        border: "border-rose-300",
        hover: "hover:text-rose-500",
      },
      {
        id: "belleza",
        name: "Belleza",
        icon: "./images/icons/monito_cat_belleza.png",
        bg: "bg-fuchsia-200",
        border: "border-fuchsia-300",
        hover: "hover:text-fuchsia-500",
      },
      {
        id: "hogar",
        name: "Hogar",
        icon: "./images/icons/monito_cat_hogar.png",
        bg: "bg-amber-200",
        border: "border-amber-300",
        hover: "hover:text-amber-500",
      },
      {
        id: "ropa",
        name: "Ropa",
        icon: "./images/icons/monito_cat_ropa.png",
        bg: "bg-sky-200",
        border: "border-sky-300",
        hover: "hover:text-sky-500",
      },
      {
        id: "tecnologia",
        name: "Tecnología",
        icon: "./images/icons/monito_cat_tecnologia.png",
        bg: "bg-teal-200",
        border: "border-teal-300",
        hover: "hover:text-teal-500",
      },
      {
        id: "papeleria",
        name: "Papelería",
        icon: "./images/icons/monito_cat_papeleria.png",
        bg: "bg-purple-200",
        border: "border-purple-300",
        hover: "hover:text-purple-500",
      },
      {
        id: "ofertas",
        name: "Ofertas",
        icon: "./images/icons/ofert.png",
        bg: "bg-white",
        border: "border-[#FFC816]",
        hover: "hover:text-[#FF1493]",
      },
    ];

    return `
      <section id="categorias" class="max-w-6xl mx-auto pt-12 pb-6 px-6">
        <h2 class="text-3xl font-black mb-8 text-center text-moni-brown">
          Explora por Categorías
        </h2>
        <div class="flex flex-wrap justify-center gap-4 md:gap-8">
          ${categories
            .map(
              (cat) => `
            <div onclick="Categories.selectCategory('${cat.id}')" 
                 class="flex flex-col items-center gap-2 cursor-pointer group">
              <div class="w-20 h-20 md:w-28 md:h-28 rounded-full ${cat.bg} border-4 ${cat.border} flex items-center justify-center p-3 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110">
                <img src="${cat.icon}" alt="${cat.name}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span class="font-bold text-moni-brown text-xs md:text-sm ${cat.hover} transition-colors">${cat.name}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </section>
    `;
  },

  selectCategory(categoryId) {
    window.dispatchEvent(
      new CustomEvent("categoryFilter", { detail: categoryId }),
    );

    const catalogo = document.getElementById("catalogo");
    if (catalogo) {
      catalogo.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },
};

window.Categories = Categories;
export default Categories;
