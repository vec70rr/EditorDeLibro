export default {
  render: (params, simName = 'Simulador: Espacio muestral (L/R) y eventos') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <h3 style="margin:0 0 10px 0;">${simName}</h3>

          <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end;">
            <div>
              <label><b>Número de vehículos (n)</b>:</label><br>
              <input id="${id_base}_n" type="number" min="1" max="12" value="3" style="width:90px;">
              <small style="opacity:.8; display:block;">Ejemplo: n=3</small>
            </div>

            <div>
              <label><b>Probabilidad de R</b> (por vehículo):</label><br>
              <input id="${id_base}_pR" type="number" min="0" max="1" step="0.01" value="0.50" style="width:110px;">
              <small style="opacity:.8; display:block;">p(R)=0.50 por defecto</small>
            </div>

            <div>
              <label><b>Simulaciones</b>:</label><br>
              <input id="${id_base}_trials" type="number" min="1" max="20000" value="200" style="width:110px;">
              <small style="opacity:.8; display:block;">Para frecuencias</small>
            </div>

            <div>
              <label><b>Evento</b>:</label><br>
              <select id="${id_base}_event" style="width:310px;">
                <option value="E1">E1: { LLL... } (todos a la izquierda)</option>
                <option value="E2">E2: { LRR... } (solo el primero a la izquierda)</option>
                <option value="A">A: exactamente 1 gira a la derecha</option>
                <option value="B">B: cuando mucho 1 gira a la derecha</option>
                <option value="C">C: todos giran en la misma dirección (todo L o todo R)</option>
                <option value="CUSTOM">Personalizado (filtro por # de R)</option>
              </select>
            </div>

            <div id="${id_base}_customBox" style="display:none; min-width:240px;">
              <label><b>Personalizado:</b> # de R</label><br>
              <select id="${id_base}_customType" style="width:160px;">
                <option value="eq">=</option>
                <option value="le">≤</option>
                <option value="ge">≥</option>
              </select>
              <input id="${id_base}_customK" type="number" min="0" value="1" style="width:70px;">
            </div>

            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button id="${id_base}_genS">Generar S</button>
              <button id="${id_base}_rand">Tirar 1 vez</button>
              <button id="${id_base}_run">Simular N veces</button>
              <button id="${id_base}_clear">Limpiar</button>
            </div>
          </div>

          <div style="margin-top:10px; display:flex; gap:12px; flex-wrap:wrap;">
            <div style="flex:1; min-width:360px;">
              <div style="background:#fff; border:1px solid #ddd; border-radius:10px; padding:10px;">
                <b>Espacio muestral S</b> <span style="opacity:.8;">(tamaño: <span id="${id_base}_sizeS">-</span>)</span>
                <div id="${id_base}_Sgrid" style="margin-top:8px; display:flex; flex-wrap:wrap; gap:8px;"></div>
              </div>
            </div>

            <div style="width:360px; min-width:300px;">
              <div style="background:#fff; border:1px solid #ddd; border-radius:10px; padding:10px;">
                <b>Resultado observado</b>
                <div style="margin-top:8px; font-family:Consolas, monospace; font-size:18px;">
                  <span id="${id_base}_obs">—</span>
                </div>

                <div style="margin-top:10px;">
                  <b>¿Ocurre el evento?</b>
                  <div id="${id_base}_hit" style="margin-top:6px; font-weight:bold;">—</div>
                </div>

                <hr style="margin:10px 0;">

                <b>Teoría (conteos)</b>
                <div style="margin-top:6px; font-size:14px; line-height:1.35;">
                  <div>|S| = 2<sup>n</sup> = <span id="${id_base}_theoryS">—</span></div>
                  <div>|Evento| = <span id="${id_base}_theoryE">—</span></div>
                  <div>P(Evento) (equiprobable) = |E|/|S| = <span id="${id_base}_theoryP">—</span></div>
                </div>

                <hr style="margin:10px 0;">

                <b>Simulación (frecuencia)</b>
                <div style="margin-top:6px; font-size:14px; line-height:1.35;">
                  <div>Hits = <span id="${id_base}_hits">0</span> / <span id="${id_base}_total">0</span></div>
                  <div>Frecuencia ≈ <span id="${id_base}_freq">—</span></div>
                  <small style="opacity:.8;">(usa p(R) si no es 0.5)</small>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top:10px;">
            <pre id="${id_base}_log" style="background:#f4f4f4; padding:10px; max-height:220px; overflow:auto; border-radius:8px;"></pre>
          </div>
        </div>
      </div>

      <script>
        (function () {
          const id = '${id_base}';
          const $ = (x) => document.getElementById(id + '_' + x);

          // Toggle estándar
          window['toggleSim_' + id] = function () {
            const c = $('container');
            const b = $('btn');
            if (c.style.display === 'none') {
              c.style.display = 'block';
              b.textContent = 'Ocultar ${simName}';
              b.classList.add('btn-sim-rojo');
            } else {
              c.style.display = 'none';
              b.textContent = 'Abrir ${simName}';
              b.classList.remove('btn-sim-rojo');
            }
          };

          // Estado
          let hits = 0;
          let total = 0;
          let S_cache = [];
          let lastObs = '';

          function logLine(s) {
            const el = $('log');
            el.textContent += (el.textContent ? '\\n' : '') + s;
            el.scrollTop = el.scrollHeight;
          }
          function clearAll() {
            $('log').textContent = '';
            $('Sgrid').innerHTML = '';
            $('sizeS').textContent = '-';
            $('obs').textContent = '—';
            $('hit').textContent = '—';
            $('theoryS').textContent = '—';
            $('theoryE').textContent = '—';
            $('theoryP').textContent = '—';
            hits = 0; total = 0;
            $('hits').textContent = '0';
            $('total').textContent = '0';
            $('freq').textContent = '—';
            S_cache = [];
            lastObs = '';
          }

          function getN() {
            const n = parseInt($('n').value, 10);
            return Math.max(1, Math.min(12, isNaN(n) ? 3 : n));
          }

          function getPR() {
            let p = parseFloat($('pR').value);
            if (isNaN(p)) p = 0.5;
            if (p < 0) p = 0;
            if (p > 1) p = 1;
            return p;
          }

          function genAllOutcomes(n) {
            // 2^n outcomes L/R
            const res = [];
            const total = 1 << n;
            for (let mask = 0; mask < total; mask++) {
              let s = '';
              for (let i = 0; i < n; i++) {
                // bit i -> decide L/R (orden izquierda a derecha)
                const bit = (mask >> (n - 1 - i)) & 1;
                s += bit ? 'R' : 'L';
              }
              res.push(s);
            }
            return res;
          }

          function renderOutcomePill(text, active=false, inEvent=false) {
            const div = document.createElement('div');
            div.textContent = text;
            div.style.fontFamily = 'Consolas, monospace';
            div.style.padding = '6px 10px';
            div.style.borderRadius = '999px';
            div.style.border = '1px solid #ddd';
            div.style.background = active ? '#e8f0ff' : (inEvent ? '#e9ffe8' : '#fff');
            div.style.cursor = 'pointer';
            div.title = 'Click para seleccionar este resultado';
            div.onclick = () => {
              lastObs = text;
              $('obs').textContent = text;
              const ok = checkEvent(text, getN());
              paintHit(ok);
              highlightS();
              logLine('Seleccionado: ' + text + ' | Evento: ' + (ok ? 'SÍ' : 'NO'));
            };
            return div;
          }

          function countR(outcome) {
            let c = 0;
            for (const ch of outcome) if (ch === 'R') c++;
            return c;
          }

          function checkEvent(outcome, n) {
            const ev = $('event').value;

            if (ev === 'E1') {
              // todos L
              return outcome === 'L'.repeat(n);
            }
            if (ev === 'E2') {
              // solo primero L y los demás R: LRRR...
              return outcome === ('L' + 'R'.repeat(n - 1));
            }
            if (ev === 'A') {
              // exactamente 1 R
              return countR(outcome) === 1;
            }
            if (ev === 'B') {
              // cuando mucho 1 R
              return countR(outcome) <= 1;
            }
            if (ev === 'C') {
              // todos misma dirección: todo L o todo R
              return outcome === 'L'.repeat(n) || outcome === 'R'.repeat(n);
            }
            // CUSTOM: filtro por #R
            const k = parseInt($('customK').value, 10) || 0;
            const type = $('customType').value;
            const r = countR(outcome);
            if (type === 'eq') return r === k;
            if (type === 'le') return r <= k;
            return r >= k; // ge
          }

          function theoryCounts(n) {
            const sizeS = 2 ** n;
            // contar |E| recorriendo S_cache (si existe) o generando
            const S = S_cache.length ? S_cache : genAllOutcomes(n);
            let sizeE = 0;
            for (const o of S) if (checkEvent(o, n)) sizeE++;
            const pEquip = sizeE / sizeS;
            return { sizeS, sizeE, pEquip };
          }

          function paintHit(ok) {
            $('hit').textContent = ok ? '✅ Sí ocurre' : '❌ No ocurre';
          }

          function updateSimStats() {
            $('hits').textContent = String(hits);
            $('total').textContent = String(total);
            $('freq').textContent = total ? (hits / total).toFixed(4) : '—';
          }

          function highlightS() {
            // re-render grid with highlight for lastObs and in-event
            const n = getN();
            if (!S_cache.length) return;
            $('Sgrid').innerHTML = '';
            for (const o of S_cache) {
              const active = (o === lastObs);
              const inEvent = checkEvent(o, n);
              $('Sgrid').appendChild(renderOutcomePill(o, active, inEvent));
            }
          }

          function generateS() {
            const n = getN();
            S_cache = genAllOutcomes(n);

            $('sizeS').textContent = String(S_cache.length);
            highlightS();

            const t = theoryCounts(n);
            $('theoryS').textContent = String(t.sizeS);
            $('theoryE').textContent = String(t.sizeE);
            $('theoryP').textContent = t.pEquip.toFixed(4);

            logLine('Generado S para n=' + n + ': ' + S_cache.length + ' resultados.');
            logLine('Tip: Verde = pertenece al evento. Azul = seleccionado.');
          }

          function randomOutcome(n, pR) {
            let s = '';
            for (let i = 0; i < n; i++) {
              s += (Math.random() < pR) ? 'R' : 'L';
            }
            return s;
          }

          function oneTrial() {
            const n = getN();
            const pR = getPR();
            const obs = randomOutcome(n, pR);
            lastObs = obs;
            $('obs').textContent = obs;

            const ok = checkEvent(obs, n);
            paintHit(ok);

            total++;
            if (ok) hits++;
            updateSimStats();

            if (S_cache.length) highlightS();

            logLine('Tiro: ' + obs + ' | Evento: ' + (ok ? 'SÍ' : 'NO') + ' | p(R)=' + pR.toFixed(2));
          }

          function runTrials() {
            const t = Math.max(1, Math.min(20000, parseInt($('trials').value, 10) || 200));
            logLine('--- Simulando ' + t + ' veces ---');
            for (let i = 0; i < t; i++) oneTrial();
            logLine('--- Fin simulación ---');
          }

          function onEventChange() {
            const ev = $('event').value;
            $('customBox').style.display = (ev === 'CUSTOM') ? 'block' : 'none';
            // Recalcula teoría y recolorea
            const n = getN();
            if (S_cache.length) {
              const t = theoryCounts(n);
              $('theoryE').textContent = String(t.sizeE);
              $('theoryP').textContent = t.pEquip.toFixed(4);
              highlightS();
              logLine('Evento cambiado. Se actualizó la teoría y el coloreado.');
            }
            if (lastObs) {
              const ok = checkEvent(lastObs, n);
              paintHit(ok);
            }
          }

          // Eventos UI
          $('genS').onclick = generateS;
          $('rand').onclick = oneTrial;
          $('run').onclick = runTrials;
          $('clear').onclick = clearAll;

          $('event').onchange = onEventChange;
          $('customType').onchange = onEventChange;
          $('customK').oninput = onEventChange;
          $('n').oninput = () => {
            // actualizar teoría y S si ya existe
            if (S_cache.length) generateS();
          };

          // Inicio: pre-genera S para que se parezca al ejemplo 2.5
          generateS();
          logLine('Listo. Prueba con n=3 para ver {LLL, LLR, ..., RRR} como el ejemplo.');

        })();
      </script>
    `;
  }
};
