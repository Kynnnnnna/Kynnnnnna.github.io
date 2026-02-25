// src/main.js
import "./styles/theme.css";
import "./styles/layout.css";

// Components
import "./styles/components/home.css";
import "./styles/components/buttons.css";
import "./styles/components/cards.css";
import "./styles/components/nav.css";
import "./styles/components/projects.css";
import "./styles/components/waterfall.css";

import { mountNav, highlightActiveNav } from "./components/nav.js";
import { animatePageEnter } from "./utils/pageEnter.js";

// Always-run logic
const navRoot = document.querySelector("#nav-root");
if (navRoot) {
  mountNav(navRoot);
  highlightActiveNav();
}

animatePageEnter();

// Page-specific logic
const page = document.body.dataset.page;

switch (page) {
  case "home":
    import("./pages/home.js");
    break;

  case "projects":
    import("./pages/projects.js");
    break;

  case "project-detail":
    import("./pages/project-detail.js");
    break;

  case "artbook":
    import("./pages/artbook.js");
    break;

  case "about":
    import("./pages/about.js");
    break;

  case "blog":
    import("./pages/blog.js")
    break;

  default:
    // no-op
    break;
}
