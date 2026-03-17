export default function initGalleryUbicacion() {
  const thumbs = Array.from(document.querySelectorAll("[data-gallery-thumb]"));
  const modalThumbs = Array.from(
    document.querySelectorAll("[data-gallery-modal-thumb]")
  );

  if (!thumbs.length) return;

  const mainImage = document.getElementById("gallery-main-image");
  const mainTitle = document.getElementById("gallery-main-title");
  const mainText = document.getElementById("gallery-main-text");
  const mainCounter = document.getElementById("gallery-counter");

  const modal = document.getElementById("gallery-modal");
  const modalPanel = document.getElementById("gallery-modal-panel");
  const modalImage = document.getElementById("gallery-modal-image");
  const modalTitle = document.getElementById("gallery-modal-title");
  const modalText = document.getElementById("gallery-modal-text");
  const modalCounter = document.getElementById("gallery-modal-counter");

  const openBtn = document.getElementById("gallery-open");
  const closeBtn = document.getElementById("gallery-close");
  const backdrop = document.getElementById("gallery-backdrop");

  const prevBtn = document.getElementById("gallery-prev");
  const nextBtn = document.getElementById("gallery-next");
  const modalPrevBtn = document.getElementById("gallery-modal-prev");
  const modalNextBtn = document.getElementById("gallery-modal-next");

  const slides = thumbs.map((thumb) => ({
    src: thumb.dataset.src ?? "",
    alt: thumb.dataset.alt ?? "",
    title: thumb.dataset.title ?? "",
    text: thumb.dataset.text ?? "",
  }));

  let currentIndex = 0;

  const pad = (value) => String(value).padStart(2, "0");
  const isModalOpen = () => modal?.getAttribute("aria-hidden") === "false";

  function updateCounter(target) {
    if (!target) return;
    target.textContent = `${pad(currentIndex + 1)} / ${pad(slides.length)}`;
  }

  function updateThumbState(items, activeRingClass, idleRingClass) {
    items.forEach((thumb, index) => {
      const isActive = index === currentIndex;

      thumb.classList.toggle("ring-2", isActive);
      thumb.classList.toggle(activeRingClass, isActive);
      thumb.classList.toggle(idleRingClass, !isActive);
      thumb.classList.toggle("opacity-100", isActive);
      thumb.classList.toggle("opacity-70", !isActive);
      thumb.classList.toggle("scale-[1.02]", isActive);
      thumb.classList.toggle("scale-100", !isActive);
      thumb.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function updateActiveThumbs() {
    updateThumbState(thumbs, "ring-[#4db4bf]/70", "ring-black/5");
    updateThumbState(modalThumbs, "ring-[#4db4bf]/70", "ring-white/10");
  }

  function setSlide(index) {
    if (index < 0) currentIndex = slides.length - 1;
    else if (index >= slides.length) currentIndex = 0;
    else currentIndex = index;

    const slide = slides[currentIndex];

    if (mainImage) {
      mainImage.src = slide.src;
      mainImage.alt = slide.alt;
    }

    if (mainTitle) mainTitle.textContent = slide.title;
    if (mainText) mainText.textContent = slide.text;
    updateCounter(mainCounter);

    if (modalImage) {
      modalImage.src = slide.src;
      modalImage.alt = slide.alt;
    }

    if (modalTitle) modalTitle.textContent = slide.title;
    if (modalText) modalText.textContent = slide.text;
    updateCounter(modalCounter);

    updateActiveThumbs();
  }

  function openModal() {
    if (!modal) return;

    modal.classList.remove("pointer-events-none", "opacity-0", "bg-black/0");
    modal.classList.add("pointer-events-auto", "opacity-100", "bg-black/82");
    modal.setAttribute("aria-hidden", "false");

    modalPanel?.classList.remove("translate-y-5", "scale-[0.985]");
    modalPanel?.classList.add("translate-y-0", "scale-100");

    document.body.classList.add("overflow-hidden");
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.add("pointer-events-none", "opacity-0", "bg-black/0");
    modal.classList.remove("pointer-events-auto", "opacity-100", "bg-black/82");
    modal.setAttribute("aria-hidden", "true");

    modalPanel?.classList.add("translate-y-5", "scale-[0.985]");
    modalPanel?.classList.remove("translate-y-0", "scale-100");

    document.body.classList.remove("overflow-hidden");
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => setSlide(index));
  });

  modalThumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => setSlide(index));
  });

  prevBtn?.addEventListener("click", () => setSlide(currentIndex - 1));
  nextBtn?.addEventListener("click", () => setSlide(currentIndex + 1));
  modalPrevBtn?.addEventListener("click", () => setSlide(currentIndex - 1));
  modalNextBtn?.addEventListener("click", () => setSlide(currentIndex + 1));

  openBtn?.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isModalOpen()) closeModal();
    if (event.key === "ArrowLeft" && isModalOpen()) setSlide(currentIndex - 1);
    if (event.key === "ArrowRight" && isModalOpen()) setSlide(currentIndex + 1);
  });

  setSlide(0);
}