export default {
  render: (params, simName = 'Ordenaciones con Repetición') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: end;">
            <div>
              <label for="${id_base}_set"><b>Conjunto de datos</b> (elementos separados por coma):</label>
              <input type="text" id="${id_base}_set" value="A, B, C" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
            </div>
            <div>
              <label for="${id_base}_r"><b>Agrupar en (r):</b></label>
              <input type="number" id="${id_base}_r" value="2" min="0" style="width: 80px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
            </div>
            <button class="btn-sim" id="${id_base}_calculateBtn" style="grid-column: 1 / -1;">Calcular Ordenaciones</button>
          </div>

          <hr style="margin: 1.5rem 0;">

          <h3>Fórmula y Resultado</h3>
          <div id="${id_base}_formula" style="font-size: 1.5em; text-align: center; margin: 1rem 0; color: #333; overflow-x: auto;"></div>
          
          <h3>Ordenaciones Posibles:</h3>
          <pre id="${id_base}_results" style="background-color: #fff; border: 1px solid #eee; padding: 1em; border-radius: 6px; max-height: 300px; overflow-y: auto; white-space: pre-wrap;"></pre>

        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);
          const DISPLAY_LIMIT = 1000; // Límite para mostrar resultados

          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';

            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ${simName}';
              btn.classList.add('btn-sim-rojo');
              calculateArrangements(); // Calcular al abrir
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ${simName}';
              btn.classList.remove('btn-sim-rojo');
            }
          };
          
          // Algoritmo recursivo para generar las ordenaciones con repetición
          const getArrangementsWithRepetition = (arr, r) => {
              const result = [];
              function generate(current) {
                  if (current.length === r) {
                      result.push(current);
                      return;
                  }
                  for (let i = 0; i < arr.length; i++) {
                      generate(current.concat(arr[i]));
                  }
              }
              generate([]);
              return result;
          };

          const calculateArrangements = () => {
            const setDataRaw = $('set').value.split(',').map(s => s.trim()).filter(Boolean);
            const dataSet = [...new Set(setDataRaw)];
            const n = dataSet.length;
            const r = parseInt($('r').value, 10);

            const formulaDiv = $('formula');
            const resultsDiv = $('results');

            if (isNaN(r) || r < 0 || n === 0) {
              formulaDiv.textContent = 'Error: Ingresa un conjunto de datos válido y un valor de "r" mayor o igual a 0.';
              resultsDiv.textContent = '';
              return;
            }

            // 1. Calcular y mostrar la fórmula
            const totalArrangements = Math.pow(n, r);
            const formulaTex = 'OR_{' + n + '}^{' + r + '} = ' + n + '^{' + r + '} = ' + totalArrangements.toLocaleString();
            formulaDiv.innerHTML = '\\\\(' + formulaTex + '\\\\)';
            
            if (window.MathJax?.typesetPromise) {
              MathJax.typesetPromise([formulaDiv]).catch(err => console.error("Error en MathJax:", err));
            }

            // 2. Generar y mostrar las ordenaciones (con límite)
            if (totalArrangements > DISPLAY_LIMIT) {
              resultsDiv.textContent = 'Hay ' + totalArrangements.toLocaleString() + ' ordenaciones posibles.\\nEs demasiado para mostrar en pantalla.';
            } else {
              const arrangements = getArrangementsWithRepetition(dataSet, r);
              resultsDiv.textContent = arrangements.map((p, i) => (i + 1) + '. ' + p.join(', ')).join('\\n');
            }
          };

          $('calculateBtn').addEventListener('click', calculateArrangements);
        })();
      </script>
    `;
  }
};