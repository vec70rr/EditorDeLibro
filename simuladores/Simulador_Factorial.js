export default {
  render: function(params, simName) {
    const id_base = 'sim_fact_' + Math.random().toString(36).substr(2, 9);
    const title = simName || 'Calculadora de Factorial';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px; background:#f0f9ff; border:1px solid #bae6fd; padding:15px; border-radius:8px;">
          <h4 style="margin-top:0; color:#0369a1;">Cálculo de Factorial (n!)</h4>
          <p style="font-size:0.9rem;">El factorial es el producto de todos los enteros desde 1 hasta n.</p>
          
          <div style="display:flex; gap:10px; align-items:center; margin-bottom:15px;">
            <label>Valor de <b>n</b>:</label>
            <input type="number" id="${id_base}_n" min="0" max="170" value="5" style="width:60px; padding:5px;">
            <button id="${id_base}_calc" class="btn-sim" style="padding:5px 15px;">Calcular</button>
          </div>

          <div id="${id_base}_res" style="display:none; background:white; padding:10px; border-radius:5px; border:1px solid #ddd;">
            <div style="font-size:1.1rem; margin-bottom:5px;">Resultado: <b id="${id_base}_val" style="color:#059669;"></b></div>
            <div style="font-family:monospace; color:#555; font-size:0.9rem; word-break:break-all;">Operación: <span id="${id_base}_op"></span></div>
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
          if (n < 0) return null;
          if (n === 0 || n === 1) return 1;
          var res = 1;
          for (var i = 2; i <= n; i++) res *= i;
          return res;
        }

        var btnCalc = document.getElementById(id + '_calc');
        if(btnCalc){
            btnCalc.addEventListener('click', function() {
              var n = parseInt(document.getElementById(id + '_n').value);
              
              if (isNaN(n) || n < 0) {
                alert('Por favor ingresa un número entero no negativo.');
                return;
              }
              
              if (n > 170) {
                 alert('El número es demasiado grande para calcularlo en el navegador.');
                 return;
              }

              var res = factorial(n);
              var opStr = n + '! = ';
              
              if (n === 0) {
                opStr += '1 (Por definición)';
              } else {
                var terms = [];
                for(var i=n; i>=1; i--) terms.push(i);
                if(n > 10) {
                   opStr += terms.slice(0,5).join(' × ') + ' × ... × 1';
                } else {
                   opStr += terms.join(' × ');
                }
              }

              document.getElementById(id + '_val').innerText = res.toLocaleString();
              document.getElementById(id + '_op').innerText = opStr;
              document.getElementById(id + '_res').style.display = 'block';
            });
        }
      })();
      </script>
    `;
  }
};
