import { projects } from "../data/projects.js";

const container = document.querySelector("#project-container");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const project = projects.find(p => p.id === id);

if (!project) {
  container.innerHTML = `<h1 class="section-title">Project not found</h1><p>Return to <a href="/projects/">projects</a>.</p>`;
} else {

  document.title = `${project.title} - Kyna`;

  const galleryHTML = project.gallery
    ? `<div class="project-gallery">
        ${project.gallery.map(src => `
          <img
            class="gallery-img"
            src="${src}"
            alt="Screenshot of ${project.title}"
            loading="lazy"
            decoding="async"
          />
        `).join("")}
      </div>`
    : '';

  const liveLink = project.links.live ? `<a class="btn" href="${project.links.live}" target="_blank">Live App</a>` : '';
  const codeLink = project.links.code ? `<a class="btn btn--code" href="${project.links.code}" target="_blank">Source Code</a>` : '';

  container.innerHTML = `
    <h1 class="section-title">${project.title}</h1>
    <p class="section-sub">${project.short}</p>

    <h3>Overview</h3>
    <p>${project.description}</p>

    <div class="project-links">
      ${liveLink}
      ${codeLink}
    </div>

    ${galleryHTML}
  `;
}