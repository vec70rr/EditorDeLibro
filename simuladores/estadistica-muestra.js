// Simulador Parte B: Explorador de datos (muestra numérica o categórica)
// Exporta default { render } | render() => STRING HTML
(function(){
  function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
  function mean(a){return a.reduce((x,y)=>x+y,0)/a.length;}
  function median(a){
    const s=a.slice().sort((x,y)=>x-y);
    const n=s.length;
    return n%2 ? s[(n-1)/2] : (s[n/2-1]+s[n/2])/2;
  }
  function stats(a){
    const m=mean(a), med=median(a), min=Math.min(...a), max=Math.max(...a);
    const range=max-min;
    const varp=a.reduce((acc,v)=>acc+(v-m)*(v-m),0)/a.length;
    return {mean:m, median:med, min, max, range, stdev:Math.sqrt(varp)};
  }
  function genNumeric(n){
    const base=randInt(30,120);
    return Array.from({length:n},()=> +(base + (Math.random()-0.5)*randInt(0,40)).toFixed(1));
  }
  function genCategorical(n){
    const cats=["A","B","C","D","E"];
    const out=[];
    for(let i=0;i<n;i++) out.push(cats[randInt(0,cats.length-1)]);
    return out;
  }
  const CSS=`<style>
  .muestra-root{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  .card{border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin:14px 0;background:#fff}
  .head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
  .title{font-weight:700}
  .input{padding:6px 8px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px}
  .btn{background:#f1f5f9;border:1px solid #cbd5e1;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:14px}
  .sol{border-top:1px dashed #cbd5e1;margin-top:12px;padding-top:12px;display:none}
  table.desc{border-collapse:collapse;font-size:13px;margin-top:8px}
  table.desc td{border:1px solid #e2e8f0;padding:4px 8px}
  .small{font-size:12px;color:#64748b;margin-top:4px}
  </style>`;
  function render(){
    return `${CSS}
    <div class="muestra-root">
      <div class="card" data-sim="muestra">
        <div class="head">
          <div class="title">Explorador de datos</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <label>Tipo:
              <select class="input" data-role="tipo">
                <option value="numerica">Numérica</option>
                <option value="categorica">Categórica</option>
              </select>
            </label>
            <label>Tamaño n:
              <input type="number" class="input" data-role="n" value="12" min="5" max="60"/>
            </label>
            <button class="btn" data-action="generar">Generar</button>
            <button class="btn" data-action="toggle-sol">Mostrar análisis</button>
          </div>
        </div>
        <div data-role="datos"><em>Configura y pulsa “Generar”.</em></div>
        <div class="sol" data-role="solucion"></div>
      </div>
    </div>`;
  }
  if(!window.__MUESTRA_EVENTS__){
    document.addEventListener('click', e=>{
      const b=e.target.closest('.btn[data-action]');
      if(!b) return;
      const action=b.getAttribute('data-action');
      const card=b.closest('[data-sim="muestra"]');
      if(action==='generar'){
        const tipo=card.querySelector('[data-role="tipo"]').value;
        let n=parseInt(card.querySelector('[data-role="n"]').value,10);
        n=Math.max(5,Math.min(60,n));
        if(tipo==='numerica'){
          const datos=genNumeric(n);
          card.dataset.datos=JSON.stringify(datos);
          const s=stats(datos);
            card.querySelector('[data-role="datos"]').innerHTML=
            `<p><b>Datos (${n}):</b> ${datos.join(', ')}</p>
             <p class="small">Observa posibles valores atípicos antes de inferir.</p>`;
          card.querySelector('[data-role="solucion"]').innerHTML=
            `<table class="desc">
              <tr><td>Media</td><td>${s.mean.toFixed(2)}</td></tr>
              <tr><td>Mediana</td><td>${s.median.toFixed(2)}</td></tr>
              <tr><td>Mínimo</td><td>${s.min.toFixed(2)}</td></tr>
              <tr><td>Máximo</td><td>${s.max.toFixed(2)}</td></tr>
              <tr><td>Rango</td><td>${s.range.toFixed(2)}</td></tr>
              <tr><td>Desv. Est.</td><td>${s.stdev.toFixed(2)}</td></tr>
            </table>
            <p class="small">Inferencia típica siguiente: intervalo de confianza para la media o prueba de hipótesis.</p>`;
        } else {
          const datos=genCategorical(n);
          card.dataset.datos=JSON.stringify(datos);
          const freq={}; datos.forEach(d=>freq[d]=(freq[d]||0)+1);
          const rows=Object.entries(freq).map(([k,v])=>`${k}: ${v} (${(v/n*100).toFixed(1)}%)`).join(', ');
          card.querySelector('[data-role="datos"]').innerHTML=
            `<p><b>Datos (${n}):</b> ${datos.join(' ')}</p>
             <p class="small">Transforma a frecuencias para graficar (barras / pastel).</p>`;
          card.querySelector('[data-role="solucion"]').innerHTML=
            `<p><b>Frecuencias:</b> ${rows}</p>
             <p class="small">Inferencia siguiente: contraste de proporciones o bondad de ajuste.</p>`;
        }
      }
      if(action==='toggle-sol'){
        const sol=card.querySelector('[data-role="solucion"]');
        sol.style.display=sol.style.display==='none'?'block':'none';
      }
    });
    window.__MUESTRA_EVENTS__=true;
  }
  const api={render};
  if(typeof window!=='undefined') window.SIM_estadistica_muestra=api;
  return api;
})();
export default (typeof window!=='undefined' && window.SIM_estadistica_muestra) ? window.SIM_estadistica_muestra : { render:()=>'' };