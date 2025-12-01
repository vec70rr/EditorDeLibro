export default {
  render: (params, simName = 'Ejemplo 2.4') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <!-- ===== INTERFAZ DEL SIMULADOR EJEMPLO 2.4 ===== -->
          <div style="font-family: Arial, sans-serif; padding:10px;">
            <h3>Ejemplo 2.4 – Baterías tipo D</h3>

            <p>
              Se prueban baterías tipo D una por una hasta encontrar la primera cuyo voltaje
              esté dentro de los límites. Si <strong>F</strong> significa "falla" y
              <strong>E</strong> "éxito", un resultado posible es
              <strong>FFE</strong> (las dos primeras fallan y la tercera es satisfactoria).
            </p>

            <div id="${id_base}_sampleSpaceInfo"
                 style="background:#e3f2fd; border-left:4px solid #1976d2;
                        padding:8px; margin-bottom:10px; font-size:0.9rem;">
              Espacio muestral:
              <strong>S = {E, FE, FFE, FFFE, ...}</strong>, que contiene un número infinito de resultados.
            </div>

            <div style="margin-bottom:8px;">
              <label for="${id_base}_prob"><strong>Probabilidad de éxito de una batería (E):</strong></label>
              <input type="number" id="${id_base}_prob" min="0" max="1" step="0.05" value="0.5"
                     style="width:80px; margin-left:6px;" />
              <span>(F tiene probabilidad 1 - p)</span>
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
                    <th style="border:1px solid #ddd; padding:4px;">Secuencia</th>
                    <th style="border:1px solid #ddd; padding:4px;">Interpretación</th>
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

          // -------- LÓGICA DEL SIMULADOR EJEMPLO 2.4 -------------
          let counts = {};   // { secuencia: conteo }

          const lastResultBox = $('lastResult');
          const tableBody     = $('tableBody');
          const totalTrialsEl = $('totalTrials');

          function getProbSuccess() {
            const p = parseFloat($('prob').value);
            if (!Number.isFinite(p) || p <= 0) return 0.5;
            if (p >= 1) return 0.999; // evitar bucles enormes
            return p;
          }

          // Genera una secuencia tipo E, FE, FFE, ... hasta el primer éxito
          function simulateSequence() {
            const p = getProbSuccess();
            let seq = '';
            let safety = 1000; // límite de seguridad por si p ~ 0

            while (safety-- > 0) {
              // éxito con probabilidad p
              const isSuccess = Math.random() < p;
              seq += isSuccess ? 'E' : 'F';
              if (isSuccess) break;
            }
            return seq;
          }

          function addResult(seq) {
            if (!counts[seq]) counts[seq] = 0;
            counts[seq] += 1;
          }

          function simulateOnce() {
            const seq = simulateSequence();
            addResult(seq);
            updateTable();
            updateLastResult(seq);
          }

          function simulateMany(n) {
            if (!Number.isFinite(n) || n <= 0) return;
            let lastSeq = null;
            for (let k = 0; k < n; k++) {
              lastSeq = simulateSequence();
              addResult(lastSeq);
            }
            updateTable();
            if (lastSeq) updateLastResult(lastSeq);
          }

          function interpretation(seq) {
            const fails = seq.length - 1;
            return fails === 0
              ? 'Primera batería exitosa'
              : fails + ' falla' + (fails > 1 ? 's' : '') + ' antes del primer éxito';
          }

          function updateLastResult(seq) {
            lastResultBox.innerHTML =
              'Último resultado: <strong>' + seq +
              '</strong> — ' + interpretation(seq);
          }

          function updateTable() {
            const entries = Object.entries(counts); // [ [seq, c], ... ]
            const total = entries.reduce((acc, [_, c]) => acc + c, 0);
            totalTrialsEl.textContent = total;

            tableBody.innerHTML = '';
            // ordenar por longitud de la secuencia y luego alfabéticamente
            entries.sort((a, b) => {
              if (a[0].length !== b[0].length) return a[0].length - b[0].length;
              return a[0].localeCompare(b[0]);
            });

            for (const [seq, c] of entries) {
              const freq = total > 0 ? (c / total).toFixed(3) : '0.000';
              const tr = document.createElement('tr');
              tr.innerHTML =
                '<td style="border:1px solid #ddd; padding:4px;">' + seq + '</td>' +
                '<td style="border:1px solid #ddd; padding:4px;">' + interpretation(seq) + '</td>' +
                '<td style="border:1px solid #ddd; padding:4px;">' + c + '</td>' +
                '<td style="border:1px solid #ddd; padding:4px;">' + freq + '</td>';
              tableBody.appendChild(tr);
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
            counts = {};
            updateTable();
            lastResultBox.innerHTML = 'Último resultado: <strong>—</strong>';
          });

          // Estado inicial
          updateTable();
          lastResultBox.innerHTML = 'Último resultado: <strong>—</strong>';
          // -------- FIN LÓGICA SIMULADOR EJEMPLO 2.4 -------------
        })();
      </script>
    `;
  }
};
