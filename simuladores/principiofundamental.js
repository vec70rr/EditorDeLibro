// Simuladores (sin LaTeX) — Capítulo 3: Principio fundamental del conteo
// Contrato del host: export default { render } y render DEVUELVE STRING HTML.
// Interacción: delegación global, sin dependencias (no usa LaTeX).

// ---------- Utils ----------
function mulberry32(a){return function(){let t=(a+=0x6d2b79f5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function makeRng(seed){const s=Math.floor((typeof seed==="number"?seed:Date.now())%2**32);return mulberry32(s>>>0);}
function randInt(rng,min,max){return Math.floor(rng()*(max-min+1))+min;}
function shuffle(rng,arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function uid(){return Math.random().toString(36).slice(2,10);}

// ---------- Estilos ----------
const CSS = `
.pf-card{border:1px solid #e3e3e3;border-radius:10px;padding:14px;margin:16px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.pf-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
.pf-title{font-weight:600}
.pf-ctrls{display:flex;gap:6px;flex-wrap:wrap}
.pf-btn{cursor:pointer;border:1px solid #ccc;background:#f9f9f9;padding:6px 10px;border-radius:8px}
.pf-btn:hover{background:#f1f1f1}
.pf-prob,.pf-sol{line-height:1.6}
.pf-sol{margin-top:8px;padding-top:8px;border-top:1px dashed #ddd;display:none}
.pf-seed{font-size:12px;color:#666;margin-bottom:6px}
`;

// ---------- Generadores ----------
function genABC(){
  const rng=makeRng(Date.now());
  const a=randInt(rng,2,6), b=randInt(rng,2,6);
  const a_sol=a*b, b_sol=a*b*b, c_sol=a*b*Math.max(0,b-1)*a;
  const prob = `
    <p>Entre los puntos <b>A</b> y <b>B</b> existen <b>${a}</b> caminos distintos, y entre <b>B</b> y <b>C</b> existen <b>${b}</b> caminos distintos.</p>
    <ol>
      <li>a) ¿De cuántas maneras se puede ir de A a C pasando por B?</li>
      <li>b) ¿De cuántas maneras se puede ir de A a C, pasando por B, y regresar a B?</li>
      <li>c) ¿De cuántas maneras se puede hacer un viaje redondo de A a C y volver a A, si no se permite usar el mismo tramo más de una vez?</li>
    </ol>`;
  const sol = `
    <p><b>Regla del producto</b></p>
    <p>a) A→B: ${a}, B→C: ${b} ⇒ ${a} × ${b} = <b>${a_sol}</b></p>
    <p>b) A→B: ${a}, B→C: ${b}, C→B: ${b} ⇒ ${a} × ${b} × ${b} = <b>${b_sol}</b></p>
    <p>c) A→B: ${a}, B→C: ${b}, C→B: ${Math.max(0,b-1)}, B→A: ${a} ⇒ ${a} × ${b} × (${b}−1) × ${a} = <b>${c_sol}</b></p>`;
  return { seed: `${a}-${b}`, prob, sol };
}

function genDir(){
  const rng=makeRng(Date.now()+17);
  // Figura dirigida: A↔B por tres tramos (t1: A→B arriba, t2 doble, t3: B→A abajo); B↔C por dos (t4: B→C, t5: C→B)
  const t1=randInt(rng,1,3), t2ab=randInt(rng,1,2), t2ba=randInt(rng,1,2), t3=randInt(rng,1,3), t4=randInt(rng,1,2), t5=randInt(rng,1,2);
  const AB = t1 + t2ab;   // A→B
  const BA = t3 + t2ba;   // B→A
  const BC = t4;          // B→C
  const CB = t5;          // C→B
  const N_ABA   = AB * BA;
  const N_ABCBA = AB * BC * CB * BA;

  const prob = `
    <p>Red de caminos dirigidos:</p>
    <ul>
      <li>A→B: t1=${t1}, t2(A→B)=${t2ab} ⇒ <b>${AB}</b></li>
      <li>B→A: t3=${t3}, t2(B→A)=${t2ba} ⇒ <b>${BA}</b></li>
      <li>B→C: t4=${t4} ⇒ <b>${BC}</b></li>
      <li>C→B: t5=${t5} ⇒ <b>${CB}</b></li>
    </ul>
    <ol>
      <li>a) ¿Cuántos viajes redondos A→B→A hay?</li>
      <li>b) ¿Cuántos viajes redondos A→B→C→B→A hay?</li>
    </ol>`;
  const sol = `
    <p>a) A→B: ${AB}, B→A: ${BA} ⇒ ${AB} × ${BA} = <b>${N_ABA}</b></p>
    <p>b) A→B: ${AB}, B→C: ${BC}, C→B: ${CB}, B→A: ${BA} ⇒ ${AB} × ${BC} × ${CB} × ${BA} = <b>${N_ABCBA}</b></p>`;
  return { seed: `t1=${t1},t2ab=${t2ab},t2ba=${t2ba},t3=${t3},t4=${t4},t5=${t5}`, prob, sol };
}

function permutations(n,r){let res=1;for(let i=0;i<r;i++){res*=n-i;}return res;}
function countKNoRepeat(d,k,noLeadingZero=true){
  const m=d.length, has0=d.includes(0);
  if (k>m) return 0;
  if (!noLeadingZero||!has0) return permutations(m,k);
  return (m-1)*permutations(m-1,k-1);
}
function count3GreaterNoRepeat(d,T,noLeadingZero=true){
  const Ds=[...d].sort((a,b)=>a-b);
  const [t1,t2,t3]=[Math.floor(T/100),Math.floor((T%100)/10),T%10];
  const D1=noLeadingZero?Ds.filter(x=>x!==0):Ds; let c=0;
  for(const h of D1.filter(x=>x>t1)){const r=Ds.filter(x=>x!==h); c+=r.length*(r.length-1);}
  if (D1.includes(t1)){
    const r2=Ds.filter(x=>x!==t1);
    for(const d2 of r2.filter(x=>x>t2)){const r3=r2.filter(x=>x!==d2); c+=r3.length;}
    if (r2.includes(t2)){const r3=r2.filter(x=>x!==t2); c+=r3.filter(u=>u>t3).length;}
  }
  return c;
}
function genNum(){
  const rng=makeRng(Date.now()+33);
  const base=shuffle(rng,[0,1,2,3,4,5,6,7,8,9]); const size=randInt(rng,4,6);
  let D=base.slice(0,size); if(!D.some(x=>x>=3)) D[0]=7;
  const T=200+randInt(rng,0,589); const allowRepeat=rng()<0.5;
  const m=D.length, has0=D.includes(0), mEff=has0?m-1:m;
  const A = allowRepeat ? mEff*m*m : countKNoRepeat(D,3,true);
  const B = count3GreaterNoRepeat(D,T,true);
  const C = countKNoRepeat(D,4,true);
  const total = B + C;
  const setStr=[...D].sort((a,b)=>a-b).join(", ");

  const prob = `
    <p>Con el conjunto de dígitos D={${setStr}}:</p>
    <ol>
      <li>A) ¿Cuántos números de <b>tres cifras</b> se pueden formar ${allowRepeat?"permitiendo repetición":"sin repetición"}?</li>
      <li>B) ¿Cuántos números de <b>tres cifras</b> mayores que ${T} se pueden formar sin repetición?</li>
      <li>C) ¿Cuántos números de <b>cuatro cifras</b> se pueden formar sin repetición?</li>
      <li>D) Total buscado = B + C.</li>
    </ol>`;
  const sol = `
    <p><b>A)</b> ${allowRepeat?"Con":"Sin"} repetición: ${mEff} × ${m} × ${m} ${allowRepeat?"":"(progresivo sin repetición)"} = <b>${A}</b></p>
    <p><b>B)</b> Comparación por centenas/decenas/unidades ⇒ <b>${B}</b></p>
    <p><b>C)</b> Cuatro cifras sin repetición: ${(has0?m-1:m)} × ${m-1} × ${m-2} × ${m-3} = <b>${C}</b></p>
    <p><b>D)</b> ${B} + ${C} = <b>${total}</b></p>`;
  return { seed:`D={${setStr}}, T=${T}, rep=${allowRepeat}`, prob, sol };
}

// ---------- Delegación global (una sola vez) ----------
if (!window.__PF_PLAIN_EVT__) {
  document.addEventListener("click",(ev)=>{
    const btn=ev.target.closest?.(".pf-btn[data-action]"); if(!btn) return;
    const card=btn.closest(".pf-card"); if(!card) return;
    const action=btn.getAttribute("data-action");
    const type=card.getAttribute("data-type");
    const seedEl=card.querySelector(".pf-seed");
    const probEl=card.querySelector(".pf-prob");
    const solEl=card.querySelector(".pf-sol");

    if (action==="new"){
      const out = type==="abc" ? genABC() : type==="dir" ? genDir() : genNum();
      seedEl.textContent = `seed: ${out.seed}`;
      probEl.innerHTML = out.prob;
      solEl.innerHTML = out.sol;
      solEl.style.display = "none";
      const tg=card.querySelector('[data-action="toggle"]'); if (tg) tg.textContent="Mostrar solución";
    } else if (action==="toggle"){
      const hidden = solEl.style.display==="none";
      solEl.style.display = hidden ? "block" : "none";
      btn.textContent = hidden ? "Ocultar solución" : "Mostrar solución";
    }
  });
  window.__PF_PLAIN_EVT__=true;
}

// ---------- Render (STRING) ----------
function render(){
  const u1=uid(), u2=uid(), u3=uid();
  return `
    <style>${CSS}</style>
    <div class="pf-root">
      <h3>Capítulo 3 — Simuladores: Principio fundamental del conteo</h3>

      <section class="pf-card" data-type="abc">
        <div class="pf-head">
          <div class="pf-title">Ejemplo 2 — Caminos A–B–C</div>
          <div class="pf-ctrls">
            <button class="pf-btn" data-action="new">Nuevo ejercicio</button>
            <button class="pf-btn" data-action="toggle">Mostrar solución</button>
          </div>
        </div>
        <div class="pf-seed">seed: —</div>
        <div class="pf-prob"><em>Pulsa “Nuevo ejercicio”.</em></div>
        <div class="pf-sol"></div>
      </section>

      <section class="pf-card" data-type="dir">
        <div class="pf-head">
          <div class="pf-title">Ejemplo 3 — Grafo dirigido y viajes redondos</div>
          <div class="pf-ctrls">
            <button class="pf-btn" data-action="new">Nuevo ejercicio</button>
            <button class="pf-btn" data-action="toggle">Mostrar solución</button>
          </div>
        </div>
        <div class="pf-seed">seed: —</div>
        <div class="pf-prob"><em>Pulsa “Nuevo ejercicio”.</em></div>
        <div class="pf-sol"></div>
      </section>

      <section class="pf-card" data-type="num">
        <div class="pf-head">
          <div class="pf-title">Ejemplos 4 y 5 — Formación de números</div>
          <div class="pf-ctrls">
            <button class="pf-btn" data-action="new">Nuevo ejercicio</button>
            <button class="pf-btn" data-action="toggle">Mostrar solución</button>
          </div>
        </div>
        <div class="pf-seed">seed: —</div>
        <div class="pf-prob"><em>Pulsa “Nuevo ejercicio”.</em></div>
        <div class="pf-sol"></div>
      </section>
    </div>
  `;
}

const api = { render };
export default api;