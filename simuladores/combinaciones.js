// combinaciones.js (v3)
// Cap. 10 — Combinaciones: simulador visual + simulador textual.
// - export default { render } y render() devuelve STRING (contrato del host).
// - Visual: "Aplicar seed" soporta formato libre o explícito n=...,r=...,pair=a-b.
// - Textual: seed propia (aplicar/copiar) y aleatoriedad en Letras/Comité/Binomio.
// - NUEVO: botones "Mostrar solución" por tarjeta en el simulador textual.
// - Sin LaTeX (Unicode/texto), interacciones por delegación global.

(function () {
  // ========== Utils ==========
  function mulberry32(a){return function(){let t=(a+=0x6d2b79f5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
  function seedFromString(str=""){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=(h<<13)|(h>>>19);}return h>>>0;}
  function makeRng(seed){if(typeof seed==="string") seed=seedFromString(seed); if(typeof seed!=="number") seed=Math.floor(Math.random()*2**32); return mulberry32(seed>>>0);}
  function randInt(rng,min,max){return Math.floor(rng()*(max-min+1))+min;}
  function shuffle(rng,arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function uid(){return Math.random().toString(36).slice(2,10);}
  function comb(n,r){ if(r<0||r>n) return 0; r=Math.min(r,n-r); let num=1, den=1; for(let i=1;i<=r;i++){ num*=(n-(r-i)); den*=i; } return Math.round(num/den);}

  // ========== CSS ==========
  const CSS = `
  .cmb-root{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  .cmb-card{border:1px solid #e6e6e6;border-radius:10px;padding:12px;margin:12px 0;background:#fff}
  .cmb-head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
  .cmb-title{font-weight:700}
  .cmb-controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .cmb-btn{padding:6px 10px;border-radius:8px;background:#f7f7f7;border:1px solid #ccc;cursor:pointer}
  .cmb-input{padding:6px 8px;border:1px solid #ccc;border-radius:8px;width:180px}
  .cmb-seed{font-size:12px;color:#666;margin-top:6px}
  .cmb-prob{margin-top:8px;line-height:1.55}
  .cmb-solution{margin-top:10px;padding-top:8px;border-top:1px dashed #e0e0e0;display:none}
  .grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:8px}
  ul.compact{margin:6px 0 0 18px}
  code.k{background:#f4f4f4;padding:2px 6px;border-radius:6px}
  `;

  // ========== Visual (comités) ==========
  // Acepta seed textual arbitraria o explícita "n=...,r=...,pair=a-b"
  function parseVisualSeed(str){
    const m = /^\s*n\s*=\s*(\d+)\s*,\s*r\s*=\s*(\d+)\s*,\s*pair\s*=\s*(\d+)\s*-\s*(\d+)\s*$/i.exec(str||"");
    if(!m) return null;
    const n = +m[1], r = +m[2], a = +m[3], b = +m[4];
    if(!(n>=2 && r>=0 && r<=n)) return null;
    return {n,r,pairA:a,pairB:b};
  }
  function instanceVisual(seedStr){
    const parsed = parseVisualSeed(seedStr);
    if (parsed){
      const {n,r,pairA,pairB} = parsed;
      const total=comb(n,r);
      const pairBoth = r>=2 ? comb(n-2,r-2) : 0;
      const pairNotBoth = total - pairBoth;
      return {n,r,pairA,pairB,total,pairBoth,pairNotBoth, seed:`n=${n},r=${r},pair=${pairA}-${pairB}`};
    }
    const rng = makeRng(seedStr || Date.now());
    const n = randInt(rng,8,14);
    const r = randInt(rng,3,Math.min(6,n));
    const pairA = randInt(rng,1,n);
    const pairB = ((pairA + randInt(rng,1,n-1))-1)%n + 1;
    const total=comb(n,r);
    const pairBoth = r>=2 ? comb(n-2,r-2) : 0;
    const pairNotBoth = total - pairBoth;
    return {n,r,pairA,pairB,total,pairBoth,pairNotBoth, seed:`n=${n},r=${r},pair=${pairA}-${pairB}`};
  }

  // ========== Textual (tres tarjetas) ==========
  function listCombinations(arr, r){
    const res=[]; (function rec(start, path){
      if (path.length===r){ res.push(path.join('')); return; }
      for (let i=start;i<arr.length;i++) rec(i+1, path.concat(arr[i]));
    })(0,[]);
    return res;
  }
  function genLetters(seedBase){
    let k;
    if (seedBase){ k = randInt(makeRng(seedBase + '|letters'),2,5); }
    else { k = randInt(makeRng(Date.now()),2,5); }
    const letters = ['a','b','c','d','e'].slice(0,k);
    const combos = {}, counts = {};
    for (let r=1;r<=k;r++){ combos[r]=listCombinations(letters,r); counts[r]=comb(k,r); }
    return { letters, combos, counts, seed:`letters:k=${k}` };
  }
  function genCommittee(seedBase){
    let n,r;
    if (seedBase){ const rng=makeRng(seedBase+'|committee'); n=randInt(rng,8,14); r=randInt(rng,3,Math.min(6,n)); }
    else { const rng=makeRng(Date.now()); n=randInt(rng,8,14); r=randInt(rng,3,Math.min(6,n)); }
    const total=comb(n,r);
    const pairBoth = r>=2 ? comb(n-2,r-2) : 0;
    const pairNotBoth = total - pairBoth;
    const withPresident = n * comb(n-1, r-1);
    return { n,r,total,pairBoth,pairNotBoth,withPresident, seed:`committee:n=${n},r=${r}` };
  }
  function genBinomial(seedBase){
    let n;
    if (seedBase){ n = randInt(makeRng(seedBase+'|binom'),3,8); }
    else { n = randInt(makeRng(Date.now()),3,8); }
    const coeffs = []; for (let r=0;r<=n;r++) coeffs.push(comb(n,r));
    const sum = coeffs.reduce((a,b)=>a+b,0);
    const termR = randInt(makeRng((seedBase||Date.now())+'|term'), 0, n);
    const termStr = `${coeffs[termR]}·a^${n-termR}·b^${termR}`;
    return { n, coeffs, sum, termR, termStr, seed:`binom:n=${n}` };
  }

  // ========== HTML blocks ==========
  function visualBlock(){
    return `
      <div class="cmb-card" data-block="visual">
        <div class="cmb-head">
          <div class="cmb-title">Simulador visual — Comités y combinaciones</div>
          <div class="cmb-controls">
            <input class="cmb-input" placeholder="seed (p.ej. n=12,r=5,pair=3-7)" data-role="seed-visual">
            <button class="cmb-btn" data-action="apply-visual">Aplicar seed</button>
            <button class="cmb-btn" data-action="copy-visual">Copiar seed</button>
            <button class="cmb-btn" data-action="new-visual">Nuevo ejercicio</button>
            <button class="cmb-btn" data-action="toggle-visual">Mostrar solución</button>
          </div>
        </div>
        <div class="cmb-seed" data-role="seed-v">seed: —</div>
        <div class="cmb-prob" data-role="visual-info"><em>Pulsa “Nuevo ejercicio” o “Aplicar seed”.</em></div>
        <div class="cmb-solution" data-role="visual-sol"></div>
      </div>
    `;
  }
  function textualBlock(){
    return `
      <div class="cmb-card" data-block="textual">
        <div class="cmb-head">
          <div class="cmb-title">Simulador textual — Letras, comité y binomio</div>
          <div class="cmb-controls">
            <input class="cmb-input" placeholder="Seed textual (opcional)" data-role="seed-text">
            <button class="cmb-btn" data-action="apply-text">Aplicar seed</button>
            <button class="cmb-btn" data-action="copy-text">Copiar seed</button>
          </div>
        </div>

        <div class="grid3">
          <!-- Letras -->
          <div>
            <div class="cmb-head" style="justify-content:space-between">
              <div class="cmb-title" style="font-weight:600">Letras (min {a,b}, máx {a,b,c,d,e})</div>
              <div class="cmb-controls">
                <button class="cmb-btn" data-action="new-letters">Nuevo</button>
                <button class="cmb-btn" data-action="toggle-letters">Mostrar solución</button>
              </div>
            </div>
            <div class="cmb-seed" data-role="seed-letters">seed: —</div>
            <div class="cmb-prob" data-role="letters-prob"><em>Pulsa “Nuevo” o “Aplicar seed”.</em></div>
            <div class="cmb-solution" data-role="letters-sol"></div>
          </div>

          <!-- Comité -->
          <div>
            <div class="cmb-head" style="justify-content:space-between">
              <div class="cmb-title" style="font-weight:600">Comité con restricciones</div>
              <div class="cmb-controls">
                <button class="cmb-btn" data-action="new-committee">Nuevo</button>
                <button class="cmb-btn" data-action="toggle-committee">Mostrar solución</button>
              </div>
            </div>
            <div class="cmb-seed" data-role="seed-committee">seed: —</div>
            <div class="cmb-prob" data-role="committee-prob"><em>Pulsa “Nuevo” o “Aplicar seed”.</em></div>
            <div class="cmb-solution" data-role="committee-sol"></div>
          </div>

          <!-- Binomio -->
          <div>
            <div class="cmb-head" style="justify-content:space-between">
              <div class="cmb-title" style="font-weight:600">Coeficientes del binomio</div>
              <div class="cmb-controls">
                <button class="cmb-btn" data-action="new-binom">Nuevo</button>
                <button class="cmb-btn" data-action="toggle-binom">Mostrar solución</button>
              </div>
            </div>
            <div class="cmb-seed" data-role="seed-binom">seed: —</div>
            <div class="cmb-prob" data-role="binom-prob"><em>Pulsa “Nuevo” o “Aplicar seed”.</em></div>
            <div class="cmb-solution" data-role="binom-sol"></div>
          </div>
        </div>
      </div>
    `;
  }

  // ========== Render helpers ==========
  function renderVisual(root, inst){
    const info = root.querySelector('[data-role="visual-info"]');
    const seedEl = root.querySelector('[data-role="seed-v"]');
    const sol = root.querySelector('[data-role="visual-sol"]');
    if (seedEl) seedEl.textContent = `seed: ${inst.seed}`;
    if (info){
      info.innerHTML = `
        <p>Seleccionar <b>${inst.r}</b> de <b>${inst.n}</b> personas.</p>
        <ul class="compact">
          <li>Total: C(${inst.n},${inst.r}) = <b>${inst.total}</b></li>
          <li>Pareja ${inst.pairA}-${inst.pairB} junta: C(${inst.n-2},${inst.r-2}) = <b>${inst.pairBoth}</b></li>
          <li>Pareja no junta: <b>${inst.pairNotBoth}</b></li>
        </ul>
      `;
    }
    if (sol){
      sol.innerHTML = `
        <p><b>Detalle:</b> Total = C(n,r) = n!/(r!(n−r)!)</p>
        <p>“Junta”: fijar la pareja y completar r−2 de n−2 → C(n−2, r−2).</p>
        <p>“No junta”: Total − “Junta”.</p>
      `;
      sol.style.display = 'none';
    }
  }
  function renderLetters(root, out){
    root.querySelector('[data-role="seed-letters"]').textContent = `seed: ${out.seed}`;
    const prob = root.querySelector('[data-role="letters-prob"]');
    const sol = root.querySelector('[data-role="letters-sol"]');
    if (prob){ prob.innerHTML = `<p>Alfabeto: <code class="k">{${out.letters.join(', ')}}</code>. Listados por orden y conteos C(k,r).</p>`; }
    if (sol){
      const k = out.letters.length;
      const parts = [];
      for (let r=1;r<=k;r++){ parts.push(`<p>Orden ${r} — C(${k},${r})=${out.counts[r]}: ${out.combos[r].join(', ')}</p>`); }
      sol.innerHTML = parts.join('');
      sol.style.display = 'none';
    }
  }
  function renderCommittee(root, out){
    root.querySelector('[data-role="seed-committee"]').textContent = `seed: ${out.seed}`;
    root.querySelector('[data-role="committee-prob"]').innerHTML = `<p>Elegir ${out.r} de ${out.n}. Calcular total, “pareja junta”, “pareja no junta” y “con presidente”.</p>`;
    const sol = root.querySelector('[data-role="committee-sol"]');
    sol.innerHTML = `
      <p>Total: C(${out.n},${out.r}) = <b>${out.total}</b></p>
      <p>Pareja junta (si r≥2): C(${out.n-2},${out.r-2}) = <b>${out.pairBoth}</b></p>
      <p>Pareja no junta: <b>${out.pairNotBoth}</b></p>
      <p>Con presidente: n × C(n−1, r−1) = ${out.n} × C(${out.n-1}, ${out.r-1}) = <b>${out.withPresident}</b></p>
    `;
    sol.style.display = 'none';
  }
  function renderBinom(root, out){
    root.querySelector('[data-role="seed-binom"]').textContent = `seed: ${out.seed}`;
    root.querySelector('[data-role="binom-prob"]').innerHTML = `<p>Coeficientes de (a+b)^${out.n} y suma 2^${out.n}.</p>`;
    const sol = root.querySelector('[data-role="binom-sol"]');
    sol.innerHTML = `
      <p>Fila: ${out.coeffs.join(', ')}</p>
      <p>Suma (identidad): 2^${out.n} = <b>${out.sum}</b></p>
      <p>Término destacado: <b>${out.termStr}</b></p>
    `;
    sol.style.display = 'none';
  }

  // ========== Delegación de eventos ==========
  if (!window.__CMB_V3_EVENTS__){
    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest?.('.cmb-btn'); if(!btn) return;
      const action = btn.getAttribute('data-action');

      // Visual
      if (action==='new-visual' || action==='apply-visual' || action==='copy-visual' || action==='toggle-visual'){
        const card = btn.closest('[data-block="visual"]'); if(!card) return;
        const seedInput = card.querySelector('[data-role="seed-visual"]');
        const sol = card.querySelector('[data-role="visual-sol"]');
        if (action==='toggle-visual'){ sol.style.display = sol.style.display==='none' ? 'block' : 'none'; return; }
        if (action==='copy-visual'){
          const sEl = card.querySelector('[data-role="seed-v"]');
          const txt = (sEl?.textContent||'').replace(/^seed:\s*/,'');
          navigator.clipboard?.writeText(txt).catch(()=>{});
          btn.textContent='Seed copiada'; setTimeout(()=>btn.textContent='Copiar seed',1000);
          return;
        }
        const seedStr = (action==='apply-visual') ? (seedInput?.value?.trim()||'') : '';
        const inst = instanceVisual(seedStr);
        renderVisual(card, inst);
        return;
      }

      // Textual: aplicar/copy base seed
      if (action==='apply-text' || action==='copy-text'){
        const card = btn.closest('[data-block="textual"]'); if(!card) return;
        if (action==='copy-text'){
          const txt = card.dataset.baseSeed || '';
          if (txt){ navigator.clipboard?.writeText(txt).catch(()=>{}); btn.textContent='Seed copiada'; setTimeout(()=>btn.textContent='Copiar seed',1000);}
          return;
        }
        const base = card.querySelector('[data-role="seed-text"]')?.value?.trim() || '';
        card.dataset.baseSeed = base || '';
        renderLetters(card, genLetters(base||null));
        renderCommittee(card, genCommittee(base||null));
        renderBinom(card, genBinomial(base||null));
        return;
      }

      // Textual: nuevos aleatorios por tarjeta
      if (action==='new-letters' || action==='new-committee' || action==='new-binom'){
        const card = btn.closest('[data-block="textual"]'); if(!card) return;
        if (action==='new-letters'){ renderLetters(card, genLetters(null)); return; }
        if (action==='new-committee'){ renderCommittee(card, genCommittee(null)); return; }
        if (action==='new-binom'){ renderBinom(card, genBinomial(null)); return; }
      }

      // Textual: toggles por tarjeta
      if (action==='toggle-letters' || action==='toggle-committee' || action==='toggle-binom'){
        const card = btn.closest('[data-block="textual"]'); if(!card) return;
        if (action==='toggle-letters'){
          const el = card.querySelector('[data-role="letters-sol"]');
          el.style.display = el.style.display==='none' ? 'block' : 'none';
          return;
        }
        if (action==='toggle-committee'){
          const el = card.querySelector('[data-role="committee-sol"]');
          el.style.display = el.style.display==='none' ? 'block' : 'none';
          return;
        }
        if (action==='toggle-binom'){
          const el = card.querySelector('[data-role="binom-sol"]');
          el.style.display = el.style.display==='none' ? 'block' : 'none';
          return;
        }
      }
    });
    window.__CMB_V3_EVENTS__ = true;
  }

  // ========== render() ==========
  function render(){
    return `
      <style>${CSS}</style>
      <div class="cmb-root">
        ${visualBlock()}
        ${textualBlock()}
      </div>
    `;
  }

  const api = { render };
  if (typeof window!=='undefined') window.SIM_combinaciones = api;
  return api;
})();

export default (typeof window !== 'undefined' && window.SIM_combinaciones) ? window.SIM_combinaciones : { render: () => '' };