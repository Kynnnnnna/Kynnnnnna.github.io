export function animatePageEnter() {
  const main = document.querySelector("main");
  if (!main) return;

  main.style.opacity = "0";
  main.style.transform = "translateY(8px)";

  requestAnimationFrame(() => {
    main.style.transition = "opacity 420ms ease, transform 420ms ease";
    main.style.opacity = "1";
    main.style.transform = "translateY(0)";
  });
}
