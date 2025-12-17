export default {
  render: function(params, simName) {
    const id_base = 'sim_pm_' + Math.random().toString(36).substr(2, 9);
    const title = simName || 'Principio Multiplicativo';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          <p>Añade los actos o etapas del experimento. Ejemplo: Rutas de A a B (3), Rutas de B a C (2).</p>
          
          <div id="${id_base}_inputs_container">
             <div class="input-row" style="margin-bottom:5px;">
               <label>Acto 1 (Maneras):</label>
               <input type="number" class="pm-input-${id_base}" value="3" style="width:50px;" min="1">
             </div>
             <div class="input-row" style="margin-bottom:5px;">
               <label>Acto 2 (Maneras):</label>
               <input type="number" class="pm-input-${id_base}" value="2" style="width:50px;" min="1">
             </div>
          </div>

          <div style="margin-top:10px;">
            <button id="${id_base}_add" class="btn-sim" style="background:#64748b;">+ Agregar Acto</button>
            <button id="${id_base}_calc" class="btn-sim">Calcular Total</button>
          </div>

          <div id="${id_base}_res" style="display:none; margin-top:15px; padding:10px; background:#ecfccb; border:1px solid #84cc16; border-radius:5px; color:#365314;">
             <strong>Resultado:</strong> <span id="${id_base}_total"></span> maneras diferentes.
             <div id="${id_base}_formula" style="font-size:0.8rem; margin-top:5px;"></div>
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

        var count = 2;
        var btnAdd = document.getElementById(id + '_add');
        if(btnAdd){
            btnAdd.addEventListener('click', function() {
               count++;
               var div = document.createElement('div');
               div.style.marginBottom = '5px';
               div.innerHTML = '<label>Acto ' + count + ' (Maneras): </label><input type="number" class="pm-input-' + id + '" value="1" style="width:50px;" min="1">';
               document.getElementById(id + '_inputs_container').appendChild(div);
            });
        }

        var btnCalc = document.getElementById(id + '_calc');
        if(btnCalc){
            btnCalc.addEventListener('click', function() {
               var inputs = document.getElementsByClassName('pm-input-' + id);
               var total = 1;
               var formulaParts = [];
               
               for(var i=0; i<inputs.length; i++) {
                  var val = parseInt(inputs[i].value);
                  if(isNaN(val) || val < 0) val = 0;
                  total *= val;
                  formulaParts.push(val);
               }

               document.getElementById(id + '_total').innerText = total.toLocaleString();
               document.getElementById(id + '_formula').innerText = formulaParts.join(' × ') + ' = ' + total;
               document.getElementById(id + '_res').style.display = 'block';
            });
        }
      })();
      </script>
    `;
  }
};
