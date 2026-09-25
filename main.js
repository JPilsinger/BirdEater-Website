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
    viewerImg.classList.toggle("is-inverted", button.dataset.invert === "true");
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

// Reversible reveals follow the viewport without capturing or changing scrolling.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const candidates = [...document.querySelectorAll(
  ".section-head, .narrative-grid > .prose, .split > div, .frame, .team-grid article, .milestones li, .progress-intro, .evidence-note, .close-grid > div, .patent-visual > div, .render-intro"
)];
const revealTargets = candidates.filter((node) => !candidates.some((parent) => parent !== node && parent.contains(node)));
let revealObserver;
function configureReveals() {
  revealObserver?.disconnect();
  revealTargets.forEach((node) => node.classList.remove("reveal", "is-dimmed", "is-revealed"));
  if (motionPreference.matches || !("IntersectionObserver" in window)) return;
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.classList.toggle("is-revealed", isIntersecting);
      target.classList.toggle("is-dimmed", !isIntersecting);
    });
  }, { rootMargin: "-4% 0px -7% 0px", threshold: 0 });
  revealTargets.forEach((node) => {
    node.classList.add("reveal");
    const bounds = node.getBoundingClientRect();
    if (bounds.top >= window.innerHeight || bounds.bottom <= 0) node.classList.add("is-dimmed");
    revealObserver.observe(node);
  });
}
motionPreference.addEventListener("change", configureReveals);
configureReveals();
