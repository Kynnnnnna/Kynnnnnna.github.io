import { initWaterScene } from "../three/waterScene.js";

export function initHome() {
  const sceneRoot = document.querySelector(".hero-scene");
  const webglMount = document.querySelector(".hero-webgl");
  const card = document.querySelector(".hero-frame");

  if (!sceneRoot || !webglMount || !card) return;

  const cleanupThree = initWaterScene(webglMount, sceneRoot, card);

  let rafId = 0;
  let start = performance.now();

  let targetRX = 0;
  let targetRY = 0;
  let currentRX = 0;
  let currentRY = 0;

  function handlePointerMove(e) {
    const rect = sceneRoot.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const mouseX = (x - 0.5) * 2;
    const mouseY = (y - 0.5) * 2;

    targetRY = mouseX * 1.2;
    targetRX = -mouseY * 0.8;
  }

  function handlePointerLeave() {
    targetRX = 0;
    targetRY = 0;
  }

  function animate(now) {
    const t = (now - start) * 0.001;

    const bobY = Math.sin(t * 1.05) * -10;
    const sway = Math.sin(t * 0.7) * 0.8;
    const driftX = Math.sin(t * 0.45) * 5;

    currentRX += (targetRX - currentRX) * 0.06;
    currentRY += (targetRY - currentRY) * 0.06;

    card.style.transform = `
      translate3d(${driftX}px, ${bobY}px, 0)
      rotateX(${currentRX}deg)
      rotateY(${currentRY}deg)
      rotateZ(${sway}deg)
    `;

    rafId = requestAnimationFrame(animate);
  }

  sceneRoot.addEventListener("mousemove", handlePointerMove);
  sceneRoot.addEventListener("mouseleave", handlePointerLeave);

  rafId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(rafId);
    sceneRoot.removeEventListener("mousemove", handlePointerMove);
    sceneRoot.removeEventListener("mouseleave", handlePointerLeave);
    cleanupThree?.();
  };
}

initHome();
