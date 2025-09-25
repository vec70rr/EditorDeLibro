export default {
  render: (params, simName = 'Ordenaciones sin Repetición') => {
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
              <input type="text" id="${id_base}_set" value="A, B, C, D" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
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
          <pre id="${id_base}_results" style="background-color: #fff; border: 1px solid #eee; padding: 1em; border-radius: 6px; max-height: 300px; overflow-y: auto;"></pre>

        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);

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

          const factorial = (n) => {
            if (n < 0) return NaN;
            if (n === 0) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) { result *= i; }
            return result;
          };
          
          const getPermutations = (arr, r) => {
              const result = [];
              function generate(current, remaining) {
                  if (current.length === r) {
                      result.push(current);
                      return;
                  }
                  for (let i = 0; i < remaining.length; i++) {
                      const newRemaining = remaining.slice(0, i).concat(remaining.slice(i + 1));
                      generate(current.concat(remaining[i]), newRemaining);
                  }
              }
              generate([], arr);
              return result;
          };

          const calculatePermutations = () => {
            const setDataRaw = $('set').value.split(',').map(s => s.trim()).filter(Boolean);
            const dataSet = [...new Set(setDataRaw)];
            const n = dataSet.length;
            const r = parseInt($('r').value, 10);

            const formulaDiv = $('formula');
            const resultsDiv = $('results');

            if (isNaN(r) || r < 0 || r > n) {
              formulaDiv.textContent = 'Error: "r" debe ser un número entre 0 y el total de elementos (n).';
              resultsDiv.textContent = '';
              return;
            }

            // --- LÍNEAS CORREGIDAS ---
            const totalPermutations = factorial(n) / factorial(n - r);
            const formulaTex = 'O_{' + n + '}^{' + r + '} = \\\\frac{' + n + '!}{(' + n + '-' + r + ')!} = \\\\frac{' + factorial(n).toLocaleString() + '}{' + factorial(n-r).toLocaleString() + '} = ' + totalPermutations.toLocaleString();
            formulaDiv.innerHTML = '\\\\(' + formulaTex + '\\\\)';
            
            if (window.MathJax?.typesetPromise) {
              MathJax.typesetPromise([formulaDiv]).catch(err => console.error("Error en MathJax:", err));
            }

            const permutations = getPermutations(dataSet, r);
            resultsDiv.textContent = permutations.map((p, i) => (i + 1) + '. ' + p.join(', ')).join('\\n');
          };

          $('calculateBtn').addEventListener('click', calculatePermutations);
        })();
      </script>
    `;
  }
};