const svgNs = "http://www.w3.org/2000/svg";

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

const historyPeriod = document.getElementById("history-period");
const historyTagButtons = Array.from(document.querySelectorAll("[data-history-tag]"));
const historyEntries = Array.from(document.querySelectorAll(".entry-item[data-days]"));
const historyCount = document.getElementById("history-count");
const historyEmpty = document.getElementById("history-empty");

let selectedHistoryTag = "all";

const applyHistoryFilters = () => {
  if (!historyEntries.length) {
    return;
  }

  const maxDays = historyPeriod ? Number(historyPeriod.value) : 14;
  let visibleCount = 0;

  historyEntries.forEach((entry) => {
    const daysAgo = Number(entry.dataset.days || "0");
    const tags = (entry.dataset.tags || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const matchPeriod = daysAgo <= maxDays;
    const matchTag = selectedHistoryTag === "all" || tags.includes(selectedHistoryTag);
    const visible = matchPeriod && matchTag;

    entry.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  });

  if (historyCount) {
    historyCount.textContent = String(visibleCount);
  }

  if (historyEmpty) {
    historyEmpty.hidden = visibleCount !== 0;
  }
};

historyTagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedHistoryTag = button.dataset.historyTag || "all";
    historyTagButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    applyHistoryFilters();
  });
});

if (historyPeriod) {
  historyPeriod.addEventListener("change", applyHistoryFilters);
}

applyHistoryFilters();

const chartElement = document.getElementById("recovery-chart");

const drawRecoveryChart = (svg) => {
  const width = 760;
  const height = 280;
  const margin = { top: 24, right: 18, bottom: 36, left: 18 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const mobility = [35, 42, 50, 58, 63, 68, 72, 75];
  const pain = [8, 7, 7, 6, 5, 5, 4, 4];
  const painNormalized = pain.map((value) => value * 10);

  const xStep = innerWidth / (mobility.length - 1);

  const toX = (index) => margin.left + index * xStep;
  const toY = (value) => margin.top + innerHeight - (value / 100) * innerHeight;

  const create = (name, attrs = {}) => {
    const node = document.createElementNS(svgNs, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };

  svg.innerHTML = "";

  [0, 25, 50, 75, 100].forEach((value) => {
    const y = toY(value);
    svg.appendChild(
      create("line", {
        x1: margin.left,
        y1: y,
        x2: width - margin.right,
        y2: y,
        stroke: "#dfe7f7",
        "stroke-width": 1,
      })
    );
  });

  const buildPath = (series) =>
    series
      .map((value, index) => `${index === 0 ? "M" : "L"}${toX(index)} ${toY(value)}`)
      .join(" ");

  svg.appendChild(
    create("path", {
      d: buildPath(mobility),
      fill: "none",
      stroke: "#2b63f3",
      "stroke-width": 4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    })
  );

  svg.appendChild(
    create("path", {
      d: buildPath(painNormalized),
      fill: "none",
      stroke: "#f97316",
      "stroke-width": 4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-dasharray": "7 6",
    })
  );

  mobility.forEach((value, index) => {
    const circle = create("circle", {
      cx: toX(index),
      cy: toY(value),
      r: 4,
      fill: "#2b63f3",
    });
    const title = create("title");
    title.textContent = `Week ${index + 1}: mobiliteit ${value} graden`;
    circle.appendChild(title);
    svg.appendChild(circle);
  });

  pain.forEach((value, index) => {
    const circle = create("circle", {
      cx: toX(index),
      cy: toY(painNormalized[index]),
      r: 4,
      fill: "#f97316",
    });
    const title = create("title");
    title.textContent = `Week ${index + 1}: pijn ${value}/10`;
    circle.appendChild(title);
    svg.appendChild(circle);
  });
};

if (chartElement) {
  drawRecoveryChart(chartElement);
}

const topicData = {
  "zwelling-traplopen": {
    region: "Regio West",
    title: "Zwelling na traplopen in week 4",
    subtitle: "Knieklacht in vroege mobilisatiefase",
    tags: ["Knie", "Week 4", "Belasting"],
    summary:
      "Veel gebruikers merken dat traplopen sneller zwelling geeft dan vlak wandelen. In de thread is consensus om belasting op te bouwen met korte blokken en directe evaluatie 12 uur later.",
    insights: [
      "Gebruik een 24-uurs regel: geen extra zwelling de volgende ochtend betekent acceptabele belasting.",
      "Koelen 10 minuten na traptraining helpt vooral bij einddag-pijn.",
      "Plan trapbelasting op dagen met lagere totale stappen om overbelasting te voorkomen.",
    ],
    replies: 31,
    helpful: 12,
    clinical: 3,
  },
  "sporthervatting-opbouw": {
    region: "Regio Zuid",
    title: "Veilige opbouw richting sporthervatting",
    subtitle: "Knie en schouder in return-to-sport fase",
    tags: ["Knie", "Schouder", "Return to sport"],
    summary:
      "Gebruikers delen een gefaseerd schema waarin sportbelasting stapsgewijs wordt opgehoogd. De beste resultaten komen bij groepen die kracht, coordinatie en slaap samen monitoren.",
    insights: [
      "Verhoog trainingsintensiteit per week met maximaal 10-15 procent.",
      "Koppel sportmomenten aan lage-pijn dagen uit je logboek.",
      "Bespreek elke tweede week progressie met fysio voor bijsturing.",
    ],
    replies: 18,
    helpful: 9,
    clinical: 4,
  },
  "werkhervatting-rug": {
    region: "Regio Oost",
    title: "Werkhervatting met lage rugklachten",
    subtitle: "Rugklacht met focus op werkbelasting",
    tags: ["Rug", "Werk", "Belastbaarheid"],
    summary:
      "Deze communitythread bevat praktische richtlijnen voor kantoor- en fysiek werk. Veel deelnemers gebruiken tijdsblokken met actieve pauzes als standaardprotocol.",
    insights: [
      "Werkblokken van 45 minuten met 5 minuten loop- of strekmoment verlagen einddag-pijn.",
      "Staand werken helpt als afwisseling, niet als volledige vervanging.",
      "Plan zwaar werk niet op dagen na slechte nachtrust.",
    ],
    replies: 44,
    helpful: 21,
    clinical: 5,
  },
  "energiebeheer-postcovid": {
    region: "Regio Noord",
    title: "Omgaan met energiedips en slaap",
    subtitle: "Post-COVID klacht met pacing en herstelvensters",
    tags: ["Post-COVID", "Energie", "Slaap"],
    summary:
      "De meest gewaardeerde posts beschrijven pacing op basis van signalen in plaats van vaste schema's. Gebruikers combineren activiteiten met geplande herstelvensters.",
    insights: [
      "Gebruik korte energietrackers in je logboek om terugvalmomenten te herkennen.",
      "Beperk piekinspanningen op dagen met lage HRV en slechte slaap.",
      "Laat mentale belasting meetellen in je dagelijkse energiebudget.",
    ],
    replies: 29,
    helpful: 17,
    clinical: 6,
  },
  "overhead-mobiliteit": {
    region: "Regio West",
    title: "Beperkte overhead mobiliteit na week 8",
    subtitle: "Schouderklacht tijdens krachtopbouw",
    tags: ["Schouder", "Mobiliteit", "Kracht"],
    summary:
      "Communityleden delen dat progressie versnelt wanneer mobiliteitsoefeningen en krachttraining op dezelfde dag slim worden gecombineerd.",
    insights: [
      "Start sessies met lage intensiteit mobiliteit voordat je kracht toevoegt.",
      "Stop bij compensatie in de onderrug of nek om foutpatronen te vermijden.",
      "Evalueer ROM wekelijks met dezelfde testbeweging voor vergelijkbaarheid.",
    ],
    replies: 23,
    helpful: 11,
    clinical: 2,
  },
  "consult-checklist": {
    region: "Landelijk",
    title: "Checklist: wat bespreek je met je fysio?",
    subtitle: "Multiklacht topic met consultvoorbereiding",
    tags: ["Consult", "Voorbereiding", "Meerdere klachten"],
    summary:
      "Dit topic bundelt de meest effectieve consultvragen uit verschillende klachtenprofielen. Gebruikers rapporteren dat consulten concreter worden met deze checklist.",
    insights: [
      "Neem je 3 belangrijkste klachten mee met voorbeelden uit je logboek.",
      "Vraag specifiek welke belastinggrens deze week geldt.",
      "Bespreek welke metric jij moet volgen tot het volgende consult.",
    ],
    replies: 65,
    helpful: 34,
    clinical: 12,
  },
};

const topicTitle = document.getElementById("topic-title");

if (topicTitle) {
  const params = new URLSearchParams(window.location.search);
  const topicKey = params.get("topic") || "zwelling-traplopen";
  const topic = topicData[topicKey] || topicData["zwelling-traplopen"];

  const regionEl = document.getElementById("topic-region");
  const subtitleEl = document.getElementById("topic-subtitle");
  const tagsEl = document.getElementById("topic-tags");
  const summaryEl = document.getElementById("topic-summary");
  const insightsEl = document.getElementById("topic-insights");
  const repliesEl = document.getElementById("topic-replies");
  const helpfulEl = document.getElementById("topic-helpful");
  const clinicalEl = document.getElementById("topic-clinical");

  if (regionEl) {
    regionEl.textContent = topic.region;
  }

  topicTitle.textContent = topic.title;

  if (subtitleEl) {
    subtitleEl.textContent = topic.subtitle;
  }

  if (summaryEl) {
    summaryEl.textContent = topic.summary;
  }

  if (tagsEl) {
    tagsEl.innerHTML = "";
    topic.tags.forEach((tag) => {
      const node = document.createElement("span");
      node.className = "topic-tag";
      node.textContent = tag;
      tagsEl.appendChild(node);
    });
  }

  if (insightsEl) {
    insightsEl.innerHTML = "";
    topic.insights.forEach((insight) => {
      const item = document.createElement("li");
      item.textContent = insight;
      insightsEl.appendChild(item);
    });
  }

  if (repliesEl) {
    repliesEl.textContent = String(topic.replies);
  }

  if (helpfulEl) {
    helpfulEl.textContent = String(topic.helpful);
  }

  if (clinicalEl) {
    clinicalEl.textContent = String(topic.clinical);
  }
}
