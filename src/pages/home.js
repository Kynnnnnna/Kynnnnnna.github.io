// Home-specific logic only

export function initHome() {
  // Placeholder for future Three.js water scene
  const hero = document.querySelector(".hero-frame");
  if (!hero) return;

  hero.dataset.readyFor3d = "true";
  // Later:
  // import("../three/waterScene.js").then(m => m.init(hero));
}

initHome();
