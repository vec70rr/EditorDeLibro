export default {
  render: (params, simName = 'Simulador: Diagrama de Árbol (Refris)') => {
    const id_base = `sim_tree_${Math.random().toString(36).slice(2)}`;
    
    const id_btn_toggle = `${id_base}_btn_toggle`;
    const id_container = `${id_base}_container`;
    const id_expl = `${id_base}_expl`;

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
             <b>A</b>: USA, <b>B</b>: Hielo, <b>C</b>: Garantía.<br>
             Simula las ramas del árbol paso a paso.
          </p>

          <div class="controls">
            <button onclick="window.run_${id_base}(100)" style="background:#3b82f6; color:white; border:none;">Simular 100</button>
            <button onclick="window.run_${id_base}(1000)" style="background:#3b82f6; color:white; border:none;">Simular 1,000</button>
            <button onclick="window.reset_${id_base}()" style="background:#ef4444; color:white; border:none;">Reiniciar</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Rama Final</th>
                <th>A (USA)</th>
                <th>B (Hielo)</th>
                <th>C (Garantía)</th>
                <th>Conteo</th>
              </tr>
            </thead>
            <tbody id="tbody_${id_base}">
               </tbody>
             <tfoot>
               <tr style="font-weight:bold; background:#f9fafb;">
                 <td colspan="4" style="text-align:right">TOTAL:</td>
                 <td id="total_${id_base}">0</td>
               </tr>
            </tfoot>
          </table>

          <div style="border-top:1px dashed #ccc; padding-top:10px; margin-top:10px;">
            <strong>Analizar:</strong>
            <div class="controls" style="margin-top:5px;">
              <button onclick="window.solve_${id_base}('b')">b) P(A ∩ B ∩ C)</button>
              <button onclick="window.solve_${id_base}('c')">c) P(B ∩ C)</button>
              <button onclick="window.solve_${id_base}('d')">d) P(C)</button>
              <button onclick="window.solve_${id_base}('e')">e) P(A | B ∩ C)</button>
            </div>
            <div id="${id_expl}" style="background:#f0f9ff; padding:10px; border-left:4px solid #3b82f6; min-height:40px;">
              Genera datos primero...
            </div>
          </div>
        </div>
      </div>

      <script>
        // --- DEFINICIÓN DE RAMAS DEL ÁRBOL (8 Posibles) ---
        // A=1 (Si), A=0 (No). Igual para B y C.
        window['branches_${id_base}'] = [
          { id: 'abc',   a:1, b:1, c:1, count:0 },
          { id: 'abc_',  a:1, b:1, c:0, count:0 },
          { id: 'ab_c',  a:1, b:0, c:1, count:0 },
          { id: 'ab_c_', a:1, b:0, c:0, count:0 },
          { id: 'a_bc',  a:0, b:1, c:1, count:0 },
          { id: 'a_bc_', a:0, b:1, c:0, count:0 },
          { id: 'a_b_c', a:0, b:0, c:1, count:0 },
          { id: 'a_b_c_',a:0, b:0, c:0, count:0 }
        ];
        window['total_${id_base}'] = 0;

        window.toggle_${id_base} = function() {
           var box = document.getElementById('${id_container}');
           var btn = document.getElementById('${id_btn_toggle}');
           if(box.style.display === 'none') {
             box.style.display = 'block';
             btn.textContent = 'Ocultar ${simName}';
             btn.classList.add('btn-sim-rojo');
             window.render_${id_base}();
           } else {
             box.style.display = 'none';
             btn.textContent = 'Abrir ${simName}';
             btn.classList.remove('btn-sim-rojo');
           }
        };

        window.run_${id_base} = function(n) {
           var branches = window['branches_${id_base}'];
           
           // Probabilidades dadas
           const P_A = 0.75;
           const P_B_given_A = 0.9; const P_B_given_nA = 0.8;
           // C conditional
           const P_C_given_AB = 0.8; const P_C_given_AnB = 0.6;
           const P_C_given_nAB = 0.7; const P_C_given_nAnB = 0.3;

           for(let i=0; i<n; i++) {
             // Simular A
             let isA = Math.random() < P_A;
             
             // Simular B (depende de A)
             let probB = isA ? P_B_given_A : P_B_given_nA;
             let isB = Math.random() < probB;

             // Simular C (depende de A y B)
             let probC = 0;
             if (isA && isB) probC = P_C_given_AB;
             else if (isA && !isB) probC = P_C_given_AnB;
             else if (!isA && isB) probC = P_C_given_nAB;
             else probC = P_C_given_nAnB;
             
             let isC = Math.random() < probC;

             // Encontrar rama y sumar
             branches.forEach(b => {
                if(b.a === (isA?1:0) && b.b === (isB?1:0) && b.c === (isC?1:0)) {
                  b.count++;
                }
             });
           }
           window['total_${id_base}'] += n;
           window.render_${id_base}();
           window.clearStyles_${id_base}();
           document.getElementById('${id_expl}').innerHTML = 'Simulación completada. Total: ' + window['total_${id_base}'];
        };

        window.render_${id_base} = function() {
           var branches = window['branches_${id_base}'];
           var html = '';
           
           branches.forEach((b, idx) => {
             let txtA = b.a ? 'Si' : 'No';
             let txtB = b.b ? 'Si' : 'No';
             let txtC = b.c ? 'Si' : 'No';
             
             html += '<tr id="tr_${id_base}_'+idx+'">';
             html += '<td>' + (b.a?'A':'A\'') + (b.b?'B':'B\'') + (b.c?'C':'C\'') + '</td>';
             html += '<td>' + txtA + '</td><td>' + txtB + '</td><td>' + txtC + '</td>';
             html += '<td style="font-weight:bold">' + b.count + '</td>';
             html += '</tr>';
           });

           document.getElementById('tbody_${id_base}').innerHTML = html;
           document.getElementById('total_${id_base}').innerText = window['total_${id_base}'];
        };

        window.reset_${id_base} = function() {
           window['branches_${id_base}'].forEach(b => b.count = 0);
           window['total_${id_base}'] = 0;
           window.render_${id_base}();
           window.clearStyles_${id_base}();
           document.getElementById('${id_expl}').innerHTML = 'Reiniciado.';
        };

        window.clearStyles_${id_base} = function() {
           var rows = document.querySelectorAll('#tbody_${id_base} tr');
           rows.forEach(r => r.classList.remove('dim', 'highlight', 'target'));
        };

        window.solve_${id_base} = function(q) {
           if(window['total_${id_base}'] === 0) return alert("Simula primero");
           window.clearStyles_${id_base}();
           var branches = window['branches_${id_base}'];
           var expl = document.getElementById('${id_expl}');
           var totalSim = window['total_${id_base}'];

           var countTarget = 0;
           var countUniverse = 0; // Para condicionales

           // Helper
           function check(conditionUniverse, conditionTarget) {
              branches.forEach((b, idx) => {
                 var row = document.getElementById('tr_${id_base}_'+idx);
                 if(conditionUniverse(b)) {
                    countUniverse += b.count;
                    if(conditionTarget(b)) {
                       countTarget += b.count;
                       row.classList.add('target');
                    } else {
                       row.classList.add('highlight');
                    }
                 } else {
                    row.classList.add('dim');
                 }
              });
           }

           if(q === 'b') {
             // P(A n B n C) -> Solo la rama ABC
             check(b => true, b => b.a==1 && b.b==1 && b.c==1); // Universo es todo
             var prob = (countTarget / totalSim).toFixed(4);
             expl.innerHTML = '<b>b) P(A ∩ B ∩ C)</b><br>Clientes en la rama ABC: ' + countTarget + '<br>Probabilidad: ' + countTarget + '/' + totalSim + ' = <b>' + prob + '</b>';
           }

           if(q === 'c') {
             // P(B n C) -> Ramas ABC y A'BC
             check(b => true, b => b.b==1 && b.c==1);
             var prob = (countTarget / totalSim).toFixed(4);
             expl.innerHTML = '<b>c) P(B ∩ C)</b><br>Clientes con Hielo y Garantía (ABC + A\'BC): ' + countTarget + '<br>Probabilidad: ' + countTarget + '/' + totalSim + ' = <b>' + prob + '</b>';
           }

           if(q === 'd') {
             // P(C) -> Todas las ramas terminadas en C
             check(b => true, b => b.c==1);
             var prob = (countTarget / totalSim).toFixed(4);
             expl.innerHTML = '<b>d) P(C)</b><br>Clientes con Garantía (cualquier rama): ' + countTarget + '<br>Probabilidad: ' + countTarget + '/' + totalSim + ' = <b>' + prob + '</b>';
           }

           if(q === 'e') {
             // P(A | B n C) -> Universo: B y C. Objetivo: A
             check(b => b.b==1 && b.c==1, b => b.a==1);
             var prob = countUniverse > 0 ? (countTarget / countUniverse).toFixed(4) : 0;
             expl.innerHTML = '<b>e) P(A | B ∩ C)</b><br>Universo (Tienen Hielo y Garantía): ' + countUniverse + '<br>De esos, son USA (A): ' + countTarget + '<br>Resultado: ' + countTarget + '/' + countUniverse + ' = <b>' + prob + '</b>';
           }
        };
      </script>
    `;
  }
};