// Archivo: sim_problema_cafe.js
// Descripción: Simulador específico para el problema de probabilidad condicional (Café: Tamaño vs Tipo)
(function(){

  // Configuración de probabilidades teóricas del problema
  const PROBS = [
    { type: 'reg', size: 's', p: 14 },
    { type: 'reg', size: 'm', p: 20 },
    { type: 'reg', size: 'l', p: 26 },
    { type: 'dec', size: 's', p: 20 },
    { type: 'dec', size: 'm', p: 10 },
    { type: 'dec', size: 'l', p: 10 }
  ];

  // Estado interno
  let state = {
    counts: { 'reg-s':0, 'reg-m':0, 'reg-l':0, 'dec-s':0, 'dec-m':0, 'dec-l':0 },
    total: 0
  };

  const CSS = `<style>
  .cafe-root { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; }
  .cafe-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #fff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  .cafe-controls { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .btn-c { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
  .btn-c:hover { background: #2563eb; }
  .btn-gray { background: #64748b; }
  .btn-gray:hover { background: #475569; }
  .btn-red { background: #ef4444; }
  .btn-red:hover { background: #dc2626; }
  
  /* Tabla con estilos para resaltar */
  .cafe-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-variant-numeric: tabular-nums; }
  .cafe-table th, .cafe-table td { padding: 12px; border: 1px solid #cbd5e1; text-align: center; position: relative; transition: all 0.3s ease; }
  .cafe-table th { background: #f8fafc; color: #334155; font-weight: 700; }
  .cafe-table td { font-size: 1.1em; color: #0f172a; }
  
  /* Estados visuales para la explicación */
  .dimmed { opacity: 0.15; filter: grayscale(100%); }
  .highlight-universe { background: #dbeafe !important; border: 2px solid #3b82f6 !important; color: #1e3a8a; font-weight: bold; }
  .highlight-target { background: #dcfce7 !important; border: 2px solid #16a34a !important; color: #14532d; font-weight: bold; transform: scale(1.05); z-index: 10; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  
  .explanation-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin-top: 15px; border-radius: 4px; min-height: 120px; }
  .math-block { font-family: monospace; background: rgba(255,255,255,0.7); padding: 5px; border-radius: 4px; display: inline-block; margin: 5px 0; font-weight: bold; }
  </style>`;

  function render(){
    return `${CSS}
    <div class="cafe-root">
      <div class="cafe-card" data-sim="cafe">
        <h3 style="margin-top:0; color:#1e293b;">Ejercicio: Preferencias de Café</h3>
        <p style="color:#64748b; font-size:0.95em;">Simula clientes para visualizar cómo cambia el "universo" en la probabilidad condicional.</p>
        
        <div class="cafe-controls">
          <button class="btn-c" data-action="gen-100">Simular 100 Clientes</button>
          <button class="btn-c" data-action="gen-1000">Simular 1,000 Clientes</button>
          <button class="btn-c btn-red" data-action="reset">Reiniciar</button>
        </div>

        <table class="cafe-table" id="tabla-cafe">
          <thead>
            <tr>
              <th>Tipo \\ Tamaño</th>
              <th class="col-s">Pequeño (14%+20%)</th>
              <th class="col-m">Mediano (20%+10%)</th>
              <th class="col-l">Grande (26%+10%)</th>
              <th class="col-total">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr class="row-reg">
              <th>Regular</th>
              <td id="cell-reg-s" data-g="reg-s">0</td>
              <td id="cell-reg-m" data-g="reg-m">0</td>
              <td id="cell-reg-l" data-g="reg-l">0</td>
              <td id="total-reg" style="font-weight:bold; color:#475569;">0</td>
            </tr>
            <tr class="row-dec">
              <th>Descafeinado</th>
              <td id="cell-dec-s" data-g="dec-s">0</td>
              <td id="cell-dec-m" data-g="dec-m">0</td>
              <td id="cell-dec-l" data-g="dec-l">0</td>
              <td id="total-dec" style="font-weight:bold; color:#475569;">0</td>
            </tr>
            <tr class="row-total" style="background:#f1f5f9; font-weight:bold;">
              <th>TOTAL</th>
              <td id="total-s">0</td>
              <td id="total-m">0</td>
              <td id="total-l">0</td>
              <td id="grand-total" style="color:#2563eb">0</td>
            </tr>
          </tbody>
        </table>

        <div style="border-top: 1px dashed #cbd5e1; padding-top: 15px; margin-top: 20px;">
          <strong style="display:block; margin-bottom:10px;">Resolver Preguntas:</strong>
          <div class="cafe-controls">
            <button class="btn-c btn-gray" data-action="solve-a">a) Probabilidades Simples</button>
            <button class="btn-c btn-gray" data-action="solve-b">b) Dado que es Pequeño</button>
            <button class="btn-c btn-gray" data-action="solve-c">c) Dado que es Descafeinado</button>
          </div>
          <div id="cafe-explanation" class="explanation-box">
            Genera datos primero para ver la explicación interactiva.
          </div>
        </div>
      </div>
    </div>`;
  }

  // Lógica de simulación y actualización
  function updateDOM(card){
    // Actualizar celdas
    for(const [key, val] of Object.entries(state.counts)){
      card.querySelector(`#cell-${key}`).textContent = val;
    }
    
    // Calcular totales
    const regTot = state.counts['reg-s'] + state.counts['reg-m'] + state.counts['reg-l'];
    const decTot = state.counts['dec-s'] + state.counts['dec-m'] + state.counts['dec-l'];
    
    const sTot = state.counts['reg-s'] + state.counts['dec-s'];
    const mTot = state.counts['reg-m'] + state.counts['dec-m'];
    const lTot = state.counts['reg-l'] + state.counts['dec-l'];
    
    // Actualizar DOM totales
    card.querySelector('#total-reg').textContent = regTot;
    card.querySelector('#total-dec').textContent = decTot;
    card.querySelector('#total-s').textContent = sTot;
    card.querySelector('#total-m').textContent = mTot;
    card.querySelector('#total-l').textContent = lTot;
    card.querySelector('#grand-total').textContent = state.total;

    return { regTot, decTot, sTot, mTot, lTot };
  }

  function clearVisuals(card){
    const cells = card.querySelectorAll('td, th');
    cells.forEach(c => {
      c.classList.remove('dimmed', 'highlight-universe', 'highlight-target');
    });
  }

  // Manejador de eventos único
  if(!window._EVENTS_CAFE_){
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-sim="cafe"] button');
      if(!btn) return;
      
      const card = btn.closest('[data-sim="cafe"]');
      const action = btn.dataset.action;
      const expl = card.querySelector('#cafe-explanation');

      // Acciones de Generación
      if(action.startsWith('gen-')){
        const n = action === 'gen-100' ? 100 : 1000;
        
        // Algoritmo simple de ruleta acumulativa
        for(let i=0; i<n; i++){
          const r = Math.random() * 100;
          let acc = 0;
          for(let p of PROBS){
            acc += p.p;
            if(r < acc){
              state.counts[`${p.type}-${p.size}`]++;
              break;
            }
          }
        }
        state.total += n;
        updateDOM(card);
        clearVisuals(card);
        expl.innerHTML = `Simulación actualizada. Total muestras: <strong>${state.total}</strong>.<br>Ahora selecciona una pregunta (a, b o c) para ver la solución con estos datos.`;
      }

      if(action === 'reset'){
        state = { counts: { 'reg-s':0, 'reg-m':0, 'reg-l':0, 'dec-s':0, 'dec-m':0, 'dec-l':0 }, total: 0 };
        updateDOM(card);
        clearVisuals(card);
        expl.textContent = "Datos reiniciados.";
      }

      // Acciones de Análisis (Solo si hay datos)
      if(action.startsWith('solve-')){
        if(state.total === 0) return alert("Primero genera algunos datos.");
        
        clearVisuals(card);
        const totals = updateDOM(card); // Recalcular totales actuales

        // Helper para atenuar todo
        const dimAll = () => card.querySelectorAll('#tabla-cafe td, #tabla-cafe th').forEach(el => el.classList.add('dimmed'));

        if(action === 'solve-a'){
          // No atenuamos nada, mostramos totales marginales
          card.querySelector('#total-s').classList.add('highlight-target');
          card.querySelector('#total-dec').classList.add('highlight-target');

          const pS = (totals.sTot / state.total).toFixed(3);
          const pD = (totals.decTot / state.total).toFixed(3);

          expl.innerHTML = `
            <strong>a) Probabilidades Simples (Marginales)</strong>
            <p>Se calcula sobre el total global (${state.total}).</p>
            <ul>
              <li><strong>P(Pequeño):</strong> Suma de la columna "Pequeño" dividida por el total.<br>
                  <span class="math-block">${totals.sTot} / ${state.total} = ${pS}</span> (Teórico ~0.34)</li>
              <li><strong>P(Descafeinado):</strong> Suma de la fila "Descafeinado" dividida por el total.<br>
                  <span class="math-block">${totals.decTot} / ${state.total} = ${pD}</span> (Teórico ~0.40)</li>
            </ul>`;
        }

        if(action === 'solve-b'){
          // P(Decaf | Small) -> Universo: Columna Small
          dimAll();
          
          // Resaltar Universo (Columna Small)
          const colSmallIds = ['cell-reg-s', 'cell-dec-s', 'total-s'];
          const headers = card.querySelectorAll('thead th');
          headers[1].classList.remove('dimmed'); // Header Pequeño
          headers[1].classList.add('highlight-universe');

          colSmallIds.forEach(id => {
            const el = card.querySelector('#'+id);
            el.classList.remove('dimmed');
            el.classList.add('highlight-universe');
          });

          // Resaltar Target (Intersección: Decaf AND Small)
          const target = card.querySelector('#cell-dec-s');
          target.classList.remove('highlight-universe');
          target.classList.add('highlight-target');

          const res = (state.counts['dec-s'] / totals.sTot).toFixed(3);

          expl.innerHTML = `
            <strong>b) Probabilidad Condicional: P(Desc | Peq)</strong>
            <p>La condición "taza pequeña" reduce nuestro universo solo a la columna azul.</p>
            <ul>
              <li><strong>Nuevo Universo (Denominador):</strong> Total de tazas pequeñas = <strong>${totals.sTot}</strong>.</li>
              <li><strong>Evento de Interés (Numerador):</strong> Dentro de las pequeñas, las que son Descafeinadas = <strong>${state.counts['dec-s']}</strong>.</li>
              <li><strong>Cálculo:</strong> <span class="math-block">${state.counts['dec-s']} / ${totals.sTot} = ${res}</span></li>
            </ul>
            <small>Nota: Es mucho más alta que la P(Descafeinado) general porque las tazas pequeñas tienden a ser descafeinadas en este modelo.</small>`;
        }

        if(action === 'solve-c'){
          // P(Small | Decaf) -> Universo: Fila Decaf
          dimAll();

          // Resaltar Universo (Fila Decaf)
          const rowDecIds = ['cell-dec-s', 'cell-dec-m', 'cell-dec-l', 'total-dec'];
          card.querySelector('.row-dec th').classList.remove('dimmed');
          card.querySelector('.row-dec th').classList.add('highlight-universe');

          rowDecIds.forEach(id => {
            const el = card.querySelector('#'+id);
            el.classList.remove('dimmed');
            el.classList.add('highlight-universe');
          });

          // Resaltar Target (Intersección: Small AND Decaf)
          const target = card.querySelector('#cell-dec-s');
          target.classList.remove('highlight-universe');
          target.classList.add('highlight-target');

          const res = (state.counts['dec-s'] / totals.decTot).toFixed(3);

          expl.innerHTML = `
            <strong>c) Probabilidad Condicional Inversa: P(Peq | Desc)</strong>
            <p>La condición "es descafeinado" reduce nuestro universo solo a la fila azul.</p>
            <ul>
              <li><strong>Nuevo Universo (Denominador):</strong> Total de descafeinados = <strong>${totals.decTot}</strong>.</li>
              <li><strong>Evento de Interés (Numerador):</strong> Dentro de los descafeinados, los que son Pequeños = <strong>${state.counts['dec-s']}</strong>.</li>
              <li><strong>Cálculo:</strong> <span class="math-block">${state.counts['dec-s']} / ${totals.decTot} = ${res}</span></li>
            </ul>
            <small>Compara este resultado con P(Pequeño) del inciso A. Saber que es descafeinado aumenta la probabilidad de que sea pequeño.</small>`;
        }
        
        // Renderizado de LaTeX si existe MathJax en la ventana principal
        if(window.MathJax) MathJax.typesetPromise([expl]);
      }
    });
    window._EVENTS_CAFE_ = true;
  }

  const api = { render };
  if(typeof window !== 'undefined') window.SIM_problema_cafe = api;
  return api;
})();
export default window.SIM_problema_cafe || { render:()=>'' };