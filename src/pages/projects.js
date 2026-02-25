import { projects } from "../data/projects.js";

let index = 0;

function renderProject(card, p) {
  const tech = p.tech.map(t => `<span class="btn" style="cursor:default;">${t}</span>`).join("");

  card.innerHTML = `
    <div class="project-card-grid">
      <div class="project-card-content">
        <h2 class="project-title">${p.title}</h2>
        <p class="project-meta">${p.short}</p>

        <div style="display:flex; gap:8px; flex-wrap:wrap; margin: 12px 0;">
          ${tech}
        </div>

        <div class="project-actions">
          ${p.links.live ? `<a class="btn" href="${p.links.live}" target="_blank">Live</a>` : ""}
          ${p.links.code ? `<a class="btn btn--code" href="${p.links.code}" target="_blank">Code</a>` : ""}
          <a class="btn btn--details" href="/project/?id=${p.id}">Details</a>
        </div>

        <div style="margin-top:14px; color:var(--muted); font-size:0.9rem;">
          ${p.year} • ${index + 1} / ${projects.length}
        </div>
      </div>

      ${p.cover ? `
        <a class="project-card-cover" href="/project/?id=${p.id}" aria-label="View ${p.title} details">
          <img
            src="${p.cover}"
            alt="${p.title} cover"
            loading="lazy"
          />
        </a>
      ` : ""}
    </div>
  `;
}


function mountProjectsCarousel() {
  const card = document.querySelector("#projectCard");
  const prev = document.querySelector("#prevProject");
  const next = document.querySelector("#nextProject");

  if (!card || !prev || !next) return;

  let direction = 1;

  const update = () => {
    card.style.setProperty("--slide", direction === 1 ? "-8px" : "8px");

    card.classList.remove("anim-in");
    card.classList.add("anim-out");

    setTimeout(() => {
      renderProject(card, projects[index]);

      requestAnimationFrame(() => {
        card.classList.remove("anim-out");
        card.classList.add("anim-in");
      });
    }, 160);
  };

  prev.addEventListener("click", () => {
    direction = -1;
    index = (index - 1 + projects.length) % projects.length;
    update();
  });

  next.addEventListener("click", () => {
    direction = 1;
    index = (index + 1) % projects.length;
    update();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prev.click();
    if (e.key === "ArrowRight") next.click();
  });

  renderProject(card, projects[index]);
  card.classList.add("anim-in");
}

mountProjectsCarousel();
