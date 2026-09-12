// Render + interaction logic. Content lives in content.js / diagrams.js.

(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const main = document.getElementById("main");
  const crumb = document.getElementById("crumb");
  const themeBtn = document.getElementById("theme-toggle");

  const allTopics = SECTIONS.flatMap((s) => s.topics.map((t) => ({ ...t, sectionId: s.id, sectionLabel: s.label })));

  function findTopic(id) {
    return allTopics.find((t) => t.id === id);
  }

  function currentTopicId() {
    const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (hash && findTopic(hash)) return hash;
    return SECTIONS[0].topics[0].id;
  }

  function renderNav(activeId) {
    nav.innerHTML = "";
    SECTIONS.forEach((section) => {
      const wrap = document.createElement("div");
      wrap.className = "nav-section";

      const title = document.createElement("div");
      title.className = "nav-section-title";
      title.textContent = section.label;
      wrap.appendChild(title);

      section.topics.forEach((topic, i) => {
        const btn = document.createElement("button");
        btn.className = "nav-item" + (topic.id === activeId ? " active" : "");
        btn.innerHTML =
          '<span class="n">' + String(i + 1).padStart(2, "0") + "</span><span>" + topic.title + "</span>";
        btn.addEventListener("click", () => {
          location.hash = topic.id;
        });
        wrap.appendChild(btn);
      });

      nav.appendChild(wrap);
    });
  }

  function renderRail(section, activeId) {
    const rail = document.createElement("div");
    rail.className = "rail";
    section.topics.forEach((topic) => {
      const card = document.createElement("button");
      let tone = "";
      if (topic.pending) tone = "tone-pending";
      else if (topic.eyebrow && topic.eyebrow.toLowerCase().includes("wart")) tone = "tone-wart";
      else if (topic.eyebrow && topic.eyebrow.toLowerCase() === "perspective") tone = "tone-good";
      card.className = "rail-card" + (tone ? " " + tone : "") + (topic.id === activeId ? " selected" : "") + (topic.pending ? " pending" : "");
      card.innerHTML =
        '<span class="rail-eyebrow">' + topic.eyebrow + "</span>" +
        '<span class="rail-title">' + topic.title + "</span>" +
        '<span class="rail-dek">' + topic.dek + "</span>";
      card.addEventListener("click", () => {
        location.hash = topic.id;
      });
      rail.appendChild(card);
    });
    return rail;
  }

  function renderDiagram(diagramKey) {
    const d = DIAGRAMS[diagramKey];
    if (!d) return null;

    const figure = document.createElement("figure");
    figure.className = "diagram";
    const svgWrap = document.createElement("div");
    svgWrap.innerHTML = d.svg;
    const svg = svgWrap.querySelector("svg");
    figure.appendChild(svg);

    const detailBox = document.createElement("div");
    detailBox.className = "diag-detail";
    figure.appendChild(detailBox);

    svg.querySelectorAll(".diag-hot").forEach((el) => {
      el.addEventListener("click", () => {
        svg.querySelectorAll(".diag-hot").forEach((o) => o.classList.remove("active"));
        el.classList.add("active");
        const key = el.getAttribute("data-detail-key");
        const text = d.details && d.details[key];
        if (text) {
          detailBox.innerHTML = "<strong>" + key.replace(/_/g, " ") + "</strong>" + text;
          detailBox.classList.add("visible");
        }
      });
    });

    const caption = document.createElement("figcaption");
    caption.textContent = d.caption;
    figure.appendChild(caption);

    return figure;
  }

  function renderArticle(topic, sectionLabel) {
    const article = document.createElement("div");
    article.className = "article";

    const eyebrowClass =
      topic.eyebrow && topic.eyebrow.toLowerCase().includes("wart")
        ? "eyebrow wart"
        : topic.eyebrow && topic.eyebrow.toLowerCase() === "perspective"
        ? "eyebrow good"
        : "eyebrow";

    const header = document.createElement("div");
    header.innerHTML =
      '<span class="' + eyebrowClass + '">' + topic.eyebrow + "</span>" +
      "<h2>" + topic.title + "</h2>" +
      '<p class="dek">' + topic.dek + "</p>";
    article.appendChild(header);

    if (topic.diagram) {
      const fig = renderDiagram(topic.diagram);
      if (fig) article.appendChild(fig);
    }

    const body = document.createElement("div");
    body.innerHTML = topic.body;
    article.appendChild(body);

    return article;
  }

  function renderProgress(section, topic) {
    const idx = section.topics.findIndex((t) => t.id === topic.id);
    const prev = section.topics[idx - 1];
    const next = section.topics[idx + 1];

    const sectionIdx = SECTIONS.findIndex((s) => s.id === section.id);
    const nextSection = SECTIONS[sectionIdx + 1];
    const prevSection = SECTIONS[sectionIdx - 1];

    const bar = document.createElement("div");
    bar.className = "progress";

    const prevBtn = document.createElement("button");
    if (prev) {
      prevBtn.textContent = "← " + prev.title;
      prevBtn.addEventListener("click", () => (location.hash = prev.id));
    } else if (prevSection) {
      const last = prevSection.topics[prevSection.topics.length - 1];
      prevBtn.textContent = "← " + prevSection.label;
      prevBtn.addEventListener("click", () => (location.hash = last.id));
    } else {
      prevBtn.textContent = "←";
      prevBtn.disabled = true;
    }

    const nextBtn = document.createElement("button");
    if (next) {
      nextBtn.textContent = next.title + " →";
      nextBtn.addEventListener("click", () => (location.hash = next.id));
    } else if (nextSection) {
      const first = nextSection.topics[0];
      nextBtn.textContent = nextSection.label + " →";
      nextBtn.addEventListener("click", () => (location.hash = first.id));
    } else {
      nextBtn.textContent = "→";
      nextBtn.disabled = true;
    }

    bar.appendChild(prevBtn);
    bar.appendChild(nextBtn);
    return bar;
  }

  function render() {
    const activeId = currentTopicId();
    const topic = findTopic(activeId);
    const section = SECTIONS.find((s) => s.id === topic.sectionId);

    renderNav(activeId);

    crumb.textContent = section.label + " / " + topic.title;

    main.innerHTML = "";
    main.appendChild(renderRail(section, activeId));
    main.appendChild(renderArticle(topic, section.label));
    main.appendChild(renderProgress(section, topic));

    main.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  window.addEventListener("hashchange", render);

  // --- theme toggle: cycles system -> light -> dark -> system ---
  function applyTheme(mode) {
    if (mode === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);
    themeBtn.textContent =
      mode === "system" ? "Theme: System" : mode === "light" ? "Theme: Light" : "Theme: Dark";
    localStorage.setItem("kbm-talk-theme", mode);
  }

  themeBtn.addEventListener("click", () => {
    const current = localStorage.getItem("kbm-talk-theme") || "system";
    const next = current === "system" ? "light" : current === "light" ? "dark" : "system";
    applyTheme(next);
  });

  applyTheme(localStorage.getItem("kbm-talk-theme") || "system");

  render();
})();
