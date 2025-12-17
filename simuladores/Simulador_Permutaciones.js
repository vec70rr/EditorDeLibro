export default {
  render: function(params, simName) {
    const id_base = 'sim_perm_' + Math.random().toString(36).substr(2, 9);
    const title = simName || 'Calculadora de Ordenaciones';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          <div style="background:#fff7ed; padding:10px; border-radius:5px; margin-bottom:10px; font-size:0.9rem;">
            Calcula ordenaciones de <b>n</b> objetos tomados de <b>r</b> en <b>r</b>. Importa el orden.
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div>
              <label>Total (n):</label>
              <input type="number" id="${id_base}_n" value="7" style="width:100%;">
            </div>
            <div>
              <label>Selección (r):</label>
              <input type="number" id="${id_base}_r" value="3" style="width:100%;">
            </div>
          </div>
          
          <button id="${id_base}_calc" class="btn-sim" style="margin-top:10px; width:100%;">Calcular Ordenaciones</button>

          <div id="${id_base}_res" style="display:none; margin-top:15px; text-align:center;">
             <div style="font-size:1.5rem; color:#ea580c; font-weight:bold;" id="${id_base}_val">0</div>
             <div style="color:#666;" id="${id_base}_detail"></div>
          </div>
        </div>
      </div>

      <script>
      (function() {
        var id = '${id_base}';
        var name = '${title}';
        
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

        function factorial(n) {
          if (n < 0) return 1; 
          var res = 1;
          for (var i = 2; i <= n; i++) res *= i;
          return res;
        }

        var btnCalc = document.getElementById(id + '_calc');
        if(btnCalc){
            btnCalc.addEventListener('click', function() {
               var n = parseInt(document.getElementById(id + '_n').value);
               var r = parseInt(document.getElementById(id + '_r').value);

               if(isNaN(n) || isNaN(r) || n < 0 || r < 0) {
                 alert('Ingresa valores válidos (n >= 0, r >= 0).');
                 return;
               }
               if(r > n) {
                 alert('r no puede ser mayor que n.');
                 return;
               }

               var res = factorial(n) / factorial(n - r);
               
               document.getElementById(id + '_val').innerText = res.toLocaleString();
               document.getElementById(id + '_detail').innerHTML = 
                 'Se calculó: ' + n + '! / (' + n + ' - ' + r + ')!';
               document.getElementById(id + '_res').style.display = 'block';
            });
        }
      })();
      </script>
    `;
  }
};
