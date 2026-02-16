const toggleBtn = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const allNavLinks = Array.from(document.querySelectorAll(".main-nav a, .icon-nav a, .mini-links a"));
const bodyPage = document.body.getAttribute("data-page");

if (toggleBtn && mainNav) {
  toggleBtn.addEventListener("click", () => {
    const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", String(!expanded));
    mainNav.classList.toggle("is-open", !expanded);
  });
}

allNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 860 && mainNav && toggleBtn) {
      mainNav.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  const linkedPage = link.getAttribute("data-page-link");
  if (linkedPage && bodyPage && linkedPage === bodyPage) {
    link.classList.add("is-active");
  }
});

const sectionLinks = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
const sections = Array.from(document.querySelectorAll("section[id]"));

const activateSectionLink = (id) => {
  sectionLinks.forEach((link) => {
    const hash = link.getAttribute("href");
    link.classList.toggle("is-active", hash === `#${id}`);
  });
};

if (sectionLinks.length && sections.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length) {
        activateSectionLink(visible[0].target.id);
      }
    },
    {
      threshold: [0.3, 0.55],
      rootMargin: "-15% 0px -45% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

const phaseButtons = Array.from(document.querySelectorAll(".phase-chip"));
phaseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    phaseButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

const tabs = Array.from(document.querySelectorAll(".tab"));
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
  });
});
