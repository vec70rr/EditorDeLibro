export default {
  render: (params, simName = 'Simulador: Vacacionistas y Tecnología') => {
    // 1. Generar ID único
    const id_base = `sim_vac_${Math.random().toString(36).slice(2)}`;
    
    // 2. IDs de elementos
    const id_btn_toggle = `${id_base}_btn_toggle`;
    const id_container = `${id_base}_container`;
    const id_expl = `${id_base}_expl`;

    // 3. Retornamos el String HTML + Script
    return `
      <div>
        <button id="${id_btn_toggle}" class="btn-sim" onclick="window.toggle_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_container}" class="simulador-box" style="display:none; margin-top:10px;">
          <style>
            #${id_container} table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; text-align: center; }
            #${id_container} th { background: #f3f4f6; padding: 6px; border: 1px solid #e5e7eb; }
            #${id_container} td { padding: 6px; border: 1px solid #e5e7eb; }
            #${id_container} .controls { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }
            #${id_container} button { padding: 5px 10px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; }
            #${id_container} .highlight { background-color: #dbeafe !important; font-weight: bold; color: #1e40af; }
            #${id_container} .target { background-color: #dcfce7 !important; font-weight: bold; color: #166534; border: 2px solid #16a34a; }
            #${id_container} .dim { opacity: 0.3; }
          </style>

          <p style="color:#666; font-size:0.9em;">
            Eventos: <b>E</b> (Email), <b>C</b> (Celular), <b>L</b> (Laptop).<br>
            Se simulan los 8 grupos posibles derivados del problema.
          </p>

          <div class="controls">
            <button onclick="window.run_${id_base}(100)" style="background:#3b82f6; color:white; border:none;">Simular 100</button>
            <button onclick="window.run_${id_base}(1000)" style="background:#3b82f6; color:white; border:none;">Simular 1,000</button>
            <button onclick="window.reset_${id_base}()" style="background:#ef4444; color:white; border:none;">Reiniciar</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Grupo (Eventos)</th>
                <th>Frecuencia</th>
                <th>% del Total</th>
              </tr>
            </thead>
            <tbody id="tbody_${id_base}">
              </tbody>
            <tfoot>
               <tr style="font-weight:bold; background:#f9fafb;">
                 <td>TOTAL</td>
                 <td id="total_${id_base}">0</td>
                 <td>100%</td>
               </tr>
            </tfoot>
          </table>

          <div style="border-top:1px dashed #ccc; padding-top:10px; margin-top:10px;">
            <strong>Resolver Incisos:</strong>
            <div class="controls" style="margin-top:5px;">
              <button onclick="window.solve_${id_base}('a')">a) P(C | E)</button>
              <button onclick="window.solve_${id_base}('b')">b) P(C | L)</button>
              <button onclick="window.solve_${id_base}('c')">c) P(C | E ∩ L)</button>
            </div>
            <div id="${id_expl}" style="background:#f0f9ff; padding:10px; border-left:4px solid #3b82f6; min-height:40px;">
              Genera datos para comenzar.
            </div>
          </div>
        </div>
      </div>

      <script>
        // --- ESTADO ---
        // Definimos las 8 categorías excluyentes calculadas matemáticamente para que sumen 100%
        // E=40%, C=30%, L=25%. Intersecciones dadas en el problema.
        // E∩C∩L = 20% (deducido), E∩L(solo) = 2%, E∩C(solo) = 3%, L∩C(solo) = 1%...
        window['probs_${id_base}'] = [
          { id: 'all',  label: 'E ∩ C ∩ L (Todos)', p: 20, count: 0, hasE:1, hasC:1, hasL:1 },
          { id: 'el',   label: 'E ∩ L (Sin Cel)',   p: 2,  count: 0, hasE:1, hasC:0, hasL:1 },
          { id: 'ec',   label: 'E ∩ C (Sin Lap)',   p: 3,  count: 0, hasE:1, hasC:1, hasL:0 },
          { id: 'lc',   label: 'L ∩ C (Sin Email)', p: 1,  count: 0, hasE:0, hasC:1, hasL:1 },
          { id: 'e',    label: 'Solo Email',        p: 15, count: 0, hasE:1, hasC:0, hasL:0 },
          { id: 'c',    label: 'Solo Celular',      p: 6,  count: 0, hasE:0, hasC:1, hasL:0 },
          { id: 'l',    label: 'Solo Laptop',       p: 2,  count: 0, hasE:0, hasC:0, hasL:1 },
          { id: 'none', label: 'Ninguno',           p: 51, count: 0, hasE:0, hasC:0, hasL:0 }
        ];
        window['total_${id_base}'] = 0;

        // 1. TOGGLE
        window.toggle_${id_base} = function() {
          var box = document.getElementById('${id_container}');
          var btn = document.getElementById('${id_btn_toggle}');
          if(box.style.display === 'none') {
            box.style.display = 'block';
            btn.textContent = 'Ocultar ${simName}';
            btn.classList.add('btn-sim-rojo');
            window.renderTable_${id_base}();
          } else {
            box.style.display = 'none';
            btn.textContent = 'Abrir ${simName}';
            btn.classList.remove('btn-sim-rojo');
          }
        };

        // 2. SIMULAR
        window.run_${id_base} = function(n) {
          var data = window['probs_${id_base}'];
          for(var i=0; i<n; i++) {
            var r = Math.random() * 100;
            var sum = 0;
            for(var j=0; j<data.length; j++) {
              sum += data[j].p;
              if(r < sum) {
                data[j].count++;
                break;
              }
            }
          }
          window['total_${id_base}'] += n;
          window.renderTable_${id_base}();
          window.clearStyles_${id_base}();
          document.getElementById('${id_expl}').innerHTML = 'Simulación actualizada. Total N = <b>' + window['total_${id_base}'] + '</b>';
        };

        // 3. RENDER TABLA
        window.renderTable_${id_base} = function() {
          var data = window['probs_${id_base}'];
          var total = window['total_${id_base}'];
          var html = '';
          
          data.forEach((item, index) => {
            var pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0';
            html += '<tr id="row_${id_base}_'+index+'">';
            html += '<td>' + item.label + '</td>';
            html += '<td style="font-weight:bold">' + item.count + '</td>';
            html += '<td>' + pct + '%</td>';
            html += '</tr>';
          });
          
          document.getElementById('tbody_${id_base}').innerHTML = html;
          document.getElementById('total_${id_base}').innerText = total;
        };

        // 4. REINICIAR
        window.reset_${id_base} = function() {
          var data = window['probs_${id_base}'];
          data.forEach(d => d.count = 0);
          window['total_${id_base}'] = 0;
          window.renderTable_${id_base}();
          window.clearStyles_${id_base}();
          document.getElementById('${id_expl}').innerHTML = 'Datos reiniciados.';
        };

        // 5. HELPER ESTILOS
        window.clearStyles_${id_base} = function() {
          var rows = document.querySelectorAll('#tbody_${id_base} tr');
          rows.forEach(r => r.classList.remove('dim', 'highlight', 'target'));
        };

        // 6. RESOLVER
        window.solve_${id_base} = function(q) {
          if(window['total_${id_base}'] === 0) return alert("Simula primero");
          window.clearStyles_${id_base}();
          
          var data = window['probs_${id_base}'];
          var expl = document.getElementById('${id_expl}');
          var universeCount = 0;
          var targetCount = 0;

          // Función filtro
          function process(condUniverse, condTarget) {
             data.forEach((d, i) => {
                var row = document.getElementById('row_${id_base}_'+i);
                var isUniverse = condUniverse(d);
                var isTarget = condTarget(d);
                
                if (isUniverse) {
                   universeCount += d.count;
                   if (isTarget) {
                      targetCount += d.count;
                      row.classList.add('target'); // Cumple ambas
                   } else {
                      row.classList.add('highlight'); // Solo universo
                   }
                } else {
                   row.classList.add('dim'); // No entra en la condicional
                }
             });
          }

          if (q === 'a') {
             // P(C | E) -> Universo: Tiene Email. Objetivo: Tiene Celular
             process(d => d.hasE === 1, d => d.hasC === 1);
             var res = universeCount > 0 ? (targetCount / universeCount).toFixed(4) : 0;
             expl.innerHTML = '<b>a) P(Celular | Email)</b><br>Vacacionistas con Email: ' + universeCount + '<br>De esos, con Celular: ' + targetCount + '<br>Resultado: ' + targetCount + '/' + universeCount + ' = <b>' + res + '</b>';
          }
          
          if (q === 'b') {
             // P(C | L) -> Universo: Tiene Laptop. Objetivo: Tiene Celular
             process(d => d.hasL === 1, d => d.hasC === 1);
             var res = universeCount > 0 ? (targetCount / universeCount).toFixed(4) : 0;
             expl.innerHTML = '<b>b) P(Celular | Laptop)</b><br>Vacacionistas con Laptop: ' + universeCount + '<br>De esos, con Celular: ' + targetCount + '<br>Resultado: ' + targetCount + '/' + universeCount + ' = <b>' + res + '</b>';
          }

          if (q === 'c') {
             // P(C | E y L) -> Universo: Tiene Email Y Laptop. Objetivo: Tiene Celular
             process(d => d.hasE === 1 && d.hasL === 1, d => d.hasC === 1);
             var res = universeCount > 0 ? (targetCount / universeCount).toFixed(4) : 0;
             expl.innerHTML = '<b>c) P(Celular | Email y Laptop)</b><br>Vacacionistas con E y L: ' + universeCount + '<br>De esos, con Celular: ' + targetCount + '<br>Resultado: ' + targetCount + '/' + universeCount + ' = <b>' + res + '</b>';
          }
        };
      </script>
    `;
  }
};