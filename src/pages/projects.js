import { projects } from "../data/projects.js";

const grid = document.querySelector("#projectsGrid");

if (grid) {
  grid.innerHTML = projects
    .map((p, index) => {
      // Keep the tags clean: show top 3, summarize the rest
      const visibleTech = p.tech.slice(0, 3);
      const extraTech = p.tech.length > 3 ? p.tech.length - 3 : 0;

      const techHTML =
        visibleTech.map((t) => `<span class="tech-pill">${t}</span>`).join("") +
        (extraTech > 0 ? `<span class="tech-pill">+${extraTech}</span>` : "");

      return `
      <a href="/project/?id=${p.id}" class="project-card" style="--stagger: ${index}">
        <div class="project-cover-wrapper">
          <img class="project-cover-img" src="${p.cover}" alt="${p.title}" loading="lazy" decoding="async" />
          <div class="project-shine"></div>
        </div>
        
        <div class="project-info">
          <div class="project-header">
            <h2 class="project-title">${p.title}</h2>
            <span class="project-year">${p.year}</span>
          </div>
          <p class="project-short">${p.short}</p>
          <div class="project-tech">
            ${techHTML}
          </div>
        </div>
      </a>
    `;
    })
    .join("");
}
