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
    viewer.style.setProperty("--viewer-width", button.dataset.displayWidth ? `${button.dataset.displayWidth}px` : "36rem");
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
