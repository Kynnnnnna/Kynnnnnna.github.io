import { projects } from "../data/projects.js";

const container = document.querySelector("#project-container");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const currentIndex = projects.findIndex((p) => p.id === id);

if (currentIndex === -1 || !container) {
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h1 class="section-title">Project not found</h1>
        <p class="section-sub">Looks like this link is broken.</p>
        <a href="/projects/" class="btn">← Back to Projects</a>
      </div>
    `;
  }
} else {
  const project = projects[currentIndex];
  document.title = `${project.title} — Kyna`;

  // Calculate Previous and Next projects
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;
  const prevProject = projects[prevIndex];
  const nextProject = projects[nextIndex];

  const techHTML = project.tech
    .map((t) => `<span class="tech-pill">${t}</span>`)
    .join("");
  const liveLink = project.links.live
    ? `<a class="btn" href="${project.links.live}" target="_blank">Live App</a>`
    : "";
  const codeLink = project.links.code
    ? `<a class="btn btn--code" href="${project.links.code}" target="_blank">Source Code</a>`
    : "";

  const galleryHTML = project.gallery
    ? `<div class="project-gallery">
        ${project.gallery
          .map(
            (src, i) => `
          <img 
            class="gallery-img" 
            src="${src}" 
            alt="Screenshot of ${project.title}" 
            loading="lazy" 
            decoding="async"
            style="animation-delay: ${i * 0.1}s" 
          />
        `,
          )
          .join("")}
       </div>`
    : "";

  const videoHTML = project.video
    ? `
      <div class="project-video">
        <video controls playsinline preload="metadata" class="detail-video">
          <source src="${project.video}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    `
    : "";

  // Inject layout without the top nav, but with the massive footer nav
  container.innerHTML = `
    <header class="detail-header">
      <h1 class="detail-title">${project.title}</h1>
      <div class="detail-meta">
        <span class="detail-year">${project.year}</span>
        <div class="project-tech">${techHTML}</div>
      </div>
    </header>

    <div class="detail-content">
      <div class="detail-text">
        <h3>Overview</h3>
        <p>${project.description}</p>
        
        <div class="project-links">
          ${liveLink}
          ${codeLink}
        </div>
        ${videoHTML}
      </div>

      ${galleryHTML}
    </div>

    <div class="project-pagination">
      <a href="/project/?id=${prevProject.id}" class="pagination-btn pagination-prev">
        <div class="pagination-bg">
          <img src="${prevProject.cover}" alt="Previous project cover" loading="lazy" decoding="async" />
        </div>
        <div class="pagination-content">
          <span class="pagination-label">← Previous</span>
          <span class="pagination-title">${prevProject.title}</span>
        </div>
      </a>

      <a href="/project/?id=${nextProject.id}" class="pagination-btn pagination-next">
        <div class="pagination-bg">
          <img src="${nextProject.cover}" alt="Next project cover" loading="lazy" decoding="async" />
        </div>
        <div class="pagination-content">
          <span class="pagination-label">Next →</span>
          <span class="pagination-title">${nextProject.title}</span>
        </div>
      </a>
    </div>
  `;
}
