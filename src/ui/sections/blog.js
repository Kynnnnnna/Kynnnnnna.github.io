export function mountBlog(section) {
  section.innerHTML = `
    <div class="container">
      <h2 class="section-title">Blog</h2>
      <div class="glass locked">
        <div>
          <b>Locked</b>
          <div style="color:var(--muted); margin-top:6px;">We’ll open this up later.</div>
        </div>
        <div class="btn" style="cursor:default;">🔒</div>
      </div>
    </div>
  `;
}
