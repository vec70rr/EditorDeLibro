export default {
  render: (params, simName = 'Simulador Ejemplo 25: 2^n - 1') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <div style="display:flex; flex-wrap:wrap; gap:14px; align-items:flex-start;">
            
            <!-- Panel de controles -->
            <div style="flex: 1 1 320px; min-width: 280px; padding:12px; border:1px solid #e5e7eb; border-radius:12px; background:#fff;">
              <h3 style="margin:0 0 8px 0;">Ejemplo 25</h3>
              <p style="margin:0 0 10px 0; line-height:1.35;">
                ¿De cuántas maneras se pueden seleccionar <b>una o más</b> personas de un grupo de tamaño <b>n</b>?
                Se cumple: <b>Σ C(n,k)</b> (k=1..n) = <b>2^n − 1</b>.
              </p>

              <label style="display:block; margin-top:10px;">
                <b>n (tamaño del grupo):</b>
                <span id="${id_base}_nVal" style="margin-left:6px;">20</span>
              </label>
              <input id="${id_base}_n" type="range" min="1" max="60" value="20" style="width:100%;" />

              <label style="display:block; margin-top:10px;">
                <b>k (tamaño del subconjunto):</b>
                <span id="${id_base}_kVal" style="margin-left:6px;">1</span>
              </label>
              <input id="${id_base}_k" type="range" min="0" max="20" value="1" style="width:100%;" />

              <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
                <label style="display:flex; align-items:center; gap:6px;">
                  <input id="${id_base}_showLabels" type="checkbox" checked />
                  Etiquetas
                </label>
                <label style="display:flex; align-items:center; gap:6px;">
                  <input id="${id_base}_logScale" type="checkbox" checked />
                  Escala log
                </label>
                <label style="display:flex; align-items:center; gap:6px;">
                  <input id="${id_base}_showTotal" type="checkbox" checked />
                  Mostrar total
                </label>
              </div>

              <div style="margin-top:12px; padding:10px; border-radius:10px; background:#f8fafc; border:1px solid #e5e7eb;">
                <div><b id="${id_base}_cnkTxt">C(20,1) = 20</b></div>
                <div id="${id_base}_sumTxt" style="margin-top:6px;">Σ C(20,k) (k=1..20) = 1 048 575</div>
                <div id="${id_base}_idTxt" style="margin-top:6px; opacity:.9;">Identidad: 2^20 − 1 = 1 048 575 ✅ coincide</div>
              </div>
            </div>

            <!-- Panel gráfica -->
            <div style="flex: 2 1 520px; min-width: 320px; padding:12px; border:1px solid #e5e7eb; border-radius:12px; background:#fff;">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
                <h3 style="margin:0;">Distribución de C(n,k)</h3>
                <div style="font-size:12px; opacity:.85;" id="${id_base}_scaleTxt">Escala: log10(C(n,k)+1)</div>
              </div>
              <canvas id="${id_base}_canvas" width="900" height="420" style="width:100%; height:420px; margin-top:10px; border-radius:12px; border:1px solid #eef2f7; background:#f8fafc;"></canvas>
              <div style="margin-top:8px; font-size:13px; opacity:.9;" id="${id_base}_caption">
                n = 20 | k resaltado = 1
              </div>
            </div>

            <!-- Panel aleatorio -->
            <div style="flex: 1 1 320px; min-width: 280px; padding:12px; border:1px solid #e5e7eb; border-radius:12px; background:#fff;">
              <h3 style="margin:0 0 8px 0;">Exploración</h3>
              <p style="margin:0 0 10px 0; line-height:1.35;">
                Genera un subconjunto aleatorio para entender que <b>C(n,k)</b> cuenta cuántos existen.
              </p>

              <label style="display:block; margin-top:6px;"><b>Modo:</b></label>
              <select id="${id_base}_mode" style="width:100%; padding:8px; border-radius:10px; border:1px solid #e5e7eb;">
                <option value="fixed">Elegir k fijo (usa el slider k)</option>
                <option value="rand">Elegir tamaño k al azar (1..n)</option>
              </select>

              <div style="display:flex; gap:10px; margin-top:10px;">
                <button id="${id_base}_gen" class="btn-sim" style="flex:1;">Generar</button>
                <button id="${id_base}_clear" class="btn-sim btn-sim-rojo" style="flex:1;">Limpiar</button>
              </div>

              <textarea id="${id_base}_log" rows="10" style="width:100%; margin-top:10px; padding:10px; border-radius:12px; border:1px solid #e5e7eb; resize:vertical;" readonly></textarea>
            </div>

          </div>

          <div style="margin-top:12px; font-size:12px; opacity:.8;">
            Tip: La suma de todos los subconjuntos no vacíos es <b>2^n − 1</b> (cada elemento puede estar o no estar, excepto el caso vacío).
          </div>
        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);

          // --- Toggle (como tu plantilla) ---
          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';
            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ' + simName;
              btn.classList.add('btn-sim-rojo');
              // Inicializa/redibuja al abrir
              initOnce();
              updateAll();
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ' + simName;
              btn.classList.remove('btn-sim-rojo');
            }
          };

          // --- Helpers matemáticos (BigInt) ---
          function bigIntPow2(n) { return 1n << BigInt(n); }

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

          // --- Estado ---
          let initialized = false;

          function initOnce() {
            if (initialized) return;
            initialized = true;

            // Eventos
            $('n').addEventListener('input', () => {
              const n = parseInt($('n').value, 10);
              $('k').max = n;
              if (parseInt($('k').value, 10) > n) $('k').value = n;
              updateAll();
            });

            $('k').addEventListener('input', updateAll);
            $('showLabels').addEventListener('change', updateAll);
            $('logScale').addEventListener('change', updateAll);
            $('showTotal').addEventListener('change', updateAll);

            $('gen').addEventListener('click', generateSubset);
            $('clear').addEventListener('click', () => $('log').value = '');
          }

          function updateAll() {
            const n = parseInt($('n').value, 10);
            const k = parseInt($('k').value, 10);

            $('nVal').textContent = n;
            $('kVal').textContent = k;

            const cnk = nCkBig(n, k);
            $('cnkTxt').textContent = 'C(' + n + ',' + k + ') = ' + formatBigInt(cnk);

            const showTotal = $('showTotal').checked;
            if (showTotal) {
              const total = (bigIntPow2(n) - 1n);
              $('sumTxt').textContent = 'Σ C(' + n + ',k) (k=1..' + n + ') = ' + formatBigInt(total);
              $('idTxt').textContent = 'Identidad: 2^' + n + ' − 1 = ' + formatBigInt(total) + ' ✅ coincide';
              $('sumTxt').style.display = 'block';
              $('idTxt').style.display = 'block';
            } else {
              $('sumTxt').style.display = 'none';
              $('idTxt').style.display = 'none';
            }

            $('scaleTxt').textContent = $('logScale').checked ? 'Escala: log10(C(n,k)+1)' : 'Escala: lineal';
            $('caption').textContent = 'n = ' + n + ' | k resaltado = ' + k;

            drawChart(n, k);
          }

          // --- Dibujo de gráfica (Canvas) ---
          function drawChart(n, highlightK) {
            const canvas = $('canvas');
            const ctx = canvas.getContext('2d');

            // Ajustar resolución para pantallas HiDPI
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

            const padL = 52, padR = 18, padT = 18, padB = 42;
            const chartW = W - padL - padR;
            const chartH = H - padT - padB;
            const x0 = padL;
            const y0 = padT + chartH;

            // Ejes
            ctx.strokeStyle = '#111827';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x0, padT);
            ctx.lineTo(x0, y0);
            ctx.lineTo(x0 + chartW, y0);
            ctx.stroke();

            // Valores
            const logScale = $('logScale').checked;
            const vals = [];
            let max = 0;
            for (let k = 0; k <= n; k++) {
              const cnk = nCkBig(n, k);
              let v = Number(cnk); // para n<=60 todavía es utilizable en escala log; si se satura, el log ayuda
              if (logScale) v = Math.log10(v + 1);
              vals.push(v);
              if (v > max) max = v;
            }
            if (max <= 0) max = 1;

            // Barras
            const bars = n + 1;
            const bw = chartW / bars;
            const gap = Math.max(1, bw * 0.12);

            for (let k = 0; k <= n; k++) {
              const v = vals[k] / max;
              const barH = Math.round(v * (chartH - 8));
              const x = x0 + k * bw + gap;
              const y = y0 - barH;
              const barW = Math.max(2, bw - 2 * gap);

              // Color
              ctx.fillStyle = (k === highlightK) ? '#3b82f6' : '#a5c3f8';
              roundRect(ctx, x, y, barW, barH, 10);
              ctx.fill();

              // Etiqueta k
              const showLabels = $('showLabels').checked;
              if (showLabels && (n <= 30 || k % 2 === 0)) {
                ctx.fillStyle = '#111827';
                ctx.font = '12px Arial';
                const ks = String(k);
                const tx = x + barW / 2 - ctx.measureText(ks).width / 2;
                ctx.fillText(ks, tx, y0 + 18);
              }
            }
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

          // --- Subconjunto aleatorio ---
          function generateSubset() {
            const n = parseInt($('n').value, 10);
            const kSlider = parseInt($('k').value, 10);

            let k;
            if ($('mode').value === 'fixed') k = kSlider;
            else k = 1 + Math.floor(Math.random() * n);

            const picked = Array(n).fill(false);
            let count = 0;
            while (count < k) {
              const idx = Math.floor(Math.random() * n);
              if (!picked[idx]) { picked[idx] = true; count++; }
            }

            const cnk = nCkBig(n, k);
            let subset = [];
            for (let i = 0; i < n; i++) if (picked[i]) subset.push('P' + (i + 1));

            const msg =
              'n=' + n + ', k=' + k + ' → 1 subconjunto de ' + formatBigInt(cnk) + ' posibles\\n' +
              '{ ' + subset.join(', ') + ' }\\n\\n';

            $('log').value += msg;
            $('log').scrollTop = $('log').scrollHeight;
          }

          // Si el contenedor ya está visible (por si tu plataforma lo monta abierto)
          // initOnce(); updateAll();
        })();
      </script>
    `;
  }
};
