export function mountNav(root) {
  root.innerHTML = `
    <nav class="nav-island glass pill">
      <a class="nav-link" href="/">Home</a>
      <a class="nav-link" href="/about/">About Me</a>
      <a class="nav-link" href="/projects/">Projects</a>
      <a class="nav-link" href="/artbook/">Artbook</a>
      <a class="nav-link" href="/blog/">Blog</a>
    </nav>
  `;
}

export function highlightActiveNav() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    const href = link.getAttribute("href").replace(/\/$/, "") || "/";

    if (href !== "/" && path.startsWith(href)) {
      link.classList.add("nav-link--active");
    }

    if (href === "/" && path === "/") {
      link.classList.add("nav-link--active");
    }
  });
}
