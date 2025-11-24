// Simulador Tallo & Hoja + Histograma (Versión SIMPLE)
// Reemplaza el archivo anterior. Mantén la etiqueta: [simulador:estadistica-stem]
// Controles mínimos:
//  - Distribución (Normal / Uniforme / Bimodal)
//  - n (tamaño de muestra)
//  - Botón Generar
//  - Botón Ejemplo Caridades (n=60) para cargar el conjunto real de porcentajes
//  - Botón Mostrar resumen (estadísticos básicos)
//  - Botón Copiar datos
// Objetivo: mostrar rápidamente forma, tallo-hoja y histograma sin parámetros extra.

(function(){
  /* === Utilidades básicas === */
  function rand(){return Math.random();}
  function randNormal(mu=15,sigma=5){
    let u=0,v=0; while(u===0)u=rand(); while(v===0)v=rand();
    const z=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
    let val=mu+sigma*z;
    // Limitar a mu ± 3σ para evitar colas extremas
    const lo=mu-3*sigma, hi=mu+3*sigma;
    if(val<lo) val=lo + rand()*(sigma*0.2);
    if(val>hi) val=hi - rand()*(sigma*0.2);
    return Math.round(val*10)/10;
  }
  function randUniform(a=0,b=100){
    return Math.round((a+(b-a)*rand())*10)/10;
  }
  function randBimodal(){
    // Mezcla: mayoría cerca de 8 y algunos cerca de 80
    return Math.round((rand()<0.7? (8 + randNormal(0,3)) : (80 + randNormal(0,4)))*10)/10;
  }
  function mean(a){return a.reduce((s,x)=>s+x,0)/a.length;}
  function median(a){
    const s=a.slice().sort((x,y)=>x-y); const n=s.length;
    return n%2? s[(n-1)/2] : (s[n/2-1]+s[n/2])/2;
  }
  function quantile(a,q){
    const s=a.slice().sort((x,y)=>x-y);
    const pos=(s.length-1)*q;
    const lo=Math.floor(pos), hi=Math.ceil(pos);
    return lo===hi? s[lo] : s[lo] + (pos-lo)*(s[hi]-s[lo]);
  }
  function variance(a){
    const m=mean(a);
    return a.reduce((acc,x)=>acc+(x-m)*(x-m),0)/(a.length-1);
  }
  function mad(a){
    const med=median(a);
    const devs=a.map(x=>Math.abs(x-med));
    return median(devs);
  }

  /* === Ejemplo Caridades (limpieza) === */
  const charityRaw = [
    "6.1","2.2","7.5","6.4","8.8","15.3","12.6","3.1","3.9","10.8",
    "5.1","16.6","34.7","1.3","10.1","83.1","3.7","8.8","difícil","1.6","1.1","8.1",
    "3.6","26.3","12.0","tener","18.8","14.1","19.5","6.2","6.0","4.7","2.2","4.0",
    "5.2","6.3","48.0","14.7","3.0","21.0","12.0","16.3","8.2","6.4","2.2","6.1",
    "15.8","12.7","11.7","17.0","una","idea","5.6","1.3","10.4","1.3","7.2","2.5",
    "3.8","20.4","5.2","0.8","3.9","16.2","mas","importantes","Sin","organización","es"
  ];
  function cleanCharity(){
    const nums=[], invalid=[];
    charityRaw.forEach(t=>{
      const v=parseFloat(t.replace(',','.'));
      if(!isNaN(v)) nums.push(Math.round(v*10)/10);
      else invalid.push(t);
    });
    return {nums: nums.sort((a,b)=>a-b), invalid};
  }

  /* === Generar muestra === */
  function gen(dist,n){
    const out=[];
    for(let i=0;i<n;i++){
      if(dist==='normal') out.push(randNormal());
      else if(dist==='uniforme') out.push(randUniform());
      else if(dist==='bimodal') out.push(randBimodal());
      else out.push(randNormal());
    }
    return out.sort((a,b)=>a-b);
  }

  /* === Tallo y hoja (decenas dinámicas) === */
  function stemLeaf(data){
    const ints=data.map(x=>Math.round(x));
    const map={};
    ints.forEach(v=>{
      const stem=Math.floor(v/10);
      const leaf=Math.abs(v)%10;
      (map[stem]=map[stem]||[]).push(leaf);
    });
    Object.keys(map).forEach(k=>map[k].sort((a,b)=>a-b));
    const stems=Object.keys(map).map(Number).sort((a,b)=>a-b);
    const MAX=30;
    const lines=[];
    stems.forEach(st=>{
      const leaves=map[st].map(x=>x).join('');
      if(leaves.length<=MAX){
        lines.push(padStem(st)+" "+leaves);
      } else {
        for(let i=0;i<leaves.length;i+=MAX)
          lines.push(padStem(st)+" "+leaves.slice(i,i+MAX));
      }
    });
    return `Stem-and-leaf  N=${data.length}\nLeaf Unit = 1.0\n\n`+lines.join('\n');
  }
  function padStem(st){return (""+st).padStart(2,' ');}

  /* === Histograma sencillo SVG (10 bins fijos) === */
  function histogramSVG(data){
    const width=420, height=200;
    const pad={l:40,r:10,t:15,b:30};
    const min=Math.min(...data), max=Math.max(...data);
    const bins=10;
    const range=max-min || 1;
    const bw=range/bins;
    const counts=Array(bins).fill(0);
    data.forEach(x=>{
      let idx=Math.floor((x-min)/bw);
      if(idx===bins) idx=bins-1;
      counts[idx]++;
    });
    const maxC=Math.max(...counts)||1;
    const plotW=width-pad.l-pad.r, plotH=height-pad.t-pad.b;
    const barW=plotW/bins;

    let bars="";
    counts.forEach((c,i)=>{
      const h=(c/maxC)*plotH;
      const x=pad.l + i*barW + 2;
      const y=pad.t + (plotH - h);
      bars+=`<rect x="${x}" y="${y}" width="${barW-4}" height="${h}" fill="#d1d5db" stroke="#374151"/>`;
      if(h>12) bars+=`<text x="${x+(barW-4)/2}" y="${y+14}" font-size="10" text-anchor="middle">${c}</text>`;
    });

    // Ejes
    let yTicks="";
    for(let t=0;t<=4;t++){
      const val=Math.round(maxC*(t/4));
      const y=pad.t + (plotH - (val/maxC)*plotH);
      yTicks+=`<line x1="${pad.l-5}" y1="${y}" x2="${pad.l}" y2="${y}" stroke="#111"/>`;
      yTicks+=`<text x="${pad.l-8}" y="${y+4}" font-size="10" text-anchor="end">${val}</text>`;
    }
    let xTicks="";
    for(let i=0;i<=bins;i++){
      const xv=(min + i*bw).toFixed(1);
      const x=pad.l + i*barW;
      xTicks+=`<text x="${x}" y="${height-pad.b+14}" font-size="10" text-anchor="middle">${xv}</text>`;
    }

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#fff"/>
      ${bars}
      <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t+plotH}" stroke="#111" stroke-width="1"/>
      <line x1="${pad.l}" y1="${pad.t+plotH}" x2="${pad.l+plotW}" y2="${pad.t+plotH}" stroke="#111" stroke-width="1"/>
      ${yTicks}
      ${xTicks}
      <text x="${pad.l/2}" y="${pad.t+plotH/2}" font-size="11" transform="rotate(-90 ${pad.l/2},${pad.t+plotH/2})" text-anchor="middle">Frecuencia</text>
      <text x="${pad.l+plotW/2}" y="${height-6}" font-size="11" text-anchor="middle">Valores</text>
    </svg>`;
  }

  /* === Forma básica (sesgo) === */
  function classify(data){
    const m=mean(data), med=median(data);
    const skew=m-med;
    let shape;
    if(Math.abs(skew)<0.2) shape="≈ Simétrica";
    else if(skew>0) shape="Sesgo derecha";
    else shape="Sesgo izquierda";
    return {shape, skew:skew.toFixed(2)};
  }

  /* === CSS mínimo === */
  const CSS=`<style>
  .stem-simple{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  .card{border:1px solid #e2e8f0;background:#fff;border-radius:12px;padding:14px;margin:16px 0}
  .head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
  .title{font-weight:700;font-size:15px}
  .btn,.sel,.inp{background:#f1f5f9;border:1px solid #cbd5e1;padding:6px 10px;font-size:14px;border-radius:8px}
  .btn{cursor:pointer}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:12px}
  pre.block{background:#f8fafc;border:1px solid #e2e8f0;padding:8px;border-radius:8px;font-size:12px;max-height:240px;overflow:auto;white-space:pre;font-family:monospace;line-height:1.25}
  .summary{display:none;border-top:1px dashed #cbd5e1;margin-top:14px;padding-top:10px}
  table.stats{border-collapse:collapse;font-size:12px;margin-top:8px}
  table.stats td{border:1px solid #e2e8f0;padding:3px 6px}
  .small{font-size:11px;color:#64748b;margin-top:4px}
  </style>`;

  /* === Interfaz === */
  function layout(){
    return `${CSS}
    <div class="stem-simple" data-root="stem-simple">
      <div class="card" data-card="stem">
        <div class="head">
          <div class="title">Tallo & Hoja + Histograma (Simple)</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <label>Distribución:
              <select class="sel" data-role="dist">
                <option value="normal">Normal</option>
                <option value="uniforme">Uniforme</option>
                <option value="bimodal">Bimodal</option>
              </select>
            </label>
            <label>n:
              <input type="number" class="inp" data-role="n" value="60" min="10" max="500"/>
            </label>
            <button class="btn" data-action="generar">Generar</button>
            <button class="btn" data-action="caridades">Ejemplo Caridades (n=60)</button>
            <button class="btn" data-action="toggle">Mostrar resumen</button>
            <button class="btn" data-action="copiar">Copiar datos</button>
          </div>
        </div>
        <div class="small">Pulsa “Generar” o carga el ejemplo real de caridades.</div>
        <div class="grid">
          <div><h4 style="margin:4px 0">Stem-and-leaf</h4><pre class="block" data-role="stem"><em>Pendiente...</em></pre></div>
          <div><h4 style="margin:4px 0">Histograma</h4><div data-role="hist"><em>Pendiente...</em></div></div>
          <div><h4 style="margin:4px 0">Datos ordenados</h4><pre class="block" data-role="datos"><em>Pendiente...</em></pre></div>
          <div><h4 style="margin:4px 0">Forma</h4><pre class="block" data-role="forma"><em>Pendiente...</em></pre></div>
        </div>
        <div class="summary" data-role="summary-box">
          <h4 style="margin:4px 0">Estadísticos</h4>
          <div data-role="stats"></div>
          <p class="small">Media vs mediana: si difieren mucho → sesgo; usa mediana + IQR/MAD.</p>
        </div>
      </div>
    </div>`;
  }

  /* === Render de muestra === */
  function renderSample(card,data,label){
    const stemText=stemLeaf(data);
    const histSVG=histogramSVG(data);
    const m=mean(data), med=median(data), q1=quantile(data,0.25), q3=quantile(data,0.75),
          iqr=q3-q1, s=Math.sqrt(variance(data)), madVal=mad(data),
          rango=(data[data.length-1]-data[0]), forma=classify(data);

    card.dataset.data=JSON.stringify(data);
    card.querySelector('[data-role="stem"]').textContent=stemText;
    card.querySelector('[data-role="hist"]').innerHTML=histSVG;
    card.querySelector('[data-role="datos"]').textContent=data.join(', ');
    card.querySelector('[data-role="forma"]').textContent=
      `Fuente: ${label}\nForma: ${forma.shape}\nSesgo (media - mediana): ${forma.skew}\n% < 20: ${(100*data.filter(x=>x<20).length/data.length).toFixed(1)}%`;
    card.querySelector('[data-role="stats"]').innerHTML=
      `<table class="stats">
        <tr><td>n</td><td>${data.length}</td></tr>
        <tr><td>Media</td><td>${m.toFixed(2)}</td></tr>
        <tr><td>Mediana</td><td>${med.toFixed(2)}</td></tr>
        <tr><td>Q1</td><td>${q1.toFixed(2)}</td></tr>
        <tr><td>Q3</td><td>${q3.toFixed(2)}</td></tr>
        <tr><td>IQR</td><td>${iqr.toFixed(2)}</td></tr>
        <tr><td>Desv.Est.</td><td>${s.toFixed(2)}</td></tr>
        <tr><td>MAD</td><td>${madVal.toFixed(2)}</td></tr>
        <tr><td>Rango</td><td>${rango.toFixed(2)}</td></tr>
      </table>`;
  }

  /* === Eventos === */
  if(!window.__STEM_SIMPLE_EVENTS__){
    document.addEventListener('click',e=>{
      const btn=e.target.closest('.btn'); if(!btn) return;
      const action=btn.getAttribute('data-action');
      const card=btn.closest('[data-card="stem"]');
      if(!card) return;

      if(action==='generar'){
        const dist=card.querySelector('[data-role="dist"]').value;
        let n=parseInt(card.querySelector('[data-role="n"]').value,10);
        n=Math.max(10,Math.min(500,n));
        const data=gen(dist,n);
        renderSample(card,data,`Distribución ${dist}`);
      }
      if(action==='caridades'){
        const {nums, invalid}=cleanCharity();
        renderSample(card,nums,"Caridades");
        if(invalid.length){
          const formaBlock=card.querySelector('[data-role="forma"]');
          formaBlock.textContent += `\nTokens ignorados: ${invalid.join(', ')}`;
        }
      }
      if(action==='toggle'){
        const box=card.querySelector('[data-role="summary-box"]');
        box.style.display=box.style.display==='none'?'block':'none';
      }
      if(action==='copiar'){
        const d=card.dataset.data;
        if(d){
          navigator.clipboard.writeText(JSON.parse(d).join(', ')).catch(()=>{});
          btn.textContent='Copiado';
          setTimeout(()=>btn.textContent='Copiar datos',900);
        }
      }
    });
    window.__STEM_SIMPLE_EVENTS__=true;
  }

  function render(){return layout();}
  const api={render};
  if(typeof window!=='undefined') window.SIM_estadistica_stem=api;
  return api;
})();

export default (typeof window!=='undefined' && window.SIM_estadistica_stem)
  ? window.SIM_estadistica_stem
  : { render:()=>'' };