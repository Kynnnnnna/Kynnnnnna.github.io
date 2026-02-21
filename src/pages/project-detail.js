import { projects } from "../data/projects.js";

const id = window.location.pathname.split("/").filter(Boolean).pop();
const project = projects.find(p => p.id === id);

if (project?.gallery) {
  const el = document.querySelector("#projectGallery");
  if (el) {
    el.innerHTML = project.gallery.map(src => `
      <img
        src="${src}"
        alt="${project.title} screenshot"
        loading="lazy"
        style="width:100%; border-radius:12px; border:1px solid var(--border); margin-bottom:12px;"
      />
    `).join("");
  }
}
