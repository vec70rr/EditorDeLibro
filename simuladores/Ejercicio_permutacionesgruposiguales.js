export default{ 
  render: (params, simName = 'Permutaciones iguales') => {
    var safeName = (typeof simName === 'string' && simName.trim()) ? simName.trim() : 'Simulador';

    // id_base ÚNICO (fuera del <script> para poder usarlo en ids del HTML)
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
  <div id="${id_base}_root">
    <button id="${id_base}_btn" class="btn-sim">Abrir ${simName}</button>

    <div id="${id_base}_container" class="simulador-box" style="display:none;">
      <h2>Simulador — Permutaciones con grupos de objetos iguales</h2>
      <p>
        Calcula el número de permutaciones distintas cuando hay objetos repetidos.
        Si hay <b>n</b> objetos en total y grupos repetidos de tamaños
        <b>n<sub>1</sub>, n<sub>2</sub>, ..., n<sub>r</sub></b>, entonces:
        <b>\\( \\dfrac{n!}{n_1!\\,n_2!\\cdots n_r!} \\)</b>.
      </p>

      <h2>Opción 1: Escribir la palabra</h2>
      <label for="${id_base}_word">Palabra / cadena:</label><br>
      <input type="text" id="${id_base}_word" value="BANANA" placeholder="Ej: BANANA"><br><br>

      <h2>Opción 2: Escribir los grupos (frecuencias)</h2>
      <label for="${id_base}_counts">Tamaños de grupos iguales (separados por comas):</label><br>
      <input type="text" id="${id_base}_counts" value="3,2,1" placeholder="Ej: 3,2,1"><br><br>

      <button id="${id_base}_btn_usar_word" class="btn-sim">Usar palabra</button>
      <button id="${id_base}_btn_usar_counts" class="btn-sim">Usar grupos</button>

      <h2>Estado actual</h2>
      <p><strong>Total de objetos:</strong> <span id="${id_base}_n_view">0</span></p>
      <p><strong>Grupos:</strong> <span id="${id_base}_groups_view">(vacío)</span></p>

      <h2>Respuesta del alumno</h2>
      <label for="${id_base}_ans_total">Total de permutaciones distintas:</label><br>
      <input type="number" id="${id_base}_ans_total" step="1"><br><br>

      <button id="${id_base}_btn_calcular" class="btn-sim">Calcular</button>
      <button id="${id_base}_btn_verificar" class="btn-sim">Verificar</button>
      <button id="${id_base}_btn_proc" class="btn-sim">Ver procedimiento</button>
      <button id="${id_base}_btn_resp" class="btn-sim">Mostrar respuestas</button>

      <div id="${id_base}_resultado"><i>Elige una opción y presiona "Calcular".</i></div>

      <div style="display:none;">
        <span id="${id_base}_correct_total">0</span>
        <span id="${id_base}_correct_n">0</span>
        <span id="${id_base}_correct_groups"></span>
      </div>
    </div>
  </div>

  <script>
  (function () {
    var id_base = '${id_base}';
    var simTitle = '${safeName}';

    function $(suffix) {
      return document.getElementById(id_base + '_' + suffix);
    }

    function toInt(v, fallback) {
      var x = parseInt(String(v), 10);
      return isNaN(x) ? fallback : x;
    }

    function escHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
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

    // Factorial entero (limitado) para evitar números enormes
    function factInt(n) {
      var r = 1;
      var i = 0;
      for (i = 2; i <= n; i++) r = r * i;
      return r;
    }

    function parseCounts(text) {
      var parts = String(text || '').split(',');
      var out = [];
      var i = 0;

      for (i = 0; i < parts.length; i++) {
        var s = parts[i].trim();
        if (s.length === 0) continue;
        var v = toInt(s, NaN);
        if (!isNaN(v) && v > 0) out.push(v);
      }
      return out;
    }

    function countsFromWord(word) {
      var s = String(word || '').trim();
      if (s.length === 0) return [];

      var freq = {};
      var i = 0;
      for (i = 0; i < s.length; i++) {
        var ch = s.charAt(i);
        if (!freq[ch]) freq[ch] = 0;
        freq[ch] = freq[ch] + 1;
      }

      var counts = [];
      for (var k in freq) {
        if (Object.prototype.hasOwnProperty.call(freq, k)) {
          counts.push(freq[k]);
        }
      }

      // Ordenar descendente para mostrar bonito (no afecta el cálculo)
      counts.sort(function (a, b) { return b - a; });
      return counts;
    }

    function sumCounts(arr) {
      var t = 0;
      var i = 0;
      for (i = 0; i < arr.length; i++) t = t + arr[i];
      return t;
    }

    function syncState(n, groups) {
      $('n_view').textContent = String(n);
      $('groups_view').textContent = groups.length ? groups.join(', ') : '(vacío)';

      $('correct_n').textContent = String(n);
      $('correct_groups').textContent = groups.join(',');
    }

    function computeTotal(n, groups) {
      // total = n! / (n1! n2! ...)
      var num = factInt(n);
      var den = 1;
      var i = 0;
      for (i = 0; i < groups.length; i++) den = den * factInt(groups[i]);

      // división exacta en estos casos (enteros)
      return Math.floor(num / den);
    }

    // Estado interno
    var state = { n: 0, groups: [] };

    function usarPalabra() {
      var word = $('word').value;
      var groups = countsFromWord(word);

      if (groups.length === 0) {
        $('resultado').innerHTML = '<b>Error:</b> escribe una palabra/cadena válida.';
        return;
      }

      var n = sumCounts(groups);
      state.n = n;
      state.groups = groups;

      // Actualizar caja de grupos para que el alumno vea el desglose
      $('counts').value = groups.join(',');

      syncState(n, groups);
      $('resultado').innerHTML = '<i>Palabra cargada. Presiona "Calcular".</i>';
      typeset();
    }

    function usarGrupos() {
      var groups = parseCounts($('counts').value);

      if (groups.length === 0) {
        $('resultado').innerHTML = '<b>Error:</b> escribe tamaños positivos, por ejemplo: 3,2,1';
        return;
      }

      // Ordenar descendente solo para presentación
      groups.sort(function (a, b) { return b - a; });

      var n = sumCounts(groups);
      state.n = n;
      state.groups = groups;

      syncState(n, groups);
      $('resultado').innerHTML = '<i>Grupos cargados. Presiona "Calcular".</i>';
      typeset();
    }

    function calcular() {
      if (!state.groups.length || !state.n) {
        // intentamos por defecto con la palabra actual
        usarPalabra();
        if (!state.groups.length) return;
      }

      // Limitar para mantenerlo manejable (factoriales crecen muy rápido)
      if (state.n > 20) {
        $('resultado').innerHTML =
          '<b>Nota:</b> El valor de n es muy grande para factorial entero en este simulador (n &gt; 20). ' +
          'Reduce la palabra o los grupos.';
        return;
      }

      var total = computeTotal(state.n, state.groups);

      $('correct_total').textContent = String(total);

      var latexDen = '';
      var i = 0;
      for (i = 0; i < state.groups.length; i++) {
        latexDen = latexDen + state.groups[i] + '!';
        if (i < state.groups.length - 1) latexDen = latexDen + '\\\\,';
      }

      $('resultado').innerHTML =
        '<b>Resultado:</b> \\\\(' +
        '\\\\dfrac{' + state.n + '!}{' + latexDen + '}=' + total +
        '\\\\).';
      typeset();
    }

    function verificar() {
      calcular();

      var userTotal = toInt($('ans_total').value, NaN);
      var correct = toInt($('correct_total').textContent, 0);

      if (!isNaN(userTotal) && userTotal === correct) {
        $('resultado').innerHTML =
          '<b>✅ Correcto.</b> El total de permutaciones distintas es \\\\(' + correct + '\\\\).';
      } else {
        $('resultado').innerHTML =
          '<b>❌ Revisa.</b> Tu respuesta no coincide. Usa \\\\(\\\\dfrac{n!}{n_1!n_2!\\\\cdots n_r!}\\\\).';
      }
      typeset();
    }

    function procedimiento() {
      if (!state.groups.length || !state.n) {
        $('resultado').innerHTML = '<i>Primero carga una palabra o grupos y luego calcula.</i>';
        return;
      }

      var total = toInt($('correct_total').textContent, 0);
      if (!total) {
        // si aún no se calculó
        calcular();
        total = toInt($('correct_total').textContent, 0);
        if (!total) return;
      }

      var latexDen = '';
      var i = 0;
      for (i = 0; i < state.groups.length; i++) {
        latexDen = latexDen + state.groups[i] + '!';
        if (i < state.groups.length - 1) latexDen = latexDen + '\\\\,';
      }

      $('resultado').innerHTML =
        '<b>Procedimiento:</b><br>' +
        '\\\\[\\\\text{Permutaciones con repetición (objetos iguales)}=\\\\dfrac{n!}{n_1!n_2!\\\\cdots n_r!}\\\\]' +
        '\\\\[n=' + state.n + ',\\\\; (n_1, n_2, \\\\dots)=(' + state.groups.join(', ') + ')\\\\]' +
        '\\\\[\\\\Rightarrow \\\\dfrac{' + state.n + '!}{' + latexDen + '}=' + total + '\\\\]';
      typeset();
    }

    function mostrarRespuestas() {
      if (!state.groups.length || !state.n) {
        $('resultado').innerHTML = '<i>Primero carga una palabra o grupos.</i>';
        return;
      }

      if (toInt($('correct_total').textContent, 0) === 0) {
        calcular();
      }

      $('ans_total').value = $('correct_total').textContent;

      $('resultado').innerHTML =
        '<i>Respuesta correcta cargada:</i> \\\\(' + $('correct_total').textContent + '\\\\).';
      typeset();
    }

    // Eventos
    $('btn_usar_word').addEventListener('click', usarPalabra);
    $('btn_usar_counts').addEventListener('click', usarGrupos);
    $('btn_calcular').addEventListener('click', calcular);
    $('btn_verificar').addEventListener('click', verificar);
    $('btn_proc').addEventListener('click', procedimiento);
    $('btn_resp').addEventListener('click', mostrarRespuestas);

    // Inicial por defecto con la palabra BANANA
    usarPalabra();

    // Toggle EXACTO (reglas)
    window['toggleSim_' + id_base] = function () {
      var container = $('container');
      var btn = $('btn');

      if (!container || !btn) return;

      if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        btn.textContent = 'Ocultar ' + simTitle;
        btn.classList.add('btn-sim-rojo');
        typeset();
      } else {
        container.style.display = 'none';
        btn.textContent = 'Abrir ' + simTitle;
        btn.classList.remove('btn-sim-rojo');
      }
    };

    $('btn').addEventListener('click', window['toggleSim_' + id_base]);

  })();
  </script>
  `;
  }
};
