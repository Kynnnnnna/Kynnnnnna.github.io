export function mountAbout(section) {
  section.innerHTML = `
    <div class="container">
      <h2 class="section-title">About Me</h2>
      <p class="section-sub">Short intro + contact only.</p>

      <div class="about-grid">
        <div class="glass card">
          <p style="margin:0 0 10px; line-height:1.65;">
            I’m Kyna — a programmer who enjoys building interactive, expressive web experiences.
          </p>
          <p style="margin:0; line-height:1.65;">
            I like clean UI, playful motion, and projects that feel “alive” without being overwhelming.
          </p>
        </div>

        <aside class="glass card">
          <h3 style="font-family:var(--font-title); margin:0 0 10px;">Contact</h3>
          <div style="display:grid; gap:8px; color:var(--muted);">
            <div><b style="color:var(--text); font-weight:700;">Email:</b> <a href="mailto:you@example.com">you@example.com</a></div>
            <div><b style="color:var(--text); font-weight:700;">GitHub:</b> <a href="https://github.com/YOUR_GITHUB" target="_blank" rel="noreferrer">YOUR_GITHUB</a></div>
            <div><b style="color:var(--text); font-weight:700;">LinkedIn:</b> <a href="#" target="_blank" rel="noreferrer">Coming soon</a></div>
          </div>
        </aside>
      </div>
    </div>
  `;
}
