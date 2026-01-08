import { artbookItems } from "../../data/artbook.js";

export function mountArtbook(section) {
  section.innerHTML = `
    <div class="container">
      <h2 class="section-title">Artbook</h2>
      <p class="section-sub">Waterfall layout. Images can be added later under /public/assets/art.</p>

      <div class="waterfall" id="wf"></div>
    </div>
  `;

  const wf = section.querySelector("#wf");

  wf.innerHTML = artbookItems.map((item) => {
    // Later: if item.img exists, render <img src="...">
    return `
      <article class="glass waterfall-item">
        <div class="waterfall-thumb" aria-hidden="true"></div>
        <div class="waterfall-caption">
          <div style="font-weight:700; color:var(--text);">${item.title}</div>
          <div>${item.note ?? ""}</div>
        </div>
      </article>
    `;
  }).join("");
}
