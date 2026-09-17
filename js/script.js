const cursor = document.getElementById("cursor");
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.opacity = "1";
});

function moveCursor() {
  cursorX += (mouseX - cursorX) * 0.18;
  cursorY += (mouseY - cursorY) * 0.18;
  cursor.style.left = cursorX + "px";
  cursor.style.top = cursorY + "px";
  requestAnimationFrame(moveCursor);
}
moveCursor();

document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("grow"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
});

const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    nav.classList.remove("open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const lineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-line");
        lineObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "-10% 0% -10% 0%" }
);

document.querySelectorAll(".service_list").forEach((el) => lineObserver.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();

const sliders = document.querySelectorAll(".project-slider");
sliders.forEach((slider) => {
  const dots = slider.querySelectorAll(".dot");
  let current = 0;
  const total = dots.length;
  if (total < 2) return;

  const go = (index) => {
    current = index;
    slider.style.setProperty("--slide", current);
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      go(i);
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

let lightboxGallery = [];
let lightboxIndex = 0;

function openLightbox(images, index) {
  lightboxGallery = images;
  lightboxIndex = index;
  renderLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function renderLightbox() {
  lightboxImage.src = lightboxGallery[lightboxIndex] || "";
  const multi = lightboxGallery.length > 1;
  lightboxPrev.style.visibility = multi ? "visible" : "hidden";
  lightboxNext.style.visibility = multi ? "visible" : "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target === lightboxImage) closeLightbox();
});
lightboxPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  lightboxIndex = (lightboxIndex - 1 + lightboxGallery.length) % lightboxGallery.length;
  renderLightbox();
});
lightboxNext.addEventListener("click", (e) => {
  e.stopPropagation();
  lightboxIndex = (lightboxIndex + 1) % lightboxGallery.length;
  renderLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lightboxPrev.click();
  if (e.key === "ArrowRight") lightboxNext.click();
});

document.querySelectorAll(".project_item").forEach((item) => {
  const slides = item.querySelectorAll(".slider-track .slide");
  const single = item.querySelector(".project_image");
  if (!slides.length && !single) return;

  const images = slides.length
    ? Array.from(slides, (s) => s.getAttribute("src"))
    : [single.getAttribute("src")];

  item.querySelectorAll(".project_image").forEach((img) => {
    img.addEventListener("click", (e) => {
      if (e.target.closest(".dot") || e.target.closest("a")) return;
      e.preventDefault();
      let index = 0;
      if (slides.length) {
        index = parseInt(item.style.getPropertyValue("--slide"), 10) || 0;
      }
      openLightbox(images, index);
    });
  });
});
