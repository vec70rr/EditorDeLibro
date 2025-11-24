// Simulador de ejercicios (Versión NUMÉRICA SIMPLE)
// Reemplaza el anterior archivo estadistica-ejercicio-intro.js
// Etiqueta: [simulador:estadistica-ejercicio-intro]
// Cambios solicitados:
//  - Eliminados los ítems: % debajo de T, IQR (Q3 - Q1), MAD.
//  - No se explican Q3, IQR ni MAD.
//  - Ejercicios numéricos: media, mediana, mínimo, máximo, rango.
//  - Ejercicios categóricos: n total, número de categorías distintas, frecuencia máxima,
//    proporción de la categoría más frecuente (decimal), suma de frecuencias restantes.
//  - Tolerancia para decimales: ±0.01.
//
// Uso:
// 1. Pulsa "Nuevo ejercicio".
// 2. Observa datos y responde SOLO números en los campos visibles.
// 3. Pulsa "Verificar" para ver ✔ / ✖ y valor esperado.
//
// ------------------------------------------------------------

(function(){
  /* ===== Utilidades ===== */
  function rand(){return Math.random();}
  function randInt(a,b){return Math.floor(rand()*(b-a+1))+a;}
  function mean(a){return a.reduce((s,x)=>s+x,0)/a.length;}
  function median(a){
    const s=a.slice().sort((x,y)=>x-y);
    const n=s.length;
    return n%2? s[(n-1)/2] : (s[n/2-1]+s[n/2])/2;
  }

  /* ===== Escenarios ===== */
  const scenariosNumeric = [
    {
      id:'resistencia',
      title:'Resistencias (MPa)',
      gen:()=>{
        const n=randInt(15,25);
        const base=randInt(70,85);
        return Array.from({length:n},()=> +(base + (rand()-0.5)*randInt(0,20)).toFixed(2));
      }
    },
    {
      id:'espesor',
      title:'Espesores (mm)',
      gen:()=>{
        const n=randInt(18,30);
        const base=randInt(980,1020)/10;
        return Array.from({length:n},()=> +(base + (rand()-0.5)*randInt(0,40)/10).toFixed(2));
      }
    },
    {
      id:'clics',
      title:'Clics en sesión',
      gen:()=>{
        const n=randInt(20,30);
        const lam=randInt(4,9);
        const data=[];
        for(let i=0;i<n;i++){
          // normal-like discreto
          let s=0; for(let k=0;k<6;k++) s+=rand();
          const z=(s-3);
          let v=Math.max(0, Math.round(lam + z*1.1));
          data.push(v);
        }
        return data;
      }
    }
  ];

  const scenariosCategorical = [
    {
      id:'satisfaccion',
      title:'Satisfacción clientes',
      gen:()=>{
        const n=randInt(18,28);
        const probs=[0.25+rand()*0.1,0.4+rand()*0.15,0.2+rand()*0.15];
        const sum=probs.reduce((a,b)=>a+b,0);
        const p=probs.map(x=>x/sum);
        const data=[];
        for(let i=0;i<n;i++){
          const r=rand();
          if(r<p[0]) data.push('baja');
          else if(r<p[0]+p[1]) data.push('media');
          else data.push('alta');
        }
        return data;
      }
    },
    {
      id:'modo_falla',
      title:'Modo de falla',
      gen:()=>{
        const n=randInt(22,32);
        const probs=[0.35,0.25,0.2,0.2];
        const names=['corrosion','fatiga','impacto','otros'];
        const data=[];
        for(let i=0;i<n;i++){
          const r=rand();
          let cum=0;
          for(let j=0;j<probs.length;j++){
            cum+=probs[j];
            if(r<=cum){ data.push(names[j]); break; }
          }
        }
        return data;
      }
    }
  ];

  let currentType=null; // 'numeric' | 'categorical'
  let currentData=[];
  let currentTitle='';

  function pickScenario(){
    currentType = rand()<0.5 ? 'numeric' : 'categorical';
    if(currentType==='numeric'){
      const sc=scenariosNumeric[randInt(0,scenariosNumeric.length-1)];
      currentData = sc.gen().sort((a,b)=>a-b);
      currentTitle=sc.title;
    } else {
      const sc=scenariosCategorical[randInt(0,scenariosCategorical.length-1)];
      currentData = sc.gen();
      currentTitle=sc.title;
    }
  }

  function newExercise(){
    pickScenario();
    const box=document.querySelector('[data-role="info-box"]');
    if(!box) return;
    let html=`<p><b>Escenario:</b> ${currentTitle}</p><p><b>n:</b> ${currentData.length}</p>`;
    if(currentType==='numeric'){
      html+=`<p><b>Datos ordenados:</b> ${currentData.join(', ')}</p>`;
    } else {
      html+=`<p><b>Datos (ordenados):</b> ${currentData.slice().sort().join(', ')}</p>`;
    }
    box.innerHTML=html;
    adjustFields();
    clearAnswers();
    clearFeedback();
  }

  function adjustFields(){
    const numRows=document.querySelectorAll('[data-block="num"]');
    const catRows=document.querySelectorAll('[data-block="cat"]');
    if(currentType==='numeric'){
      numRows.forEach(r=>r.style.display='table-row');
      catRows.forEach(r=>r.style.display='none');
    } else {
      numRows.forEach(r=>r.style.display='none');
      catRows.forEach(r=>r.style.display='table-row');
    }
  }

  function clearAnswers(){
    document.querySelectorAll('input[data-answer]').forEach(i=>{
      i.value='';
      i.classList.remove('ok','err');
    });
  }
  function clearFeedback(){
    const fb=document.querySelector('[data-role="feedback"]');
    if(fb) fb.innerHTML='';
  }

  function verify(){
    if(!currentData.length) return;
    const results=[];
    if(currentType==='numeric'){
      const m=mean(currentData);
      const med=median(currentData);
      const min=Math.min(...currentData);
      const max=Math.max(...currentData);
      const range=max-min;
      checkFloat('media', m, results);
      checkFloat('mediana', med, results);
      checkFloat('min', min, results);
      checkFloat('max', max, results);
      checkFloat('rango', range, results);
    } else {
      const n=currentData.length;
      const distinct=[...new Set(currentData)];
      const freqMap={};
      currentData.forEach(x=>freqMap[x]=(freqMap[x]||0)+1);
      const freqs=Object.values(freqMap).sort((a,b)=>b-a);
      const maxFreq=freqs[0];
      const propMax=maxFreq/n;
      const sumOthers=n - maxFreq;
      checkInt('n_total', n, results);
      checkInt('n_cats', distinct.length, results);
      checkInt('freq_max', maxFreq, results);
      checkFloat('prop_max', propMax, results);
      checkInt('freq_otros', sumOthers, results);
    }
    renderFeedback(results);
  }

  function getInput(name){
    return document.querySelector(`input[data-answer="${name}"]`);
  }

  function checkFloat(name, correct, arr){
    const inp=getInput(name); if(!inp) return;
    const val=parseFloat(inp.value);
    const ok=!isNaN(val) && Math.abs(val - correct) <= 0.01;
    mark(inp,ok);
    arr.push({name, ok, expected: correct.toFixed(4)});
  }
  function checkInt(name, correct, arr){
    const inp=getInput(name); if(!inp) return;
    const val=parseInt(inp.value,10);
    const ok=!isNaN(val) && val===correct;
    mark(inp,ok);
    arr.push({name, ok, expected: String(correct)});
  }
  function mark(inp,ok){
    inp.classList.remove('ok','err');
    inp.classList.add(ok?'ok':'err');
  }
  function renderFeedback(list){
    const fb=document.querySelector('[data-role="feedback"]');
    let html='<h4>Resultados</h4><ul style="margin-left:18px">';
    list.forEach(r=>{
      html+=`<li>${r.name}: ${r.ok?'✔':'✖'} (esperado: ${r.expected})</li>`;
    });
    html+='</ul>';
    fb.innerHTML=html;
  }

  const CSS=`<style>
  .ej-num-simple-root{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px}
  .ej-card{border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:16px 0;background:#fff}
  .ej-btn{background:#f1f5f9;border:1px solid #cbd5e1;border-radius:8px;padding:6px 12px;font-size:14px;cursor:pointer}
  .ej-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;font-size:13px;line-height:1.4;margin-bottom:12px}
  table.ej-t{width:100%;border-collapse:collapse;font-size:13px}
  table.ej-t th,table.ej-t td{border:1px solid #e2e8f0;padding:6px;text-align:left}
  table.ej-t th{background:#f1f5f9}
  input.ej-inp{width:100%;padding:6px 8px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;box-sizing:border-box}
  input.ej-inp.ok{background:#dcfce7;border-color:#16a34a}
  input.ej-inp.err{background:#fee2e2;border-color:#dc2626}
  .ej-feedback{border-top:1px dashed #cbd5e1;margin-top:14px;padding-top:10px;font-size:13px}
  .ej-small{font-size:12px;color:#64748b;margin-top:6px}
  </style>`;

  function layout(){
    return `${CSS}
    <div class="ej-num-simple-root" data-root="intro-num-simple">
      <div class="ej-card">
        <h3 style="margin:0 0 10px 0">Ejercicio — Solo valores numéricos</h3>
        <p style="margin:0 0 12px 0">Pulsa "Nuevo ejercicio", ingresa números y luego "Verificar". Tolerancia ±0.01.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
          <button class="ej-btn" data-action="nuevo">Nuevo ejercicio</button>
          <button class="ej-btn" data-action="verificar">Verificar</button>
        </div>
        <div class="ej-box" data-role="info-box"><em>Pulsa "Nuevo ejercicio".</em></div>
        <table class="ej-t">
          <thead>
            <tr><th style="width:45%">Ítem</th><th>Respuesta</th></tr>
          </thead>
          <tbody>
            <!-- Numeric -->
            <tr data-block="num"><td>Media</td><td><input class="ej-inp" data-answer="media" placeholder="Ej: 75.20"/></td></tr>
            <tr data-block="num"><td>Mediana</td><td><input class="ej-inp" data-answer="mediana" placeholder="Ej: 74.90"/></td></tr>
            <tr data-block="num"><td>Mínimo</td><td><input class="ej-inp" data-answer="min" placeholder="Ej: 60.00"/></td></tr>
            <tr data-block="num"><td>Máximo</td><td><input class="ej-inp" data-answer="max" placeholder="Ej: 89.50"/></td></tr>
            <tr data-block="num"><td>Rango</td><td><input class="ej-inp" data-answer="rango" placeholder="Ej: 29.50"/></td></tr>

            <!-- Categorical -->
            <tr data-block="cat"><td>n total</td><td><input class="ej-inp" data-answer="n_total" placeholder="Ej: 24"/></td></tr>
            <tr data-block="cat"><td>Número de categorías distintas</td><td><input class="ej-inp" data-answer="n_cats" placeholder="Ej: 3"/></td></tr>
            <tr data-block="cat"><td>Frecuencia máxima</td><td><input class="ej-inp" data-answer="freq_max" placeholder="Ej: 12"/></td></tr>
            <tr data-block="cat"><td>Proporción categoría más frecuente</td><td><input class="ej-inp" data-answer="prop_max" placeholder="Ej: 0.50"/></td></tr>
            <tr data-block="cat"><td>Suma frecuencias restantes</td><td><input class="ej-inp" data-answer="freq_otros" placeholder="Ej: 12"/></td></tr>
          </tbody>
        </table>
        <div class="ej-feedback" data-role="feedback"></div>
        <div class="ej-small">No uses símbolos de porcentaje: escribe 0.55 en lugar de 55%.</div>
      </div>
    </div>`;
  }

  if(!window.__EJ_NUM_SIMPLE_EVENTS__){
    document.addEventListener('click', e=>{
      const btn=e.target.closest('.ej-btn'); if(!btn) return;
      const action=btn.getAttribute('data-action');
      if(action==='nuevo'){ newExercise(); }
      if(action==='verificar'){ verify(); }
    });
    window.__EJ_NUM_SIMPLE_EVENTS__=true;
  }

  function render(){ return layout(); }

  const api={ render };
  if(typeof window!=='undefined') window.SIM_estadistica_ejercicio_intro=api;
  return api;
})();

export default (typeof window!=='undefined' && window.SIM_estadistica_ejercicio_intro)
  ? window.SIM_estadistica_ejercicio_intro
  : { render:()=>'' };