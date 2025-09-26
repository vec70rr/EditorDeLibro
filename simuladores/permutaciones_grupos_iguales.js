export default {
  render: (params, simName = 'Permutaciones con Grupos de Objetos Iguales') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label for="${id_base}_set"><b>Conjunto de datos</b> (incluye los elementos repetidos, separados por coma):</label>
              <input type="text" id="${id_base}_set" value="a, b, b" placeholder="Ej: a, b, b, c, c, c" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
            </div>
            <button class="btn-sim" id="${id_base}_calculateBtn">Calcular Permutaciones</button>
          </div>

          <hr style="margin: 1.5rem 0;">

          <h3>Fórmula y Resultado</h3>
          <div id="${id_base}_formula" style="font-size: 1.5em; text-align: center; margin: 1rem 0; color: #333; overflow-x: auto;"></div>
          
          <h3>Permutaciones Distintas:</h3>
          <pre id="${id_base}_results" style="background-color: #fff; border: 1px solid #eee; padding: 1em; border-radius: 6px; max-height: 300px; overflow-y: auto; white-space: pre-wrap;"></pre>

        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);
          const DISPLAY_LIMIT_N = 8; // Límite de n para mostrar resultados (8! es grande)

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
            if (n > 20) return Infinity;
            if (n === 0) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) { result *= i; }
            return result;
          };
          
          const getMultisetPermutations = (arr) => {
              const result = [];
              const n = arr.length;
              const freqMap = arr.reduce((acc, item) => {
                  acc[item] = (acc[item] || 0) + 1;
                  return acc;
              }, {});
              const uniqueElements = Object.keys(freqMap);

              function generate(current) {
                  if (current.length === n) {
                      result.push(current.slice());
                      return;
                  }
                  for (const element of uniqueElements) {
                      if (freqMap[element] > 0) {
                          freqMap[element]--;
                          current.push(element);
                          generate(current);
                          current.pop(); // Backtrack
                          freqMap[element]++; // Backtrack
                      }
                  }
              }
              generate([]);
              return result;
          };

          const calculatePermutations = () => {
            const dataSet = $('set').value.split(',').map(s => s.trim()).filter(Boolean);
            const n = dataSet.length;

            const formulaDiv = $('formula');
            const resultsDiv = $('results');
            
            if (n === 0) {
              formulaDiv.textContent = 'Por favor, ingresa un conjunto de datos.';
              resultsDiv.textContent = '';
              return;
            }

            // 1. Calcular frecuencias y la fórmula
            const freqMap = dataSet.reduce((acc, item) => { acc[item] = (acc[item] || 0) + 1; return acc; }, {});
            const repetitions = Object.values(freqMap).filter(count => count > 1);
            
            let denominatorFactorials = 1;
            repetitions.forEach(count => { denominatorFactorials *= factorial(count); });
            
            const totalPermutations = factorial(n) / denominatorFactorials;

            const superscripts = repetitions.join(',');
            const denominatorTex = repetitions.map(r => r + '!').join('');
            const formulaTex = 'P_{' + n + '}^{' + superscripts + '} = \\\\frac{' + n + '!}{' + denominatorTex + '} = ' + totalPermutations.toLocaleString();
            formulaDiv.innerHTML = '\\\\(' + formulaTex + '\\\\)';
            
            if (window.MathJax?.typesetPromise) {
              MathJax.typesetPromise([formulaDiv]).catch(err => console.error("Error en MathJax:", err));
            }

            // 2. Generar y mostrar las permutaciones (con límite)
            if (n > DISPLAY_LIMIT_N) {
              resultsDiv.textContent = 'Hay ' + totalPermutations.toLocaleString() + ' permutaciones.\\nEl conjunto es demasiado grande para mostrar la lista (límite n=' + DISPLAY_LIMIT_N + ').';
            } else {
              const permutations = getMultisetPermutations(dataSet);
              resultsDiv.textContent = permutations.map((p, i) => (i + 1) + '. ' + p.join(', ')).join('\\n');
            }
          };

          $('calculateBtn').addEventListener('click', calculatePermutations);
        })();
      </script>
    `;
  }
};