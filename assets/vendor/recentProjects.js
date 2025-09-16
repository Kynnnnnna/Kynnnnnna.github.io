(function () {
  // Configuration
  const PAGE_SIZE = 1; // show 1 project at a time
  const CONTAINER_ID = "recent-projects";
  const LOAD_MORE_ID = "load-more-projects";

  const source = Array.isArray(window.Projects) ? window.Projects.slice() : [];

  const projects = source.sort((a, b) => new Date(b.date) - new Date(a.date));

  let shownCount = 0;

  // Build a project card element
  function createProjectCard(p) {
    const img = (p.image || "").trim();
    const title = (p.title || "Untitled Project").trim();
    const desc = (p.description || "").trim();
    const date = (p.date || "").trim();
    const highlights = Array.isArray(p.highlights) ? p.highlights : [];
    const github = (p.github || "").trim();

    // Highlights list HTML
    const highlightsHTML = highlights
      .map(h => `<li>${h}</li>`)
      .join("");

    // Card HTML
    const col = document.createElement("div");
    col.className = "col s12 m6 l4";

    col.innerHTML = `
      <div class="card medium">
        <div class="card-image waves-effect waves-block waves-light">
          <img alt="${title}" src="${img}" style="height:100%;width:100%;" class="activator" />
        </div>
        <div class="card-content">
          <span class="card-title activator teal-text hoverline">
            ${title}<i class="mdi-navigation-more-vert right"></i>
          </span>
          <p>${desc}</p>
          <p class="grey-text" style="margin-top:6px;">${date ? new Date(date).toDateString() : ""}</p>
        </div>
        <div class="card-reveal">
          <span class="card-title teal-text">
            <small>Highlights</small><i class="mdi-navigation-close right"></i>
          </span>
          <ul>${highlightsHTML}</ul>
        </div>
      </div>
    `;

    return col;
  }

  // Append up to PAGE_SIZE projects
  function renderNextPage() {
    const container = document.getElementById(CONTAINER_ID);
    const loadMoreBtn = document.getElementById(LOAD_MORE_ID);

    if (!container) return;

    const end = Math.min(shownCount + PAGE_SIZE, projects.length);
    for (let i = shownCount; i < end; i++) {
      container.appendChild(createProjectCard(projects[i]));
    }
    shownCount = end;

    // Hide the button if no more projects
    if (loadMoreBtn) {
      loadMoreBtn.style.display = shownCount >= projects.length ? "none" : "inline-block";
    }
  }

  // Initialize after DOM is ready
  function init() {
    const container = document.getElementById(CONTAINER_ID);
    const loadMoreBtn = document.getElementById(LOAD_MORE_ID);

    if (!container) return; // nothing to do if section is missing

    // First render: only the latest project
    renderNextPage();

    // Wire up "Load More"
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", renderNextPage);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();