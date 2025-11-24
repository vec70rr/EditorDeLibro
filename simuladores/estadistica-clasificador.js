// Simulador Parte A: Clasificador rápido
// Exporta default { render } | render() => STRING HTML
(function(){
  function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
  const escenarios=[
    {txt:"Se seleccionan 50 chips de un lote de 10 000 para probar su tasa de falla.",
     poblacion:"Los 10 000 chips del lote.",
     muestra:"Los 50 chips probados.",
     variable:"Categórica (falla / no falla) o numérica (tiempo hasta falla).",
     prob:"Si la tasa real de falla es 4%, probabilidad de ≥5 fallas en 50.",
     inf:"¿La muestra sugiere que la tasa de falla ≠ 4%?"},
    {txt:"Se mide la resistencia a la flexión de 12 prototipos de concreto.",
     poblacion:"Todas las posibles piezas que se producirán (población conceptual).",
     muestra:"Los 12 prototipos medidos.",
     variable:"Numérica (MPa).",
     prob:"Suponiendo media poblacional 8 MPa, probabilidad de muestra con media ≥8.5.",
     inf:"¿La media poblacional difiere de 8 MPa?"},
    {txt:"Se registra el modo de falla (corrosión, impacto, fatiga) de 40 piezas retornadas.",
     poblacion:"Todas las piezas en servicio del sistema.",
     muestra:"Las 40 piezas retornadas.",
     variable:"Categórica (modo de falla).",
     prob:"Si la proporción real de corrosión es 0.25, probabilidad de ≥15 casos en 40.",
     inf:"¿La proporción de corrosión difiere de 0.25?"},
    {txt:"Se encuesta a 100 graduados para evaluar satisfacción del plan de estudios.",
     poblacion:"Todos los graduados del ciclo actual.",
     muestra:"Los 100 encuestados.",
     variable:"Categórica (nivel de satisfacción ordinal) + opcional numérica (edad).",
     prob:"Si 60% están satisfechos realmente, probabilidad de ≥70 satisfechos en 100.",
     inf:"¿Evidencia de que la proporción de satisfechos > 60%?"},
    {txt:"Se mide el espesor de 20 láminas producidas en un turno.",
     poblacion:"Todas las láminas producibles bajo esas condiciones (conceptual) o todas las del turno (concreta).",
     muestra:"Las 20 láminas medidas.",
     variable:"Numérica (espesor).",
     prob:"Con espesor real 1.00 mm, probabilidad de media muestral <0.98.",
     inf:"¿El espesor medio difiere de 1.00 mm?"}
  ];
  function nuevo(){
    return escenarios[randInt(0,escenarios.length-1)];
  }
  const CSS=`<style>
  .clasif-root{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  .card{border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin:14px 0;background:#fff}
  .head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
  .title{font-weight:700}
  .btn{background:#f1f5f9;border:1px solid #cbd5e1;padding:6px 12px;border-radius:8px;cursor:pointer}
  .sol{border-top:1px dashed #cbd5e1;margin-top:12px;padding-top:12px;display:none}
  .diagram{margin-top:8px}
  </style>`;
  function diagram(){
    return `<svg width="300" height="60" viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="ar" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0,10 3.5,0 7" fill="#334155"/></marker></defs>
      <rect x="8" y="10" width="110" height="40" rx="8" fill="#f8fafc" stroke="#334155"/>
      <text x="63" y="35" text-anchor="middle" font-size="12">Población</text>
      <rect x="182" y="10" width="110" height="40" rx="8" fill="#f8fafc" stroke="#334155"/>
      <text x="237" y="35" text-anchor="middle" font-size="12">Muestra</text>
      <path d="M118 30 L182 30" stroke="#334155" stroke-width="2" marker-end="url(#ar)"/>
      <path d="M182 40 L118 40" stroke="#334155" stroke-width="2" marker-end="url(#ar)"/>
      <text x="150" y="22" font-size="10" text-anchor="middle">Probabilidad</text>
      <text x="150" y="52" font-size="10" text-anchor="middle">Inferencia</text>
    </svg>`;
  }
  function renderScenario(sc){
    return `<p>${sc.txt}</p>
    <p style="font-size:12px;color:#64748b">Identifica: población, muestra, variable, pregunta de probabilidad e inferencia.</p>`;
  }
  function renderSolution(sc){
    return `<p><b>Población:</b> ${sc.poblacion}</p>
    <p><b>Muestra:</b> ${sc.muestra}</p>
    <p><b>Variable:</b> ${sc.variable}</p>
    <p><b>Pregunta de probabilidad:</b> ${sc.prob}</p>
    <p><b>Pregunta de inferencia:</b> ${sc.inf}</p>`;
  }
  if(!window.__CLASIF_EVENTS__){
    document.addEventListener('click', e=>{
      const b=e.target.closest('.btn[data-action]');
      if(!b) return;
      const action=b.getAttribute('data-action');
      const card=b.closest('.card[data-sim="clasificador"]');
      if(action==='nuevo'){
        const sc=nuevo();
        card.dataset.index=escenarios.indexOf(sc);
        card.querySelector('[data-role="scenario"]').innerHTML=renderScenario(sc);
        card.querySelector('[data-role="solution"]').innerHTML=renderSolution(sc);
      }
      if(action==='toggle'){
        const sol=card.querySelector('[data-role="solution"]');
        sol.style.display=sol.style.display==='none'?'block':'none';
      }
    });
    window.__CLASIF_EVENTS__=true;
  }
  function render(){
    const sc=nuevo();
    return `${CSS}
    <div class="clasif-root">
      <div class="card" data-sim="clasificador" data-index="${escenarios.indexOf(sc)}">
        <div class="head">
          <div class="title">Clasificador rápido</div>
          <div>
            <button class="btn" data-action="nuevo">Nuevo escenario</button>
            <button class="btn" data-action="toggle">Mostrar solución</button>
          </div>
        </div>
        <div class="diagram">${diagram()}</div>
        <div data-role="scenario">${renderScenario(sc)}</div>
        <div class="sol" data-role="solution">${renderSolution(sc)}</div>
      </div>
    </div>`;
  }
  const api={render};
  if(typeof window!=='undefined') window.SIM_estadistica_clasificador=api;
  return api;
})();
export default (typeof window!=='undefined' && window.SIM_estadistica_clasificador) ? window.SIM_estadistica_clasificador : { render:()=>'' };