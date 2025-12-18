export default {
  render: (params, simName = "14 Ejercicios") => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div class="simulador-wrapper">
        <button id="btn_toggle_${id_base}" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${simName}
        </button>

        <div id="sim_box_${id_base}" class="simulador-box" style="display:none; margin-top:10px;">
          
          <div style="border-radius:18px;padding:18px 18px 20px;background:#ffffff;color:#111827;border:1px solid #bfdbfe;box-shadow:0 14px 32px rgba(148,163,184,.35);">
            
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <div>
                <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#2563eb;">
                  Sección de ejercicios de técnicas de conteo
                </div>
                <h3 style="margin:2px 0 0;font-size:19px;font-weight:700;color:#111827;">
                  ${simName}
                </h3>
              </div>
              <div style="width:44px;height:44px;border-radius:999px;
                          background:radial-gradient(circle at 30% 20%,#1d4ed8,#1e3a8a);
                          box-shadow:0 0 24px rgba(37,99,235,0.75);"></div>
            </div>

           <p style="margin:6px 0 10px;font-size:13px;color:#4b5563;max-width:760px;">
              Estos ejercicios usan ideas de nuestro curso de probabilidad y estadística,
              .Verás situaciones sobre problemas de elegir libros, formar palabras con letras, 
              lanzar dados, armar equipos, repartir cartas,hacer triángulos en un polígono y 
              sacar bolas de una urna. Ten en cuenta que cada vez que hagas un nuevo conjunto de ejercicios, los 
              <b>problemas cambian</b>, así que las respuestas no siempre serán las mismas.
                        </p>
            <p style="margin:0 0 14px;font-size:13px;color:#4b5563;max-width:760px;">
              Elige una opción para cada pregunta y pulsa <b>“Verificar respuestas”</b>.
              Si quieres practicar más, al final encontrarás el botón <b>“Nuevo conjunto de ejercicios”</b>, 
              presionalo y observa cómo cambian los problemas y podrás practicar con nuevos ejercicios.
            </p>

            <div style="display:flex;flex-direction:column;gap:16px;">

              <!-- EJERCICIO 1: libros e idiomas -->
              <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 1 — Selección de libros</div>
                  <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#eff6ff;color:#1d4ed8;">Inspirado en el problema 1</span>
                </div>
                <div id="${id_base}_ej1_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>
                <div id="${id_base}_q1_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
                <div id="${id_base}_q1_fb" style="margin-top:4px;font-size:12px;"></div>
              </div>

              <!-- EJERCICIO 2: arreglos de letras -->
              <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 2 — Arreglos de consonantes y vocales</div>
                  <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#eff6ff;color:#1d4ed8;">Problema 2</span>
                </div>
                <div id="${id_base}_ej2_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>
                <div id="${id_base}_q2_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
                <div id="${id_base}_q2_fb" style="margin-top:4px;font-size:12px;"></div>
              </div>

              <!-- EJERCICIO 3: dados idénticos -->
              <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 3 — Dados idénticos</div>
                  <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#eff6ff;color:#1d4ed8;">Problema 3</span>
                </div>
                <div id="${id_base}_ej3_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>
                <div id="${id_base}_q3_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
                <div id="${id_base}_q3_fb" style="margin-top:4px;font-size:12px;"></div>
              </div>

              <!-- EJERCICIO 4: partidos de baloncesto -->
              <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 4 — Partidos de baloncesto</div>
                  <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#ecfeff;color:#0e7490;">Problema 4</span>
                </div>
                <div id="${id_base}_ej4_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>
                <div id="${id_base}_q4_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
                <div id="${id_base}_q4_fb" style="margin-top:4px;font-size:12px;"></div>
              </div>

              <!-- EJERCICIO 5: reparto de cartas -->
              <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 5 — Reparto de cartas</div>
                  <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#ecfeff;color:#0e7490;">Problema 5</span>
                </div>
                <div id="${id_base}_ej5_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>
                <div id="${id_base}_q5_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
                <div id="${id_base}_q5_fb" style="margin-top:4px;font-size:12px;"></div>
              </div>

              <!-- EJERCICIO 6: triángulos en un polígono -->
              <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 6 — Triángulos en un polígono</div>
                  <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#fefce8;color:#854d0e;">Problema 6</span>
                </div>
                <div id="${id_base}_ej6_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>
                <div id="${id_base}_q6_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
                <div id="${id_base}_q6_fb" style="margin-top:4px;font-size:12px;"></div>
              </div>

              <!-- EJERCICIO 7: urna con bolas -->
              <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 7 — Urna con bolas blancas y negras</div>
                  <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#fefce8;color:#854d0e;">Problema 7</span>
                </div>
                <div id="${id_base}_ej7_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>

                <div style="font-size:12px;color:#374151;margin-bottom:2px;">
                  7.1 ¿Cuántas muestras distintas de 4 bolas se pueden extraer sin importar el color?
                </div>
                <div id="${id_base}_q7a_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
                <div id="${id_base}_q7a_fb" style="margin-top:4px;font-size:12px;"></div>

                <div style="font-size:12px;color:#374151;margin-top:8px;margin-bottom:2px;">
                  7.2 ¿Cuántas de esas muestras tienen exactamente <b>2 bolas blancas</b> y <b>2 bolas negras</b>?
                </div>
                <div id="${id_base}_q7b_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
                <div id="${id_base}_q7b_fb" style="margin-top:4px;font-size:12px;"></div>
              </div>

            </div>

            <div style="margin-top:16px;display:flex;flex-direction:column;gap:10px;align-items:flex-start;">
              <div style="display:flex;align-items:center;gap:10px;">
                <button id="${id_base}_verificar"
                        style="appearance:none;border:none;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;background:linear-gradient(135deg,#22c55e,#16a34a);color:#f9fafb;cursor:pointer;box-shadow:0 10px 24px rgba(34,197,94,.45);">
                  Verificar respuestas
                </button>
                <div id="${id_base}_resumen" style="font-size:13px;color:#111827;"></div>
              </div>

              <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;">
                <button id="${id_base}_nuevo"
                        style="appearance:none;border:none;border-radius:999px;padding:7px 16px;font-size:13px;font-weight:600;background:linear-gradient(135deg,#0ea5e9,#3b82f6);color:#f9fafb;cursor:pointer;box-shadow:0 10px 22px rgba(59,130,246,.35);">
                  Nuevo conjunto de ejercicios
                </button>
                <span style="font-size:12px;color:#6b7280;">(cambia los números y las respuestas correctas)</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <script>
      (function() {
        var id   = '${id_base}';
        var name = '${simName}';

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

        var btnNuevo  = document.getElementById(id + '_nuevo');
        var btnVerif  = document.getElementById(id + '_verificar');
        var resumenEl = document.getElementById(id + '_resumen');

        var namePrefix = id + '_';

        var q = {
          ej1_enun: document.getElementById(id + '_ej1_enun'),
          q1_opts : document.getElementById(id + '_q1_opts'),
          q1_fb   : document.getElementById(id + '_q1_fb'),

          ej2_enun: document.getElementById(id + '_ej2_enun'),
          q2_opts : document.getElementById(id + '_q2_opts'),
          q2_fb   : document.getElementById(id + '_q2_fb'),

          ej3_enun: document.getElementById(id + '_ej3_enun'),
          q3_opts : document.getElementById(id + '_q3_opts'),
          q3_fb   : document.getElementById(id + '_q3_fb'),

          ej4_enun: document.getElementById(id + '_ej4_enun'),
          q4_opts : document.getElementById(id + '_q4_opts'),
          q4_fb   : document.getElementById(id + '_q4_fb'),

          ej5_enun: document.getElementById(id + '_ej5_enun'),
          q5_opts : document.getElementById(id + '_q5_opts'),
          q5_fb   : document.getElementById(id + '_q5_fb'),

          ej6_enun: document.getElementById(id + '_ej6_enun'),
          q6_opts : document.getElementById(id + '_q6_opts'),
          q6_fb   : document.getElementById(id + '_q6_fb'),

          ej7_enun: document.getElementById(id + '_ej7_enun'),
          q7a_opts: document.getElementById(id + '_q7a_opts'),
          q7a_fb  : document.getElementById(id + '_q7a_fb'),
          q7b_opts: document.getElementById(id + '_q7b_opts'),
          q7b_fb  : document.getElementById(id + '_q7b_fb')
        };

        var state = { questions: {} };

        function fact(n){
          var r = 1;
          for (var i=2;i<=n;i++) r *= i;
          return r;
        }

        function comb(n,k){
          if (k < 0 || k > n) return 0;
          k = Math.min(k, n-k);
          var num = 1, den = 1;
          for (var i=1;i<=k;i++){
            num *= (n-k+i);
            den *= i;
          }
          return num/den;
        }

        function makeNumericOptions(correct){
          var opts = new Set();
          opts.add(correct);
          var factors = [0.5, 0.75, 1.25, 1.5, 2];
          while (opts.size < 4){
            var f = factors[Math.floor(Math.random()*factors.length)];
            var cand = Math.max(1, Math.round(correct * f));
            opts.add(cand);
          }
          return Array.from(opts);
        }

        function renderMC(container, name, values){
          var letters = ["A","B","C","D"];
          var shuffled = values.slice();
          for (var i=shuffled.length-1;i>0;i--){
            var j = Math.floor(Math.random()*(i+1));
            var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
          }
          var html = "";
          var map  = {};
          for (var idx=0; idx<shuffled.length; idx++){
            var val = shuffled[idx];
            var v   = letters[idx];
            html += '<label style="display:block;margin:3px 0;padding:4px 6px;border-radius:8px;border:1px solid #e5e7eb;cursor:pointer;">'
                  + '<input type="radio" name="'+name+'" value="'+v+'" style="margin-right:6px;">'
                  + '<b>'+v+') </b>'+val
                  + '</label>';
            map[v] = val;
          }
          container.innerHTML = html;
          return map;
        }

        // ---- EJERCICIO 1: libros ----
        function generarEj1(){
          var E = 4 + Math.floor(Math.random()*3); // 4-6 inglés
          var G = 2 + Math.floor(Math.random()*3); // 2-4 alemán
          var F = 1 + Math.floor(Math.random()*3); // 1-3 francés
          var k = 3 + Math.floor(Math.random()*2); // 3-4 libros

          q.ej1_enun.innerHTML =
            "En un librero hay <b>"+E+"</b> libros en inglés, <b>"+G+"</b> en alemán y <b>"+F+"</b> en francés (todos distintos). "
            + "Se quiere seleccionar una <b>muestra de "+k+" libros</b> para recomendar a un grupo de estudiantes, "
            + "pero la recomendación debe incluir <b>al menos un libro en inglés</b>. "
            + "¿Cuántas selecciones distintas son posibles?";

          var total = comb(E+G+F, k);
          var sinIngles = comb(G+F, k);
          var correct = total - sinIngles;

          var options = makeNumericOptions(correct);
          var map = renderMC(q.q1_opts, namePrefix+"q1", options);

          var correctLetter = null;
          for (var letter in map){
            if (map[letter] === correct){ correctLetter = letter; break; }
          }

          state.questions.q1 = {
            correct: correctLetter,
            fbEl: q.q1_fb,
            name: namePrefix + "q1",
            shortCorrect: "Bien: contaste todas las formas de escoger "+k+" libros y luego quitaste las selecciones que no tienen libros en inglés.",
            shortIncorrect: "Primero cuenta todas las selecciones posibles de "+k+" libros y luego elimina solo las que no tienen ningún libro en inglés.",
            detailIncorrect:
              "Paso 1: suma todos los libros disponibles. Llama N al número total de libros en el librero.<br>"+
              "Paso 2: cuenta cuántas selecciones de "+k+" libros puedes hacer sin ninguna restricción usando una combinación C(N,"+k+").<br>"+
              "Paso 3: ahora imagina que solo eliges entre los libros que NO están en inglés (alemán y francés). Cuenta esas selecciones con C("+(G+F)+","+k+").<br>"+
              "Paso 4: las selecciones que sí tienen al menos un libro en inglés son las que quedan al restar: C(N,"+k+") − C("+(G+F)+","+k+").<br>"+
              "La idea clave es trabajar con el complemento: es más sencillo contar las selecciones sin inglés y luego quitarlas del total."
          };
          q.q1_fb.textContent = "";
        }

        // ---- EJERCICIO 2: letras ----
        function generarEj2(){
          var Nc = 3 + Math.floor(Math.random()*3); // 3-5 consonantes distintas
          var Nv = 3 + Math.floor(Math.random()*2); // 3-4 vocales distintas;

          q.ej2_enun.innerHTML =
            "Se dispone de un alfabeto reducido con <b>"+Nc+"</b> consonantes distintas y <b>"+Nv+"</b> vocales distintas. "
            + "¿Cuántos arreglos diferentes de <b>5 letras</b> se pueden formar que contengan exactamente "
            + "<b>3 consonantes y 2 vocales</b>, sin repetir letras?";

          var correct = fact(5) * comb(Nc,3) * comb(Nv,2);
          var options = makeNumericOptions(correct);
          var map = renderMC(q.q2_opts, namePrefix+"q2", options);

          var correctLetter = null;
          for (var letter in map){
            if (map[letter] === correct){ correctLetter = letter; break; }
          }

          state.questions.q2 = {
            correct: correctLetter,
            fbEl: q.q2_fb,
            name: namePrefix + "q2",
            shortCorrect: "Correcto: primero eliges qué letras se usan y luego cuentas de cuántas maneras se pueden ordenar.",
            shortIncorrect: "Separa el problema en dos partes: primero elige qué consonantes y vocales vas a usar, y después cuántas formas hay de ordenarlas.",
            detailIncorrect:
              "Paso 1: elige las 3 consonantes que aparecerán en el arreglo. Eso se cuenta con C("+Nc+",3).<br>"+
              "Paso 2: elige las 2 vocales del total de "+Nv+" vocales disponibles. Eso se cuenta con C("+Nv+",2).<br>"+
              "Paso 3: ya tienes 5 letras distintas; ahora pregúntate de cuántas maneras se pueden ordenar en 5 posiciones. Esto se cuenta con 5! (cinco factorial).<br>"+
              "Paso 4: combina todo multiplicando: C("+Nc+",3) · C("+Nv+",2) · 5!. Una parte elige las letras y la otra parte las ordena."
          };
          q.q2_fb.textContent = "";
        }

        // ---- EJERCICIO 3: dados idénticos ----
        function generarEj3(){
          var caras = 4 + Math.floor(Math.random()*5); // 4-8

          q.ej3_enun.innerHTML =
            "Se lanzan dos dados <b>idénticos</b> con caras numeradas del 1 al <b>"+caras+"</b>. "
            + "Dos resultados que solo difieren en el orden (por ejemplo, 2–5 y 5–2) se consideran el <b>mismo</b> resultado. "
            + "¿Cuántos resultados distintos son posibles?";

          var correct = (caras*(caras+1))/2;
          var options = makeNumericOptions(correct);
          var map = renderMC(q.q3_opts, namePrefix+"q3", options);

          var correctLetter = null;
          for (var letter in map){
            if (map[letter] === correct){ correctLetter = letter; break; }
          }

          state.questions.q3 = {
            correct: correctLetter,
            fbEl: q.q3_fb,
            name: namePrefix + "q3",
            shortCorrect: "Muy bien: trataste a los resultados como pares sin orden, no como parejas diferentes.",
            shortIncorrect: "No distingas entre (a,b) y (b,a): ambos representan el mismo resultado si los dados son idénticos.",
            detailIncorrect:
              "Imagina todos los pares posibles de números del 1 al "+caras+", pero sin importar el orden.<br>"+
              "Primero forma todos los pares ordenados y luego junta aquellos que son iguales pero en distinto orden, por ejemplo (2,5) y (5,2).<br>"+
              "Eso se puede contar usando combinaciones: cada resultado corresponde a elegir un par de números con repetición permitida (como 3 y 3), lo que se resume en una expresión del estilo C(n+1,2).<br>"+
              "La clave es pensar en “pares sin orden” en lugar de ver los lanzamientos como primero-dado y segundo-dado."
          };
          q.q3_fb.textContent = "";
        }

        // ---- EJERCICIO 4: baloncesto ----
        function generarEj4(){
          var jugadores = [8,10,12][Math.floor(Math.random()*3)];
          var k = jugadores/2;

          q.ej4_enun.innerHTML =
            "Se tienen <b>"+jugadores+"</b> jugadores de baloncesto y se quieren formar dos equipos de <b>"+k+"</b> jugadores cada uno "
            + "para un partido amistoso. Los jugadores son distinguibles y solo importa qué jugadores quedan en cada equipo; "
            + "no importa cuál sea el equipo local o visitante. ¿Cuántos partidos distintos se pueden organizar?";

          var total = comb(jugadores,k)/2;
          var options = makeNumericOptions(total);
          var map = renderMC(q.q4_opts, namePrefix+"q4", options);

          var correctLetter = null;
          for (var letter in map){
            if (map[letter] === total){ correctLetter = letter; break; }
          }

          state.questions.q4 = {
            correct: correctLetter,
            fbEl: q.q4_fb,
            name: namePrefix + "q4",
            shortCorrect: "Perfecto: consideraste que intercambiar los equipos no genera un partido distinto.",
            shortIncorrect: "Primero elige un equipo de "+k+" jugadores y después recuerda que el otro equipo queda determinado automáticamente.",
            detailIncorrect:
              "Paso 1: elige qué jugadores formarán el primer equipo. Eso se cuenta con C("+jugadores+","+k+").<br>"+
              "Paso 2: los jugadores que quedan forman automáticamente el segundo equipo, así que no se vuelve a contar.<br>"+
              "Paso 3: si consideras que el equipo A y el equipo B son iguales al intercambiarse (A vs B es el mismo partido que B vs A), debes dividir entre 2 para no contar dos veces cada pareja de equipos.<br>"+
              "En resumen, el número de partidos distintos se obtiene tomando una combinación y corrigiendo la doble cuenta con un factor 1/2."
          };
          q.q4_fb.textContent = "";
        }

        // ---- EJERCICIO 5: reparto de cartas ----
        function generarEj5(){
          var P = 3 + Math.floor(Math.random()*2);   // 3 o 4 jugadores
          var n = 2 + Math.floor(Math.random()*4);   // 2-5 cartas cada uno
          var total = P * n;

          q.ej5_enun.innerHTML =
            "Se tienen <b>"+total+"</b> cartas distintas y se reparten entre <b>"+P+"</b> jugadores, "
            + "de manera que cada jugador recibe exactamente <b>"+n+"</b> cartas. Los jugadores son distinguibles. "
            + "¿De cuántas maneras diferentes se puede hacer el reparto?";

          var correct = fact(total) / Math.pow(fact(n), P); // (Pn)! / (n!)^P
          var options = makeNumericOptions(correct);
          var map = renderMC(q.q5_opts, namePrefix+"q5", options);

          var correctLetter = null;
          for (var letter in map){
            if (map[letter] === correct){ correctLetter = letter; break; }
          }

          state.questions.q5 = {
            correct: correctLetter,
            fbEl: q.q5_fb,
            name: namePrefix + "q5",
            shortCorrect: "Muy bien: pensaste en todas las formas de ordenar las cartas y luego agrupaste en bloques para cada jugador.",
            shortIncorrect: "Piensa que primero colocas todas las cartas en fila y luego las vas agrupando en bloques de "+n+" cartas para cada jugador.",
            detailIncorrect:
              "Paso 1: imagina que alineas las "+total+" cartas distintas en una fila. El número de maneras de hacerlo es el factorial de "+total+", es decir, todas las permutaciones posibles.<br>"+
              "Paso 2: ahora divide esa fila en bloques consecutivos de "+n+" cartas, uno para cada jugador. Dentro de cada bloque, el orden de las cartas no importa para el reparto, solo importa qué cartas tiene cada persona.<br>"+
              "Paso 3: para corregir que hemos contado órdenes internos que en realidad representan el mismo reparto, dividimos por n! para el primer jugador, por n! para el segundo, etcétera, tantas veces como jugadores haya.<br>"+
              "Así se llega a una expresión del tipo (número total de cartas)! dividido entre (n!) elevado al número de jugadores."
          };
          q.q5_fb.textContent = "";
        }

        // ---- EJERCICIO 6: triángulos en un n-gono ----
        function generarEj6(){
          var n = 5 + Math.floor(Math.random()*6); // 5-10

          q.ej6_enun.innerHTML =
            "Se tiene un polígono convexo de <b>"+n+"</b> lados. ¿Cuántos triángulos diferentes pueden formarse con vértices en los vértices del polígono, "
            + "de manera que <b>ningún lado del polígono</b> sea lado del triángulo?";

          var totalTri = comb(n,3);
          var conLado  = n*(n-3);           // triángulos que usan al menos un lado del polígono
          var correct  = totalTri - conLado;

          var options = makeNumericOptions(correct);
          var map = renderMC(q.q6_opts, namePrefix+"q6", options);

          var correctLetter = null;
          for (var letter in map){
            if (map[letter] === correct){ correctLetter = letter; break; }
          }

          state.questions.q6 = {
            correct: correctLetter,
            fbEl: q.q6_fb,
            name: namePrefix + "q6",
            shortCorrect: "Bien hecho: primero contaste todos los triángulos posibles y luego quitaste los que tienen un lado del polígono.",
            shortIncorrect: "Empieza contando todos los triángulos con vértices en el polígono y después elimina solo los que usan alguno de los lados del polígono.",
            detailIncorrect:
              "Paso 1: cualquier triángulo se forma eligiendo 3 vértices del polígono. Eso se cuenta con C("+n+",3), que incluye a todos los triángulos posibles.<br>"+
              "Paso 2: ahora cuenta los triángulos que sí usan por lo menos un lado del polígono. Para cada uno de los "+n+" lados, eliges un tercer vértice que no sea ninguno de los extremos de ese lado ni lo repita; al organizar correctamente el conteo, esto lleva a una expresión proporcional a n(n−3) para estos triángulos.<br>"+
              "Paso 3: los triángulos que no tienen ningún lado del polígono como arista son los que quedan al hacer: triángulos sin restricción menos triángulos con algún lado del polígono.<br>"+
              "La estrategia de “contar todo” y luego “restar los que no cumplen la condición” es la misma que se usa en varios de los ejercicios anteriores."
          };
          q.q6_fb.textContent = "";
        }

        // ---- EJERCICIO 7: urna ----
        function generarEj7(){
          var blancas = 4 + Math.floor(Math.random()*3); // 4-6
          var negras  = 4 + Math.floor(Math.random()*3); // 4-6
          var N = blancas + negras;

          q.ej7_enun.innerHTML =
            "Una urna contiene <b>"+blancas+"</b> bolas blancas y <b>"+negras+"</b> bolas negras. "
            + "Se extraen <b>4 bolas</b> sin reemplazo y sin importar el orden.";

          var total = comb(N,4);
          var exact22 = comb(blancas,2) * comb(negras,2);

          var optionsA = makeNumericOptions(total);
          var mapA = renderMC(q.q7a_opts, namePrefix+"q7a", optionsA);
          var correctA = null;
          for (var la in mapA){
            if (mapA[la] === total){ correctA = la; break; }
          }

          var optionsB = makeNumericOptions(exact22);
          var mapB = renderMC(q.q7b_opts, namePrefix+"q7b", optionsB);
          var correctB = null;
          for (var lb in mapB){
            if (mapB[lb] === exact22){ correctB = lb; break; }
          }

          state.questions.q7a = {
            correct: correctA,
            fbEl: q.q7a_fb,
            name: namePrefix + "q7a",
            shortCorrect: "Exacto: solo importa qué 4 bolas quedaron fuera de la urna, no el orden en que salieron.",
            shortIncorrect: "Piensa en las extracciones como un grupo de 4 bolas sin orden; cada grupo distinto se cuenta una sola vez.",
            detailIncorrect:
              "Paso 1: imagina que al final solo te interesa el conjunto de 4 bolas que salieron, no la secuencia de extracción.<br>"+
              "Paso 2: eso significa que cada subconjunto de 4 bolas del total de "+N+" bolas se cuenta una sola vez, como en una combinación C(N,4).<br>"+
              "Paso 3: cualquier orden posible de extracción que produzca las mismas 4 bolas se agrupa en el mismo subconjunto, por eso no se multiplica por permutaciones.<br>"+
              "Cuando el orden no importa, la herramienta adecuada es la combinación, no las permutaciones."
          };

          state.questions.q7b = {
            correct: correctB,
            fbEl: q.q7b_fb,
            name: namePrefix + "q7b",
            shortCorrect: "Muy bien: separaste la elección de las bolas blancas y de las negras.",
            shortIncorrect: "Divide el problema en dos elecciones: primero elige las bolas blancas y luego las negras que completan la muestra.",
            detailIncorrect:
              "Paso 1: como quieres exactamente 2 bolas blancas, elige 2 de las "+blancas+" disponibles. Eso se cuenta con C("+blancas+",2).<br>"+
              "Paso 2: también quieres exactamente 2 bolas negras, así que eliges 2 de las "+negras+" negras disponibles. Eso se cuenta con C("+negras+",2).<br>"+
              "Paso 3: las elecciones de blancas y negras son independientes, por lo que combinas ambas posibilidades multiplicando las dos combinaciones.<br>"+
              "Esta misma idea se usa mucho: cuando una muestra se compone de grupos de distintos tipos de objetos, se cuentan las formas de elegir cada tipo por separado y luego se multiplican."
          };

          q.q7a_fb.textContent = "";
          q.q7b_fb.textContent = "";
        }

        function generarTodo(){
          generarEj1();
          generarEj2();
          generarEj3();
          generarEj4();
          generarEj5();
          generarEj6();
          generarEj7();
          resumenEl.textContent = "";
        }

        function verificar(){
          var total = 0;
          var correctas = 0;

          function evalQuestion(key){
            var info = state.questions[key];
            if (!info) return;
            total++;
            var selector = 'input[name="'+info.name+'"]:checked';
            var checked = document.querySelector('#sim_box_' + id + ' ' + selector);
            info.fbEl.style.padding = "4px 6px";
            info.fbEl.style.borderRadius = "8px";

            // limpia contenido
            info.fbEl.innerHTML = "";
            info.fbEl.style.background = "";
            info.fbEl.style.border = "";
            info.fbEl.style.color = "";

            if (!checked){
              info.fbEl.style.background = "rgba(248,250,252)";
              info.fbEl.style.border = "1px dashed #e5e7eb";
              info.fbEl.style.color = "#b45309";
              info.fbEl.innerHTML = "Sin respuesta.";
              return;
            }

            if (checked.value === info.correct){
              correctas++;
              info.fbEl.style.background = "rgba(22,163,74,0.08)";
              info.fbEl.style.border = "1px solid #22c55e";
              info.fbEl.style.color = "#166534";
              info.fbEl.innerHTML = "✔ Correcto. " + (info.shortCorrect || "");
            } else {
              info.fbEl.style.background = "rgba(248,113,113,0.08)";
              info.fbEl.style.border = "1px solid #f87171";
              info.fbEl.style.color = "#b91c1c";

              var btnId = info.name + "_retro_btn";
              var boxId = info.name + "_retro_box";

              var html = "✘ Incorrecto. " + (info.shortIncorrect || "");
              if (info.detailIncorrect){
                html += ' <button type="button" id="'+btnId+'" '+
                        'style="margin-left:8px;padding:3px 10px;border-radius:999px;border:1px solid #b91c1c;background:#fff7f7;font-size:11px;color:#b91c1c;cursor:pointer;">'+
                        'Ver retroalimentación</button>'+
                        '<div id="'+boxId+'" style="display:none;margin-top:6px;padding:6px 8px;border-radius:8px;background:#fef2f2;border:1px dashed #fecaca;color:#7f1d1d;font-size:11px;line-height:1.4;">'+
                        info.detailIncorrect+
                        '</div>';
              }
              info.fbEl.innerHTML = html;

              if (info.detailIncorrect){
                var btn = document.getElementById(btnId);
                var box = document.getElementById(boxId);
                if (btn && box){
                  btn.addEventListener('click', function(){
                    var visible = box.style.display === "block";
                    box.style.display = visible ? "none" : "block";
                    btn.textContent = visible ? "Ver retroalimentación" : "Ocultar retroalimentación";
                  });
                }
              }
            }
          }

          ["q1","q2","q3","q4","q5","q6","q7a","q7b"].forEach(evalQuestion);

          if (total > 0){
            resumenEl.textContent = "Aciertos: " + correctas + " de " + total + " preguntas.";
          } else {
            resumenEl.textContent = "";
          }
        }

        if (btnNuevo)  btnNuevo.addEventListener('click', generarTodo);
        if (btnVerif)  btnVerif.addEventListener('click', verificar);

        // Primera generación
        generarTodo();

      })();
      </script>
    `;
  }
};
