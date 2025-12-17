export default {
  render: function(params, simName) {
    const id_base = 'sim_pascal_' + Math.random().toString(36).substr(2, 9);
    const title = simName || 'Triángulo de Pascal';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          <div style="margin-bottom:15px; text-align:center;">
            <label>Filas a generar (n):</label>
            <input type="number" id="${id_base}_rows" value="6" min="1" max="12" style="width:60px; padding:5px; border-radius:4px; border:1px solid #ccc;">
            <button id="${id_base}_gen" class="btn-sim">Generar Triángulo</button>
          </div>
          
          <div id="${id_base}_container" style="text-align:center; overflow-x:auto; padding:20px; background:#f8fafc; border-radius:8px;"></div>
          
          <div style="margin-top:10px; font-size:0.85rem; color:#64748b; text-align:center;">
            <i>Nota: Cada número es la suma de los dos números que tiene inmediatamente arriba (Propiedad IV).</i>
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

        var btnGen = document.getElementById(id + '_gen');
        if(btnGen){
            btnGen.addEventListener('click', function() {
               var n = parseInt(document.getElementById(id + '_rows').value);
               if(n > 12) { alert('Máximo 12 filas para visualización óptima.'); n = 12; }
               var container = document.getElementById(id + '_container');
               container.innerHTML = '';

               var triangle = [[1]];
               
               for(var i=1; i<n; i++) {
                  var prevRow = triangle[i-1];
                  var newRow = [1];
                  for(var j=1; j<prevRow.length; j++) {
                     newRow.push(prevRow[j-1] + prevRow[j]);
                  }
                  newRow.push(1);
                  triangle.push(newRow);
               }

               triangle.forEach(function(row) {
                  var rowDiv = document.createElement('div');
                  rowDiv.style.marginBottom = '8px';
                  rowDiv.style.height = '30px';
                  
                  row.forEach(function(val) {
                     var span = document.createElement('span');
                     span.innerText = val;
                     span.style.display = 'inline-block';
                     span.style.width = '35px';
                     span.style.height = '35px';
                     span.style.lineHeight = '35px';
                     span.style.margin = '0 3px';
                     span.style.background = '#e0f2fe';
                     span.style.borderRadius = '50%';
                     span.style.fontSize = '0.9rem';
                     span.style.fontWeight = 'bold';
                     span.style.color = '#0369a1';
                     span.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                     span.title = 'Coeficiente Binomial';
                     rowDiv.appendChild(span);
                  });
                  container.appendChild(rowDiv);
               });
            });
        }
      })();
      </script>
    `;
  }
};
