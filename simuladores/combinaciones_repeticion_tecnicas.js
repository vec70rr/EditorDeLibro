export default {
  render: (params, simName = 'Simulador: Combinaciones con repetición') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <h3 style="margin-top:0;">${simName}</h3>

          <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:flex-end;">
            <div style="min-width:280px;">
              <label><b>Elementos</b> (separados por coma):</label><br>
              <input id="${id_base}_elems" type="text" value="a,b,c" style="width:100%;">
              <small style="opacity:.8;">Ej: a,b,c</small>
            </div>

            <div>
              <label><b>Orden r</b> (se pueden repetir):</label><br>
              <input id="${id_base}_r" type="number" value="3" min="0" style="width:90px">
              <small style="opacity:.8; display:block;">r ≥ 0</small>
            </div>

            <div>
              <label><b>Modo</b>:</label><br>
              <select id="${id_base}_mode" style="width:220px">
                <option value="r">Generar orden r</option>
                <option value="all">Generar todos (0..r)</option>
              </select>
            </div>

            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button id="${id_base}_gen">Generar</button>
              <button id="${id_base}_step_btn" disabled>Siguiente (paso)</button>
              <button id="${id_base}_clear">Limpiar</button>
            </div>
          </div>

          <div style="margin-top:10px; display:flex; gap:18px; flex-wrap:wrap; align-items:center;">
            <label style="user-select:none;">
              <input id="${id_base}_step" type="checkbox">
              <b>Modo paso a paso</b>
            </label>

            <label style="user-select:none;">
              <input id="${id_base}_show_multiset" type="checkbox" checked>
              <b>Mostrar como multiconjunto</b> (a×2, b×1)
            </label>

            <label><b>Límite de salida</b>:</label>
            <input id="${id_base}_limit" type="number" value="500" min="10" max="20000" style="width:110px">
            <small style="opacity:.8;">Evita congelamientos</small>
          </div>

          <p id="${id_base}_info" style="font-weight:bold; margin:10px 0 6px;"></p>

          <div style="display:flex; gap:14px; flex-wrap:wrap;">
            <div style="flex:1; min-width:320px;">
              <pre id="${id_base}_out"
                   style="background:#f4f4f4; padding:10px; max-height:320px; overflow:auto; border-radius:8px;"></pre>
            </div>

            <div style="width:320px; min-width:280px;">
              <div style="background:#fff; border:1px solid #ddd; border-radius:10px; padding:10px;">
                <b>Teoría rápida</b>
                <div style="margin-top:8px; font-size:14px; line-height:1.35;">
                  <div>En <b>combinaciones con repetición</b> puedes repetir elementos y <b>no importa el orden</b>.</div>
                  <div style="margin-top:8px;">
                    Cantidad:
                    <div style="font-family:Consolas, monospace; margin-top:4px;">
                      CR(n,r) = C(n + r - 1, r)
                    </div>
                  </div>
                  <div style="margin-top:8px; opacity:.9;">
                    Ej: con a,b,c (n=3) y r=2 → C(4,2)=6:
                    <div style="font-family:Consolas, monospace; margin-top:4px;">
                      aa, ab, ac, bb, bc, cc
                    </div>
                  </div>
                </div>
              </div>

              <div style="margin-top:10px; background:#fff; border:1px solid #ddd; border-radius:10px; padding:10px;">
                <b>Mini-reto</b>
                <div style="margin-top:8px; font-size:14px;">
                  Cambia a elementos <b>1,2,3,4</b> y r=<b>3</b>.  
                  ¿Cuántas salen? (Se mostrará en “CR(n,r)”.)
                </div>
              </div>
            </div>
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

          // Utilidades
          function parseElems() {
            return $('elems').value
              .split(',')
              .map(s => s.trim())
              .filter(s => s.length > 0);
          }

          // nCk exacto (BigInt)
          function nCk(n, k) {
            if (k < 0 || k > n) return 0n;
            k = Math.min(k, n - k);
            let num = 1n, den = 1n;
            for (let i = 1; i <= k; i++) {
              num *= BigInt(n - (i - 1));
              den *= BigInt(i);
            }
            return num / den;
          }

          // CR(n,r)=C(n+r-1,r)
          function combConRep(n, r) {
            if (n <= 0) return 0n;
            if (r < 0) return 0n;
            return nCk(n + r - 1, r);
          }

          // Genera combinaciones con repetición (no importa orden) como secuencias no-decrecientes de índices
          function genCombRep(elems, r, startIdx, actualIdxs, outArr, limit) {
            if (outArr.length >= limit) return;
            if (actualIdxs.length === r) {
              outArr.push(actualIdxs.slice());
              return;
            }
            for (let i = startIdx; i < elems.length; i++) {
              actualIdxs.push(i);
              genCombRep(elems, r, i, actualIdxs, outArr, limit); // i (no i+1) => permite repetición
              actualIdxs.pop();
              if (outArr.length >= limit) return;
            }
          }

          function formatAsString(elems, idxs) {
            // "aab" o "1,1,3" (pero estilo libro: concatenado)
            return idxs.map(i => elems[i]).join('');
          }

          function formatAsMultiset(elems, idxs) {
            // a×2, b×1, c×0 (solo no-cero)
            const counts = new Map();
            for (const i of idxs) counts.set(i, (counts.get(i) || 0) + 1);
            const parts = [];
            [...counts.keys()].sort((a,b)=>a-b).forEach(i => {
              const c = counts.get(i);
              parts.push(elems[i] + '×' + c);
            });
            return '{ ' + parts.join(', ') + ' }';
          }

          // Buffer para paso a paso
          let buffer = [];
          let stepIndex = 0;

          function setInfo(text) {
            $('info').textContent = text;
          }
          function setOut(text) {
            $('out').textContent = text;
          }
          function appendOut(line) {
            $('out').textContent += ( $('out').textContent ? '\\n' : '' ) + line;
            $('out').scrollTop = $('out').scrollHeight;
          }

          function clearAll() {
            buffer = [];
            stepIndex = 0;
            setInfo('');
            setOut('');
          }

          function generar() {
            clearAll();

            const elems = parseElems();
            const n = elems.length;
            const r = parseInt($('r').value, 10);
            const mode = $('mode').value;
            const limit = Math.max(10, Math.min(20000, parseInt($('limit').value, 10) || 500));
            const showMultiset = $('show_multiset').checked;

            if (n === 0) { alert('Ingresa al menos 1 elemento.'); return; }
            if (r < 0) { alert('r debe ser ≥ 0'); return; }

            const paso = $('step').checked;
            $('step_btn').disabled = !paso;

            const lines = [];
            const addComboLine = (idxs) => {
              const s1 = formatAsString(elems, idxs);
              if (showMultiset) {
                const ms = formatAsMultiset(elems, idxs);
                lines.push(s1.padEnd(10, ' ') + '  ' + ms);
              } else {
                lines.push(s1);
              }
            };

            const totalCR = (rr) => combConRep(n, rr);

            if (mode === 'r') {
              const total = totalCR(r);
              setInfo(\`n=\${n}, r=\${r}  →  CR(n,r)=C(n+r-1,r)=\${total.toString()}\`);

              const idxCombos = [];
              genCombRep(elems, r, 0, [], idxCombos, limit);

              if (!paso) {
                if (idxCombos.length === 0 && r === 0) {
                  setOut('(La combinación vacía)');
                  return;
                }
                for (const idxs of idxCombos) addComboLine(idxs);

                if (idxCombos.length >= limit && total > BigInt(limit)) {
                  lines.push('');
                  lines.push(\`(Mostrando solo \${limit} de \${total.toString()} resultados)\`);
                }
                setOut(lines.join('\\n'));
              } else {
                buffer = [];
                buffer.push(\`(Paso a paso) Listo. Presiona "Siguiente (paso)". Total = \${total.toString()}\`);
                for (const idxs of idxCombos) {
                  const s1 = formatAsString(elems, idxs);
                  buffer.push(showMultiset ? (s1.padEnd(10,' ') + '  ' + formatAsMultiset(elems, idxs)) : s1);
                }
                if (idxCombos.length >= limit && total > BigInt(limit)) {
                  buffer.push('');
                  buffer.push(\`(Mostrando solo \${limit} de \${total.toString()} resultados)\`);
                }
                setOut(buffer[0]);
                stepIndex = 1;
              }

            } else {
              // all: 0..r
              // Nota: r=0 => solo combinación vacía
              let suma = 0n;
              for (let rr = 0; rr <= r; rr++) suma += totalCR(rr);

              setInfo(\`n=\${n}, órdenes 0..r (r=\${r}) → Total = \${suma.toString()}\`);

              if (!paso) {
                for (let rr = 0; rr <= r; rr++) {
                  const total = totalCR(rr);
                  lines.push(\`=== Orden \${rr}  (CR=\${total.toString()}) ===\`);

                  const idxCombos = [];
                  genCombRep(elems, rr, 0, [], idxCombos, limit);

                  if (rr === 0) {
                    lines.push('(vacía)');
                    lines.push('');
                    continue;
                  }

                  for (const idxs of idxCombos) addComboLine(idxs);

                  if (idxCombos.length >= limit && total > BigInt(limit)) {
                    lines.push(\`(Mostrando solo \${limit} de \${total.toString()} resultados)\`);
                  }
                  lines.push('');
                }
                setOut(lines.join('\\n'));
              } else {
                buffer = [];
                buffer.push(\`(Paso a paso) Listo. Presiona "Siguiente (paso)". Total 0..r = \${suma.toString()}\`);
                for (let rr = 0; rr <= r; rr++) {
                  const total = totalCR(rr);
                  buffer.push(\`=== Orden \${rr}  (CR=\${total.toString()}) ===\`);

                  const idxCombos = [];
                  genCombRep(elems, rr, 0, [], idxCombos, limit);

                  if (rr === 0) {
                    buffer.push('(vacía)');
                    continue;
                  }
                  for (const idxs of idxCombos) {
                    const s1 = formatAsString(elems, idxs);
                    buffer.push(showMultiset ? (s1.padEnd(10,' ') + '  ' + formatAsMultiset(elems, idxs)) : s1);
                  }
                  if (idxCombos.length >= limit && total > BigInt(limit)) {
                    buffer.push(\`(Mostrando solo \${limit} de \${total.toString()} resultados)\`);
                  }
                  buffer.push('');
                }
                setOut(buffer[0]);
                stepIndex = 1;
              }
            }
          }

          function siguientePaso() {
            if (!$('step').checked) return;
            if (!buffer || buffer.length === 0) {
              alert('Primero presiona "Generar".');
              return;
            }
            if (stepIndex >= buffer.length) {
              appendOut('(Fin) Ya no hay más resultados.');
              return;
            }
            // Si estaba solo el mensaje inicial, lo reemplazamos por salida acumulada
            if (stepIndex === 1) {
              setOut(buffer[0] + '\\n\\n' + buffer[1]);
            } else {
              appendOut(buffer[stepIndex]);
            }
            stepIndex++;
          }

          // Eventos
          $('gen').onclick = generar;
          $('step_btn').onclick = siguientePaso;
          $('clear').onclick = clearAll;

          $('step').addEventListener('change', () => {
            $('step_btn').disabled = !$('step').checked;
            // no regeneramos automáticamente, pero limpiamos buffer para evitar confusión
            buffer = [];
            stepIndex = 0;
          });

        })();
      </script>
    `;
  }
};
