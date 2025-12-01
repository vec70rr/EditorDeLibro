export default {
  render: function(params, simName) {
    var id_base = 'sim_compare_' + Math.random().toString(36).substr(2, 9);
    var title = simName || 'Comparar Muestras (A vs B)';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          
          <style>
            .compare-grid-${id_base} { display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 15px; }
            .group-box-${id_base} { border: 1px solid #ddd; padding: 10px; border-radius: 6px; background: #fdfdfd; }
            .box-plot-${id_base} { position: relative; height: 80px; background: #fafafa; border: 1px solid #eee; margin-top: 10px; border-radius: 4px; }
            .box-rect-${id_base} { position: absolute; top: 20px; height: 40px; background: rgba(37, 99, 235, 0.15); border: 2px solid #2563eb; z-index: 1; }
            .med-line-${id_base} { position: absolute; top: 20px; height: 40px; width: 3px; background: #ef4444; z-index: 2; }
            .whisker-line-${id_base} { position: absolute; top: 40px; height: 2px; background: #2563eb; z-index: 0; }
            .whisker-cap-${id_base} { position: absolute; top: 30px; height: 20px; width: 2px; background: #2563eb; z-index: 0; }
            .outlier-${id_base} { position: absolute; top: 36px; width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; transform: translateX(-50%); z-index: 3; }
            .res-diff-${id_base} { background: #eff6ff; border-left: 4px solid #2563eb; padding: 10px; font-size: 0.9rem; color: #1e3a8a; }
          </style>

          <div class="compare-grid-${id_base}">
            <div class="group-box-${id_base}">
              <label style="font-weight:bold; color:#2563eb;">Grupo A:</label>
              <textarea id="${id_base}_inA" rows="1" style="width:100%; border:1px solid #ccc;">12, 15, 18, 20, 22, 25, 28</textarea>
            </div>
            <div class="group-box-${id_base}">
              <label style="font-weight:bold; color:#d97706;">Grupo B:</label>
              <textarea id="${id_base}_inB" rows="1" style="width:100%; border:1px solid #ccc;">18, 20, 22, 24, 26, 28, 30, 40</textarea>
            </div>
          </div>
          
          <button id="${id_base}_btn_run" class="btn-sim">Comparar Grupos</button>

          <div id="${id_base}_res" style="display:none; margin-top:20px;">
            <label>Distribución A:</label>
            <div id="${id_base}_plotA" class="box-plot-${id_base}"></div>
            
            <label>Distribución B:</label>
            <div id="${id_base}_plotB" class="box-plot-${id_base}"></div>

            <div id="${id_base}_analisis" class="res-diff-${id_base}"></div>
          </div>

        </div>
      </div>

      <script>
      (function() {
        var id = '${id_base}';
        var name = '${title}';
        function $(eid) { return document.getElementById(id + '_' + eid); }

        window['toggleSim_' + id] = function() {
          var box = document.getElementById('sim_box_' + id);
          var btn = document.getElementById('btn_toggle_' + id);
          if (box.style.display === 'none') {
            box.style.display = 'block';
            btn.innerText = 'Ocultar ' + name;
            btn.classList.add('btn-sim-rojo');
          } else {
            box.style.display = 'none';
            btn.innerText = 'Abrir ' + name;
            btn.classList.remove('btn-sim-rojo');
          }
        };

        function parse(str) {
          return str.split(/[\\s,;]+/).map(Number).filter(function(n){ return !isNaN(n); }).sort(function(a,b){return a-b;});
        }

        function getStats(arr) {
          function q(p) {
            var pos = (arr.length - 1) * p;
            var base = Math.floor(pos);
            var rest = pos - base;
            return arr[base+1]!==undefined ? arr[base]+rest*(arr[base+1]-arr[base]) : arr[base];
          }
          var q1 = q(0.25), med = q(0.5), q3 = q(0.75);
          var iqr = q3 - q1;
          var lb = q1 - 1.5 * iqr, ub = q3 + 1.5 * iqr;
          return {
            q1: q1, med: med, q3: q3,
            minW: Math.min.apply(null, arr.filter(function(v){ return v>=lb; })),
            maxW: Math.max.apply(null, arr.filter(function(v){ return v<=ub; })),
            out: arr.filter(function(v){ return v<lb || v>ub; })
          };
        }

        function draw(container, data, globalMin, globalMax) {
          container.innerHTML = '';
          if(data.length < 2) return;
          
          var s = getStats(data);
          var range = (globalMax - globalMin) || 1;
          var toPct = function(v) { return ((v - globalMin) / range) * 100; };

          // Caja
          var box = document.createElement('div');
          box.className = 'box-rect-' + id;
          box.style.left = toPct(s.q1) + '%';
          box.style.width = (toPct(s.q3) - toPct(s.q1)) + '%';
          container.appendChild(box);

          // Mediana
          var m = document.createElement('div');
          m.className = 'med-line-' + id;
          m.style.left = toPct(s.med) + '%';
          container.appendChild(m);

          // Bigotes
          var lineL = document.createElement('div');
          lineL.className = 'whisker-line-' + id;
          lineL.style.left = toPct(s.minW) + '%';
          lineL.style.width = (toPct(s.q1) - toPct(s.minW)) + '%';
          container.appendChild(lineL);

          var lineR = document.createElement('div');
          lineR.className = 'whisker-line-' + id;
          lineR.style.left = toPct(s.q3) + '%';
          lineR.style.width = (toPct(s.maxW) - toPct(s.q3)) + '%';
          container.appendChild(lineR);

          // Tapas
          [s.minW, s.maxW].forEach(function(v) {
            var cap = document.createElement('div');
            cap.className = 'whisker-cap-' + id;
            cap.style.left = toPct(v) + '%';
            container.appendChild(cap);
          });

          // Outliers
          s.out.forEach(function(v) {
            var o = document.createElement('div');
            o.className = 'outlier-' + id;
            o.style.left = toPct(v) + '%';
            container.appendChild(o);
          });
        }

        $('btn_run').addEventListener('click', function() {
          var dA = parse($('inA').value);
          var dB = parse($('inB').value);
          
          if(dA.length < 2 || dB.length < 2) { alert('Mínimo 2 datos por grupo'); return; }

          // Escala global compartida
          var all = dA.concat(dB);
          var min = Math.min.apply(null, all);
          var max = Math.max.apply(null, all);
          // Margen visual 5%
          var span = max - min;
          min -= span * 0.05; 
          max += span * 0.05;

          draw($('plotA'), dA, min, max);
          draw($('plotB'), dB, min, max);

          var meanA = dA.reduce(function(a,b){return a+b;},0)/dA.length;
          var meanB = dB.reduce(function(a,b){return a+b;},0)/dB.length;
          var diff = (meanA - meanB).toFixed(2);
          
          $('analisis').innerHTML = '<b>Análisis Rápido:</b><br>' +
             'Promedio A: ' + meanA.toFixed(2) + '<br>' +
             'Promedio B: ' + meanB.toFixed(2) + '<br>' +
             'Diferencia (A - B): ' + diff;
          
          $('res').style.display = 'block';
        });

        // Autostart
        setTimeout(function(){ $('btn_run').click(); }, 600);

      })();
      </script>
    `;
  }
};
