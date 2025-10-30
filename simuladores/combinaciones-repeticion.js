// Cap. 11 — Combinaciones con repetición (Versión SIMPLE)
// Contrato: export default { render } y render() DEVUELVE UN STRING HTML.
// 3 tarjetas: Estrellas y Barras, Letras con repetición, Composición por tipos.
// Interacción por delegación global. Sin LaTeX (usa texto Unicode).

(function () {
  // ========== Utilidades mínimas ==========
  function comb(n, r) {
    if (r < 0 || r > n) return 0;
    r = Math.min(r, n - r);
    let num = 1, den = 1;
    for (let i = 1; i <= r; i++) { num *= (n - (r - i)); den *= i; }
    return Math.round(num / den);
  }

  // Combinaciones con repetición: elementos en orden no decreciente (índices crecientes con repetición)
  function combinationsWithRep(items, r) {
    const res = [];
    (function rec(start, path) {
      if (path.length === r) { res.push(path.map(i => items[i]).join('')); return; }
      for (let i = start; i < items.length; i++) rec(i, path.concat(i));
    })(0, []);
    return res;
  }

  // Composiciones x1+...+xn=r, xi>=0 (cap para no saturar)
  function compositions(n, r, cap = 200) {
    const out = [];
    (function rec(pos, left, acc) {
      if (out.length >= cap) return;
      if (pos === n - 1) { out.push(acc.concat(left)); return; }
      for (let x = 0; x <= left; x++) {
        rec(pos + 1, left - x, acc.concat(x));
        if (out.length >= cap) return;
      }
    })(0, r, []);
    return out;
  }

  // ========== Estilos mínimos ==========
  const CSS = `
  .crs-root{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  .card{border:1px solid #e6e6e6;border-radius:10px;padding:12px;margin:12px 0;background:#fff}
  .head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
  .title{font-weight:700}
  .controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .btn{padding:6px 10px;border-radius:8px;background:#f7f7f7;border:1px solid #ccc;cursor:pointer}
  .inp{padding:6px 8px;border:1px solid #ccc;border-radius:8px;width:90px}
  .prob{margin-top:8px;line-height:1.55}
  .sol{margin-top:10px;padding-top:8px;border-top:1px dashed #ddd;display:none}
  code.k{background:#f4f4f4;padding:2px 6px;border-radius:6px}
  .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
  ul.compact{margin:6px 0 0 18px}
  `;

  // ========== Bloques HTML ==========
  function blockStarsBars() {
    return `
      <div class="card" data-block="sb">
        <div class="head">
          <div class="title">Estrellas y Barras (combinaciones con repetición)</div>
          <div class="controls">
            <label>n tipos <input class="inp" type="number" min="2" max="6" value="3" data-role="n"></label>
            <label>r objetos <input class="inp" type="number" min="1" max="12" value="5" data-role="r"></label>
            <button class="btn" data-action="sb-calc">Calcular</button>
            <button class="btn" data-action="sb-rand">Aleatorio</button>
            <button class="btn" data-action="sb-toggle">Mostrar solución</button>
          </div>
        </div>
        <div class="prob" data-role="sb-info"><em>Ingresa n y r, y pulsa “Calcular”.</em></div>
        <div class="sol" data-role="sb-sol"></div>
      </div>
    `;
  }

  function blockLetters() {
    return `
      <div class="card" data-block="letters">
        <div class="head">
          <div class="title">Letras con repetición</div>
          <div class="controls">
            <label>k (2–5) <input class="inp" type="number" min="2" max="5" value="3" data-role="k"></label>
            <label>r (1–4) <input class="inp" type="number" min="1" max="4" value="3" data-role="r"></label>
            <button class="btn" data-action="letters-gen">Generar</button>
            <button class="btn" data-action="letters-toggle">Mostrar solución</button>
          </div>
        </div>
        <div class="prob" data-role="letters-info"><em>Elige k y r y pulsa “Generar”.</em></div>
        <div class="sol" data-role="letters-sol"></div>
      </div>
    `;
  }

  function blockMix() {
    return `
      <div class="card" data-block="mix">
        <div class="head">
          <div class="title">Composición por tipos (n categorías, tamaño r)</div>
          <div class="controls">
            <label>n (2–4) <input class="inp" type="number" min="2" max="4" value="2" data-role="n"></label>
            <label>r (1–10) <input class="inp" type="number" min="1" max="10" value="5" data-role="r"></label>
            <button class="btn" data-action="mix-gen">Generar</button>
            <button class="btn" data-action="mix-toggle">Mostrar solución</button>
          </div>
        </div>
        <div class="prob" data-role="mix-info"><em>Elige n y r y pulsa “Generar”.</em></div>
        <div class="sol" data-role="mix-sol"></div>
      </div>
    `;
  }

  // ========== Render helpers ==========
  function renderSB(card, n, r) {
    const info = card.querySelector('[data-role="sb-info"]');
    const sol  = card.querySelector('[data-role="sb-sol"]');
    n = Math.max(2, Math.min(6, Number(n)||0));
    r = Math.max(1, Math.min(12, Number(r)||0));
    const total = comb(n + r - 1, r);
    info.innerHTML = `
      <p>Parámetros: n = <b>${n}</b>, r = <b>${r}</b></p>
      <p>Total combinaciones con repetición: <code class="k">C(n+r−1, r) = C(${n+r-1}, ${r}) = ${total}</code></p>
    `;
    sol.innerHTML = `
      <p><b>Explicación</b></p>
      <p>Estrellas y barras: contar soluciones en enteros no negativos de x₁+…+xₙ=r
         equivale a C(n+r−1, r). Cada composición ↔ colocar r estrellas y n−1 barras.</p>
      <p>Ejemplo: n=3, r=5. Una composición (2,1,2) puede verse como ★★|★|★★.</p>
    `;
  }

  function renderLetters(card, k, r) {
    const info = card.querySelector('[data-role="letters-info"]');
    const sol  = card.querySelector('[data-role="letters-sol"]');
    k = Math.max(2, Math.min(5, Number(k)||0));
    r = Math.max(1, Math.min(4, Number(r)||0));
    const letters = ['a','b','c','d','e'].slice(0, k);
    const total = comb(k + r - 1, r);
    const list = combinationsWithRep(letters, r);
    const MAX = 150;
    const shown = list.slice(0, MAX);
    const tail = list.length > MAX ? `… (y ${list.length - MAX} más)` : '';
    info.innerHTML = `
      <p>Alfabeto: <code class="k">{${letters.join(', ')}}</code>, orden r = <b>${r}</b></p>
      <p>Total: <code class="k">C(k+r−1, r) = C(${k+r-1}, ${r}) = ${total}</code></p>
    `;
    sol.innerHTML = `
      <p>Listado (orden no decreciente):</p>
      <p>${shown.join(', ')} ${tail}</p>
    `;
  }

  function renderMix(card, n, r) {
    const info = card.querySelector('[data-role="mix-info"]');
    const sol  = card.querySelector('[data-role="mix-sol"]');
    n = Math.max(2, Math.min(4, Number(n)||0));
    r = Math.max(1, Math.min(10, Number(r)||0));
    const total = comb(n + r - 1, r);
    info.innerHTML = `
      <p>n tipos = <b>${n}</b>, tamaño r = <b>${r}</b></p>
      <p>Total composiciones (x₁,…,xₙ) con xᵢ≥0, Σxᵢ=r:
         <code class="k">C(n+r−1, r) = C(${n+r-1}, ${r}) = ${total}</code></p>
    `;
    // Si el total no es enorme, listamos
    if (total <= 200) {
      const comps = compositions(n, r, 200);
      sol.innerHTML = `
        <p>Composiciones:</p>
        <p>${comps.map(v => '(' + v.join(', ') + ')').join(', ')}</p>
      `;
    } else {
      sol.innerHTML = `<p>Listado omitido (total=${total} > 200). Reduce n o r para ver la lista completa.</p>`;
    }
  }

  // ========== Delegación de eventos ==========
  if (!window.__CRS_EVENTS__) {
    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest?.('.btn'); if (!btn) return;
      const action = btn.getAttribute('data-action');

      // Estrellas y Barras
      if (action === 'sb-calc' || action === 'sb-rand' || action === 'sb-toggle') {
        const card = btn.closest('[data-block="sb"]'); if (!card) return;
        const nEl = card.querySelector('[data-role="n"]');
        const rEl = card.querySelector('[data-role="r"]');
        const sol = card.querySelector('[data-role="sb-sol"]');

        if (action === 'sb-toggle') {
          sol.style.display = sol.style.display === 'none' ? 'block' : 'none';
          return;
        }

        let n, r;
        if (action === 'sb-rand') {
          n = Math.floor(Math.random() * 5) + 2;       // 2..6
          r = Math.floor(Math.random() * 12) + 1;      // 1..12
          nEl.value = n; rEl.value = r;
        } else {
          n = nEl.value; r = rEl.value;
        }
        renderSB(card, n, r);
        return;
      }

      // Letras con repetición
      if (action === 'letters-gen' || action === 'letters-toggle') {
        const card = btn.closest('[data-block="letters"]'); if (!card) return;
        const kEl = card.querySelector('[data-role="k"]');
        const rEl = card.querySelector('[data-role="r"]');
        const sol = card.querySelector('[data-role="letters-sol"]');

        if (action === 'letters-toggle') {
          sol.style.display = sol.style.display === 'none' ? 'block' : 'none';
          return;
        }

        renderLetters(card, kEl.value, rEl.value);
        return;
      }

      // Composición por tipos
      if (action === 'mix-gen' || action === 'mix-toggle') {
        const card = btn.closest('[data-block="mix"]'); if (!card) return;
        const nEl = card.querySelector('[data-role="n"]');
        const rEl = card.querySelector('[data-role="r"]');
        const sol = card.querySelector('[data-role="mix-sol"]');

        if (action === 'mix-toggle') {
          sol.style.display = sol.style.display === 'none' ? 'block' : 'none';
          return;
        }

        renderMix(card, nEl.value, rEl.value);
        return;
      }
    });
    window.__CRS_EVENTS__ = true;
  }

  // ========== render() ==========
  function render() {
    return `
      <style>${CSS}</style>
      <div class="crs-root">
        ${blockStarsBars()}
        <div class="grid2">
          ${blockLetters()}
          ${blockMix()}
        </div>
      </div>
    `;
  }

  const api = { render };
  if (typeof window !== 'undefined') window.SIM_combinaciones_repeticion_simple = api;
  return api;
})();

export default (typeof window !== 'undefined' && window.SIM_combinaciones_repeticion_simple)
  ? window.SIM_combinaciones_repeticion_simple
  : { render: () => '' };