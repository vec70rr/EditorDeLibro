// explorador_datos.js
// Explorador de datos (numéricos o categóricos)

export default {
  render: (_params, simName = "Explorador de datos") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:780px;margin:16px 0;">

  <!-- Botón mostrar/ocultar -->
  <button id="${id}_toggle"
          style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;border:none;cursor:pointer;font-size:13px;font-weight:600;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;box-shadow:0 8px 18px rgba(37,99,235,.35);margin-bottom:10px;">
    Ocultar simulador
  </button>

  <!-- Panel del simulador -->
  <div id="${id}_panel"
       style="padding:16px 18px;border-radius:18px;background:#ffffff;color:#0f172a;border:1px solid #bfdbfe;box-shadow:0 14px 32px rgba(148,163,184,.35);">

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div>
        <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;font-weight:600">
          Simulador interactivo
        </div>
        <h3 style="margin:2px 0 0;font-size:20px;font-weight:700;color:#111827">
          ${simName}
        </h3>
      </div>
      <div style="width:40px;height:40px;border-radius:999px;background:radial-gradient(circle at 30% 30%,#60a5fa 0,#1d4ed8 50%,transparent 72%);box-shadow:0 0 20px rgba(59,130,246,.75)"></div>
    </div>

    <p style="margin:6px 0 14px;font-size:13px;color:#4b5563">
      Configura el tipo de datos y el tamaño de la muestra, pulsa <b>Generar</b> y luego
      <b>Mostrar análisis</b>.
    </p>

    <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:#f9fafb;border-radius:14px;padding:10px 12px;border:1px solid #e5e7eb">
      <div>
        <div style="font-size:11px;color:#6b7280;margin-bottom:2px">Tipo</div>
        <select id="${id}_tipo" style="padding:6px 10px;border-radius:999px;border:1px solid #cbd5f5;background:#ffffff;color:#111827;font-size:13px;outline:none">
          <option value="num">Numérica</option>
          <option value="cat">Categórica</option>
        </select>
      </div>

      <div>
        <div style="font-size:11px;color:#6b7280;margin-bottom:2px">Tamaño n</div>
        <input id="${id}_n" type="number" min="3" max="200" value="12"
               style="width:80px;padding:6px 10px;border-radius:999px;border:1px solid #cbd5f5;background:#ffffff;color:#111827;font-size:13px;outline:none">
      </div>

      <button id="${id}_btnGen"
              style="margin-left:auto;padding:8px 14px;border-radius:999px;border:none;cursor:pointer;font-size:13px;font-weight:600;background:linear-gradient(135deg,#0ea5e9,#3b82f6);color:white;box-shadow:0 8px 18px rgba(59,130,246,.35)">
        Generar
      </button>

      <button id="${id}_btnAnalizar"
              style="padding:8px 12px;border-radius:999px;border:1px solid #cbd5f5;cursor:pointer;font-size:13px;font-weight:500;background:#ffffff;color:#1f2937">
        Mostrar análisis
      </button>
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:14px">
      <div style="flex:2 1 220px;background:#f9fafb;border-radius:14px;padding:10px 12px;border:1px solid #e5e7eb">
        <div style="font-size:12px;font-weight:600;color:#111827;margin-bottom:4px">Datos generados</div>
        <pre id="${id}_datos"
             style="margin:0;font-size:12px;white-space:pre-wrap;word-wrap:break-word;color:#111827;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace"></pre>
      </div>

      <div style="flex:3 1 260px;background:#ffffff;border-radius:14px;padding:10px 12px;border:1px solid #e5e7eb">
        <div style="font-size:12px;font-weight:600;color:#111827;margin-bottom:4px">Análisis rápido</div>
        <div id="${id}_analisis" style="font-size:12px;color:#374151"></div>
      </div>
    </div>

    <div id="${id}_msg" style="margin-top:10px;font-size:11px;color:#b45309"></div>
  </div>
</div>

<script>
(function(){
  var root = document.getElementById("${id}");
  if (!root) return;

  // Toggle mostrar/ocultar
  var panel = root.querySelector("#${id}_panel");
  var btnToggle = root.querySelector("#${id}_toggle");
  btnToggle.addEventListener("click", function(){
    var hidden = panel.style.display === "none";
    panel.style.display = hidden ? "" : "none";
    btnToggle.textContent = hidden ? "Ocultar simulador" : "Mostrar simulador";
  });

  var tipoSel = root.querySelector("#${id}_tipo");
  var nInp    = root.querySelector("#${id}_n");
  var btnGen  = root.querySelector("#${id}_btnGen");
  var btnAna  = root.querySelector("#${id}_btnAnalizar");
  var boxDatos= root.querySelector("#${id}_datos");
  var boxAna  = root.querySelector("#${id}_analisis");
  var msg     = root.querySelector("#${id}_msg");

  var datosActuales = [];

  function randEntero(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generar(){
    var n = parseInt(nInp.value,10);
    if (isNaN(n) || n < 3){
      msg.textContent = "n debe ser un número entero ≥ 3.";
      return;
    }
    if (n > 200){
      msg.textContent = "Para este simulador, usa n ≤ 200.";
      return;
    }

    msg.textContent = "";
    datosActuales = [];

    if (tipoSel.value === "num"){
      for (var i=0;i<n;i++){
        datosActuales.push(randEntero(40,120));
      }
    } else {
      for (var j=0;j<n;j++){
        var r = Math.random();
        var c;
        if (r < 0.45) c = "A";
        else if (r < 0.75) c = "B";
        else if (r < 0.9)  c = "C";
        else               c = "D";
        datosActuales.push(c);
      }
    }

    boxDatos.textContent = datosActuales.join(
      tipoSel.value === "num" ? ", " : "  "
    );
    boxAna.innerHTML = "<i>Ahora pulsa “Mostrar análisis”.</i>";
  }

  function analizarNumerica(vals){
    if (!vals.length) return "<i>No hay datos.</i>";

    var n = vals.length;
    var min = vals[0], max = vals[0], sum = 0;
    for (var i=0;i<n;i++){
      var v = vals[i];
      if (v < min) min = v;
      if (v > max) max = v;
      sum += v;
    }
    var media = sum / n;

    var varSum = 0;
    for (var j=0;j<n;j++){
      var dif = vals[j] - media;
      varSum += dif * dif;
    }
    var varianza = varSum / (n - 1);
    var desEst   = Math.sqrt(varianza);
    var rango    = max - min;

    return ""
      + "<b>n</b> = " + n + "<br>"
      + "<b>Mínimo</b> = " + min.toFixed(0) + "<br>"
      + "<b>Máximo</b> = " + max.toFixed(0) + "<br>"
      + "<b>Rango</b> = " + rango.toFixed(0) + "<br>"
      + "<b>Media</b> ≈ " + media.toFixed(2) + "<br>"
      + "<b>Desviación estándar</b> ≈ " + desEst.toFixed(2);
  }

  function analizarCateg(vals){
    if (!vals.length) return "<i>No hay datos.</i>";

    var conteos = {};
    vals.forEach(function(v){
      conteos[v] = (conteos[v] || 0) + 1;
    });
    var n = vals.length;
    var partes = [];
    Object.keys(conteos).sort().forEach(function(cat){
      var k = conteos[cat];
      var p = (100 * k / n).toFixed(1);
      partes.push("<b>" + cat + "</b>: " + k + " (" + p + "%)");
    });
    return "<b>n</b> = " + n + "<br>" + partes.join("<br>");
  }

  function mostrarAnalisis(){
    if (!datosActuales.length){
      msg.textContent = "Primero genera una muestra.";
      return;
    }
    msg.textContent = "";

    if (tipoSel.value === "num"){
      var valsNum = datosActuales.map(function(v){ return Number(v); });
      boxAna.innerHTML = analizarNumerica(valsNum);
    } else {
      boxAna.innerHTML = analizarCateg(datosActuales);
    }
  }

  btnGen.addEventListener("click", generar);
  btnAna.addEventListener("click", mostrarAnalisis);
})();
</script>
    `;
  }
};
