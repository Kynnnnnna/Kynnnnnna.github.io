import { projects } from "../../data/projects.js";

export function mountProjects(section) {
  section.innerHTML = `
    <div class="container">
      <h2 class="section-title">Projects</h2>
      <p class="section-sub">Use arrows to browse. One card at a time.</p>

      <div class="projects-wrap">
        <button class="btn" id="prevProject" aria-label="Previous project">←</button>

        <div class="glass card project-card" id="projectCard" role="region" aria-live="polite"></div>

        <button class="btn" id="nextProject" aria-label="Next project">→</button>
      </div>
    </div>
  `;

  const card = section.querySelector("#projectCard");
  const prev = section.querySelector("#prevProject");
  const next = section.querySelector("#nextProject");

  let idx = 0;

  const render = () => {
    const p = projects[idx];
    const tags = (p.tags ?? []).map(t => `<span class="btn" style="cursor:default;">${t}</span>`).join("");

    card.innerHTML = `
      <h3 class="project-title">${p.title}</h3>
      <p class="project-meta">${p.desc}</p>

      <div style="display:flex; gap:10px; flex-wrap:wrap; margin: 0 0 14px;">
        ${tags}
      </div>

      <div class="project-actions">
        <a class="btn" href="${p.links?.demo ?? "#"}" target="_blank" rel="noreferrer">Live</a>
        <a class="btn" href="${p.links?.code ?? "#"}" target="_blank" rel="noreferrer">Code</a>
      </div>

      <div style="margin-top:14px; color:var(--muted); font-size:0.9rem;">
        ${idx + 1} / ${projects.length}
      </div>
    `;
  };

  const move = (dir) => {
    idx = (idx + dir + projects.length) % projects.length;
    render();
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  // Optional: keyboard navigation when section is on screen
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });

  render();
}
