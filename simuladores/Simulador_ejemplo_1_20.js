export default {
  render: function(params, simName) {
    var id_base = 'sim_ex_1_20_' + Math.random().toString(36).substr(2, 9);
    var title = simName || 'Ejemplo 1.20: Cargas de Nitrógeno';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          
          <style>
             .nitro-plot-${id_base} { position:relative; height:100px; background:#fafafa; border:1px solid #ccc; border-radius:4px; margin:15px 0; }
             /* Estilos reutilizados internamente */
             .nb-box-${id_base} { position:absolute; top:30px; height:40px; background:rgba(220, 38, 38, 0.1); border:1px solid #dc2626; }
             .nb-med-${id_base} { position:absolute; top:30px; height:40px; width:2px; background:#b91c1c; }
             .nb-out-${id_base} { position:absolute; top:45px; width:8px; height:8px; border-radius:50%; background:#ef4444; transform:translate(-50%, -50%); opacity:0.7; }
             .nb-out-ext-${id_base} { background:#991b1b; width:10px; height:10px; border:2px solid #fff; z-index:10; }
             .stat-row-${id_base} { display:flex; justify-content:space-between; background:#fff; padding:10px; border:1px solid #eee; margin-bottom:10px; font-size:0.9rem; }
          </style>

          <div style="background:#fff7ed; padding:10px; border-left:4px solid #f97316; font-size:0.9rem; margin-bottom:10px;">
            Este conjunto de datos contiene valores de carga de nitrógeno (kg/día). Nota la fuerte asimetría y los valores extremos muy altos.
          </div>

          <button id="${id_base}_btn_load" class="btn-sim">Cargar Datos del Ejemplo</button>

          <div id="${id_base}_res" style="display:none; margin-top:15px;">
             <div class="stat-row-${id_base}">
               <span>Media: <b id="${id_base}_mean"></b></span>
               <span>Mediana: <b id="${id_base}_med"></b></span>
               <span>Máximo: <b id="${id_base}_max"></b></span>
             </div>

             <div class="nitro-plot-${id_base}" id="${id_base}_canvas"></div>

             <div style="font-size:0.85rem; color:#555;">
               <span style="display:inline-block; width:10px; height:10px; background:#ef4444; border-radius:50%;"></span> Outlier Moderado
               <span style="display:inline-block; width:10px; height:10px; background:#991b1b; border:1px solid #000; border-radius:50%; margin-left:10px;"></span> Outlier Extremo
             </div>
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

        // Datos Hardcoded del ejemplo
        var data = [9.69, 13.16, 17.09, 18.12, 23.70, 24.07, 24.29, 26.43, 30.75, 31.54, 35.07, 36.99, 40.32, 42.51, 45.64, 48.22, 49.98, 50.06, 55.02, 57.00, 58.41, 61.31, 64.25, 65.24, 66.14, 67.68, 81.40, 90.80, 92.17, 92.42, 100.82, 101.94, 103.61, 106.28, 106.80, 108.69, 114.61, 120.86, 124.54, 143.27, 143.75, 149.64, 167.79, 182.50, 192.55, 193.53, 271.57, 292.61, 312.45, 352.09, 371.47, 444.68, 460.86, 563.92, 690.11, 826.54, 1529.35];

        $('btn_load').addEventListener('click', function() {
           // Estadisticas basicas
           var sorted = data.slice().sort(function(a,b){return a-b;});
           var n = sorted.length;
           var mean = sorted.reduce(function(a,b){return a+b;},0)/n;
           
           var med = (n % 2 === 0) ? (sorted[n/2-1] + sorted[n/2])/2 : sorted[(n-1)/2];
           var q1 = sorted[Math.floor((n-1)*0.25)]; // Simple aprox
           var q3 = sorted[Math.floor((n-1)*0.75)]; 
           
           var iqr = q3 - q1;
           var lb = q1 - 1.5*iqr, ub = q3 + 1.5*iqr;
           var elb = q1 - 3*iqr, eub = q3 + 3*iqr;
           
           $('mean').innerText = mean.toFixed(1);
           $('med').innerText = med.toFixed(1);
           $('max').innerText = sorted[n-1].toFixed(1);
           
           // Dibujar
           var cvs = $('canvas');
           cvs.innerHTML = '';
           var minV = sorted[0], maxV = sorted[n-1];
           var range = maxV - minV;
           var pct = function(v) { return ((v - minV) / range) * 95 + 2; }; // Padding 2%

           // Caja y Mediana
           var box = document.createElement('div');
           box.className = 'nb-box-' + id;
           box.style.left = pct(q1) + '%';
           box.style.width = (pct(q3) - pct(q1)) + '%';
           cvs.appendChild(box);

           var mLine = document.createElement('div');
           mLine.className = 'nb-med-' + id;
           mLine.style.left = pct(med) + '%';
           cvs.appendChild(mLine);
           
           // Outliers
           sorted.forEach(function(v) {
              if (v < lb || v > ub) {
                 var o = document.createElement('div');
                 o.className = 'nb-out-' + id;
                 if (v < elb || v > eub) o.className += ' nb-out-ext-' + id;
                 o.style.left = pct(v) + '%';
                 o.title = v;
                 cvs.appendChild(o);
              }
           });
           
           $('res').style.display = 'block';
        });

      })();
      </script>
    `;
  }
};
