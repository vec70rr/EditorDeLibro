// explorador_datos.js
// Explorador de datos (numéricos o categóricos)
// Uso en tu editor: [simulador:explorador_datos]

export default {
  render: (_params, simName = "Explorador de datos") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:16px;border-radius:16px;background:linear-gradient(135deg,#020617,#0f172a);color:#e5e7eb;box-shadow:0 18px 40px rgba(15,23,42,.7);max-width:780px">

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <div>
      <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#38bdf8;font-weight:600">
        Simulador interactivo
      </div>
      <h3 style="margin:2px 0 0;font-size:20px;font-weight:700;color:#f9fafb">
        ${simName}
      </h3>
    </div>
    <div style="width:40px;height:40px;border-radius:999px;background:radial-gradient(circle at 30% 30%,#38bdf8 0,#0ea5e9 40%,transparent 70%);box-shadow:0 0 22px rgba(56,189,248,.9)"></div>
  </div>

  <p style="margin:6px 0 14px;font-size:13px;color:#cbd5f5">
    Configura el tipo de datos y el tamaño de la muestra, pulsa <b>Generar</b> y luego
    <b>Mostrar análisis</b>.
  </p>

  <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:rgba(15,23,42,.85);border-radius:12px;padding:10px 12px;border:1px solid rgba(148,163,184,.35)">
    <div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:2px">Tipo</div>
      <select id="${id}_tipo" style="padding:6px 10px;border-radius:999px;border:1px solid #334155;background:#020617;color:#e5e7eb;font-size:13px;outline:none">
        <option value="num">Numérica</option>
        <option value="cat">Categórica</option>
      </select>
    </div>

    <div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:2px">Tamaño n</div>
      <input id="${id}_n" type="number" min="3" max="200" value="12"
             style="width:80px;padding:6px 10px;border-radius:999px;border:1px solid #334155;background:#020617;color:#e5e7eb;font-size:13px;outline:none">
    </div>

    <button id="${id}_btnGen"
            style="margin-left:auto;padding:8px 14px;border-radius:999px;border:none;cursor:pointer;font-size:13px;font-weight:600;background:linear-gradient(135deg,#06b6d4,#3b82f6);color:white;box-shadow:0 8px 18px rgba(59,130,246,.55)">
      Generar
    </button>

    <button id="${id}_btnAnalizar"
            style="padding:8px 12px;border-radius:999px;border:1px solid rgba(148,163,184,.55);cursor:pointer;font-size:13px;font-weight:500;background:rgba(15,23,42,.9);color:#e5e7eb">
      Mostrar análisis
    </button>
  </div>

  <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:14px">
    <div style="flex:2 1 220px;background:rgba(15,23,42,.85);border-radius:12px;padding:10px 12px;border:1px solid rgba(148,163,184,.35)">
      <div style="font-size:12px;font-weight:600;color:#e5e7eb;margin-bottom:4px">Datos generados</div>
      <pre id="${id}_datos"
           style="margin:0;font-size:12px;white-space:pre-wrap;word-wrap:break-word;color:#e5e7eb;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace"></pre>
    </div>

    <div style="flex:3 1 260px;background:rgba(15,23,42,.9);border-radius:12px;padding:10px 12px;border:1px solid rgba(148,163,184,.35)">
      <div style="font-size:12px;font-weight:600;color:#e5e7eb;margin-bottom:4px">Análisis rápido</div>
      <div id="${id}_analisis" style="font-size:12px;color:#cbd5f5"></div>
    </div>
  </div>

  <div id="${id}_msg" style="margin-top:10px;font-size:11px;color:#f97316"></div>

</div>

<script>
(function(){
  var root = document.getElementById("${id}");
  if (!root) return;

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
      // numérica ~ valores de 40 a 120
      for (var i=0;i<n;i++){
        datosActuales.push(randEntero(40,120));
      }
    } else {
      // categórica: A,B,C,D con distintas frecuencias
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
