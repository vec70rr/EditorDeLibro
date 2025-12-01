export default {
  render: function(params, simName) {
    var id_base = 'sim_var_n_' + Math.random().toString(36).substr(2, 9);
    var title = simName || 'Varianza: n vs n-1';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          
          <style>
             .comp-box-${id_base} { display:flex; justify-content:space-around; margin:20px 0; gap:10px; }
             .res-card-${id_base} { background:#f8fafc; border:1px solid #e2e8f0; padding:15px; border-radius:8px; width:45%; text-align:center; }
             .val-big-${id_base} { font-size:1.4rem; font-weight:bold; color:#2563eb; display:block; margin:10px 0; }
             .formula-txt-${id_base} { font-size:0.8rem; color:#64748b; font-style:italic; }
             .diff-alert-${id_base} { background:#fef3c7; border-left:4px solid #f59e0b; padding:10px; color:#92400e; font-size:0.9rem; margin-top:10px; }
          </style>

          <label>Datos (Muestra pequeña para ver el efecto):</label>
          <textarea id="${id_base}_input" rows="2" style="width:100%; border:1px solid #ccc;">10, 12, 14, 16</textarea>
          <button id="${id_base}_btn_calc" class="btn-sim" style="margin-top:10px;">Calcular Diferencia</button>

          <div id="${id_base}_res" style="display:none;">
             <div class="comp-box-${id_base}">
               <div class="res-card-${id_base}">
                 <strong>Poblacional (÷ n)</strong>
                 <span class="formula-txt-${id_base}">Sesgada si es muestra</span>
                 <span id="${id_base}_res_pop" class="val-big-${id_base}">0.00</span>
               </div>
               <div class="res-card-${id_base}" style="border-color:#2563eb; background:#eff6ff;">
                 <strong>Muestral (÷ n-1)</strong>
                 <span class="formula-txt-${id_base}">Corrección de Bessel</span>
                 <span id="${id_base}_res_sam" class="val-big-${id_base}">0.00</span>
               </div>
             </div>
             
             <div id="${id_base}_diff_msg" class="diff-alert-${id_base}"></div>
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

        function parse(str) { return str.split(/[\\s,;]+/).map(Number).filter(function(n){return !isNaN(n);}); }

        $('btn_calc').addEventListener('click', function() {
           var d = parse($('input').value);
           if(d.length < 2) { alert('Mínimo 2 datos'); return; }
           
           var mean = d.reduce(function(a,b){return a+b;},0)/d.length;
           var ssq = d.reduce(function(a,b){return a + Math.pow(b-mean,2);},0);
           
           var varPop = ssq / d.length;
           var varSam = ssq / (d.length - 1);
           
           $('res_pop').innerText = varPop.toFixed(4);
           $('res_sam').innerText = varSam.toFixed(4);
           
           var diff = varSam - varPop;
           $('diff_msg').innerHTML = 'La varianza muestral es <b>' + diff.toFixed(4) + '</b> unidades mayor.<br>Al dividir por (n-1), compensamos el hecho de que la media muestral se ajusta a los datos, subestimando la dispersión real.';
           
           $('res').style.display = 'block';
        });
        
        setTimeout(function(){ $('btn_calc').click(); }, 500);

      })();
      </script>
    `;
  }
};
