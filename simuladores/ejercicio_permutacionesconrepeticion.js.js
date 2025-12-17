export default{
  render: (params, simName = 'Permutaciones con Repetición') => {

    // id_base ÚNICO (definido fuera del <script> para poder usarlo en ids del HTML)
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
  <div id="${id_base}_root">
    <button id="${id_base}_btn" class="btn-sim">Abrir ${simName}</button>
    <div id="${id_base}_container" class="simulador-box" style="display:none;">
      <h2>Simulador — Permutaciones con Repetición</h2>
      <p>
        Calcula el número de arreglos de longitud <b>n</b> construidos con <b>k</b> símbolos, permitiendo repetición.
        La fórmula es: <b>\\(k^n\\)</b>.
      </p>

      <h2>Parámetros</h2>
      <label for="${id_base}_k">Cantidad de símbolos (k):</label><br>
      <input type="number" id="${id_base}_k" value="3" min="1" max="10"><br><br>

      <label for="${id_base}_n">Longitud del arreglo (n):</label><br>
      <input type="number" id="${id_base}_n" value="3" min="1" max="10"><br><br>

      <label for="${id_base}_symbols">Símbolos (separados por comas):</label><br>
      <input type="text" id="${id_base}_symbols" value="a,b,c" placeholder="Ej: a,b,c"><br><br>

      <button id="${id_base}_btn_generar" class="btn-sim">Generar</button>
      <button id="${id_base}_btn_verificar" class="btn-sim">Verificar</button>
      <button id="${id_base}_btn_proc" class="btn-sim">Ver procedimiento</button>
      <button id="${id_base}_btn_resp" class="btn-sim">Mostrar respuestas</button>

      <h2>Respuesta del alumno</h2>
      <label for="${id_base}_ans_total">Total de permutaciones con repetición:</label><br>
      <input type="number" id="${id_base}_ans_total" step="1"><br><br>

      <div id="${id_base}_resultado"><i>Define los parámetros y presiona "Generar".</i></div>

      <div style="display:none;">
        <span id="${id_base}_correct_total">0</span>
        <span id="${id_base}_correct_k">0</span>
        <span id="${id_base}_correct_n">0</span>
        <span id="${id_base}_correct_symbols"></span>
      </div>
    </div>
  </div>

  <script>
  (function () {
    var id_base = '${id_base}';

    function $(suffix) {
      return document.getElementById(id_base + '_' + suffix);
    }

    function toInt(v, fallback) {
      var x = parseInt(String(v), 10);
      return isNaN(x) ? fallback : x;
    }

    function clampInt(x, a, b) {
      x = toInt(x, a);
      if (x < a) x = a;
      if (x > b) x = b;
      return x;
    }

    function escHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function powInt(base, exp) {
      var r = 1;
      var i = 0;
      for (i = 0; i < exp; i++) r = r * base;
      return r;
    }

    function parseSymbols(text) {
      var parts = String(text || '').split(',');
      var out = [];
      var seen = {};
      var i = 0;

      for (i = 0; i < parts.length; i++) {
        var s = parts[i].trim();
        if (s.length > 0 && !seen[s]) {
          seen[s] = true;
          out.push(s);
        }
      }
      return out;
    }

    function typeset() {
      try {
        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise();
        } else if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Queue) {
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
        }
      } catch (e) {}
    }

    function syncCorrect(total, k, n, symbols) {
      $('correct_total').textContent = String(total);
      $('correct_k').textContent = String(k);
      $('correct_n').textContent = String(n);
      $('correct_symbols').textContent = symbols.join(',');
    }

    function buildListSample(symbols, k, n, maxMostrar) {
      var total = powInt(k, n);
      var limite = total < maxMostrar ? total : maxMostrar;

      function toBaseK(num) {
        var digits = [];
        var pos = 0;
        for (pos = 0; pos < n; pos++) digits.push(0);
        for (pos = n - 1; pos >= 0; pos--) {
          digits[pos] = num % k;
          num = Math.floor(num / k);
        }
        return digits;
      }

      var out = [];
      var idx = 0;
      for (idx = 0; idx < limite; idx++) {
        var d = toBaseK(idx);
        var s = '';
        var j = 0;
        for (j = 0; j < d.length; j++) s = s + symbols[d[j]];
        out.push(s);
      }

      return { total: total, shown: out };
    }

    function generar() {
      var k = clampInt($('k').value, 1, 10);
      var n = clampInt($('n').value, 1, 10);

      var symbols = parseSymbols($('symbols').value);
      if (symbols.length === 0) {
        $('resultado').innerHTML = '<b>Error:</b> escribe símbolos separados por comas, por ejemplo: a,b,c';
        return;
      }
      if (symbols.length > 10) symbols = symbols.slice(0, 10);

      // Regla: k debe coincidir con el número de símbolos; si no, se ajusta k.
      if (k !== symbols.length) {
        k = symbols.length;
        $('k').value = String(k);
      }

      var total = powInt(k, n);
      syncCorrect(total, k, n, symbols);

      var maxMostrar = 200;
      var res = buildListSample(symbols, k, n, maxMostrar);

      var html = '';
      html = html + '<b>Resultado:</b> ';
      html = html + '\\\\(k^n=' + k + '^' + n + '=' + total + '\\\\).<br><br>';

      html = html + '<b>Listado</b> (';
      html = html + (total <= maxMostrar ? 'todas' : 'muestra de las primeras ' + maxMostrar);
      html = html + '):<br>';

      var items = res.shown;
      var perLine = 12;
      var i = 0;
      var lines = [];

      for (i = 0; i < items.length; i = i + perLine) {
        var chunk = items.slice(i, i + perLine);
        var j = 0;
        for (j = 0; j < chunk.length; j++) chunk[j] = escHtml(chunk[j]);
        lines.push(chunk.join(', '));
      }

      html = html + '<div style="overflow:auto; max-height:220px;"><code>' + lines.join('<br>') + '</code></div>';

      if (total > maxMostrar) {
        html = html + '<div><i>Nota:</i> Se omitieron ' + (total - maxMostrar) + ' permutaciones para mantener el simulador ligero.</div>';
      }

      $('resultado').innerHTML = html;
      typeset();
    }

    function verificar() {
      generar();

      var userTotal = toInt($('ans_total').value, NaN);
      var correct = toInt($('correct_total').textContent, 0);

      if (!isNaN(userTotal) && userTotal === correct) {
        $('resultado').innerHTML =
          '<b>✅ Correcto.</b> ' +
          'Con \\\\(k=' + $('correct_k').textContent + '\\\\) y \\\\(n=' + $('correct_n').textContent + '\\\\), ' +
          'el total es \\\\(k^n=' + $('correct_k').textContent + '^' + $('correct_n').textContent + '=' + correct + '\\\\).';
      } else {
        $('resultado').innerHTML =
          '<b>❌ Revisa.</b> Tu total no coincide. Recuerda: \\\\(k^n\\\\).';
      }
      typeset();
    }

    function procedimiento() {
      var k = toInt($('correct_k').textContent, 0);
      var n = toInt($('correct_n').textContent, 0);
      var total = toInt($('correct_total').textContent, 0);

      if (!k || !n) {
        $('resultado').innerHTML = '<i>Primero genera un caso para ver el procedimiento.</i>';
        return;
      }

      $('resultado').innerHTML =
        '<b>Procedimiento:</b><br>' +
        '\\\\[\\\\text{Permutaciones con repetición} = k^n\\\\]' +
        '\\\\[k=' + k + ',\\\\; n=' + n + ' \\\\Rightarrow k^n=' + k + '^' + n + '=' + total + '\\\\]' +
        '<div><i>Interpretación:</i> en cada una de las ' + n + ' posiciones hay ' + k + ' opciones.</div>';
      typeset();
    }

    function mostrarRespuestas() {
      var correct = $('correct_total').textContent;
      $('ans_total').value = correct;

      $('resultado').innerHTML =
        '<i>Respuesta correcta cargada:</i> ' +
        '\\\\(k^n=' + $('correct_k').textContent + '^' + $('correct_n').textContent + '=' + correct + '\\\\).';
      typeset();
    }

    // Botones internos
    $('btn_generar').addEventListener('click', generar);
    $('btn_verificar').addEventListener('click', verificar);
    $('btn_proc').addEventListener('click', procedimiento);
    $('btn_resp').addEventListener('click', mostrarRespuestas);

    // Toggle EXACTO
    window['toggleSim_' + id_base] = function () {
      var container = $('container');
      var btn = $('btn');

      if (!container || !btn) return;

      if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        btn.textContent = 'Ocultar ' + safeName;
        btn.classList.add('btn-sim-rojo');
        typeset();
      } else {
        container.style.display = 'none';
        btn.textContent = 'Abrir ' + safeName;
        btn.classList.remove('btn-sim-rojo');
      }
    };

    // Sin onclick inline
    $('btn').addEventListener('click', window['toggleSim_' + id_base]);

  })();
  </script>
  `;
  }
};
