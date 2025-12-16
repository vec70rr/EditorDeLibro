export default {
  render: (params, simName = 'Simulador: Números combinatorios y Triángulo de Pascal') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <h3>Triángulo de Pascal</h3>

          <label>
            Filas (n):
            <span id="${id_base}_n_val">6</span>
          </label>
          <input id="${id_base}_n" type="range" min="1" max="15" value="6" />

          <label style="margin-left:10px;">
            r:
            <span id="${id_base}_r_val">3</span>
          </label>
          <input id="${id_base}_r" type="range" min="0" max="6" value="3" />

          <div style="margin-top:10px; padding:8px; background:#f8fafc; border-radius:8px;">
            <div id="${id_base}_valor"></div>
            <div id="${id_base}_propiedades" style="margin-top:6px;"></div>
          </div>

          <canvas id="${id_base}_canvas" width="600" height="350"
            style="width:100%; margin-top:12px; border:1px solid #e5e7eb; border-radius:10px;"></canvas>
        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);

          /* ================= TOGGLE ================= */
          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';
            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ' + simName;
              btn.classList.add('btn-sim-rojo');
              actualizar();
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ' + simName;
              btn.classList.remove('btn-sim-rojo');
            }
          };

          /* ================= MATEMÁTICA ================= */
          function combinacion(n, r) {
            if (r < 0 || r > n) return 0n;
            r = Math.min(r, n - r);
            let res = 1n;
            for (let i = 1; i <= r; i++) {
              res = res * BigInt(n - i + 1) / BigInt(i);
            }
            return res;
          }

          function formato(x) {
            return x.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ');
          }

          /* ================= DIBUJO ================= */
          function dibujarTriangulo(n, rSel) {
            const canvas = $('canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const dy = 32;
            const dx = 60;

            ctx.font = '14px Arial';
            ctx.textAlign = 'center';

            for (let n0 = 0; n0 <= n; n0++) {
              const y = 30 + n0 * dy;
              for (let r0 = 0; r0 <= n0; r0++) {
                const x = cx - (n0 * dx) / 2 + r0 * dx;
                const val = combinacion(n0, r0);

                if (n0 === n && (r0 === rSel || r0 === n - rSel)) {
                  ctx.fillStyle = '#3b82f6';
                } else {
                  ctx.fillStyle = '#111827';
                }

                ctx.fillText(formato(val), x, y);
              }
            }
          }

          /* ================= ACTUALIZACIÓN ================= */
          function actualizar() {
            const n = parseInt($('n').value);
            const r = parseInt($('r').value);

            $('n_val').textContent = n;
            $('r').max = n;
            $('r_val').textContent = r;

            const c = combinacion(n, r);
            const cs = combinacion(n, n - r);

            $('valor').innerHTML =
              '<b>C(' + n + ',' + r + ') = ' + formato(c) + '</b>';

            $('propiedades').innerHTML =
              'Simetría: C(' + n + ',' + r + ') = C(' + n + ',' + (n - r) + ') = ' +
              formato(cs);

            dibujarTriangulo(n, r);
          }

          /* ================= EVENTOS ================= */
          $('n').addEventListener('input', actualizar);
          $('r').addEventListener('input', actualizar);

        })();
      </script>
    `;
  }
};
