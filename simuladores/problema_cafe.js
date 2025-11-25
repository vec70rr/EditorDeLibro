export default {
  render: (params, simName = 'Simulador: Preferencias de Café') => {
    // 1. Generar ID único para esta instancia
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;
    
    // 2. IDs de elementos clave
    const id_btn_toggle = `${id_base}_btn_toggle`;
    const id_container = `${id_base}_container`;
    const id_expl = `${id_base}_expl`;
    
    // IDs de celdas de la tabla (para actualizarlas)
    // Regular
    const c_rs = `${id_base}_rs`; const c_rm = `${id_base}_rm`; const c_rl = `${id_base}_rl`;
    // Descafeinado
    const c_ds = `${id_base}_ds`; const c_dm = `${id_base}_dm`; const c_dl = `${id_base}_dl`;
    // Totales Fila
    const t_reg = `${id_base}_treg`; const t_dec = `${id_base}_tdec`;
    // Totales Columna
    const t_s = `${id_base}_ts`; const t_m = `${id_base}_tm`; const t_l = `${id_base}_tl`;
    const t_grand = `${id_base}_grand`;

    // 3. Retornamos el String HTML + Script
    return `
      <div>
        <button id="${id_btn_toggle}" class="btn-sim" onclick="window.toggle_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_container}" class="simulador-box" style="display:none; margin-top:10px;">
          <style>
            #${id_container} table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 14px; text-align: center; }
            #${id_container} th { background: #f3f4f6; padding: 8px; border: 1px solid #e5e7eb; }
            #${id_container} td { padding: 8px; border: 1px solid #e5e7eb; position: relative; }
            #${id_container} .controls { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }
            #${id_container} button { padding: 5px 10px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; }
            #${id_container} .highlight { background-color: #dbeafe !important; font-weight: bold; color: #1e40af; }
            #${id_container} .target { background-color: #dcfce7 !important; font-weight: bold; color: #166534; border: 2px solid #16a34a; }
            #${id_container} .dim { opacity: 0.3; }
          </style>

          <p style="color:#666; font-size:0.9em;">Simula clientes para ver la ley de grandes números y probabilidad condicional.</p>

          <div class="controls">
            <button onclick="window.run_${id_base}(100)" style="background:#3b82f6; color:white; border:none;">Simular 100</button>
            <button onclick="window.run_${id_base}(1000)" style="background:#3b82f6; color:white; border:none;">Simular 1,000</button>
            <button onclick="window.reset_${id_base}()" style="background:#ef4444; color:white; border:none;">Reiniciar</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tipo \\ Tamaño</th>
                <th>Pequeño</th>
                <th>Mediano</th>
                <th>Grande</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr id="${id_base}_row_r">
                <th>Regular</th>
                <td id="${c_rs}">0</td> <td id="${c_rm}">0</td> <td id="${c_rl}">0</td>
                <td id="${t_reg}" style="font-weight:bold">0</td>
              </tr>
              <tr id="${id_base}_row_d">
                <th>Descafeinado</th>
                <td id="${c_ds}">0</td> <td id="${c_dm}">0</td> <td id="${c_dl}">0</td>
                <td id="${t_dec}" style="font-weight:bold">0</td>
              </tr>
              <tr id="${id_base}_row_t" style="background:#f9fafb; font-weight:bold">
                <th>TOTAL</th>
                <td id="${t_s}">0</td> <td id="${t_m}">0</td> <td id="${t_l}">0</td>
                <td id="${t_grand}" style="color:#2563eb">0</td>
              </tr>
            </tbody>
          </table>

          <div style="border-top:1px dashed #ccc; padding-top:10px; margin-top:10px;">
            <strong>Analizar:</strong>
            <div class="controls" style="margin-top:5px;">
              <button onclick="window.solve_${id_base}('a')">a) Prob. Simples</button>
              <button onclick="window.solve_${id_base}('b')">b) Dado Pequeño</button>
              <button onclick="window.solve_${id_base}('c')">c) Dado Descafeinado</button>
            </div>
            <div id="${id_expl}" style="background:#f0f9ff; padding:10px; border-left:4px solid #3b82f6; min-height:60px;">
              Genera datos primero...
            </div>
          </div>
        </div>
      </div>

      <script>
        // --- VARIABLES DE ESTADO (Globales únicas para esta instancia) ---
        // Usamos window['var_' + id] para simular estado persistente sin closures complejos
        window['counts_${id_base}'] = { rs:0, rm:0, rl:0, ds:0, dm:0, dl:0, total:0 };

        // 1. ABRIR / CERRAR
        window.toggle_${id_base} = function() {
          var box = document.getElementById('${id_container}');
          var btn = document.getElementById('${id_btn_toggle}');
          if(box.style.display === 'none') {
            box.style.display = 'block';
            btn.textContent = 'Ocultar ${simName}';
            btn.classList.add('btn-sim-rojo');
          } else {
            box.style.display = 'none';
            btn.textContent = 'Abrir ${simName}';
            btn.classList.remove('btn-sim-rojo');
          }
        };

        // 2. GENERAR DATOS
        window.run_${id_base} = function(n) {
          var state = window['counts_${id_base}'];
          var probs = [
            {id:'rs', p:14}, {id:'rm', p:20}, {id:'rl', p:26},
            {id:'ds', p:20}, {id:'dm', p:10}, {id:'dl', p:10}
          ];

          for(var i=0; i<n; i++) {
            var r = Math.random() * 100;
            var sum = 0;
            for(var j=0; j<probs.length; j++) {
              sum += probs[j].p;
              if(r < sum) {
                state[probs[j].id]++;
                break;
              }
            }
          }
          state.total += n;
          window.updateTable_${id_base}();
          window.clearStyles_${id_base}();
          document.getElementById('${id_expl}').innerHTML = 'Se agregaron ' + n + ' clientes. Total: <b>' + state.total + '</b>';
        };

        // 3. REINICIAR
        window.reset_${id_base} = function() {
          window['counts_${id_base}'] = { rs:0, rm:0, rl:0, ds:0, dm:0, dl:0, total:0 };
          window.updateTable_${id_base}();
          window.clearStyles_${id_base}();
          document.getElementById('${id_expl}').innerHTML = 'Datos reiniciados.';
        };

        // 4. ACTUALIZAR DOM
        window.updateTable_${id_base} = function() {
          var s = window['counts_${id_base}'];
          
          // Celdas
          document.getElementById('${c_rs}').innerText = s.rs;
          document.getElementById('${c_rm}').innerText = s.rm;
          document.getElementById('${c_rl}').innerText = s.rl;
          document.getElementById('${c_ds}').innerText = s.ds;
          document.getElementById('${c_dm}').innerText = s.dm;
          document.getElementById('${c_dl}').innerText = s.dl;

          // Totales
          var tr = s.rs + s.rm + s.rl;
          var td = s.ds + s.dm + s.dl;
          var ts = s.rs + s.ds;
          var tm = s.rm + s.dm;
          var tl = s.rl + s.dl;

          document.getElementById('${t_reg}').innerText = tr;
          document.getElementById('${t_dec}').innerText = td;
          document.getElementById('${t_s}').innerText = ts;
          document.getElementById('${t_m}').innerText = tm;
          document.getElementById('${t_l}').innerText = tl;
          document.getElementById('${t_grand}').innerText = s.total;
        };

        // 5. LIMPIAR ESTILOS
        window.clearStyles_${id_base} = function() {
           var cells = document.querySelectorAll('#${id_container} td, #${id_container} th');
           for(var i=0; i<cells.length; i++) {
             cells[i].classList.remove('dim', 'highlight', 'target');
           }
        };

        // 6. RESOLVER PREGUNTAS
        window.solve_${id_base} = function(mode) {
           var s = window['counts_${id_base}'];
           if(s.total === 0) return alert("Genera datos primero");
           
           window.clearStyles_${id_base}();
           var expl = document.getElementById('${id_expl}');
           
           // Función helper interna
           function dimAll() {
             var cells = document.querySelectorAll('#${id_container} td, #${id_container} th');
             for(var i=0; i<cells.length; i++) cells[i].classList.add('dim');
           }
           function highlight(id, type) {
             var el = document.getElementById(id);
             if(el) {
               el.classList.remove('dim');
               el.classList.add(type === 'target' ? 'target' : 'highlight');
             }
           }

           // --- LÓGICA INCISOS ---
           if(mode === 'a') {
             highlight('${t_s}', 'target');
             highlight('${t_dec}', 'target');
             var ps = ((s.rs + s.ds) / s.total).toFixed(3);
             var pd = ((s.ds + s.dm + s.dl) / s.total).toFixed(3);
             expl.innerHTML = '<b>a) Simples:</b><br>P(Pequeño) = ' + ps + '<br>P(Descafeinado) = ' + pd;
           }
           
           else if(mode === 'b') {
             dimAll();
             // Universo: Columna Pequeño
             highlight('${c_rs}', 'highlight'); highlight('${c_ds}', 'highlight'); highlight('${t_s}', 'highlight');
             // Intersección
             highlight('${c_ds}', 'target');
             
             var totSmall = s.rs + s.ds;
             var val = totSmall > 0 ? (s.ds / totSmall).toFixed(3) : 0;
             expl.innerHTML = '<b>b) P(Desc | Pequeño):</b><br>Universo reducido a columna Pequeño (' + totSmall + ').<br>Resultado: ' + s.ds + ' / ' + totSmall + ' = <b>' + val + '</b>';
           }

           else if(mode === 'c') {
             dimAll();
             // Universo: Fila Descafeinado
             highlight('${c_ds}', 'highlight'); highlight('${c_dm}', 'highlight'); highlight('${c_dl}', 'highlight'); highlight('${t_dec}', 'highlight');
             // Intersección
             highlight('${c_ds}', 'target');

             var totDec = s.ds + s.dm + s.dl;
             var val = totDec > 0 ? (s.ds / totDec).toFixed(3) : 0;
             expl.innerHTML = '<b>c) P(Pequeño | Desc):</b><br>Universo reducido a fila Descafeinado (' + totDec + ').<br>Resultado: ' + s.ds + ' / ' + totDec + ' = <b>' + val + '</b>';
           }
        };
      </script>
    `;
  }
};