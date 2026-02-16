const toggleBtn = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const allNavLinks = Array.from(document.querySelectorAll(".main-nav a"));
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

const phaseButtons = Array.from(document.querySelectorAll(".phase-chip"));
phaseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    phaseButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

const complaintButtons = Array.from(document.querySelectorAll("[data-complaint-filter]"));
const regionFilter = document.getElementById("region-filter");
const communityCards = Array.from(document.querySelectorAll(".community-card"));
const communityCount = document.getElementById("community-count");
const emptyState = document.getElementById("community-empty");

let selectedComplaint = "all";

const applyCommunityFilters = () => {
  if (!communityCards.length) {
    return;
  }

  const selectedRegion = regionFilter ? regionFilter.value : "all";
  let visibleCount = 0;

  communityCards.forEach((card) => {
    const cardRegion = (card.dataset.region || "all").trim();
    const cardComplaints = (card.dataset.complaints || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const matchRegion = selectedRegion === "all" || cardRegion === selectedRegion || cardRegion === "all";
    const matchComplaint = selectedComplaint === "all" || cardComplaints.includes(selectedComplaint);

    const isVisible = matchRegion && matchComplaint;
    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (communityCount) {
    communityCount.textContent = String(visibleCount);
  }

  if (emptyState) {
    emptyState.hidden = visibleCount !== 0;
  }
};

complaintButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedComplaint = button.dataset.complaintFilter || "all";
    complaintButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    applyCommunityFilters();
  });
});

if (regionFilter) {
  regionFilter.addEventListener("change", applyCommunityFilters);
}

applyCommunityFilters();
