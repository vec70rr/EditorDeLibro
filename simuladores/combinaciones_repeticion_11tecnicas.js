export default {
  render: (params, simName = 'Simulador Ejemplo 27: Comités por composición (H/M)') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <div style="display:flex; flex-wrap:wrap; gap:14px; align-items:flex-start;">

            <!-- Panel de explicación + controles -->
            <div style="flex: 1 1 360px; min-width: 300px; padding:12px; border:1px solid #e5e7eb; border-radius:12px; background:#fff;">
              <h3 style="margin:0 0 8px 0;">Ejemplo 27 (Combinaciones con repetición)</h3>
              <p style="margin:0 0 10px 0; line-height:1.35;">
                En una escuela mixta (hombres y mujeres), se formará un comité de tamaño <b>r</b>.
                ¿Cuántas composiciones posibles <b>(hombres, mujeres)</b> existen?
              </p>

              <div style="padding:10px; border-radius:10px; background:#f8fafc; border:1px solid #e5e7eb; line-height:1.5;">
                <div><b>Idea:</b> solo importa la <b>composición</b>, no quiénes son.</div>
                <div>Buscamos el número de soluciones enteras no negativas a:</div>
                <div style="text-align:center; font-weight:700; margin:6px 0;">h + m = r</div>
                <div>Eso equivale a combinaciones con repetición:</div>
                <div style="text-align:center; font-weight:700; margin:6px 0;">
                  \\( CR_2^r = C_{2+r-1}^r = C_{r+1}^r = r+1 \\)
                </div>
              </div>

              <label style="display:block; margin-top:12px;">
                <b>r (tamaño del comité):</b>
                <span id="${id_base}_rVal" style="margin-left:6px;">5</span>
              </label>
              <input id="${id_base}_r" type="range" min="1" max="25" value="5" style="width:100%;" />

              <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
                <label style="display:flex; align-items:center; gap:6px;">
                  <input id="${id_base}_showAll" type="checkbox" checked />
                  Mostrar tabla completa (h,m)
                </label>
                <label style="display:flex; align-items:center; gap:6px;">
                  <input id="${id_base}_animate" type="checkbox" checked />
                  Animar composición
                </label>
                <label style="display:flex; align-items:center; gap:6px;">
                  <input id="${id_base}_showLabels" type="checkbox" checked />
                  Etiquetas
                </label>
              </div>

              <div style="margin-top:12px; padding:10px; border-radius:10px; background:#f8fafc; border:1px solid #e5e7eb;">
                <div style="font-size:14px;"><b id="${id_base}_formulaTxt">CR(2,5)=C(6,5)=6</b></div>
                <div id="${id_base}_plainTxt" style="margin-top:6px; opacity:.95;">
                  Resultado: hay <b>6</b> composiciones distintas (h,m).
                </div>
                <div id="${id_base}_identityTxt" style="margin-top:6px; opacity:.9;">
                  Verificación rápida: r+1 = 6 ✅
                </div>
              </div>

              <!-- Tabla -->
              <div id="${id_base}_tableWrap" style="margin-top:12px; display:block;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                  <b>Composiciones posibles</b>
                  <span style="font-size:12px; opacity:.8;">(hombres, mujeres)</span>
                </div>
                <div id="${id_base}_table" style="margin-top:8px; max-height:260px; overflow:auto; border:1px solid #e5e7eb; border-radius:12px; background:#fff;"></div>
              </div>
            </div>

            <!-- Panel gráfico principal -->
            <div style="flex: 2 1 560px; min-width: 320px; padding:12px; border:1px solid #e5e7eb; border-radius:12px; background:#fff;">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
                <h3 style="margin:0;">Visualización de composiciones</h3>
                <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                  <button id="${id_base}_prev" class="btn-sim">◀</button>
                  <button id="${id_base}_play" class="btn-sim">▶ Reproducir</button>
                  <button id="${id_base}_next" class="btn-sim">▶</button>
                  <button id="${id_base}_rand" class="btn-sim btn-sim-rojo">🎲 Aleatorio</button>
                </div>
              </div>

              <canvas id="${id_base}_canvas" width="900" height="420"
                style="width:100%; height:420px; margin-top:10px; border-radius:12px; border:1px solid #eef2f7; background:#f8fafc;"></canvas>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; gap:10px; flex-wrap:wrap;">
                <div id="${id_base}_caption" style="font-size:13px; opacity:.9;">r=5 | composición #1 de 6</div>
                <div id="${id_base}_pair" style="font-weight:700;">h=0, m=5</div>
              </div>

              <div style="margin-top:10px; padding:10px; border:1px solid #e5e7eb; border-radius:12px; background:#fff;">
                <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                  <div style="flex:1; min-width:220px;">
                    <b>Comparación:</b> suma fija<br/>
                    <span style="opacity:.85;">Cada composición cumple</span> <b>h + m = r</b>.
                  </div>
                  <div style="flex:1; min-width:220px;">
                    <b>Interpretación:</b> “estrellas y barras”<br/>
                    <span style="opacity:.85;">Distribuir</span> <b>r</b> <span style="opacity:.85;">alumnos entre</span> <b>2</b> <span style="opacity:.85;">categorías.</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel de experimento / mini simulación -->
            <div style="flex: 1 1 360px; min-width: 300px; padding:12px; border:1px solid #e5e7eb; border-radius:12px; background:#fff;">
              <h3 style="margin:0 0 8px 0;">Mini simulación</h3>
              <p style="margin:0 0 10px 0; line-height:1.35;">
                Genera comités aleatorios (solo composición) y mira cómo aparecen las <b>r+1</b> composiciones.
              </p>

              <label style="display:block;"><b>Repeticiones:</b></label>
              <input id="${id_base}_trials" type="number" min="1" max="2000" value="200" style="width:100%; padding:8px; border-radius:10px; border:1px solid #e5e7eb;" />

              <div style="display:flex; gap:10px; margin-top:10px;">
                <button id="${id_base}_run" class="btn-sim" style="flex:1;">Simular</button>
                <button id="${id_base}_reset" class="btn-sim btn-sim-rojo" style="flex:1;">Reiniciar</button>
              </div>

              <canvas id="${id_base}_hist" width="900" height="220"
                style="width:100%; height:220px; margin-top:10px; border-radius:12px; border:1px solid #eef2f7; background:#f8fafc;"></canvas>

              <div id="${id_base}_histCaption" style="margin-top:8px; font-size:13px; opacity:.9;">
                Histograma de frecuencias (por composición).
              </div>
            </div>

          </div>

          <div style="margin-top:12px; font-size:12px; opacity:.8;">
            Fórmula del ejemplo: \\( CR_2^5 = C_{2+5-1}^5 = C_6^5 = \\dfrac{6!}{5!(6-5)!} = 6 \\).
            Generalizando: \\( CR_2^r = C_{r+1}^r = r+1 \\).
          </div>
        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);

          // ---- Toggle (misma estructura) ----
          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';
            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ' + simName;
              btn.classList.add('btn-sim-rojo');
              initOnce();
              updateAll();
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ' + simName;
              btn.classList.remove('btn-sim-rojo');
              stopPlay();
            }
          };

          // ---- Math (BigInt) ----
          function nCkBig(n, k) {
            if (k < 0 || k > n) return 0n;
            if (k === 0 || k === n) return 1n;
            k = Math.min(k, n - k);
            let num = 1n, den = 1n;
            for (let i = 1; i <= k; i++) {
              num *= BigInt(n - (k - i));
              den *= BigInt(i);
            }
            return num / den;
          }
          function formatBigInt(x) {
            const s = x.toString();
            let out = '';
            let cnt = 0;
            for (let i = s.length - 1; i >= 0; i--) {
              out = s[i] + out;
              cnt++;
              if (cnt === 3 && i !== 0) { out = ' ' + out; cnt = 0; }
            }
            return out;
          }

          // ---- Estado ----
          let initialized = false;
          let index = 0;       // 0..r (representa h)
          let timer = null;

          // Histograma
          let counts = [];

          function initOnce() {
            if (initialized) return;
            initialized = true;

            $('r').addEventListener('input', () => { index = 0; updateAll(); });
            $('showAll').addEventListener('change', updateAll);
            $('animate').addEventListener('change', () => { if (!$('animate').checked) stopPlay(); });
            $('showLabels').addEventListener('change', updateAll);

            $('prev').addEventListener('click', () => { step(-1); });
            $('next').addEventListener('click', () => { step(1); });
            $('rand').addEventListener('click', () => { randomPick(); });

            $('play').addEventListener('click', () => {
              if (timer) stopPlay();
              else startPlay();
            });

            $('run').addEventListener('click', runSimulation);
            $('reset').addEventListener('click', () => {
              counts = [];
              drawHist();
              $('histCaption').textContent = 'Histograma de frecuencias (por composición).';
            });
          }

          function updateAll() {
            const r = parseInt($('r').value, 10);
            $('rVal').textContent = r;

            // index/h en rango
            if (index < 0) index = 0;
            if (index > r) index = r;

            // Resultado: CR_2^r = C_{r+1}^r = r+1
            const total = BigInt(r + 1);
            const comb = nCkBig(r + 1, r);

            $('formulaTxt').textContent = 'CR(2,' + r + ') = C(' + (r + 1) + ',' + r + ') = ' + formatBigInt(comb);
            $('plainTxt').innerHTML = 'Resultado: hay <b>' + (r + 1) + '</b> composiciones distintas (h,m).';
            $('identityTxt').innerHTML = 'Verificación rápida: r+1 = ' + (r + 1) + ' ✅';

            // Tabla
            $('tableWrap').style.display = $('showAll').checked ? 'block' : 'none';
            if ($('showAll').checked) renderTable(r);

            // Canvas principal
            $('caption').textContent = 'r=' + r + ' | composición #' + (index + 1) + ' de ' + (r + 1);
            $('pair').textContent = 'h=' + index + ', m=' + (r - index);
            drawMain(r, index);

            // Histograma (si no existe, crear)
            if (counts.length !== r + 1) {
              counts = Array(r + 1).fill(0);
              drawHist();
            }
          }

          function renderTable(r) {
            // Composiciones: (h,m) con h=0..r
            let html = '<table style="width:100%; border-collapse:collapse; font-size:13px;">';
            html += '<thead><tr style="background:#f8fafc;">'
                 +  '<th style="text-align:left; padding:8px; border-bottom:1px solid #e5e7eb;">#</th>'
                 +  '<th style="text-align:left; padding:8px; border-bottom:1px solid #e5e7eb;">Hombres (h)</th>'
                 +  '<th style="text-align:left; padding:8px; border-bottom:1px solid #e5e7eb;">Mujeres (m)</th>'
                 +  '<th style="text-align:left; padding:8px; border-bottom:1px solid #e5e7eb;">Suma</th>'
                 + '</tr></thead><tbody>';

            for (let h = 0; h <= r; h++) {
              const m = r - h;
              const active = (h === index);
              html += '<tr style="' + (active ? 'background:#eaf2ff;' : '') + ' cursor:pointer;"'
                   +  ' onclick="window.__pick_' + id_base + '(' + h + ')">'
                   +  '<td style="padding:8px; border-bottom:1px solid #f1f5f9;">' + (h + 1) + '</td>'
                   +  '<td style="padding:8px; border-bottom:1px solid #f1f5f9;">' + h + '</td>'
                   +  '<td style="padding:8px; border-bottom:1px solid #f1f5f9;">' + m + '</td>'
                   +  '<td style="padding:8px; border-bottom:1px solid #f1f5f9;">' + r + '</td>'
                   + '</tr>';
            }
            html += '</tbody></table>';
            $('table').innerHTML = html;

            // Exponer picker para el onclick inline
            window['__pick_' + id_base] = (h) => { index = h; updateAll(); };
          }

          function step(dir) {
            const r = parseInt($('r').value, 10);
            index = (index + dir + (r + 1)) % (r + 1);
            updateAll();
          }

          function randomPick() {
            const r = parseInt($('r').value, 10);
            index = Math.floor(Math.random() * (r + 1));
            updateAll();
          }

          function startPlay() {
            if (!$('animate').checked) return;
            $('play').textContent = '⏸ Pausar';
            timer = setInterval(() => step(1), 800);
          }

          function stopPlay() {
            if (timer) clearInterval(timer);
            timer = null;
            if (initialized) $('play').textContent = '▶ Reproducir';
          }

          // ---- Dibujo principal (composición actual) ----
          function drawMain(r, h) {
            const canvas = $('canvas');
            const ctx = canvas.getContext('2d');

            const cssW = canvas.clientWidth;
            const cssH = canvas.clientHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(cssW * dpr);
            canvas.height = Math.floor(cssH * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const W = cssW, H = cssH;
            ctx.clearRect(0, 0, W, H);

            // Fondo
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, W, H);

            // Título dentro del canvas
            ctx.fillStyle = '#111827';
            ctx.font = 'bold 15px Arial';
            ctx.fillText('Composición (h,m) con h+m=r', 16, 24);

            // Panel de barras H vs M
            const pad = 18;
            const x0 = pad, y0 = 60;
            const barW = W - pad * 2;
            const barH = 34;

            // Barra total
            ctx.fillStyle = '#e5e7eb';
            roundRect(ctx, x0, y0, barW, barH, 12);
            ctx.fill();

            const men = h;
            const women = r - h;

            // Proporción
            const menW = r === 0 ? 0 : (barW * men / r);
            const womenW = r === 0 ? 0 : (barW * women / r);

            // Barra hombres
            ctx.fillStyle = '#3b82f6';
            roundRect(ctx, x0, y0, menW, barH, 12);
            ctx.fill();

            // Barra mujeres (a la derecha)
            ctx.fillStyle = '#f97316';
            roundRect(ctx, x0 + menW, y0, womenW, barH, 12);
            ctx.fill();

            ctx.fillStyle = '#111827';
            ctx.font = '13px Arial';
            ctx.fillText('Hombres: ' + men, x0, y0 + barH + 20);
            ctx.fillText('Mujeres: ' + women, x0 + 140, y0 + barH + 20);

            // Visual con íconos (bolitas)
            const showLabels = $('showLabels').checked;
            const gridTop = y0 + 90;
            const cols = Math.min(10, Math.max(5, Math.ceil(Math.sqrt(r))));
            const gap = 12;
            const radius = 7;

            // Mostrar r “alumnos” como círculos: hombres primero, luego mujeres
            let i = 0;
            for (let row = 0; row < 10 && i < r; row++) {
              for (let col = 0; col < cols && i < r; col++) {
                const cx = x0 + col * (radius * 2 + gap) + radius;
                const cy = gridTop + row * (radius * 2 + gap) + radius;
                const isMan = i < men;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fillStyle = isMan ? '#3b82f6' : '#f97316';
                ctx.fill();
                i++;
              }
            }

            // Leyenda
            const lx = W - 220, ly = H - 60;
            ctx.fillStyle = '#111827';
            ctx.font = '13px Arial';
            if (showLabels) {
              ctx.fillText('Leyenda:', lx, ly);
              drawLegendDot(ctx, lx, ly + 12, '#3b82f6', 'Hombre');
              drawLegendDot(ctx, lx + 110, ly + 12, '#f97316', 'Mujer');
            }

            // Ecuación
            ctx.fillStyle = '#111827';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('h + m = ' + h + ' + ' + (r - h) + ' = ' + r, 16, H - 18);
          }

          function drawLegendDot(ctx, x, y, color, label) {
            ctx.beginPath();
            ctx.arc(x + 6, y + 6, 6, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.fillStyle = '#111827';
            ctx.font = '13px Arial';
            ctx.fillText(label, x + 18, y + 11);
          }

          function roundRect(ctx, x, y, w, h, r) {
            const radius = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + w, y, x + w, y + h, radius);
            ctx.arcTo(x + w, y + h, x, y + h, radius);
            ctx.arcTo(x, y + h, x, y, radius);
            ctx.arcTo(x, y, x + w, y, radius);
            ctx.closePath();
          }

          // ---- Mini simulación / histograma ----
          function runSimulation() {
            const r = parseInt($('r').value, 10);
            const trials = Math.max(1, Math.min(2000, parseInt($('trials').value || '200', 10)));

            // Reseteo si tamaño cambió
            if (counts.length !== r + 1) counts = Array(r + 1).fill(0);

            // Modelo: si elegimos una composición al azar (solo para ver frecuencias),
            // tomamos h uniforme 0..r (todas las composiciones equiprobables).
            for (let t = 0; t < trials; t++) {
              const h = Math.floor(Math.random() * (r + 1));
              counts[h]++;
            }

            $('histCaption').textContent = 'Simulación (' + trials + ' muestras): frecuencias por composición h=0..' + r;
            drawHist();
          }

          function drawHist() {
            const canvas = $('hist');
            const ctx = canvas.getContext('2d');

            const cssW = canvas.clientWidth;
            const cssH = canvas.clientHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(cssW * dpr);
            canvas.height = Math.floor(cssH * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const W = cssW, H = cssH;
            ctx.clearRect(0, 0, W, H);

            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, W, H);

            const r = parseInt($('r').value, 10);
            if (counts.length !== r + 1) counts = Array(r + 1).fill(0);

            const padL = 44, padR = 14, padT = 16, padB = 34;
            const chartW = W - padL - padR;
            const chartH = H - padT - padB;
            const x0 = padL, y0 = padT + chartH;

            // Ejes
            ctx.strokeStyle = '#111827';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x0, padT);
            ctx.lineTo(x0, y0);
            ctx.lineTo(x0 + chartW, y0);
            ctx.stroke();

            // Max
            let max = 1;
            for (const v of counts) if (v > max) max = v;

            const bars = r + 1;
            const bw = chartW / bars;
            const gap = Math.max(1, bw * 0.12);

            for (let hval = 0; hval <= r; hval++) {
              const v = counts[hval] / max;
              const barH = Math.round(v * (chartH - 6));
              const x = x0 + hval * bw + gap;
              const y = y0 - barH;
              const barW = Math.max(2, bw - 2 * gap);

              ctx.fillStyle = (hval === index) ? '#3b82f6' : '#a5c3f8';
              roundRect(ctx, x, y, barW, barH, 10);
              ctx.fill();

              // Etiquetas (h)
              if ($('showLabels').checked && (r <= 20 || hval % 2 === 0)) {
                ctx.fillStyle = '#111827';
                ctx.font = '12px Arial';
                const s = String(hval);
                const tx = x + barW / 2 - ctx.measureText(s).width / 2;
                ctx.fillText(s, tx, y0 + 16);
              }
            }

            ctx.fillStyle = '#111827';
            ctx.font = '12px Arial';
            ctx.fillText('h (número de hombres) — composición (h, r-h)', padL, H - 10);
          }

          // Si tu plataforma monta el contenedor visible por defecto, podrías activar:
          // initOnce(); updateAll();
        })();
      </script>
    `;
  }
};
