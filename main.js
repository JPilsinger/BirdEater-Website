const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

function setNav(open) {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);
}

toggle.addEventListener("click", () => {
  setNav(toggle.getAttribute("aria-expanded") !== "true");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNav(false));
});

const links = [...nav.querySelectorAll("a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach((link) => {
        const current = link.getAttribute("href") === `#${id}`;
        if (current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
);

sections.forEach((section) => spy.observe(section));

const viewer = document.querySelector("#viewer");
const viewerImg = document.querySelector("#viewer-img");

document.querySelectorAll(".shot").forEach((button) => {
  button.addEventListener("click", () => {
    viewerImg.src = button.dataset.full;
    viewerImg.alt = button.dataset.alt || "";
    viewer.showModal();
  });
});

viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});

viewer.addEventListener("close", () => {
  viewerImg.removeAttribute("src");
});

const slider = document.querySelector(".slider");
if (slider) {
  const slides = [...slider.querySelectorAll(".slider-frame .shot")];
  const captions = [...slider.querySelectorAll(".slider-caption > span:not(.slider-dots)")];
  const dots = [...slider.querySelectorAll(".slider-dots button")];
  let index = 0;
  let timer = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    captions.forEach((caption, i) => caption.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.setAttribute("aria-selected", String(i === index)));
  };

  const start = () => {
    if (reduce || slides.length < 2) return;
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 5000);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      start();
    });
  });

  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", start);
  slider.addEventListener("focusin", () => clearInterval(timer));
  slider.addEventListener("focusout", start);
  start();
}
