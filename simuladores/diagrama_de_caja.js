export default {
  render: function(params, simName) {
    const id_base = 'sim_boxplot_' + Math.random().toString(36).substr(2, 9);
    const title = simName || 'Diagrama de Caja y Outliers';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          
          <style>
            .res-grid-${id_base} { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 15px 0; font-family: monospace; }
            .stat-box-${id_base} { background: #fff; border: 1px solid #ccc; padding: 5px; text-align: center; border-radius: 4px; }
            .box-plot-${id_base} { position: relative; height: 120px; background: #f9f9f9; border: 1px solid #ccc; border-radius: 8px; margin: 20px 0; }
            
            /* Elementos del Boxplot */
            .box-${id_base} { position: absolute; bottom: 40px; height: 40px; background: rgba(37, 99, 235, 0.1); border: 2px solid #2563eb; z-index: 1; }
            .median-line-${id_base} { position: absolute; bottom: 40px; height: 40px; width: 3px; background: #ef4444; z-index: 2; }
            .whisker-${id_base} { position: absolute; bottom: 60px; height: 2px; background: #2563eb; z-index: 1; }
            .whisker-cap-${id_base} { position: absolute; bottom: 50px; height: 20px; width: 2px; background: #2563eb; z-index: 1; }
            .outlier-${id_base} { position: absolute; bottom: 54px; width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; border: 1px solid #fff; transform: translateX(-50%); z-index: 3; }
            .outlier-ext-${id_base} { background: #ef4444; width: 12px; height: 12px; }
            .axis-txt-${id_base} { position: absolute; bottom: 10px; font-size: 10px; color: #555; transform: translateX(-50%); }
          </style>

          <div style="margin-bottom: 15px;">
            <label style="display:block; font-weight:600;">Datos:</label>
            <textarea id="${id_base}_input" rows="2" style="width:100%; padding:8px; border-radius:4px; border:1px solid #999;">15, 18, 22, 25, 28, 30, 32, 35, 38, 40, 95, 120</textarea>
            <button id="${id_base}_btn_run" class="btn-sim" style="margin-top:8px;">Generar Diagrama</button>
          </div>

          <div id="${id_base}_res" style="display:none;">
            <div class="res-grid-${id_base}">
              <div class="stat-box-${id_base}">Q1: <b id="${id_base}_q1"></b></div>
              <div class="stat-box-${id_base}">Med: <b id="${id_base}_med"></b></div>
              <div class="stat-box-${id_base}">Q3: <b id="${id_base}_q3"></b></div>
              <div class="stat-box-${id_base}">IQR: <b id="${id_base}_iqr"></b></div>
            </div>
            
            <div id="${id_base}_canvas" class="box-plot-${id_base}"></div>
            
            <div style="font-size:0.9rem; background:#eff6ff; padding:10px; border-left:4px solid #2563eb;">
              Outliers detectados: <b id="${id_base}_out_count">0</b>
            </div>
          </div>

        </div>
      </div>

      <script>
      (function() {
        var id_base = '${id_base}';
        var simName = '${title}';
        function $(id) { return document.getElementById(id_base + '_' + id); }

        // 1. Toggle Function
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

        // 2. Math Logic
        function parse(str) {
          return str.split(/[\\s,;]+/).map(Number).filter(function(n) { return !isNaN(n); }).sort(function(a,b){return a-b;});
        }

        function getQuartiles(sorted) {
          function q(p) {
            var pos = (sorted.length - 1) * p;
            var base = Math.floor(pos);
            var rest = pos - base;
            if (sorted[base + 1] !== undefined) {
              return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
            }
            return sorted[base];
          }
          return { q1: q(0.25), med: q(0.5), q3: q(0.75) };
        }

        // 3. Render Logic (Strict Concatenation)
        function drawBox(data) {
          var container = $('canvas');
          container.innerHTML = '';
          
          if (data.length < 5) {
             container.innerHTML = '<p style="text-align:center; padding-top:40px;">Necesito más datos (min 5)</p>';
             return;
          }

          var stats = getQuartiles(data);
          var iqr = stats.q3 - stats.q1;
          var lowerBound = stats.q1 - 1.5 * iqr;
          var upperBound = stats.q3 + 1.5 * iqr;
          var extremeLower = stats.q1 - 3 * iqr;
          var extremeUpper = stats.q3 + 3 * iqr;

          var validPoints = data.filter(function(v){ return v >= lowerBound && v <= upperBound; });
          var minW = Math.min.apply(null, validPoints);
          var maxW = Math.max.apply(null, validPoints);
          
          var outliers = data.filter(function(v){ return v < lowerBound || v > upperBound; });
          
          // Escala visual
          var globalMin = data[0];
          var globalMax = data[data.length-1];
          var range = (globalMax - globalMin) || 1;
          
          function toPct(val) {
            return ((val - globalMin) / range) * 100;
          }

          // Dibujar Caja
          var box = document.createElement('div');
          box.className = 'box-' + id_base;
          box.style.left = toPct(stats.q1) + '%';
          box.style.width = (toPct(stats.q3) - toPct(stats.q1)) + '%';
          container.appendChild(box);

          // Mediana
          var med = document.createElement('div');
          med.className = 'median-line-' + id_base;
          med.style.left = toPct(stats.med) + '%';
          container.appendChild(med);

          // Bigotes (Líneas horizontales)
          var wLeft = document.createElement('div');
          wLeft.className = 'whisker-' + id_base;
          wLeft.style.left = toPct(minW) + '%';
          wLeft.style.width = (toPct(stats.q1) - toPct(minW)) + '%';
          container.appendChild(wLeft);

          var wRight = document.createElement('div');
          wRight.className = 'whisker-' + id_base;
          wRight.style.left = toPct(stats.q3) + '%';
          wRight.style.width = (toPct(maxW) - toPct(stats.q3)) + '%';
          container.appendChild(wRight);

          // Tapas de Bigotes (Verticales)
          [minW, maxW].forEach(function(val) {
            var cap = document.createElement('div');
            cap.className = 'whisker-cap-' + id_base;
            cap.style.left = toPct(val) + '%';
            container.appendChild(cap);
          });

          // Outliers
          outliers.forEach(function(val) {
            var o = document.createElement('div');
            o.className = 'outlier-' + id_base;
            if (val < extremeLower || val > extremeUpper) {
               o.className += ' outlier-ext-' + id_base;
            }
            o.style.left = toPct(val) + '%';
            o.title = 'Atípico: ' + val;
            container.appendChild(o);
          });

          // Etiquetas Ejes
          [globalMin, stats.q1, stats.med, stats.q3, globalMax].forEach(function(val) {
             var lbl = document.createElement('div');
             lbl.className = 'axis-txt-' + id_base;
             lbl.innerText = val.toFixed(1);
             lbl.style.left = toPct(val) + '%';
             container.appendChild(lbl);
          });

          // Actualizar textos
          $('q1').innerText = stats.q1.toFixed(1);
          $('med').innerText = stats.med.toFixed(1);
          $('q3').innerText = stats.q3.toFixed(1);
          $('iqr').innerText = iqr.toFixed(1);
          $('out_count').innerText = outliers.length;
        }

        // 4. Init
        var btn = $('btn_run');
        if(btn) {
           btn.addEventListener('click', function() {
              var d = parse($('input').value);
              drawBox(d);
              $('res').style.display = 'block';
           });
           setTimeout(function(){ btn.click(); }, 500);
        }

      })();
      </script>
    `;
  }
};
