// Simulador visual — Caminos dirigidos A–B–C (Cap. 3) [MEJORADO]
// - export default { render } y render DEVUELVE UN STRING HTML (requisito del host).
// - Sin LaTeX (Unicode →, ×, t₁…t₅), interactividad por delegación global.
// - Mejoras: controles de seed (aplicar/copiar), overlays de resultados en SVG, resaltado por hover.

//////////////////// Utils ////////////////////
function mulberry32(a){return function(){let t=(a+=0x6d2b79f5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function seedFromString(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=(h<<13)|(h>>>19);}return h>>>0;}
function makeRng(seed){let s;if(typeof seed==="string"&&seed.trim().length){s=seedFromString(seed);}else if(typeof seed==="number"){s=seed>>>0;}else{s=Math.floor(Date.now()%2**32);}return mulberry32(s);}
function randInt(rng,min,max){return Math.floor(rng()*(max-min+1))+min;}

//////////////////// Estilos ////////////////////
const CSS = `
.pfv-card{border:1px solid #e3e3e3;border-radius:10px;padding:14px;margin:16px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.pfv-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap}
.pfv-title{font-weight:600}
.pfv-ctrls{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.pfv-btn{cursor:pointer;border:1px solid #ccc;background:#f9f9f9;padding:6px 10px;border-radius:8px}
.pfv-btn:hover{background:#f1f1f1}
.pfv-input{border:1px solid #ccc;border-radius:8px;padding:6px 8px;width:180px}
.pfv-prob,.pfv-sol{line-height:1.6}
.pfv-sol{display:none;margin-top:8px;padding-top:8px;border-top:1px dashed #ddd}
.pfv-seed{font-size:12px;color:#666;margin:6px 0}
ul.pfv-ul{margin:8px 0 0 0;padding-left:20px}
svg{max-width:100%;height:auto}
svg text{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:12px}
.edge{stroke:#333}
.edge.hl{stroke:#1e88e5 !important}
.edgelabel{fill:#333}
.edgelabel.hl{fill:#1e88e5 !important;font-weight:600}
.overlay{fill:#1e88e5;font-weight:700}
.small{font-size:12px;color:#444}
`;

//////////////////// Generación de instancia ////////////////////
function newInstance(seedStr){
  const rng = makeRng(seedStr);
  // t1: A→B (arriba), t2: doble sentido, t3: B→A (abajo), t4: B→C (arriba), t5: C→B (abajo)
  const t1=randInt(rng,1,3), t2ab=randInt(rng,1,2), t2ba=randInt(rng,1,2), t3=randInt(rng,1,3), t4=randInt(rng,1,2), t5=randInt(rng,1,2);

  const AB=t1+t2ab, BA=t3+t2ba, BC=t4, CB=t5;
  const N_ABA=AB*BA;
  const N_ABCBA=AB*BC*CB*BA;

  const seed = `t1=${t1}, t2ab=${t2ab}, t2ba=${t2ba}, t3=${t3}, t4=${t4}, t5=${t5}`;
  return { t1,t2ab,t2ba,t3,t4,t5, AB,BA,BC,CB, N_ABA,N_ABCBA, seed };
}

//////////////////// HTML (STRING) ////////////////////
function render(){
  const uid = Math.random().toString(36).slice(2,10);
  return `
  <style>${CSS}</style>
  <section class="pfv-card" data-pfv-root="1" data-uid="${uid}">
    <div class="pfv-head">
      <div class="pfv-title">Figura dirigida — A, B, C (interactivo)</div>
      <div class="pfv-ctrls">
        <input class="pfv-input" type="text" placeholder="Seed opcional…" data-role="seed-input" aria-label="Seed">
        <button class="pfv-btn" data-action="apply-seed" data-uid="${uid}">Aplicar seed</button>
        <button class="pfv-btn" data-action="copy-seed" data-uid="${uid}">Copiar seed</button>
        <button class="pfv-btn" data-action="new" data-uid="${uid}">Nuevo ejercicio</button>
        <button class="pfv-btn" data-action="toggle" data-uid="${uid}">Mostrar solución</button>
      </div>
    </div>

    <div class="pfv-seed" data-role="seed">seed: —</div>

    <div class="pfv-prob">
      <p>Tramos: t₂ es de doble sentido; los demás son de un solo sentido.</p>

      <!-- Dibujo SVG -->
      <svg width="620" height="230" viewBox="0 0 620 230" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto">
        <defs>
          <marker id="pfv-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#333" />
          </marker>
          <marker id="pfv-arrow-rev" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#333" />
          </marker>
        </defs>

        <!-- Nodos -->
        <circle cx="80" cy="115" r="16" fill="#fff" stroke="#333" />
        <text x="80" y="120" text-anchor="middle">A</text>
        <circle cx="300" cy="115" r="16" fill="#fff" stroke="#333" />
        <text x="300" y="120" text-anchor="middle">B</text>
        <circle cx="520" cy="115" r="16" fill="#fff" stroke="#333" />
        <text x="520" y="120" text-anchor="middle">C</text>

        <!-- A→B arriba (t1) -->
        <path class="edge" data-edge="ab" d="M 90 100 Q 190 45, 290 100" fill="none" stroke="#333" stroke-width="2" marker-end="url(#pfv-arrow)"/>
        <text class="edgelabel" data-edge="ab" x="190" y="52" text-anchor="middle">t₁ × <tspan data-val="t1">—</tspan></text>

        <!-- B→A abajo (t3) -->
        <path class="edge" data-edge="ba" d="M 290 130 Q 190 185, 90 130" fill="none" stroke="#333" stroke-width="2" marker-end="url(#pfv-arrow-rev)"/>
        <text class="edgelabel" data-edge="ba" x="190" y="197" text-anchor="middle">t₃ × <tspan data-val="t3">—</tspan></text>

        <!-- t2 doble sentido (centro) -->
        <line class="edge" data-edge="ab" x1="96" y1="115" x2="284" y2="115" stroke="#333" stroke-width="2" marker-end="url(#pfv-arrow)"/>
        <line class="edge" data-edge="ba" x1="284" y1="109" x2="96" y2="109" stroke="#333" stroke-width="2" marker-end="url(#pfv-arrow-rev)"/>
        <text class="edgelabel" data-edge="ab" x="190" y="104" text-anchor="middle">t₂ A→B × <tspan data-val="t2ab">—</tspan></text>
        <text class="edgelabel" data-edge="ba" x="190" y="136" text-anchor="middle">t₂ B→A × <tspan data-val="t2ba">—</tspan></text>

        <!-- B→C arriba (t4) -->
        <path class="edge" data-edge="bc" d="M 310 100 Q 410 45, 510 100" fill="none" stroke="#333" stroke-width="2" marker-end="url(#pfv-arrow)"/>
        <text class="edgelabel" data-edge="bc" x="410" y="52" text-anchor="middle">t₄ × <tspan data-val="t4">—</tspan></text>

        <!-- C→B abajo (t5) -->
        <path class="edge" data-edge="cb" d="M 510 130 Q 410 185, 310 130" fill="none" stroke="#333" stroke-width="2" marker-end="url(#pfv-arrow-rev)"/>
        <text class="edgelabel" data-edge="cb" x="410" y="197" text-anchor="middle">t₅ × <tspan data-val="t5">—</tspan></text>

        <!-- Overlays de resultados -->
        <text class="overlay" x="140" y="20">N(A→B→A): <tspan data-val="N_ABA">—</tspan></text>
        <text class="overlay" x="360" y="20">N(A→B→C→B→A): <tspan data-val="N_ABCBA">—</tspan></text>
      </svg>

      <ul class="pfv-ul">
        <li>A→B disponibles: <b><span data-val="AB">—</span></b> = t₁ + t₂(A→B)</li>
        <li>B→A disponibles: <b><span data-val="BA">—</span></b> = t₃ + t₂(B→A)</li>
        <li>B→C: <b><span data-val="BC">—</span></b> (t₄)</li>
        <li>C→B: <b><span data-val="CB">—</span></b> (t₅)</li>
      </ul>

      <ol>
        <li>a) Viajes redondos A→B→A (producto A→B por B→A).</li>
        <li>b) Viajes redondos A→B→C→B→A (producto A→B, B→C, C→B, B→A).</li>
      </ol>
    </div>

    <div class="pfv-sol" data-role="solution">
      <p><b>Solución</b></p>
      <p>a) N(A→B→A) = (A→B) × (B→A) = <b><span data-val="N_ABA">—</span></b></p>
      <p>b) N(A→B→C→B→A) = (A→B) × (B→C) × (C→B) × (B→A) = <b><span data-val="N_ABCBA">—</span></b></p>
      <p class="small">Nota: no hay tramo directo A↔C; pasar por C implica A→B→C→B→A.</p>
    </div>
  </section>
  `;
}

//////////////////// Lógica interactiva (delegación global) ////////////////////
function updateNumbers(card, S){
  const set=(sel,v)=>{const el=card.querySelector(sel); if(el) el.textContent=String(v);};
  set('[data-role="seed"]', `seed: ${S.seed}`);
  set('[data-val="t1"]', S.t1); set('[data-val="t2ab"]', S.t2ab); set('[data-val="t2ba"]', S.t2ba);
  set('[data-val="t3"]', S.t3); set('[data-val="t4"]', S.t4); set('[data-val="t5"]', S.t5);
  set('[data-val="AB"]', S.AB); set('[data-val="BA"]', S.BA); set('[data-val="BC"]', S.BC); set('[data-val="CB"]', S.CB);
  set('[data-val="N_ABA"]', S.N_ABA); set('[data-val="N_ABCBA"]', S.N_ABCBA);
}

function highlightEdge(card, edge, on){
  card.querySelectorAll(`[data-edge="${edge}"]`).forEach(el=>{
    if(el.tagName.toLowerCase()==='text') el.classList.toggle('hl', on);
    else el.classList.toggle('hl', on);
  });
}

if(!window.__PFV_LISTENERS__){
  document.addEventListener('click',(ev)=>{
    const btn = ev.target.closest?.('.pfv-btn[data-action]'); if(!btn) return;
    const card = btn.closest('.pfv-card'); if(!card) return;
    const action = btn.getAttribute('data-action');
    const sol = card.querySelector('[data-role="solution"]');
    const seedInput = card.querySelector('[data-role="seed-input"]');

    if(action==='new'){
      const S=newInstance(); updateNumbers(card,S);
      if(sol) sol.style.display='none';
      const tgl=card.querySelector('.pfv-btn[data-action="toggle"]'); if(tgl) tgl.textContent='Mostrar solución';
    } else if(action==='toggle'){
      const hidden = sol.style.display==='none'; sol.style.display=hidden?'block':'none';
      btn.textContent = hidden?'Ocultar solución':'Mostrar solución';
    } else if(action==='apply-seed'){
      const seedStr = seedInput?.value?.trim() || '';
      const S=newInstance(seedStr); updateNumbers(card,S);
      if(sol) sol.style.display='none';
      const tgl=card.querySelector('.pfv-btn[data-action="toggle"]'); if(tgl) tgl.textContent='Mostrar solución';
    } else if(action==='copy-seed'){
      const seedEl=card.querySelector('[data-role="seed"]');
      const text=seedEl?.textContent?.replace(/^seed:\s*/,'')||'';
      if(navigator.clipboard?.writeText){ navigator.clipboard.writeText(text).catch(()=>{}); }
      btn.textContent='Seed copiada'; setTimeout(()=>{btn.textContent='Copiar seed';},1200);
    }
  });

  // Hover/Focus de arcos (resaltado)
  document.addEventListener('mouseover',(ev)=>{
    const el=ev.target.closest?.('[data-edge]'); if(!el) return;
    const card=el.closest('.pfv-card'); if(!card) return;
    const edge=el.getAttribute('data-edge'); if(!edge) return;
    highlightEdge(card, edge, true);
  });
  document.addEventListener('mouseout',(ev)=>{
    const el=ev.target.closest?.('[data-edge]'); if(!el) return;
    const card=el.closest('.pfv-card'); if(!card) return;
    const edge=el.getAttribute('data-edge'); if(!edge) return;
    highlightEdge(card, edge, false);
  });

  window.__PFV_LISTENERS__=true;
}

//////////////////// Export ////////////////////
const api = { render };
export default api;