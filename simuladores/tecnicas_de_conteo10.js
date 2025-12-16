export default {
  render: (params, simName = 'Simulador de Combinaciones') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <h3>${simName}</h3>

          <label>Elementos (separados por coma):</label><br>
          <input id="${id_base}_elems" type="text" value="a,b,c,d" style="width:80%"><br><br>

          <label>Orden r:</label>
          <input id="${id_base}_r" type="number" value="2" min="1" style="width:60px"><br><br>

          <button id="${id_base}_gen_r">Generar orden r</button>
          <button id="${id_base}_gen_all">Generar todos (1..n)</button>
          <button id="${id_base}_clear">Limpiar</button>

          <p id="${id_base}_info" style="font-weight:bold;"></p>

          <pre id="${id_base}_out"
               style="background:#f4f4f4; padding:10px; max-height:300px; overflow:auto;">
          </pre>
        </div>
      </div>

      <script>
        (function () {
          const id = '${id_base}';
          const $ = (x) => document.getElementById(id + '_' + x);

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

          function parseElems() {
            return $('elems').value
              .split(',')
              .map(e => e.trim())
              .filter(e => e.length > 0);
          }

          function nCr(n, r) {
            if (r > n) return 0;
            r = Math.min(r, n - r);
            let res = 1;
            for (let i = 1; i <= r; i++) {
              res = res * (n - i + 1) / i;
            }
            return Math.round(res);
          }

          function combinar(arr, r, start, actual, res) {
            if (actual.length === r) {
              res.push(actual.join(''));
              return;
            }
            for (let i = start; i < arr.length; i++) {
              actual.push(arr[i]);
              combinar(arr, r, i + 1, actual, res);
              actual.pop();
            }
          }

          function generarOrdenR() {
            const elems = parseElems();
            const r = parseInt($('r').value);
            const n = elems.length;

            if (r > n) {
              alert('r no puede ser mayor que n');
              return;
            }

            let res = [];
            combinar(elems, r, 0, [], res);

            $('info').textContent = 'C(' + n + ',' + r + ') = ' + nCr(n, r);
            $('out').textContent = res.join('\\n');
          }

          function generarTodos() {
            const elems = parseElems();
            const n = elems.length;
            let salida = '';
            let total = 0;

            for (let r = 1; r <= n; r++) {
              let res = [];
              combinar(elems, r, 0, [], res);
              salida += 'Orden ' + r + ' (C(' + n + ',' + r + ')=' + nCr(n, r) + ')\\n';
              salida += res.join('\\n') + '\\n\\n';
              total += nCr(n, r);
            }

            $('info').textContent = 'Total combinaciones (1..n): ' + total;
            $('out').textContent = salida;
          }

          $('gen_r').onclick = generarOrdenR;
          $('gen_all').onclick = generarTodos;
          $('clear').onclick = () => {
            $('out').textContent = '';
            $('info').textContent = '';
          };

        })();
      </script>
    `;
  }
};
