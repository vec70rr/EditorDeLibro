export default {
  render: (params, simName = 'Ejemplo 2.2') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <!-- ===== INTERFAZ DEL SIMULADOR EJEMPLO 2.2 ===== -->
          <div style="font-family: Arial, sans-serif; padding:10px;">
            <h3>Ejemplo 2.2 – Tres fusibles</h3>

            <p>
              Se examinan tres fusibles, uno tras otro, y cada uno se clasifica como
              no defectuoso (N) o defectuoso (D). Un resultado es una secuencia de tres letras.
            </p>

            <div id="${id_base}_sampleSpaceInfo"
                 style="background:#e3f2fd; border-left:4px solid #1976d2;
                        padding:8px; margin-bottom:10px; font-size:0.9rem;">
              Espacio muestral:<br>
              <strong>S = {NNN, NND, NDN, NDD, DNN, DND, DDN, DDD}</strong>
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
                    <th style="border:1px solid #ddd; padding:4px;">Secuencia</th>
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

          // ------- LÓGICA DEL SIMULADOR EJEMPLO 2.2 --------------
          const outcomes = [
            { seq: 'NNN', desc: 'Los tres fusibles no defectuosos' },
            { seq: 'NND', desc: 'Dos no defectuosos, el tercero defectuoso' },
            { seq: 'NDN', desc: 'No, defectuoso, no' },
            { seq: 'NDD', desc: 'No, defectuoso, defectuoso' },
            { seq: 'DNN', desc: 'Defectuoso, no, no' },
            { seq: 'DND', desc: 'Defectuoso, no, defectuoso' },
            { seq: 'DDN', desc: 'Defectuoso, defectuoso, no' },
            { seq: 'DDD', desc: 'Los tres fusibles defectuosos' }
          ];

          let counts = {};
          outcomes.forEach(o => counts[o.seq] = 0);

          const lastResultBox = $('lastResult');
          const tableBody     = $('tableBody');
          const totalTrialsEl = $('totalTrials');

          function randomSequence() {
            let s = '';
            for (let i = 0; i < 3; i++) {
              s += (Math.random() < 0.5) ? 'N' : 'D';
            }
            return s;
          }

          function simulateOnce() {
            const seq = randomSequence();
            counts[seq] += 1;
            updateTable();
            const obj = outcomes.find(o => o.seq === seq);
            updateLastResult(obj || { seq, desc: 'Secuencia ' + seq });
          }

          function simulateMany(n) {
            if (!Number.isFinite(n) || n <= 0) return;
            let lastSeq = null;
            for (let i = 0; i < n; i++) {
              const seq = randomSequence();
              counts[seq] += 1;
              lastSeq = seq;
            }
            updateTable();
            if (lastSeq) {
              const obj = outcomes.find(o => o.seq === lastSeq);
              updateLastResult(obj || { seq: lastSeq, desc: 'Secuencia ' + lastSeq });
            }
          }

          function updateLastResult(outcome) {
            if (!outcome) {
              lastResultBox.innerHTML = 'Último resultado: <strong>—</strong>';
            } else {
              lastResultBox.innerHTML =
                'Último resultado: <strong>' + outcome.seq +
                '</strong> (' + outcome.desc + ')';
            }
          }

          function updateTable() {
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            totalTrialsEl.textContent = total;
            tableBody.innerHTML = '';
            outcomes.forEach(o => {
              const c = counts[o.seq] || 0;
              const freq = total > 0 ? (c / total).toFixed(3) : '0.000';
              const tr = document.createElement('tr');
              tr.innerHTML =
                '<td style="border:1px solid #ddd; padding:4px;">' + o.seq + '</td>' +
                '<td style="border:1px solid #ddd; padding:4px;">' + o.desc + '</td>' +
                '<td style="border:1px solid #ddd; padding:4px;">' + c + '</td>' +
                '<td style="border:1px solid #ddd; padding:4px;">' + freq + '</td>';
              tableBody.appendChild(tr);
            });
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
            outcomes.forEach(o => counts[o.seq] = 0);
            updateTable();
            updateLastResult(null);
          });

          // Estado inicial
          updateTable();
          updateLastResult(null);
          // ------- FIN LÓGICA SIMULADOR EJEMPLO 2.2 --------------
        })();
      </script>
    `;
  }
};
