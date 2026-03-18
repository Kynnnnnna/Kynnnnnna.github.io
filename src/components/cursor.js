export function initCursor() {
  // 1. Only run on devices with a fine pointer (aka mice, not touchscreens)
  if (!window.matchMedia("(pointer: fine)").matches) return;

  // 2. Create and inject the cursor element
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  // 3. State variables for smooth following (LERP)
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  // 4. Update target coordinates on mouse move
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // 5. Add hover effects to interactive elements
  const addHoverEvents = () => {
    const interactives = document.querySelectorAll("a, button, .btn");
    
    interactives.forEach(el => {
      // Avoid adding multiple listeners if this function runs again
      if (el.dataset.cursorAttached) return; 
      
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
      el.dataset.cursorAttached = "true";
    });
  };

  // Run once on load
  addHoverEvents();

  // Run again if the DOM changes (useful for your dynamic project detail page)
  const observer = new MutationObserver(addHoverEvents);
  observer.observe(document.body, { childList: true, subtree: true });

  // 6. The Animation Loop
  function render() {
    // Increased from 0.15 to 0.4 for a much snappier, responsive feel
    cursorX += (mouseX - cursorX) * 0.4;
    cursorY += (mouseY - cursorY) * 0.4;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(render);
  }
  
  // Start the loop
  render();
}