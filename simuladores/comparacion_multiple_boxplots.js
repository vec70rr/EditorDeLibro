export default {
  render: function(params, simName) {
    var id_base = 'sim_multi_' + Math.random().toString(36).substr(2, 9);
    var title = simName || 'Comparación Múltiple (Boxplots)';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          
          <style>
            .multi-cont-${id_base} { margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px; }
            .multi-plot-area-${id_base} { display:flex; flex-direction:column; gap:10px; margin-top:15px; }
            .multi-row-${id_base} { display:flex; align-items:center; height:60px; background:#f9f9f9; border:1px solid #eee; position:relative; }
            .multi-lbl-${id_base} { width:80px; font-size:0.8rem; font-weight:bold; padding-left:10px; border-right:1px solid #ddd; z-index:10; background:#f9f9f9; }
            .multi-canvas-${id_base} { flex-grow:1; position:relative; height:100%; }
            /* Elementos graficos minimos */
            .m-box-${id_base} { position:absolute; top:15px; height:30px; background:rgba(16, 185, 129, 0.2); border:1px solid #10b981; }
            .m-med-${id_base} { position:absolute; top:15px; height:30px; width:2px; background:#047857; }
            .m-whisk-${id_base} { position:absolute; top:29px; height:2px; background:#10b981; }
            .m-out-${id_base} { position:absolute; top:26px; width:6px; height:6px; background:#ef4444; border-radius:50%; transform:translateX(-50%); }
          </style>

          <div class="multi-cont-${id_base}">
            <label>Grupo 1:</label><textarea id="${id_base}_g1" rows="1" style="width:100%; margin-bottom:5px;">211, 260, 220, 170, 210, 190, 240</textarea>
            <label>Grupo 2:</label><textarea id="${id_base}_g2" rows="1" style="width:100%; margin-bottom:5px;">291, 262, 253, 290, 243, 220, 260</textarea>
            <label>Grupo 3:</label><textarea id="${id_base}_g3" rows="1" style="width:100%; margin-bottom:5px;">172, 296, 241, 231, 260, 228, 208</textarea>
            <button id="${id_base}_btn_multi" class="btn-sim" style="margin-top:5px;">Generar Comparativa</button>
          </div>

          <div id="${id_base}_res" style="display:none;">
             <div id="${id_base}_plots" class="multi-plot-area-${id_base}"></div>
             <div style="font-size:0.8rem; color:#666; text-align:center; margin-top:5px;">Escala compartida basada en el Mínimo y Máximo global.</div>
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

        function parse(str) { return str.split(/[\\s,;]+/).map(Number).filter(function(n){return !isNaN(n);}).sort(function(a,b){return a-b;}); }

        function getStats(d) {
           if(d.length===0) return null;
           var q = function(p) { var i=(d.length-1)*p, b=Math.floor(i), r=i-b; return d[b+1]!==undefined ? d[b]+r*(d[b+1]-d[b]) : d[b]; };
           var q1=q(0.25), q3=q(0.75), iqr=q3-q1;
           var lb=q1-1.5*iqr, ub=q3+1.5*iqr;
           return {
             q1:q1, med:q(0.5), q3:q3,
             min: Math.min.apply(null, d.filter(function(v){return v>=lb;})),
             max: Math.max.apply(null, d.filter(function(v){return v<=ub;})),
             out: d.filter(function(v){return v<lb||v>ub;})
           };
        }

        $('btn_multi').addEventListener('click', function() {
           var g1 = parse($('g1').value);
           var g2 = parse($('g2').value);
           var g3 = parse($('g3').value);
           
           var groups = [ {name:'G1', d:g1}, {name:'G2', d:g2}, {name:'G3', d:g3} ];
           var all = [].concat(g1, g2, g3);
           
           if(all.length < 5) { alert('Insuficientes datos.'); return; }
           
           var minG = Math.min.apply(null, all);
           var maxG = Math.max.apply(null, all);
           var span = maxG - minG || 1;
           
           var container = $('plots');
           container.innerHTML = '';

           groups.forEach(function(g) {
              if(g.d.length < 2) return;
              var s = getStats(g.d);
              var pct = function(v) { return ((v - minG) / span) * 100; };
              
              var row = document.createElement('div');
              row.className = 'multi-row-' + id;
              
              var lbl = document.createElement('div');
              lbl.className = 'multi-lbl-' + id;
              lbl.innerText = g.name + ' (n=' + g.d.length + ')';
              row.appendChild(lbl);
              
              var cvs = document.createElement('div');
              cvs.className = 'multi-canvas-' + id;
              
              // Caja
              var box = document.createElement('div');
              box.className = 'm-box-' + id;
              box.style.left = pct(s.q1) + '%';
              box.style.width = (pct(s.q3) - pct(s.q1)) + '%';
              cvs.appendChild(box);
              
              // Mediana
              var med = document.createElement('div');
              med.className = 'm-med-' + id;
              med.style.left = pct(s.med) + '%';
              cvs.appendChild(med);
              
              // Bigotes
              var wl = document.createElement('div');
              wl.className = 'm-whisk-' + id;
              wl.style.left = pct(s.min) + '%';
              wl.style.width = (pct(s.q1) - pct(s.min)) + '%';
              cvs.appendChild(wl);
              
              var wr = document.createElement('div');
              wr.className = 'm-whisk-' + id;
              wr.style.left = pct(s.q3) + '%';
              wr.style.width = (pct(s.max) - pct(s.q3)) + '%';
              cvs.appendChild(wr);

              // Outliers
              s.out.forEach(function(o) {
                 var dot = document.createElement('div');
                 dot.className = 'm-out-' + id;
                 dot.style.left = pct(o) + '%';
                 cvs.appendChild(dot);
              });
              
              row.appendChild(cvs);
              container.appendChild(row);
           });
           
           $('res').style.display = 'block';
        });
        
        // Auto init
        setTimeout(function(){ $('btn_multi').click(); }, 700);

      })();
      </script>
    `;
  }
};
