export default {
  render: (params, simName = 'Simulador de Media Aritmética') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>
        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <div style="padding: 20px;">
            <h3>Simulador de Cálculo de Media Aritmética</h3>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 5px;">
              <h4>Opción 1: Generar datos automáticamente</h4>
              <label>Cantidad de números (n): <input type="number" id="${id_base}_gen_n" value="5" min="1" max="50" style="width:60px;"></label><br>
              <label>Valor mínimo: <input type="number" id="${id_base}_gen_min" value="1" step="0.01" style="width:80px;"></label>
              <label>Valor máximo: <input type="number" id="${id_base}_gen_max" value="20" step="0.01" style="width:80px;"></label><br>
              <label><input type="checkbox" id="${id_base}_gen_integers" checked> Solo números enteros</label><br>
              <button id="${id_base}_gen_btn" style="margin-top:5px;">Generar nuevos datos</button>
            </div>

            <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 5px;">
              <h4>Opción 2: Ingresar datos manualmente</h4>
              <label>Lista de números (separados por comas):</label><br>
              <input type="text" id="${id_base}_manual_list" placeholder="Ej: 5, 7.5, 3, 12, 8.2" style="width:300px;">
              <button id="${id_base}_manual_btn">Usar esta lista</button>
            </div>

            <div style="border: 2px solid #333; padding: 15px; margin: 15px 0; border-radius: 5px; background-color: #f9f9f9;">
              <h4>Datos actuales:</h4>
              <p><strong>Conjunto de datos:</strong> <span id="${id_base}_datos_preview">(lista vacía)</span></p>
            </div>

            <div style="border: 1px solid #666; padding: 15px; margin: 10px 0; border-radius: 5px; background-color: #fff;">
              <h4>Escribe tus respuestas:</h4>
              <label>1) Suma de todos los valores = <input type="number" id="${id_base}_ans_sum" step="0.01" style="width:100px;"></label><br>
              <label>2) Número de datos (n) = <input type="number" id="${id_base}_ans_n" step="1" style="width:80px;"></label><br>
              <label>3) Media aritmética = <input type="number" id="${id_base}_ans_mean" step="0.01" style="width:100px;"></label><br><br>
              
              <button id="${id_base}_verificar" style="background-color: #4CAF50; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Verificar respuestas</button>
              <button id="${id_base}_procedimiento" style="background-color: #2196F3; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-left: 5px;">Ver procedimiento completo</button>
              <button id="${id_base}_mostrar_respuestas" style="background-color: #ff9800; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-left: 5px;">Mostrar respuestas correctas</button>
            </div>

            <div id="${id_base}_resultado" style="border: 2px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; background-color: #fafafa; min-height: 40px;">
              <i>Genera datos y completa tus respuestas para ver los resultados aquí.</i>
            </div>

            <!-- Respuestas correctas ocultas -->
            <div style="display:none;">
              <span id="${id_base}_correct_sum">0</span>
              <span id="${id_base}_correct_n">0</span>
              <span id="${id_base}_correct_mean">0</span>
            </div>
          </div>
        </div>
      </div>
      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);

          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';
            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ${simName}';
              btn.classList.add('btn-sim-rojo');
              inicializarSimulador();
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ${simName}';
              btn.classList.remove('btn-sim-rojo');
            }
          };

          function inicializarSimulador() {
            // Controles
            var genN = $("gen_n");
            var genMin = $("gen_min");
            var genMax = $("gen_max");
            var genBtn = $("gen_btn");
            var genInts = $("gen_integers");

            var manualList = $("manual_list");
            var manualBtn = $("manual_btn");

            var datosPreview = $("datos_preview");

            var ansSum = $("ans_sum");
            var ansN   = $("ans_n");
            var ansMean= $("ans_mean");

            var verificarBtn = $("verificar");
            var procedimientoBtn = $("procedimiento");
            var mostrarBtn = $("mostrar_respuestas");
            var divRes = $("resultado");

            var spanCorrectSum  = $("correct_sum");
            var spanCorrectN    = $("correct_n");
            var spanCorrectMean = $("correct_mean");

            // Estado actual
            var current = {
              datos: []
            };

            // Utilidades
            function randint(min, max){
              return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            function randFloat(min, max, decimals){
              var v = min + Math.random() * (max - min);
              var m = Math.pow(10, decimals || 2);
              return Math.round(v * m) / m;
            }

            function actualizarPreview(){
              datosPreview.textContent = current.datos.length ? current.datos.join(", ") : "(lista vacía)";
              // guardar correctos ocultos
              var s = suma(current.datos);
              var n = current.datos.length;
              var m = n > 0 ? s / n : 0;
              spanCorrectSum.textContent = s.toFixed(2);
              spanCorrectN.textContent = "" + n;
              spanCorrectMean.textContent = m.toFixed(2);
            }

            // Funciones matemáticas
            function suma(arr){
              if(!arr || !arr.length) return 0;
              return arr.reduce(function(acc, x){ return acc + Number(x); }, 0);
            }

            function media(arr){
              var n = arr.length;
              if(n === 0) return 0;
              return suma(arr) / n;
            }

            // Generar datos automáticamente
            function generarDatos(){
              var n = parseInt(genN.value) || 5;
              var min = parseFloat(genMin.value);
              var max = parseFloat(genMax.value);
              if(isNaN(min) || isNaN(max)) { alert("Rango no válido"); return; }
              if(min > max) { alert("El mínimo no puede ser mayor que el máximo"); return; }
              var arr = [];
              for(var i=0;i<n;i++){
                if(genInts.checked){
                  arr.push(randint(Math.round(min), Math.round(max)));
                } else {
                  arr.push(randFloat(min, max, 2));
                }
              }
              current.datos = arr;
              // limpiar respuestas del alumno
              ansSum.value = ""; ansN.value = ""; ansMean.value = "";
              divRes.innerHTML = '<i>Se generaron nuevos datos. Escribe tus respuestas y pulsa "Verificar respuestas".</i>';
              actualizarPreview();
            }

            // Usar lista manual
            function usarListaManual(){
              var txt = manualList.value.trim();
              if(!txt){
                alert("Ingresa una lista de números separados por comas.");
                return;
              }
              // separar por comas, permitir espacios, ignorar elementos vacíos
              var parts = txt.split(",").map(function(p){ return p.trim(); }).filter(function(p){ return p !== ""; });
              var nums = [];
              for(var i=0;i<parts.length;i++){
                var v = Number(parts[i]);
                if(isNaN(v)){
                  alert("Valor no numérico encontrado: " + parts[i]);
                  return;
                }
                nums.push(v);
              }
              if(nums.length === 0){
                alert("No se detectaron números válidos.");
                return;
              }
              current.datos = nums;
              ansSum.value = ""; ansN.value = ""; ansMean.value = "";
              divRes.innerHTML = '<i>Lista manual cargada. Escribe tus respuestas y pulsa "Verificar respuestas".</i>';
              actualizarPreview();
            }

            // Verificación con tolerancia 0.01 para suma y media; n exacto entero
            function verificar(){
              var correctoSum = parseFloat(spanCorrectSum.textContent) || 0;
              var correctoN   = parseInt(spanCorrectN.textContent) || 0;
              var correctoMean= parseFloat(spanCorrectMean.textContent) || 0;

              var tol = 0.01;

              var userSumRaw = ansSum.value;
              var userNRaw   = ansN.value;
              var userMeanRaw= ansMean.value;

              function checkNumber(raw, correct, tolerance){
                if(raw === "" || raw === null) return { ok:false, vacio:true, correcto:correct };
                var v = parseFloat(raw);
                if(isNaN(v)) return { ok:false, vacio:false, usuario:raw, correcto:correct };
                return { ok: Math.abs(v - correct) <= tolerance, vacio:false, usuario:v, correcto:correct };
              }

              function checkInt(raw, correct){
                if(raw === "" || raw === null) return { ok:false, vacio:true, correcto:correct };
                var v = parseInt(raw);
                if(isNaN(v)) return { ok:false, vacio:false, usuario:raw, correcto:correct };
                return { ok: v === correct, vacio:false, usuario:v, correcto:correct };
              }

              var cSum = checkNumber(userSumRaw, correctoSum, tol);
              var cN   = checkInt(userNRaw, correctoN);
              var cMean= checkNumber(userMeanRaw, correctoMean, tol);

              var lista = [ {num:1, txt:"Suma", res:cSum}, {num:2, txt:"n (número de datos)", res:cN}, {num:3, txt:"Media", res:cMean} ];

              var aciertos = lista.reduce(function(acc,it){ return acc + (it.res.ok ? 1 : 0); }, 0);

              function linea(it){
                var c = it.res;
                var icon = c.ok ? "✅" : "❌";
                var detalle;
                if(c.vacio){
                  detalle = " (sin respuesta; valor correcto: " + formatCorrect(c.correcto, it.num) + ")";
                } else if(!c.ok){
                  detalle = " (tu respuesta: " + (typeof c.usuario === "number" ? c.usuario.toFixed(2) : c.usuario) +
                            "; correcto: " + formatCorrect(c.correcto, it.num) + ")";
                } else {
                  detalle = " (correcto: " + formatCorrect(c.correcto, it.num) + ")";
                }
                return it.num + ") " + it.txt + " = " + icon + detalle + "<br>";
              }

              function formatCorrect(val, itemNum){
                if(itemNum === 2) return String(val); // n as integer
                return Number(val).toFixed(2);
              }

              var html = "<b>Resultado de tus respuestas (tolerancia ±0.01 para suma y media):</b><br><br>";
              for(var i=0;i<lista.length;i++){
                html += linea(lista[i]);
              }
              html += "<br><b>Aciertos: " + aciertos + " de 3</b>";
              divRes.innerHTML = html;
            }

            // Mostrar procedimiento completo (suma paso a paso y cálculo de media)
            function mostrarProcedimiento(){
              var arr = current.datos.slice();
              if(!arr.length){
                divRes.innerHTML = "<i>No hay datos para mostrar. Genera o ingresa una lista primero.</i>";
                return;
              }

              var pasos = [];
              for(var i=0;i<arr.length;i++){
                pasos.push(Number(arr[i]));
              }
              var s = suma(pasos);
              var n = pasos.length;
              var m = media(pasos);

              // Construir la suma paso a paso
              var sumExpr = pasos.join(" + ");
              var html = "<b>Procedimiento completo para calcular la media aritmética:</b><br><br>";

              // Mostrar los datos originales
              html += "<div><b>Datos del conjunto:</b></div>";
              html += "<p>x = {" + pasos.join(", ") + "}</p>";

              html += "<div><b>Fórmula de la media aritmética:</b></div>";
              html += "<p>x̄ = (Σxi) / n = (x₁ + x₂ + ... + xₙ) / n</p>";

              // Paso 1: Sumar todos los valores
              html += "<div><b>Paso 1: Sumar todos los valores</b></div>";
              html += "<p>Sumamos cada uno de los " + n + " valores:</p>";
              html += "<p>Σxi = " + sumExpr + "</p>";
              html += "<p>Realizando la operación:</p>";
              html += "<p>Σxi = " + s.toFixed(2) + "</p>";

              // Paso 2: Contar los datos
              html += "<div><b>Paso 2: Contar el número total de datos (n)</b></div>";
              html += "<p>Contamos cuántos valores tenemos en el conjunto:</p>";
              html += "<p>n = " + n + "</p>";

              // Paso 3: Aplicar la fórmula
              html += "<div><b>Paso 3: Aplicar la fórmula de la media</b></div>";
              html += "<p>Sustituimos los valores en la fórmula:</p>";
              html += "<p>x̄ = Σxi / n = " + s.toFixed(2) + " / " + n + "</p>";
              html += "<p>Realizamos la división:</p>";
              html += "<p>x̄ = " + m.toFixed(2) + "</p>";

              // Resultado final
              html += "<div><b>Resultado final:</b></div>";
              html += "<p style='font-size:16px;padding:10px;background:#f0f8ff;border:1px solid #ccc;border-radius:5px;'>";
              html += "La media aritmética del conjunto es: <strong>x̄ = " + m.toFixed(2) + "</strong></p>";

              divRes.innerHTML = html;
            }

            // Mostrar respuestas correctas
            function mostrarRespuestasCorrectas(){
              var correctoSum = parseFloat(spanCorrectSum.textContent) || 0;
              var correctoN   = parseInt(spanCorrectN.textContent) || 0;
              var correctoMean= parseFloat(spanCorrectMean.textContent) || 0;

              ansSum.value = correctoSum.toFixed(2);
              ansN.value   = correctoN;
              ansMean.value= correctoMean.toFixed(2);

              divRes.innerHTML = "<i>Respuestas correctas cargadas en los campos.</i>";
            }

            // Eventos
            if(genBtn) genBtn.addEventListener("click", generarDatos);
            if(manualBtn) manualBtn.addEventListener("click", usarListaManual);
            if(verificarBtn) verificarBtn.addEventListener("click", verificar);
            if(procedimientoBtn) procedimientoBtn.addEventListener("click", mostrarProcedimiento);
            if(mostrarBtn) mostrarBtn.addEventListener("click", mostrarRespuestasCorrectas);

            // Generar por defecto al cargar
            (function inicial(){
              if(genN) genN.value = 5;
              if(genMin) genMin.value = 1;
              if(genMax) genMax.value = 20;
              if(genInts) genInts.checked = true;
              generarDatos();
            })();
          }
        })();
      </script>
    `;
  }
};
