export default {
  render: function(params, simName) {
    // Generamos un ID único para evitar conflictos si hay varios simuladores en la misma página
    const id_base = 'sim_variabilidad_' + Math.random().toString(36).substr(2, 9);
    const title = simName || 'Medidas de Variabilidad';

    // Construimos el HTML y el Script usando concatenación estricta (sin backticks dentro del script)
    return `
      <div class="simulador-wrapper" id="wrapper_${id_base}">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          
          <style>
            .res-grid-${id_base} { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin: 15px 0; }
            .stat-card-${id_base} { background: #f1f5f9; padding: 10px; text-align: center; border-radius: 8px; border: 1px solid #e2e8f0; }
            .stat-val-${id_base} { font-size: 1.2rem; font-weight: bold; color: #2563eb; display: block; }
            .stat-lbl-${id_base} { font-size: 0.8rem; color: #64748b; }
            .dot-plot-${id_base} { position: relative; height: 100px; background: #fafafa; border: 1px solid #ddd; border-radius: 8px; margin-top: 20px; }
            .dot-${id_base} { position: absolute; bottom: 20px; width: 12px; height: 12px; border-radius: 50%; background: #2563eb; transform: translateX(-50%); border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s; }
            .dot-${id_base}:hover { transform: translateX(-50%) scale(1.5); z-index: 10; }
            .mean-line-${id_base} { position: absolute; bottom: 0; height: 100%; width: 2px; background: #ef4444; opacity: 0.6; transform: translateX(-50%); pointer-events: none; }
            .axis-lbl-${id_base} { position: absolute; bottom: -20px; font-size: 0.7rem; color: #64748b; transform: translateX(-50%); }
          </style>

          <div style="margin-bottom: 15px;">
            <label style="display:block; font-weight:600; margin-bottom:5px;">Ingresa tus datos (separados por comas):</label>
            <textarea id="${id_base}_input" rows="3" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">10, 12, 15, 18, 20, 22, 25</textarea>
            <button id="${id_base}_btn_calc" class="btn-sim" style="margin-top:10px;">Calcular Estadísticas</button>
          </div>

          <div id="${id_base}_resultados" style="display:none;">
            <div class="res-grid-${id_base}">
              <div class="stat-card-${id_base}"><span id="${id_base}_n" class="stat-val-${id_base}">0</span><span class="stat-lbl-${id_base}">N</span></div>
              <div class="stat-card-${id_base}"><span id="${id_base}_media" class="stat-val-${id_base}">0</span><span class="stat-lbl-${id_base}">Media</span></div>
              <div class="stat-card-${id_base}"><span id="${id_base}_var" class="stat-val-${id_base}">0</span><span class="stat-lbl-${id_base}">Varianza</span></div>
              <div class="stat-card-${id_base}"><span id="${id_base}_desv" class="stat-val-${id_base}">0</span><span class="stat-lbl-${id_base}">Desv. Est.</span></div>
            </div>

            <div style="margin-top:10px;">
              <h4 style="margin:0; font-size:1rem; color:#333;">Gráfica de Puntos</h4>
              <div id="${id_base}_plot" class="dot-plot-${id_base}"></div>
            </div>
          </div>

        </div>
      </div>

      <script>
      (function() {
        var id_base = '${id_base}';
        var simName = '${title}';

        // Función auxiliar para seleccionar elementos
        function $(id) { return document.getElementById(id_base + '_' + id); }

        // 1. Lógica del Toggle (Requisito Estricto)
        window['toggleSim_' + id_base] = function() {
          var box = document.getElementById('sim_box_' + id_base);
          var btn = document.getElementById('btn_toggle_' + id_base);
          
          if (box.style.display === 'none') {
            box.style.display = 'block';
            btn.innerText = 'Ocultar ' + simName;
            btn.classList.add('btn-sim-rojo');
          } else {
            box.style.display = 'none';
            btn.innerText = 'Abrir ' + simName;
            btn.classList.remove('btn-sim-rojo');
          }
        };

        // 2. Funciones Matemáticas
        function parseValues(text) {
          return text.split(/[\\s,;]+/).map(Number).filter(function(n) { return !isNaN(n); });
        }

        function getMean(arr) {
          return arr.reduce(function(a, b) { return a + b; }, 0) / arr.length;
        }

        function getVariance(arr) {
          var m = getMean(arr);
          var sum = arr.reduce(function(a, b) { return a + Math.pow(b - m, 2); }, 0);
          return sum / (arr.length > 1 ? arr.length - 1 : 1);
        }

        // 3. Lógica de Dibujo (Sin Template Literals)
        function drawPlot(values) {
          var container = $('plot');
          container.innerHTML = '';
          
          if (values.length === 0) return;

          var min = Math.min.apply(null, values);
          var max = Math.max.apply(null, values);
          var spread = (max - min) || 1;
          var mean = getMean(values);

          // Dibujar línea de media
          var meanPos = ((mean - min) / spread) * 100;
          var lineDiv = document.createElement('div');
          lineDiv.className = 'mean-line-' + id_base;
          lineDiv.style.left = meanPos + '%';
          container.appendChild(lineDiv);

          // Dibujar puntos
          for (var i = 0; i < values.length; i++) {
            var val = values[i];
            var pos = ((val - min) / spread) * 100;
            var dot = document.createElement('div');
            dot.className = 'dot-' + id_base;
            dot.style.left = pos + '%';
            dot.title = val;
            container.appendChild(dot);
          }

          // Etiquetas eje X
          var labels = [min, mean, max];
          for (var j = 0; j < labels.length; j++) {
            var lVal = labels[j];
            var lPos = ((lVal - min) / spread) * 100;
            var lbl = document.createElement('div');
            lbl.className = 'axis-lbl-' + id_base;
            lbl.style.left = lPos + '%';
            lbl.innerText = lVal.toFixed(1);
            if (j === 1) lbl.style.color = '#ef4444'; // Color rojo para la media
            container.appendChild(lbl);
          }
        }

        // 4. Evento Principal
        var btnCalc = $('btn_calc');
        if (btnCalc) {
          btnCalc.addEventListener('click', function() {
            var raw = $('input').value;
            var data = parseValues(raw);

            if (data.length < 2) {
              alert('Por favor ingresa al menos 2 números válidos.');
              return;
            }

            // Cálculos
            var media = getMean(data);
            var varianza = getVariance(data);
            var desv = Math.sqrt(varianza);

            // Actualizar DOM
            $('n').innerText = data.length;
            $('media').innerText = media.toFixed(2);
            $('var').innerText = varianza.toFixed(2);
            $('desv').innerText = desv.toFixed(2);

            // Dibujar
            drawPlot(data);
            $('resultados').style.display = 'block';
          });
          
          // Calcular automáticamente al cargar
          setTimeout(function() { btnCalc.click(); }, 500);
        }

      })();
      </script>
    `;
  }
};
