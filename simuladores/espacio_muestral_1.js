export default {
  render: (params, simName = 'Ejemplo 2.1') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <!-- ===== INTERFAZ DEL SIMULADOR EJEMPLO 2.1 ===== -->
          <div style="font-family: Arial, sans-serif; padding:10px;">
            <h3>Ejemplo 2.1 – Espacio muestral</h3>

            <div style="margin-bottom:8px;">
              <label for="${id_base}_experiment"><strong>Experimento:</strong></label>
              <select id="${id_base}_experiment">
                <option value="interruptor">Prueba de interruptor (S = {N, D})</option>
                <option value="tachuela">Lanzamiento de tachuela (S = {U, D})</option>
                <option value="sexo">Sexo de recién nacido (S = {H, M})</option>
              </select>
            </div>

            <div id="${id_base}_sampleSpaceInfo"
                 style="background:#e3f2fd; border-left:4px solid #1976d2;
                        padding:8px; margin-bottom:10px; font-size:0.9rem;">
            </div>

            <div style="margin-bottom:10px;">
              <button id="${id_base}_btnOnce">Simular una vez</button>

              <span style="margin-left:10px;">
                Simular
                <input type="number" id="${id_base}_numTrials" min="1" value="10" style="width:70px;" />
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
              <table style="width:100%; border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="border:1px solid #ddd; padding:4px;">Resultado</th>
                    <th style="border:1px solid #ddd; padding:4px;">Descripción</th>
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

          // ====== FUNCIÓN DE MOSTRAR / OCULTAR (PLANTILLA) ======
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

          // ------------- LÓGICA DEL SIMULADOR --------------------
          const experiments = {
            interruptor: {
              name: 'Prueba de interruptor',
              description: 'Se prueba un interruptor para decidir si está defectuoso o no.',
              sampleSpace: 'S = {N, D}',
              outcomes: [
                { symbol: 'N', desc: 'No defectuoso' },
                { symbol: 'D', desc: 'Defectuoso' }
              ]
            },
            tachuela: {
              name: 'Lanzamiento de tachuela',
              description: 'Se lanza una tachuela y se observa la posición final.',
              sampleSpace: 'S = {U, D}',
              outcomes: [
                { symbol: 'U', desc: 'Punta hacia arriba' },
                { symbol: 'D', desc: 'Punta hacia abajo' }
              ]
            },
            sexo: {
              name: 'Sexo de recién nacido',
              description: 'Se registra el sexo de un recién nacido.',
              sampleSpace: 'S = {H, M}',
              outcomes: [
                { symbol: 'H', desc: 'Hombre' },
                { symbol: 'M', desc: 'Mujer' }
              ]
            }
          };

          let currentExperimentKey = 'interruptor';
          let counts = {};

          const sampleSpaceInfo = $('sampleSpaceInfo');
          const lastResultBox   = $('lastResult');
          const tableBody       = $('tableBody');
          const totalTrialsEl   = $('totalTrials');

          function initExperiment(key) {
            currentExperimentKey = key;
            const exp = experiments[key];

            sampleSpaceInfo.innerHTML =
              '<strong>' + exp.name + '</strong><br>' +
              exp.description + '<br>' +
              'Espacio muestral: <strong>' + exp.sampleSpace + '</strong>';

            counts = {};
            exp.outcomes.forEach(o => counts[o.symbol] = 0);
            updateTable();
            updateLastResult(null);
          }

          function randomOutcome() {
            const exp = experiments[currentExperimentKey];
            const idx = Math.floor(Math.random() * exp.outcomes.length);
            return exp.outcomes[idx];
          }

          function simulateOnce() {
            const outcome = randomOutcome();
            counts[outcome.symbol] += 1;
            updateTable();
            updateLastResult(outcome);
          }

          function simulateMany(n) {
            if (!Number.isFinite(n) || n <= 0) return;
            for (let i = 0; i < n; i++) {
              const outcome = randomOutcome();
              counts[outcome.symbol] += 1;
              if (i === n - 1) updateLastResult(outcome);
            }
            updateTable();
          }

          function updateLastResult(outcome) {
            if (!outcome) {
              lastResultBox.innerHTML = 'Último resultado: <strong>—</strong>';
            } else {
              lastResultBox.innerHTML =
                'Último resultado: <strong>' + outcome.symbol +
                '</strong> (' + outcome.desc + ')';
            }
          }

          function updateTable() {
            const exp = experiments[currentExperimentKey];
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            totalTrialsEl.textContent = total;

            tableBody.innerHTML = '';
            exp.outcomes.forEach(o => {
              const c = counts[o.symbol] || 0;
              const freq = total > 0 ? (c / total).toFixed(3) : '0.000';
              const tr = document.createElement('tr');
              tr.innerHTML =
                '<td style="border:1px solid #ddd; padding:4px;">' + o.symbol + '</td>' +
                '<td style="border:1px solid #ddd; padding:4px;">' + o.desc + '</td>' +
                '<td style="border:1px solid #ddd; padding:4px;">' + c + '</td>' +
                '<td style="border:1px solid #ddd; padding:4px;">' + freq + '</td>';
              tableBody.appendChild(tr);
            });
          }

          // Eventos
          $('experiment').addEventListener('change', (e) => {
            initExperiment(e.target.value);
          });

          $('btnOnce').addEventListener('click', () => {
            simulateOnce();
          });

          $('btnMany').addEventListener('click', () => {
            const n = parseInt($('numTrials').value, 10);
            simulateMany(n);
          });

          $('btnReset').addEventListener('click', () => {
            initExperiment(currentExperimentKey);
          });

          // Inicializar simulador
          initExperiment('interruptor');
          // ------------- FIN LÓGICA SIMULADOR --------------------
        })();
      </script>
    `;
  }
};
