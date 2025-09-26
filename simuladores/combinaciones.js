export default {
  render: (params, simName = 'Combinaciones') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
            <div>
              <label for="${id_base}_type"><b>Tipo de Combinación:</b></label>
              <select id="${id_base}_type" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
                <option value="sin_repeticion" selected>Sin Repetición</option>
                <option value="con_repeticion">Con Repetición</option>
              </select>
            </div>
            <div>
              <label for="${id_base}_set"><b>Conjunto de datos</b> (separados por coma):</label>
              <input type="text" id="${id_base}_set" value="a, b, c, d" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
            </div>
            <div>
              <label for="${id_base}_r"><b>Agrupar en (r):</b></label>
              <input type="number" id="${id_base}_r" value="2" min="0" style="width: 80px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
            </div>
          </div>
          <button class="btn-sim" id="${id_base}_calculateBtn" style="width: 100%; margin-top: 1rem;">Calcular Combinaciones</button>

          <hr style="margin: 1.5rem 0;">

          <h3>Fórmula y Resultado</h3>
          <div id="${id_base}_formula" style="font-size: 1.2em; text-align: center; margin: 1rem 0; color: #333; overflow-x: auto;"></div>
          
          <h3>Combinaciones Posibles:</h3>
          <pre id="${id_base}_results" style="background-color: #fff; border: 1px solid #eee; padding: 1em; border-radius: 6px; max-height: 300px; overflow-y: auto; white-space: pre-wrap;"></pre>

        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);
          const DISPLAY_LIMIT = 1000;

          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';

            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ${simName}';
              btn.classList.add('btn-sim-rojo');
              calculate();
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ${simName}';
              btn.classList.remove('btn-sim-rojo');
            }
          };

          const factorial = (n) => {
            if (n < 0) return NaN;
            if (n > 20) return Infinity;
            if (n === 0) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) { result *= i; }
            return result;
          };
          
          const getCombinations = (arr, r) => {
              const result = [];
              function generate(startIndex, currentCombo) {
                  if (currentCombo.length === r) { result.push([...currentCombo]); return; }
                  for (let i = startIndex; i < arr.length; i++) {
                      currentCombo.push(arr[i]);
                      generate(i + 1, currentCombo);
                      currentCombo.pop();
                  }
              }
              generate(0, []);
              return result;
          };

          const getCombinationsWithRepetition = (arr, r) => {
              const result = [];
              function generate(startIndex, currentCombo) {
                  if (currentCombo.length === r) { result.push([...currentCombo]); return; }
                  for (let i = startIndex; i < arr.length; i++) {
                      currentCombo.push(arr[i]);
                      generate(i, currentCombo);
                      currentCombo.pop();
                  }
              }
              generate(0, []);
              return result;
          };

          const calculate = () => {
            const type = $('type').value;
            const setDataRaw = $('set').value.split(',').map(s => s.trim()).filter(Boolean);
            const dataSet = [...new Set(setDataRaw)];
            const n = dataSet.length;
            const r = parseInt($('r').value, 10);

            const formulaDiv = $('formula');
            const resultsDiv = $('results');
            
            let total, formulaTex, combinations;

            if (type === 'sin_repeticion') {
                if (isNaN(r) || r < 0 || r > n) {
                    formulaDiv.textContent = 'Error: Para combinaciones sin repetición, "r" debe ser un número entre 0 y n.';
                    resultsDiv.textContent = '';
                    return;
                }
                total = factorial(n) / (factorial(r) * factorial(n - r));
                formulaTex = 'C_{' + n + '}^{' + r + '} = \\\\frac{' + n + '!}{' + r + '!(' + n + '-' + r + ')' + '!} = ' + total.toLocaleString();
                if (total <= DISPLAY_LIMIT) {
                    combinations = getCombinations(dataSet, r);
                }
            } else { // con_repeticion
                if (isNaN(r) || r < 0 || n === 0) {
                    formulaDiv.textContent = 'Error: Ingresa datos válidos (n>0 y r>=0).';
                    resultsDiv.textContent = '';
                    return;
                }
                const m = n + r - 1;
                total = factorial(m) / (factorial(r) * factorial(n - 1));
                formulaTex = 'CR_{' + n + '}^{' + r + '} = C_{' + n + '+' + r + '-1}^{' + r + '} = C_{' + m + '}^{' + r + '} = ' + total.toLocaleString();
                if (total <= DISPLAY_LIMIT) {
                    combinations = getCombinationsWithRepetition(dataSet, r);
                }
            }

            formulaDiv.innerHTML = '\\\\(' + formulaTex + '\\\\)';
            if (window.MathJax?.typesetPromise) {
              MathJax.typesetPromise([formulaDiv]);
            }

            if (total > DISPLAY_LIMIT) {
              resultsDiv.textContent = 'Hay ' + total.toLocaleString() + ' combinaciones.\\nEs demasiado para mostrar en pantalla (límite: ' + DISPLAY_LIMIT + ').';
            } else {
              resultsDiv.textContent = combinations.map((c, i) => (i + 1) + '. ' + c.join(', ')).join('\\n');
            }
          };

          $('calculateBtn').addEventListener('click', calculate);
          $('type').addEventListener('change', calculate); // Se actualiza al cambiar el tipo
          $('set').addEventListener('input', calculate);   // Se actualiza al escribir en el conjunto
          $('r').addEventListener('input', calculate);      // Se actualiza al cambiar r
        })();
      </script>
    `;
  }
};