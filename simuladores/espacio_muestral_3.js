export default {
  render: (params, simName = 'Ejemplo 2.3') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <!-- ===== INTERFAZ DEL SIMULADOR EJEMPLO 2.3 ===== -->
          <div style="font-family: Arial, sans-serif; padding:10px;">
            <h3>Ejemplo 2.3 – Bombas en dos gasolinerías</h3>

            <p>
              Dos gasolinerías están en una misma intersección y cada una tiene seis bombas.
              En cierta hora del día se registran cuántas bombas están en uso en cada gasolinería.
              Un resultado es un par ordenado (i, j), donde i es el número de bombas en uso en la
              primera gasolinería y j en la segunda (i, j = 0, 1, ..., 6).
            </p>

            <div id="${id_base}_sampleSpaceInfo"
                 style="background:#e3f2fd; border-left:4px solid #1976d2;
                        padding:8px; margin-bottom:10px; font-size:0.9rem;">
              Espacio muestral: todos los pares (i, j) con i, j = 0, 1, ..., 6 (49 resultados posibles).
            </div>

            <div style="margin-bottom:10px;">
              <button id="${id_base}_btnOnce">Simular una vez</button>

              <span style="margin-left:10px;">
                Simular
                <input type="number" id="${id_base}_numTrials" min="1" value="20" style="width:70px;" />
                veces
              </span>

              <button id="${id_base}_btnMany" style="margin-left:10px;">Ejecutar</button>
              <button id="${id_base}_btnReset" style="margin-left:10px;">Reiniciar</button>
            </div>

            <div id="${id_base}_lastResult"
                 style="background:#fffde7; border-left:4px solid #fbc02d;
                        padding:8px; margin-bottom:10px;">
              Último resultado: <strong>—</strong>
            </div>

            <div>
              <h4>Resultados acumulados</h4>
              <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
                <thead>
                  <tr>
                    <th style="border:1px solid #ddd; padding:4px;">i</th>
                    <th style="border:1px solid #ddd; padding:4px;">j</th>
                    <th style="border:1px solid #ddd; padding:4px;">Conteo</th>
                    <th style="border:1px solid #ddd; padding:4px;">Frecuencia relativa</th>
                  </tr>
                </thead>
                <tbody id="${id_base}_tableBody"></tbody>
              </table>
              <p>Total de simulaciones: <span id="${id_base}_totalTrials">0</span></p>
            </div>
          </div>
          <!-- ===== FIN INTERFAZ SIMULADOR ===== -->
        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);

          // ====== FUNCIÓN MOSTRAR/OCULTAR (MISMA PLANTILLA) ======
          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none' || container.style.display === '';
            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ' + '${simName}';
              btn.classList.add('btn-sim-rojo');
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ' + '${simName}';
              btn.classList.remove('btn-sim-rojo');
            }
          };
          // =======================================================

          // -------- LÓGICA DEL SIMULADOR EJEMPLO 2.3 -------------
          const maxBombas = 6;
          let counts = {};

          function initCounts() {
            counts = {};
            for (let i = 0; i <= maxBombas; i++) {
              for (let j = 0; j <= maxBombas; j++) {
                counts[i + ',' + j] = 0;
              }
            }
          }

          initCounts();

          const lastResultBox = $('lastResult');
          const tableBody     = $('tableBody');
          const totalTrialsEl = $('totalTrials');

          function randomPair() {
            const i = Math.floor(Math.random() * (maxBombas + 1));
            const j = Math.floor(Math.random() * (maxBombas + 1));
            return { i, j };
          }

          function simulateOnce() {
            const { i, j } = randomPair();
            counts[i + ',' + j] += 1;
            updateTable();
            updateLastResult(i, j);
          }

          function simulateMany(n) {
            if (!Number.isFinite(n) || n <= 0) return;
            let last = null;
            for (let k = 0; k < n; k++) {
              last = randomPair();
              counts[last.i + ',' + last.j] += 1;
            }
            updateTable();
            if (last) updateLastResult(last.i, last.j);
          }

          function updateLastResult(i, j) {
            lastResultBox.innerHTML =
              'Último resultado: <strong>(' + i + ', ' + j +
              ')</strong> — ' +
              i + ' bombas en la primera gasolinería, ' +
              j + ' en la segunda.';
          }

          function updateTable() {
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            totalTrialsEl.textContent = total;
            tableBody.innerHTML = '';

            for (let i = 0; i <= maxBombas; i++) {
              for (let j = 0; j <= maxBombas; j++) {
                const key = i + ',' + j;
                const c   = counts[key] || 0;
                const freq = total > 0 ? (c / total).toFixed(3) : '0.000';
                const tr = document.createElement('tr');
                tr.innerHTML =
                  '<td style="border:1px solid #ddd; padding:4px;">' + i + '</td>' +
                  '<td style="border:1px solid #ddd; padding:4px;">' + j + '</td>' +
                  '<td style="border:1px solid #ddd; padding:4px;">' + c + '</td>' +
                  '<td style="border:1px solid #ddd; padding:4px;">' + freq + '</td>';
                tableBody.appendChild(tr);
              }
            }
          }

          // Eventos
          $('btnOnce').addEventListener('click', () => {
            simulateOnce();
          });

          $('btnMany').addEventListener('click', () => {
            const n = parseInt($('numTrials').value, 10);
            simulateMany(n);
          });

          $('btnReset').addEventListener('click', () => {
            initCounts();
            updateTable();
            lastResultBox.innerHTML = 'Último resultado: <strong>—</strong>';
          });

          // Estado inicial
          updateTable();
          lastResultBox.innerHTML = 'Último resultado: <strong>—</strong>';
          // -------- FIN LÓGICA SIMULADOR EJEMPLO 2.3 -------------
        })();
      </script>
    `;
  }
};
