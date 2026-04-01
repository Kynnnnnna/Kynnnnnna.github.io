export function animatePageEnter() {
  const main = document.querySelector("main");
  if (!main) return;

  main.style.opacity = "0";
  main.style.transform = "translateY(10px)";
  main.style.filter = "blur(6px)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      main.style.transition =
        "opacity 420ms ease, transform 420ms ease, filter 420ms ease";
      main.style.opacity = "1";
      main.style.transform = "translateY(0)";
      main.style.filter = "blur(0)";
      document.body.classList.add("page-ready");
    });
  });
}