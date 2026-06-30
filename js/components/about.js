const About = {
  render() {
    return `
      <section id="about-page" class="relative py-20 scroll-mt-24 overflow-hidden bg-moni-cream min-h-screen">
        <!-- Elementos decorativos de fondo -->
        <div class="absolute top-10 left-10 w-32 h-32 bg-moni-pink/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-10 right-10 w-40 h-40 bg-moni-beige/80 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-4xl mx-auto px-6 relative z-10">
          <h2 class="text-4xl md:text-5xl font-black mb-8 text-moni-brown text-center">
            ¿Quiénes somos?
          </h2>

          <!-- Tarjeta Principal -->
          <div class="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border-4 border-moni-beige relative flex flex-col md:flex-row items-center gap-8">
            <!-- Texto -->
            <div class="flex-1 text-center md:text-left">
              <p class="text-lg md:text-xl leading-relaxed text-moni-brown">
                En Moni Shop, nuestra misión es
                <span class="text-moni-pink font-bold">buscar por todo el mundo lo que te hará sonreír</span>. 
                Somos una empresa que valora la calidad y el poder de un buen detalle.
              </p>

              <p class="text-lg md:text-xl mt-5 leading-relaxed text-moni-brown">
                Te ofrecemos <span class="font-bold">productos únicos</span>,
                seleccionados para hacer tu día a día más
                <span class="text-moni-pink font-bold">práctico y feliz</span>,
                <span class="font-black underline decoration-moni-pink decoration-wavy decoration-2 underline-offset-4">
                  sin pagar de más
                </span>.
              </p>
            </div>

            <!-- Monito -->
            <div class="w-56 h-56 md:w-72 md:h-72 flex-shrink-0">
              <img
                src="./images/icons/monito_around_world.png"
                alt="Monito por el mundo"
                class="w-full h-full object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>
    `;
  },
};

window.About = About;
export default About;
