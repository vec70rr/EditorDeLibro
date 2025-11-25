// ================================================================
// Simulador — Problema del Café (Probabilidad Condicional)
// Estructura idéntica a sim_condicional.js
// ================================================================

export default {
  render: (_params, simName = "Simulador: El Problema del Café") => {
    const id = "sim_" + Math.random().toString(36).slice(2); // id único

    return `
      <div id="${id}">
        <button id="${id}_btnToggle" class="btn-sim">
          Abrir ${simName}
        </button>

        <div id="${id}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <style>
            #${id}_container {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 14px;
            }
            #${id}_container .box {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              background: #fff;
              margin-top: 10px;
            }
            #${id}_container .controls {
              display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;
            }
            #${id}_container button {
              padding: 6px 12px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              border: 1px solid #d1d5db;
              background: #f3f4f6;
              color: #374151;
            }
            #${id}_container button.primary {
              background: #3b82f6; color: white; border: none;
            }
            #${id}_container button.primary:hover { background: #2563eb; }
            #${id}_container button.danger {
              background: #ef4444; color: white; border: none;
            }
            #${id}_container button.danger:hover { background: #dc2626; }
            
            /* Tabla */
            #${id}_container table {
              width: 100%; border-collapse: collapse; margin: 10px 0; font-variant-numeric: tabular-nums;
            }
            #${id}_container th, #${id}_container td {
              padding: 10px; border: 1px solid #e5e7eb; text-align: center; position: relative; transition: all 0.3s;
            }
            #${id}_container th { background: #f9fafb; font-weight: 700; color: #374151; }
            #${id}_container td { font-size: 1.1em; color: #111; }

            /* Efectos Visuales para la explicación */
            #${id}_container .dimmed { opacity: 0.2; }
            #${id}_container .highlight-universe { background: #dbeafe !important; border: 2px solid #3b82f6 !important; color: #1e3a8a; font-weight: bold; }
            #${id}_container .highlight-target { background: #dcfce7 !important; border: 2px solid #16a34a !important; color: #14532d; font-weight: bold; }
            
            #${id}_container .explanation {
              background: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px; margin-top: 15px; border-radius: 4px; min-height: 80px;
            }
          </style>

          <h3>Simulador — Preferencias de Café</h3>
          <p style="color:#64748b; margin-bottom:10px;">
            Simula clientes para visualizar cómo cambia el "universo" en la probabilidad condicional.
          </p>

          <div class="box">
            <div class="controls">
              <button data-action="gen-100" class="primary">Simular 100</button>
              <button data-action="gen-1000" class="primary">Simular 1,000</button>
              <button data-action="reset" class="danger">Reiniciar</button>
            </div>

            <table id="${id}_table">
              <thead>
                <tr>
                  <th>Tipo \\ Tamaño</th>
                  <th>Pequeño (S)</th>
                  <th>Mediano (M)</th>
                  <th>Grande (L)</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr id="${id}_row_reg">
                  <th>Regular</th>
                  <td id="${id}_c_reg_s">0</td>
                  <td id="${id}_c_reg_m">0</td>
                  <td id="${id}_c_reg_l">0</td>
                  <td id="${id}_tot_reg" style="font-weight:bold; color:#6b7280;">0</td>
                </tr>
                <tr id="${id}_row_dec">
                  <th>Descafeinado</th>
                  <td id="${id}_c_dec_s">0</td>
                  <td id="${id}_c_dec_m">0</td>
                  <td id="${id}_c_dec_l">0</td>
                  <td id="${id}_tot_dec" style="font-weight:bold; color:#6b7280;">0</td>
                </tr>
                <tr style="background:#f3f4f6; font-weight:bold;">
                  <th>TOTAL</th>
                  <td id="${id}_tot_s">0</td>
                  <td id="${id}_tot_m">0</td>
                  <td id="${id}_tot_l">0</td>
                  <td id="${id}_grand_tot" style="color:#2563eb">0</td>
                </tr>
              </tbody>
            </table>

            <div style="border-top: 1px dashed #e5e7eb; padding-top: 15px; margin-top: 15px;">
              <strong style="display:block; margin-bottom:10px;">Analizar Escenarios:</strong>
              <div class="controls">
                <button data-action="solve-a">a) Prob. Simples</button>
                <button data-action="solve-b">b) Dado que es Pequeño</button>
                <button data-action="solve-c">c) Dado que es Descafeinado</button>
              </div>
              <div id="${id}_explanation" class="explanation">
                Genera datos primero para ver la explicación interactiva.
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        (function(){
          const root = document.getElementById("${id}");
          if (!root) return;

          const simName = "${simName}";
          const container = root.querySelector("#${id}_container");
          const btnToggle = root.querySelector("#${id}_btnToggle");

          if (!container || !btnToggle) return;

          // Helper para seleccionar por ID dinámico
          const $ = (suffix) => root.querySelector("#${id}_" + suffix);

          // Configuración del problema
          const PROBS = [
            { type: 'reg', size: 's', p: 14 },
            { type: 'reg', size: 'm', p: 20 },
            { type: 'reg', size: 'l', p: 26 },
            { type: 'dec', size: 's', p: 20 },
            { type: 'dec', size: 'm', p: 10 },
            { type: 'dec', size: 'l', p: 10 }
          ];

          let state = {
            counts: { 'reg_s':0, 'reg_m':0, 'reg_l':0, 'dec_s':0, 'dec_m':0, 'dec_l':0 },
            total: 0
          };

          let initialized = false;

          btnToggle.addEventListener("click", function(){
            const hidden = container.style.display === "none" || container.style.display === "";
            if (hidden) {
              container.style.display = "block";
              btnToggle.textContent = "Ocultar " + simName;
              btnToggle.classList.add("btn-sim-rojo");
              if (!initialized) {
                initialized = true;
                initSim();
              }
            } else {
              container.style.display = "none";
              btnToggle.textContent = "Abrir " + simName;
              btnToggle.classList.remove("btn-sim-rojo");
            }
          });

          function initSim(){
            const expl = $("explanation");

            // Función para actualizar la tabla HTML
            function updateDOM() {
              // Celdas individuales
              for(const [key, val] of Object.entries(state.counts)){
                const cell = $("c_" + key);
                if(cell) cell.textContent = val;
              }

              // Totales filas
              const regTot = state.counts['reg_s'] + state.counts['reg_m'] + state.counts['reg_l'];
              const decTot = state.counts['dec_s'] + state.counts['dec_m'] + state.counts['dec_l'];
              
              // Totales columnas
              const sTot = state.counts['reg_s'] + state.counts['dec_s'];
              const mTot = state.counts['reg_m'] + state.counts['dec_m'];
              const lTot = state.counts['reg_l'] + state.counts['dec_l'];

              $("tot_reg").textContent = regTot;
              $("tot_dec").textContent = decTot;
              $("tot_s").textContent = sTot;
              $("tot_m").textContent = mTot;
              $("tot_l").textContent = lTot;
              $("grand_tot").textContent = state.total;

              return { regTot, decTot, sTot, mTot, lTot };
            }

            // Limpiar estilos visuales (highlight/dim)
            function clearVisuals() {
              const cells = container.querySelectorAll('td, th');
              cells.forEach(c => {
                c.classList.remove('dimmed', 'highlight-universe', 'highlight-target');
              });
            }

            // Delegación de eventos para todos los botones dentro del contenedor
            container.addEventListener('click', (e) => {
              const btn = e.target.closest('button[data-action]');
              if (!btn) return;

              const action = btn.dataset.action;

              // --- GENERACIÓN ---
              if (action.startsWith('gen-')) {
                const n = action === 'gen-100' ? 100 : 1000;
                for(let i=0; i<n; i++){
                  const r = Math.random() * 100;
                  let acc = 0;
                  for(let p of PROBS){
                    acc += p.p;
                    if(r < acc){
                      // Usamos _ en lugar de - para coincidir con las keys del state
                      state.counts[\`\${p.type}_\${p.size}\`]++;
                      break;
                    }
                  }
                }
                state.total += n;
                updateDOM();
                clearVisuals();
                expl.innerHTML = "Simulación actualizada. Total muestras: <b>" + state.total + "</b>.<br>Ahora selecciona una pregunta (a, b o c).";
              }

              // --- RESET ---
              if (action === 'reset') {
                state = { counts: { 'reg_s':0, 'reg_m':0, 'reg_l':0, 'dec_s':0, 'dec_m':0, 'dec_l':0 }, total: 0 };
                updateDOM();
                clearVisuals();
                expl.textContent = "Datos reiniciados.";
              }

              // --- ANÁLISIS (SOLUCIONES) ---
              if (action.startsWith('solve-')) {
                if(state.total === 0) return alert("Primero genera datos.");
                
                clearVisuals();
                const t = updateDOM(); // Obtener totales actuales
                
                // Helper para "atenuar todo"
                const dimAll = () => container.querySelectorAll('td, th').forEach(el => el.classList.add('dimmed'));

                if(action === 'solve-a') {
                  // A: Probabilidades Simples
                  $("tot_s").classList.add('highlight-target');
                  $("tot_dec").classList.add('highlight-target');
                  
                  // Remover dim de los headers relevantes para que se vean mejor
                  // (Opcional, pero se ve mejor si no atenua todo en el inciso A)
                  
                  const pS = (t.sTot / state.total).toFixed(3);
                  const pD = (t.decTot / state.total).toFixed(3);

                  expl.innerHTML = \`
                    <strong>a) Probabilidades Simples (Marginales)</strong><br>
                    Se calculan sobre el total global (\${state.total}).<br>
                    • <b>P(Pequeño):</b> \${t.sTot} / \${state.total} = <b>\${pS}</b> (Teórico ~0.34)<br>
                    • <b>P(Descafeinado):</b> \${t.decTot} / \${state.total} = <b>\${pD}</b> (Teórico ~0.40)
                  \`;
                }

                if(action === 'solve-b') {
                  // B: P(Decaf | Small) -> Universo: Columna Small
                  dimAll();

                  // Resaltar Universo (Columna Small)
                  const colIds = ['c_reg_s', 'c_dec_s', 'tot_s'];
                  // Headers manuales es dificil sin ID, iluminamos celdas
                  colIds.forEach(id => {
                    const el = $(id);
                    if(el) { el.classList.remove('dimmed'); el.classList.add('highlight-universe'); }
                  });

                  // Resaltar Target (Intersección: Decaf y Small)
                  const target = $("c_dec_s");
                  target.classList.remove('highlight-universe');
                  target.classList.add('highlight-target');

                  const res = t.sTot > 0 ? (state.counts['dec_s'] / t.sTot).toFixed(3) : 0;

                  expl.innerHTML = \`
                    <strong>b) P(Descafeinado | Pequeño)</strong><br>
                    El universo se reduce a la columna "Pequeño".<br>
                    • <b>Nuevo Total:</b> \${t.sTot} (Tazas pequeñas)<br>
                    • <b>Favorables:</b> \${state.counts['dec_s']} (Descafeinados dentro de pequeñas)<br>
                    • <b>Cálculo:</b> \${state.counts['dec_s']} / \${t.sTot} = <b>\${res}</b>
                  \`;
                }

                if(action === 'solve-c') {
                   // C: P(Small | Decaf) -> Universo: Fila Decaf
                   dimAll();

                   // Resaltar Universo (Fila Decaf)
                   const rowIds = ['c_dec_s', 'c_dec_m', 'c_dec_l', 'tot_dec'];
                   $("row_dec").querySelectorAll('th').forEach(th => {
                      th.classList.remove('dimmed'); th.classList.add('highlight-universe');
                   });
                   
                   rowIds.forEach(id => {
                     const el = $(id);
                     if(el) { el.classList.remove('dimmed'); el.classList.add('highlight-universe'); }
                   });

                   // Resaltar Target (Intersección: Small y Decaf)
                   const target = $("c_dec_s");
                   target.classList.remove('highlight-universe');
                   target.classList.add('highlight-target');

                   const res = t.decTot > 0 ? (state.counts['dec_s'] / t.decTot).toFixed(3) : 0;

                   expl.innerHTML = \`
                    <strong>c) P(Pequeño | Descafeinado)</strong><br>
                    El universo se reduce a la fila "Descafeinado".<br>
                    • <b>Nuevo Total:</b> \${t.decTot} (Total descafeinados)<br>
                    • <b>Favorables:</b> \${state.counts['dec_s']} (Pequeños dentro de descafeinados)<br>
                    • <b>Cálculo:</b> \${state.counts['dec_s']} / \${t.decTot} = <b>\${res}</b>
                  \`;
                }
              }
            });
          }
        })();
      </script>
    `;
  }
};