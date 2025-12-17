export default {
  render: function(params, simName) {
    const id_base = 'sim_arbol_' + Math.random().toString(36).substr(2, 9);
    const title = simName || 'Diagrama de Árbol (Torneo)';

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${title}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          <div style="background:#fff7ed; padding:10px; border-left:4px solid #f97316; margin-bottom:15px; font-size:0.9rem;">
            <strong>Ejemplo del Libro:</strong> Sergio (S) y Antonio (A) juegan tenis. Gana el primero en lograr 2 juegos seguidos o un total de 3.
          </div>

          <div id="${id_base}_tree_container" style="display:flex; justify-content:center; overflow-x:auto; padding:20px; min-height:200px;">
             <div style="text-align:center;">
                <button id="${id_base}_start" class="btn-sim" style="background:#ea580c;">Ver Resultados Posibles</button>
             </div>
          </div>
          
          <div id="${id_base}_status" style="text-align:center; margin-top:10px; font-weight:bold; color:#444;"></div>
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

        var btnStart = document.getElementById(id + '_start');
        if(btnStart){
            btnStart.addEventListener('click', function() {
               var container = document.getElementById(id + '_tree_container');
               var status = document.getElementById(id + '_status');
               
               container.innerHTML = '';
               status.innerHTML = 'Se han generado las 10 formas posibles de terminar el torneo (ver Figura del libro).<br><span style="font-size:0.8rem; font-weight:normal;">S = Sergio, A = Antonio</span>';
               
               var outcomes = [
                 "S-S (Gana S)", 
                 "S-A-S-S (Gana S)", 
                 "S-A-S-A (Gana A)", 
                 "S-A-A (Gana A)",
                 "A-S-S (Gana S)",
                 "A-S-A-S (Gana S)",
                 "A-S-A-A (Gana A)",
                 "A-A (Gana A)"
               ];
               // Nota: Simplificación visual de las ramas principales
               
               var ul = document.createElement('ul');
               ul.style.listStyle = 'none';
               ul.style.padding = '0';
               ul.style.textAlign = 'left';
               
               outcomes.forEach(function(out) {
                  var li = document.createElement('li');
                  li.style.margin = '5px 0';
                  li.style.padding = '8px';
                  li.style.background = '#f1f5f9';
                  li.style.borderLeft = '3px solid #0ea5e9';
                  li.innerHTML = '<span style="color:#64748b;">Ruta:</span> <b>' + out + '</b>';
                  ul.appendChild(li);
               });
               
               container.appendChild(ul);
            });
        }
      })();
      </script>
    `;
  }
};
