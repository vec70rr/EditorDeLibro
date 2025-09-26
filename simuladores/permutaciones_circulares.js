export default {
  render: (params, simName = 'Permutaciones Circulares') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label for="${id_base}_set"><b>Conjunto de datos</b> (elementos únicos separados por coma):</label>
              <input type="text" id="${id_base}_set" value="a, b, c, d" placeholder="Ej: a, b, c, d" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
            </div>
            <button class="btn-sim" id="${id_base}_calculateBtn">Calcular Permutaciones</button>
          </div>

          <hr style="margin: 1.5rem 0;">

          <h3>Fórmula y Resultado</h3>
          <div id="${id_base}_formula" style="font-size: 1.5em; text-align: center; margin: 1rem 0; color: #333; overflow-x: auto;"></div>
          
          <h3>Representación Gráfica:</h3>
          <div id="${id_base}_graphicContainer" style="display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:20px; min-height:150px; background-color: #f8f9fa; border-radius: 8px; padding: 1rem;">
            <p id="${id_base}_graphicMessage">Ingresa elementos y haz clic en calcular para ver el gráfico.</p>
          </div>
          
          <h3>Permutaciones Distintas:</h3>
          <pre id="${id_base}_results" style="background-color: #fff; border: 1px solid #eee; padding: 1em; border-radius: 6px; max-height: 300px; overflow-y: auto; white-space: pre-wrap;"></pre>

        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);
          const GRAPHIC_PERMUTATION_LIMIT = 10; // Límite de permutaciones para graficar
          const RESULTS_LIST_LIMIT = 7; // Límite de n para listar

          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';

            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ${simName}';
              btn.classList.add('btn-sim-rojo');
              calculateCircularPermutations();
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

          const getSimplePermutations = (arr) => {
              const result = [];
              function generate(current, remaining) {
                  if (remaining.length === 0) { result.push(current); return; }
                  for (let i = 0; i < remaining.length; i++) {
                      const newRemaining = remaining.slice(0, i).concat(remaining.slice(i + 1));
                      generate(current.concat(remaining[i]), newRemaining);
                  }
              }
              generate([], arr);
              return result;
          };

          const calculateCircularPermutations = () => {
            const setDataRaw = $('set').value.split(',').map(s => s.trim()).filter(Boolean);
            const dataSet = [...new Set(setDataRaw)];
            const n = dataSet.length;

            const formulaDiv = $('formula');
            const resultsDiv = $('results');
            const graphicContainer = $('graphicContainer');
            
            if (n === 0) {
              formulaDiv.textContent = 'Por favor, ingresa un conjunto de datos.';
              resultsDiv.textContent = '';
              graphicContainer.innerHTML = '<p>Ingresa elementos para ver el gráfico.</p>';
              return;
            }

            const totalPermutations = n > 0 ? factorial(n - 1) : 0;
            const formulaTex = 'PC_{' + n + '} = (' + n + '-1)! = ' + (n - 1) + '! = ' + totalPermutations.toLocaleString();
            formulaDiv.innerHTML = '\\\\(' + formulaTex + '\\\\)';
            
            if (window.MathJax?.typesetPromise) {
              MathJax.typesetPromise([formulaDiv]);
            }

            // --- LÓGICA DE GRÁFICOS Y RESULTADOS ACTUALIZADA ---
            let circularPermutations = [];
            if (n > 0 && n <= RESULTS_LIST_LIMIT) {
                const linearPermutations = getSimplePermutations(dataSet.slice(1));
                const fixedElement = dataSet[0];
                circularPermutations = linearPermutations.map(p => [fixedElement, ...p]);
                resultsDiv.textContent = circularPermutations.map((p, i) => (i + 1) + '. ' + p.join(', ')).join('\\n');
            } else {
                resultsDiv.textContent = 'Hay ' + totalPermutations.toLocaleString() + ' permutaciones circulares.\\nEl conjunto es demasiado grande para mostrar la lista (límite n=' + RESULTS_LIST_LIMIT + ').';
            }

            graphicContainer.innerHTML = '';
            if (n > 0 && totalPermutations <= GRAPHIC_PERMUTATION_LIMIT) {
                const createCircleSVG = (elements) => {
                    let svg = '<svg width="150" height="150" viewBox="0 0 150 150">';
                    svg += '<circle cx="75" cy="75" r="60" stroke="#ccc" stroke-width="1" fill="none" stroke-dasharray="4"/>';
                    const angleStep = (2 * Math.PI) / elements.length;
                    elements.forEach((el, i) => {
                        const angle = i * angleStep;
                        const x = 75 + 60 * Math.sin(angle);
                        const y = 75 - 60 * Math.cos(angle);
                        svg += '<circle cx="' + x + '" cy="' + y + '" r="12" fill="#004080" stroke="white" stroke-width="2"/>';
                        svg += '<text x="' + x + '" y="' + y + '" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="white" font-weight="bold">' + el + '</text>';
                    });
                    svg += '</svg>';
                    return svg;
                };

                // Generar un SVG para cada permutación circular
                let allSvgs = '';
                for (const perm of circularPermutations) {
                    allSvgs += createCircleSVG(perm);
                }
                graphicContainer.innerHTML = allSvgs;
            } else {
                graphicContainer.innerHTML = '<p style="text-align:center;">Hay demasiadas permutaciones (' + totalPermutations + ') para representarlas gráficamente (límite: 10).</p>';
            }
          };

          $('calculateBtn').addEventListener('click', calculateCircularPermutations);
        })();
      </script>
    `;
  }
};