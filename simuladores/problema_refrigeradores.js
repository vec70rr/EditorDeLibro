export default {
  render: (params, simName = 'Simulador: Diagrama de Árbol (Refris)') => {
    // 1. Generar ID único
    const id_base = `sim_tree_${Math.random().toString(36).slice(2)}`;
    
    // 2. IDs de elementos
    const id_btn_toggle = `${id_base}_btn_toggle`;
    const id_container = `${id_base}_container`;
    const id_expl = `${id_base}_expl`;
    
    // IDs de tabla
    const tbody_id = `${id_base}_tbody`;
    const total_id = `${id_base}_total`;

    // 3. Retornamos el String HTML + Script (Usando solo var para compatibilidad)
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
             A' significa "No A". Se simula la ruta del diagrama de árbol.
          </p>

          <div class="controls">
            <button onclick="window.run_${id_base}(100)" style="background:#3b82f6; color:white; border:none;">Simular 100</button>
            <button onclick="window.run_${id_base}(1000)" style="background:#3b82f6; color:white; border:none;">Simular 1,000</button>
            <button onclick="window.reset_${id_base}()" style="background:#ef4444; color:white; border:none;">Reiniciar</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Evento</th>
                <th>Origen (A)</th>
                <th>Hielo (B)</th>
                <th>Garantía (C)</th>
                <th>Conteo</th>
              </tr>
            </thead>
            <tbody id="${tbody_id}">
               </tbody>
             <tfoot>
               <tr style="font-weight:bold; background:#f9fafb;">
                 <td colspan="4" style="text-align:right">TOTAL:</td>
                 <td id="${total_id}">0</td>
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
        // --- ESTADO ---
        // A=1 (Si), A=0 (No). 8 Posibles combinaciones (2x2x2)
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

        // 1. ABRIR/CERRAR
        window.toggle_${id_base} = function() {
           var box = document.getElementById('${id_container}');
           var btn = document.getElementById('${id_btn_toggle}');
           if(box.style.display === 'none') {
             box.style.display = 'block';
             btn.textContent = 'Ocultar ${simName}';
             btn.classList.add('btn-sim-rojo');
             window.render_${id_base}(); // Intentar renderizar estado inicial
           } else {
             box.style.display = 'none';
             btn.textContent = 'Abrir ${simName}';
             btn.classList.remove('btn-sim-rojo');
           }
        };

        // 2. SIMULAR
        window.run_${id_base} = function(n) {
           var branches = window['branches_${id_base}'];
           
           // Probabilidades (Variables VAR para compatibilidad)
           var P_A = 0.75;
           
           // Probabilidades condicionales dadas
           var P_B_Si_A = 0.9; 
           var P_B_No_A = 0.8;
           
           var P_C_Si_AB = 0.8;   // P(C | A n B)
           var P_C_Si_AnB = 0.6;  // P(C | A n B')
           var P_C_Si_nAB = 0.7;  // P(C | A' n B)
           var P_C_Si_nAnB = 0.3; // P(C | A' n B')

           for(var i=0; i<n; i++) {
             // Paso 1: A (USA)
             var isA = Math.random() < P_A;
             
             // Paso 2: B (Hielo), depende de A
             var probB = isA ? P_B_Si_A : P_B_No_A;
             var isB = Math.random() < probB;

             // Paso 3: C (Garantía), depende de A y B
             var probC = 0;
             if (isA && isB) { probC = P_C_Si_AB; }
             else if (isA && !isB) { probC = P_C_Si_AnB; }
             else if (!isA && isB) { probC = P_C_Si_nAB; }
             else { probC = P_C_Si_nAnB; }
             
             var isC = Math.random() < probC;

             // Buscar la rama correspondiente y sumar
             for(var k=0; k<branches.length; k++) {
               var b = branches[k];
               var valA = isA ? 1 : 0;
               var valB = isB ? 1 : 0;
               var valC = isC ? 1 : 0;
               
               if(b.a === valA && b.b === valB && b.c === valC) {
                 b.count++;
                 break;
               }
             }
           }
           window['total_${id_base}'] += n;
           window.render_${id_base}();
           window.clearStyles_${id_base}();
           document.getElementById('${id_expl}').innerHTML = 'Se agregaron ' + n + ' simulaciones. Total: <b>' + window['total_${id_base}'] + '</b>';
        };

        // 3. RENDERIZAR TABLA
        window.render_${id_base} = function() {
           var branches = window['branches_${id_base}'];
           var html = '';
           
           for(var i=0; i<branches.length; i++) {
             var b = branches[i];
             var txtA = b.a ? "Si" : "No";
             var txtB = b.b ? "Si" : "No";
             var txtC = b.c ? "Si" : "No";
             
             // Notación matemática A, A'
             var math = (b.a?"A":"A'") + (b.b?"B":"B'") + (b.c?"C":"C'");

             html += '<tr id="tr_${id_base}_'+i+'">';
             html += '<td>' + math + '</td>';
             html += '<td>' + txtA + '</td><td>' + txtB + '</td><td>' + txtC + '</td>';
             html += '<td style="font-weight:bold">' + b.count + '</td>';
             html += '</tr>';
           }

           document.getElementById('${tbody_id}').innerHTML = html;
           document.getElementById('${total_id}').innerText = window['total_${id_base}'];
        };

        // 4. REINICIAR
        window.reset_${id_base} = function() {
           var branches = window['branches_${id_base}'];
           for(var i=0; i<branches.length; i++) {
             branches[i].count = 0;
           }
           window['total_${id_base}'] = 0;
           window.render_${id_base}();
           window.clearStyles_${id_base}();
           document.getElementById('${id_expl}').innerHTML = 'Datos reiniciados.';
        };

        // 5. LIMPIAR ESTILOS
        window.clearStyles_${id_base} = function() {
           var rows = document.querySelectorAll('#${tbody_id} tr');
           for(var i=0; i<rows.length; i++) {
             rows[i].classList.remove('dim', 'highlight', 'target');
           }
        };

        // 6. RESOLVER INCISOS
        window.solve_${id_base} = function(q) {
           var totalSim = window['total_${id_base}'];
           if(totalSim === 0) return alert("Genera datos primero");
           
           window.clearStyles_${id_base}();
           var branches = window['branches_${id_base}'];
           var expl = document.getElementById('${id_expl}');

           var countTarget = 0;
           var countUniverse = 0;

           // Iteramos ramas manualmente (estilo var antiguo)
           for(var i=0; i<branches.length; i++) {
              var b = branches[i];
              var row = document.getElementById('tr_${id_base}_'+i);
              var inUniverse = false;
              var inTarget = false;

              // Lógica de conjuntos según la pregunta
              if(q === 'b') { // P(A n B n C)
                inUniverse = true; // Todo el espacio muestral
                if(b.a===1 && b.b===1 && b.c===1) inTarget = true;
              }
              else if(q === 'c') { // P(B n C)
                inUniverse = true;
                if(b.b===1 && b.c===1) inTarget = true;
              }
              else if(q === 'd') { // P(C)
                inUniverse = true;
                if(b.c===1) inTarget = true;
              }
              else if(q === 'e') { // P(A | B n C)
                // Universo restringido: Solo B y C
                if(b.b===1 && b.c===1) {
                  inUniverse = true;
                  if(b.a===1) inTarget = true;
                }
              }

              // Aplicar estilos y cuentas
              if(inUniverse) {
                 countUniverse += b.count;
                 if(inTarget) {
                    countTarget += b.count;
                    row.classList.add('target');
                 } else {
                    row.classList.add('highlight');
                 }
              } else {
                 row.classList.add('dim');
              }
           }

           // Mostrar textos
           var prob = 0;
           if(q === 'b') {
             prob = (countTarget / totalSim).toFixed(4);
             expl.innerHTML = '<b>b) P(A ∩ B ∩ C)</b><br>Rama exacta A-B-C: ' + countTarget + '<br>Prob = ' + countTarget + '/' + totalSim + ' = <b>' + prob + '</b>';
           }
           else if(q === 'c') {
             prob = (countTarget / totalSim).toFixed(4);
             expl.innerHTML = '<b>c) P(B ∩ C)</b><br>Ramas con Hielo y Garantía: ' + countTarget + '<br>Prob = ' + countTarget + '/' + totalSim + ' = <b>' + prob + '</b>';
           }
           else if(q === 'd') {
             prob = (countTarget / totalSim).toFixed(4);
             expl.innerHTML = '<b>d) P(C)</b><br>Cualquier rama con Garantía: ' + countTarget + '<br>Prob = ' + countTarget + '/' + totalSim + ' = <b>' + prob + '</b>';
           }
           else if(q === 'e') {
             prob = countUniverse > 0 ? (countTarget / countUniverse).toFixed(4) : 0;
             expl.innerHTML = '<b>e) P(A | B ∩ C)</b><br>Dado que tiene Hielo y Garantía (Total: ' + countUniverse + ')<br>¿Cuántos son de USA (A)? ' + countTarget + '<br>Resultado = ' + countTarget + '/' + countUniverse + ' = <b>' + prob + '</b>';
           }
        };
      </script>
    `;
  }
};