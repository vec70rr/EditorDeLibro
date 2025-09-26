export default {
  render: (params, simName = 'Permutaciones con Repetición') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label for="${id_base}_set"><b>Conjunto de datos</b> (elementos separados por coma):</label>
              <input type="text" id="${id_base}_set" value="A, B" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
            </div>
            <button class="btn-sim" id="${id_base}_calculateBtn">Calcular Permutaciones</button>
          </div>

          <hr style="margin: 1.5rem 0;">

          <h3>Fórmula y Resultado</h3>
          <div id="${id_base}_formula" style="font-size: 1.5em; text-align: center; margin: 1rem 0; color: #333; overflow-x: auto;"></div>
          
          <h3>Permutaciones Posibles:</h3>
          <pre id="${id_base}_results" style="background-color: #fff; border: 1px solid #eee; padding: 1em; border-radius: 6px; max-height: 300px; overflow-y: auto; white-space: pre-wrap;"></pre>

        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);
          const DISPLAY_LIMIT_N = 5; // Límite de n (5^5 = 3,125)

          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';

            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ${simName}';
              btn.classList.add('btn-sim-rojo');
              calculatePermutations();
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ${simName}';
              btn.classList.remove('btn-sim-rojo');
            }
          };

          // Algoritmo para generar permutaciones con repetición (es el mismo que "ordenaciones con repetición")
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

          const calculatePermutations = () => {
            const setDataRaw = $('set').value.split(',').map(s => s.trim()).filter(Boolean);
            const dataSet = [...new Set(setDataRaw)];
            const n = dataSet.length;
            // Para este caso específico, r es siempre igual a n
            const r = n;

            const formulaDiv = $('formula');
            const resultsDiv = $('results');
            
            if (n === 0) {
              formulaDiv.textContent = 'Por favor, ingresa un conjunto de datos.';
              resultsDiv.textContent = '';
              return;
            }

            // 1. Calcular y mostrar la fórmula
            const totalPermutations = Math.pow(n, r);
            const formulaTex = 'PR_{' + n + '} = ' + n + '^{' + r + '} = ' + totalPermutations.toLocaleString();
            formulaDiv.innerHTML = '\\\\(' + formulaTex + '\\\\)';
            
            if (window.MathJax?.typesetPromise) {
              MathJax.typesetPromise([formulaDiv]).catch(err => console.error("Error en MathJax:", err));
            }

            // 2. Generar y mostrar las permutaciones (con límite)
            if (n > DISPLAY_LIMIT_N) {
              resultsDiv.textContent = 'Hay ' + totalPermutations.toLocaleString() + ' permutaciones.\\nEs demasiado para mostrar en pantalla (límite n=' + DISPLAY_LIMIT_N + ').';
            } else {
              const permutations = getArrangementsWithRepetition(dataSet, r);
              resultsDiv.textContent = permutations.map((p, i) => (i + 1) + '. ' + p.join(', ')).join('\\n');
            }
          };

          $('calculateBtn').addEventListener('click', calculatePermutations);
        })();
      </script>
    `;
  }
};