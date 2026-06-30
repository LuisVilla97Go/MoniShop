const Slider = {
  init() {
    console.log("Slider inicializado");
  },

  changeImage(imageElement, newSrc) {
    if (!imageElement) return;

    imageElement.style.opacity = "0";

    setTimeout(() => {
      imageElement.src = newSrc;

      imageElement.style.opacity = "1";
    }, 150);
  },
};

export default Slider;
