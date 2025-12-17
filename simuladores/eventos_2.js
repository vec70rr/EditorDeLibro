export default {
  render: (params, simName = 'Simulador: Gasolinerías (0..m) y eventos A, B, C') => {
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
              <label><b>Bombas por gasolinería (m)</b>:</label><br>
              <input id="${id_base}_m" type="number" min="1" max="30" value="6" style="width:90px;">
              <small style="opacity:.8; display:block;">Resultados: (x,y), x,y ∈ [0..m]</small>
            </div>

            <div>
              <label><b>Evento</b>:</label><br>
              <select id="${id_base}_event" style="width:360px;">
                <option value="A">A: mismo # de bombas en uso (x = y)</option>
                <option value="B">B: total de bombas en uso = t (x + y = t)</option>
                <option value="C">C: a lo sumo 1 bomba en uso en cada gasolinera (x ≤ 1 y y ≤ 1)</option>
                <option value="CUSTOM">Personalizado (filtro por x,y o x+y)</option>
              </select>
            </div>

            <div id="${id_base}_boxT" style="display:none;">
              <label><b>t</b> (para x+y=t):</label><br>
              <input id="${id_base}_t" type="number" min="0" value="4" style="width:90px;">
            </div>

            <div id="${id_base}_boxCustom" style="display:none; min-width:380px;">
              <label><b>Personalizado</b>:</label><br>
              <select id="${id_base}_customType" style="width:210px;">
                <option value="sum_eq">x + y = k</option>
                <option value="sum_le">x + y ≤ k</option>
                <option value="sum_ge">x + y ≥ k</option>
                <option value="x_eq">x = k</option>
                <option value="y_eq">y = k</option>
                <option value="x_le">x ≤ k</option>
                <option value="y_le">y ≤ k</option>
              </select>
              <input id="${id_base}_k" type="number" min="0" value="4" style="width:90px;">
            </div>

            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button id="${id_base}_genS">Generar S</button>
              <button id="${id_base}_pick">Elegir (x,y)</button>
              <button id="${id_base}_clear">Limpiar</button>
            </div>
          </div>

          <div style="margin-top:10px; display:flex; gap:12px; flex-wrap:wrap;">
            <div style="flex:1; min-width:420px;">
              <div style="background:#fff; border:1px solid #ddd; border-radius:10px; padding:10px;">
                <b>Espacio muestral S</b> <span style="opacity:.8;">(|S| = (m+1)² = <span id="${id_base}_sizeS">-</span>)</span>
                <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                  <small style="opacity:.8;">Verde = pertenece al evento | Azul = seleccionado</small>
                </div>
                <div id="${id_base}_grid" style="margin-top:10px; display:grid; gap:6px;"></div>
              </div>
            </div>

            <div style="width:360px; min-width:320px;">
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
                  <div>|S| = (m+1)² = <span id="${id_base}_theoryS">—</span></div>
                  <div>|Evento| = <span id="${id_base}_theoryE">—</span></div>
                  <div>P(Evento) (equiprobable) = |E|/|S| = <span id="${id_base}_theoryP">—</span></div>
                </div>

                <hr style="margin:10px 0;">

                <b>Definición del evento</b>
                <div id="${id_base}_edef" style="margin-top:6px; font-size:14px; line-height:1.35; opacity:.95;"></div>
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
          let S_cache = [];
          let last = null; // {x,y}

          function logLine(s) {
            const el = $('log');
            el.textContent += (el.textContent ? '\\n' : '') + s;
            el.scrollTop = el.scrollHeight;
          }

          function clearAll() {
            $('log').textContent = '';
            $('grid').innerHTML = '';
            $('sizeS').textContent = '-';
            $('theoryS').textContent = '—';
            $('theoryE').textContent = '—';
            $('theoryP').textContent = '—';
            $('obs').textContent = '—';
            $('hit').textContent = '—';
            $('edef').textContent = '';
            S_cache = [];
            last = null;
          }

          function getM() {
            const m = parseInt($('m').value, 10);
            return Math.max(1, Math.min(30, isNaN(m) ? 6 : m));
          }

          function eventDef(m) {
            const ev = $('event').value;
            if (ev === 'A') return 'A = { (x,y) : x = y },  x,y ∈ [0..m]';
            if (ev === 'B') {
              const t = parseInt($('t').value, 10) || 0;
              return 'B = { (x,y) : x + y = ' + t + ' },  x,y ∈ [0..m]';
            }
            if (ev === 'C') return 'C = { (x,y) : x ≤ 1 y y ≤ 1 },  x,y ∈ [0..m]';
            // CUSTOM
            const k = parseInt($('k').value, 10) || 0;
            const type = $('customType').value;
            const map = {
              sum_eq: 'x + y = ' + k,
              sum_le: 'x + y ≤ ' + k,
              sum_ge: 'x + y ≥ ' + k,
              x_eq:   'x = ' + k,
              y_eq:   'y = ' + k,
              x_le:   'x ≤ ' + k,
              y_le:   'y ≤ ' + k
            };
            return 'E = { (x,y) : ' + (map[type] || ('x + y = ' + k)) + ' },  x,y ∈ [0..m]';
          }

          function inEvent(x, y, m) {
            const ev = $('event').value;

            if (ev === 'A') return x === y;

            if (ev === 'B') {
              const t = parseInt($('t').value, 10) || 0;
              return (x + y) === t;
            }

            if (ev === 'C') return x <= 1 && y <= 1;

            // CUSTOM
            const k = parseInt($('k').value, 10) || 0;
            const type = $('customType').value;

            if (type === 'sum_eq') return (x + y) === k;
            if (type === 'sum_le') return (x + y) <= k;
            if (type === 'sum_ge') return (x + y) >= k;
            if (type === 'x_eq') return x === k;
            if (type === 'y_eq') return y === k;
            if (type === 'x_le') return x <= k;
            if (type === 'y_le') return y <= k;

            return (x + y) === k;
          }

          function genS(m) {
            const res = [];
            for (let x = 0; x <= m; x++) {
              for (let y = 0; y <= m; y++) {
                res.push({ x, y });
              }
            }
            return res;
          }

          function theoryCounts(m) {
            const sizeS = (m + 1) * (m + 1);
            const S = S_cache.length ? S_cache : genS(m);
            let sizeE = 0;
            for (const p of S) if (inEvent(p.x, p.y, m)) sizeE++;
            return { sizeS, sizeE, p: sizeE / sizeS };
          }

          function pill(text, active, isIn) {
            const d = document.createElement('div');
            d.textContent = text;
            d.style.fontFamily = 'Consolas, monospace';
            d.style.textAlign = 'center';
            d.style.padding = '6px 0';
            d.style.borderRadius = '10px';
            d.style.border = '1px solid #ddd';
            d.style.cursor = 'pointer';
            d.style.background = active ? '#e8f0ff' : (isIn ? '#e9ffe8' : '#fff');
            d.title = 'Click para seleccionar ' + text;
            return d;
          }

          function renderGrid() {
            const m = getM();
            if (!S_cache.length) return;

            // Grid: (m+2) cols (header + y values)
            const cols = m + 2;
            $('grid').style.gridTemplateColumns = 'repeat(' + cols + ', minmax(42px, 1fr))';
            $('grid').innerHTML = '';

            // Header row
            $('grid').appendChild(pill('x\\y', false, false));
            for (let y = 0; y <= m; y++) $('grid').appendChild(pill(String(y), false, false));

            // Rows
            for (let x = 0; x <= m; x++) {
              $('grid').appendChild(pill(String(x), false, false));
              for (let y = 0; y <= m; y++) {
                const isIn = inEvent(x, y, m);
                const active = last && last.x === x && last.y === y;
                const cell = pill('(' + x + ',' + y + ')', active, isIn);
                cell.onclick = () => selectPoint(x, y);
                $('grid').appendChild(cell);
              }
            }
          }

          function selectPoint(x, y) {
            const m = getM();
            last = { x, y };
            $('obs').textContent = '(' + x + ',' + y + ')';
            const ok = inEvent(x, y, m);
            $('hit').textContent = ok ? '✅ Sí ocurre' : '❌ No ocurre';
            renderGrid();
            logLine('Seleccionado: (' + x + ',' + y + ') | Evento: ' + (ok ? 'SÍ' : 'NO'));
          }

          function generateAll() {
            const m = getM();
            S_cache = genS(m);

            $('sizeS').textContent = String((m + 1) * (m + 1));
            $('edef').textContent = eventDef(m);

            const t = theoryCounts(m);
            $('theoryS').textContent = String(t.sizeS);
            $('theoryE').textContent = String(t.sizeE);
            $('theoryP').textContent = t.p.toFixed(4);

            renderGrid();
            logLine('Generado S para m=' + m + ' → ' + t.sizeS + ' resultados (0..m, 0..m).');
            logLine('Verde = pertenece al evento, Azul = seleccionado.');
          }

          function pickPrompt() {
            const m = getM();
            const s = prompt('Ingresa (x,y) con 0..' + m + ' (ej: 3,4):', '2,2');
            if (!s) return;
            const parts = s.split(',').map(v => parseInt(v.trim(), 10));
            if (parts.length !== 2 || parts.some(v => isNaN(v))) {
              alert('Formato inválido. Usa: x,y');
              return;
            }
            const x = parts[0], y = parts[1];
            if (x < 0 || y < 0 || x > m || y > m) {
              alert('Fuera de rango. Debe ser 0..' + m);
              return;
            }
            selectPoint(x, y);
          }

          function onEventChange() {
            const ev = $('event').value;
            $('boxT').style.display = (ev === 'B') ? 'block' : 'none';
            $('boxCustom').style.display = (ev === 'CUSTOM') ? 'block' : 'none';

            // recalcula teoría y re-render si ya existe S
            if (S_cache.length) {
              const m = getM();
              $('edef').textContent = eventDef(m);
              const t = theoryCounts(m);
              $('theoryE').textContent = String(t.sizeE);
              $('theoryP').textContent = t.p.toFixed(4);
              renderGrid();
              logLine('Evento actualizado: ' + eventDef(m));
              if (last) selectPoint(last.x, last.y);
            }
          }

          // UI events
          $('genS').onclick = generateAll;
          $('pick').onclick = pickPrompt;
          $('clear').onclick = clearAll;

          $('event').onchange = onEventChange;
          $('t').oninput = onEventChange;
          $('customType').onchange = onEventChange;
          $('k').oninput = onEventChange;
          $('m').oninput = () => { if (S_cache.length) generateAll(); };

          // Inicio como el ejemplo: m=6 y eventos listos
          generateAll();
          logLine('Listo. Prueba Evento A (diagonal), Evento B con t=4, o Evento C (zona 0/1).');

        })();
      </script>
    `;
  }
};
