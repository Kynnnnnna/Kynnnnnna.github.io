import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/components.css";

import { mountNav } from "./ui/nav.js";

import { mountHome } from "./ui/sections/home.js";
import { mountAbout } from "./ui/sections/about.js";
import { mountProjects } from "./ui/sections/projects.js";
import { mountArtbook } from "./ui/sections/artbook.js";
import { mountBlog } from "./ui/sections/blog.js";

mountNav(document.querySelector("#nav-root"));

mountHome(document.querySelector("#home"));
mountAbout(document.querySelector("#about"));
mountProjects(document.querySelector("#projects"));
mountArtbook(document.querySelector("#artbook"));
mountBlog(document.querySelector("#blog"));
