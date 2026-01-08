const links = [
  { label: "Home", href: "#home" },
  { label: "About Me", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Artbook", href: "#artbook" },
  { label: "Blog", href: "#blog" }
];

export function mountNav(root) {
  root.innerHTML = `
    <nav class="nav-island glass pill" aria-label="Primary navigation">
      ${links.map(l => `<a class="nav-link" href="${l.href}">${l.label}</a>`).join("")}
    </nav>
  `;

  // Smooth scroll (native is fine but this is consistent across browsers)
  root.querySelectorAll("a[href^='#']").forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
}
