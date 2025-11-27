// Ejer_poblaciones_muestras.js
// Ejercicio interactivo — Poblaciones, muestras y conceptos básicos
// Uso en tu editor: [simulador:ejer_poblaciones_muestras]

export default {
  render: (_params, simName = "Ejercicio — Poblaciones, muestras y conceptos básicos") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="padding:15px;font-family:sans-serif;max-width:800px">
  <h3 style="margin-top:0">${simName}</h3>

  <p>
    Clasifica cada descripción eligiendo la opción más adecuada
    (<b>población</b>, <b>muestra</b>, <b>variable categórica</b>,
    <b>variable numérica</b>, <b>censo</b> o <b>proceso</b>).
  </p>

  <div style="border:1px solid #e5e7eb;border-radius:6px;padding:10px;background:#f9fafb;margin-bottom:10px">
    <b>Instrucciones</b><br>
    1. Lee cada descripción con atención.<br>
    2. En la columna "Tipo", selecciona la categoría que creas correcta.<br>
    3. Pulsa <b>"Verificar"</b> para ver tus aciertos.<br>
    4. Pulsa <b>"Nuevo ejercicio"</b> para generar más descripciones.
  </div>

  <table style="border-collapse:collapse;width:100%;max-width:780px">
    <thead>
      <tr>
        <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px;width:40px">#</th>
        <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Descripción</th>
        <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px;width:180px">Tipo</th>
      </tr>
    </thead>
    <tbody id="${id}_tbody"></tbody>
  </table>

  <div style="margin-top:10px">
    <button id="${id}_nuevo">Nuevo ejercicio</button>
    <button id="${id}_verificar" style="margin-left:8px">Verificar</button>
  </div>

  <div id="${id}_res" style="margin-top:10px;font-size:14px"></div>
</div>

<script>
(function(){
  var root = document.getElementById("${id}");
  if (!root) return;

  var tbody      = root.querySelector("#${id}_tbody");
  var btnNuevo  = root.querySelector("#${id}_nuevo");
  var btnCheck  = root.querySelector("#${id}_verificar");
  var divRes    = root.querySelector("#${id}_res");

  // Banco de ítems basado en el texto del libro
  var items = [
    {
      texto: "Todas las cápsulas de gelatina de un tipo particular producidas durante un periodo específico.",
      tipo: "Población"
    },
    {
      texto: "100 cápsulas de gelatina seleccionadas de la producción de esta semana para su inspección.",
      tipo: "Muestra"
    },
    {
      texto: "Número de grietas en el recubrimiento de una pieza.",
      tipo: "Variable numérica"
    },
    {
      texto: "Tipo de transmisión (automática o manual) de cada automóvil.",
      tipo: "Variable categórica"
    },
    {
      texto: "Medir la edad (en años) de cada graduado de ingeniería.",
      tipo: "Variable numérica"
    },
    {
      texto: "Determinar el tipo de defecto (soldadura insuficiente, rotura, etc.) en cada unidad defectuosa.",
      tipo: "Variable categórica"
    },
    {
      texto: "Obtener información de todos los objetos de la población, sin omitir ninguno.",
      tipo: "Censo"
    },
    {
      texto: "Flujo continuo de unidades que salen de una línea de producción a lo largo del tiempo.",
      tipo: "Proceso"
    },
    {
      texto: "Todas las personas que obtuvieron una licenciatura de ingeniería durante el último ciclo académico.",
      tipo: "Población"
    },
    {
      texto: "Una selección de graduados de ingeniería del último año para aplicarles un cuestionario.",
      tipo: "Muestra"
    }
  ];

  var opciones = [
    "Población",
    "Muestra",
    "Variable categórica",
    "Variable numérica",
    "Censo",
    "Proceso"
  ];

  var ejercicioActual = [];

  function barajar(arr){
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function nuevoEjercicio(){
    tbody.innerHTML = "";
    divRes.innerHTML = "<i>Selecciona un tipo para cada descripción y luego pulsa \"Verificar\".</i>";

    // Tomamos 5 ítems aleatorios
    ejercicioActual = barajar(items).slice(0, 5);

    ejercicioActual.forEach(function(it, idx){
      var tr = document.createElement("tr");

      var tdNum = document.createElement("td");
      tdNum.style.padding = "4px";
      tdNum.textContent = (idx + 1) + ")";

      var tdTexto = document.createElement("td");
      tdTexto.style.padding = "4px";
      tdTexto.textContent = it.texto;

      var tdSel = document.createElement("td");
      tdSel.style.padding = "4px";

      var sel = document.createElement("select");
      sel.id = "${id}_sel_" + idx;
      sel.style.width = "100%";

      var opt0 = document.createElement("option");
      opt0.value = "";
      opt0.textContent = "Selecciona...";
      sel.appendChild(opt0);

      opciones.forEach(function(op){
        var o = document.createElement("option");
        o.value = op;
        o.textContent = op;
        sel.appendChild(o);
      });

      tdSel.appendChild(sel);

      tr.appendChild(tdNum);
      tr.appendChild(tdTexto);
      tr.appendChild(tdSel);

      tbody.appendChild(tr);
    });
  }

  function verificar(){
    if (!ejercicioActual.length) {
      divRes.innerHTML = "<span style='color:#b91c1c'>Primero genera un ejercicio con el botón \"Nuevo ejercicio\".</span>";
      return;
    }

    var aciertos = 0;
    var total = ejercicioActual.length;
    var detalle = "";

    ejercicioActual.forEach(function(it, idx){
      var sel = root.querySelector("#${id}_sel_" + idx);
      var resp = sel ? sel.value : "";
      var ok = (resp === it.tipo);

      if (ok) aciertos++;

      var icon = ok ? "✅" : "❌";
      var extra = "";
      if (!resp) {
        extra = " (sin respuesta; correcto: " + it.tipo + ")";
      } else if (!ok) {
        extra = " (tu respuesta: " + resp + "; correcto: " + it.tipo + ")";
      } else {
        extra = " (correcto: " + it.tipo + ")";
      }

      detalle += (idx + 1) + ") " + icon + extra + "<br>";
    });

    divRes.innerHTML = "<b>Resultado:</b> " + aciertos + " de " + total + " aciertos.<br><br>" + detalle;
  }

  btnNuevo.addEventListener("click", nuevoEjercicio);
  btnCheck.addEventListener("click", verificar);

  // Primer ejercicio al cargar
  nuevoEjercicio();

})();
</script>
    `;
  }
};
