// axiomas_clientes.js
// Ejercicio — Clasificación de clientes para practicar axiomas
// Uso: [simulador:axiomas_clientes]

export default {
  render: function (_params, simName) {
    if (!simName) simName = "Ejercicio — Probabilidad con clientes";
    var id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="padding:15px;font-family:sans-serif;max-width:700px">

  <h3>${simName}</h3>

  <p>
    Un cliente puede ser <b>N</b> = "nuevo" o <b>F</b> = "frecuente".<br>
    Además puede <b>C</b> = "comprar" o <b>C'</b> = "no comprar".<br>
  </p>

  <div style="background:#f1f5f9;padding:10px;border-radius:6px;margin-bottom:10px">
    <b>Datos del ejercicio:</b><br>
    P(N) = <span id="${id}_pn"></span><br>
    P(C) = <span id="${id}_pc"></span><br>
    P(N ∩ C) = <span id="${id}_pnc"></span>
  </div>

  <p>Escribe tus respuestas en decimales (por ejemplo 0.40) y luego pulsa "Verificar respuestas".</p>

  <table style="width:100%;border-collapse:collapse">
    <tr>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Ítem</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Probabilidad</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Tu respuesta</th>
    </tr>
    <tr>
      <td style="padding:4px">1)</td>
      <td style="padding:4px">P(N ∪ C)</td>
      <td style="padding:4px"><input id="${id}_r1" type="number" step="0.01" style="width:90px"></td>
    </tr>
    <tr>
      <td style="padding:4px">2)</td>
      <td style="padding:4px">P(N')</td>
      <td style="padding:4px"><input id="${id}_r2" type="number" step="0.01" style="width:90px"></td>
    </tr>
    <tr>
      <td style="padding:4px">3)</td>
      <td style="padding:4px">P(C')</td>
      <td style="padding:4px"><input id="${id}_r3" type="number" step="0.01" style="width:90px"></td>
    </tr>
    <tr>
      <td style="padding:4px">4)</td>
      <td style="padding:4px">P(exactamente uno)</td>
      <td style="padding:4px"><input id="${id}_r4" type="number" step="0.01" style="width:90px"></td>
    </tr>
  </table>

  <div style="margin-top:10px">
    <button id="${id}_nuevo">Nuevo ejercicio</button>
    <button id="${id}_verificar" style="margin-left:8px">Verificar respuestas</button>
  </div>

  <div id="${id}_res" style="margin-top:12px;font-size:14px"></div>

</div>

<script>
(function(){
  var root = document.getElementById("${id}");
  if (!root) return;

  var spanN  = root.querySelector("#${id}_pn");
  var spanC  = root.querySelector("#${id}_pc");
  var spanNC = root.querySelector("#${id}_pnc");

  var r1 = root.querySelector("#${id}_r1");
  var r2 = root.querySelector("#${id}_r2");
  var r3 = root.querySelector("#${id}_r3");
  var r4 = root.querySelector("#${id}_r4");

  var divRes = root.querySelector("#${id}_res");

  var btnNuevo     = root.querySelector("#${id}_nuevo");
  var btnVerificar = root.querySelector("#${id}_verificar");

  var current = { N: 0.4, C: 0.5, NC: 0.2 };

  function nuevo(){
    // Posibles valores "bonitos" para P(N) y P(C)
    var posiblesN = [0.3, 0.4, 0.5, 0.6];
    var posiblesC = [0.4, 0.5, 0.6];

    var N = posiblesN[Math.floor(Math.random() * posiblesN.length)];
    var C = posiblesC[Math.floor(Math.random() * posiblesC.length)];

    var min = Math.max(0, N + C - 1);
    var max = Math.min(N, C);

    // Elegimos NC dentro del rango permitido y redondeado a 2 decimales
    var NC = min + Math.random() * (max - min);
    NC = Math.round(NC * 100) / 100;

    current.N  = N;
    current.C  = C;
    current.NC = NC;

    spanN.textContent  = N.toFixed(2);
    spanC.textContent  = C.toFixed(2);
    spanNC.textContent = NC.toFixed(2);

    r1.value = "";
    r2.value = "";
    r3.value = "";
    r4.value = "";

    divRes.innerHTML = '<i>Escribe tus respuestas y luego pulsa "Verificar respuestas".</i>';
  }

  function verificar(){
    var N  = current.N;
    var C  = current.C;
    var NC = current.NC;

    var union  = N + C - NC;          // P(N ∪ C)
    var compN  = 1 - N;               // P(N')
    var compC  = 1 - C;               // P(C')
    var soloN  = N - NC;              // N y no C
    var soloC  = C - NC;              // C y no N
    var exUno  = soloN + soloC;       // exactamente uno

    var correct = [union, compN, compC, exUno];
    var inputs  = [r1, r2, r3, r4];

    var txt = "<b>Resultados:</b><br><br>";
    var aciertos = 0;

    for (var i = 0; i < inputs.length; i++){
      var val = parseFloat(inputs[i].value);
      var ok  = !isNaN(val) && Math.abs(val - correct[i]) <= 0.01;
      if (ok) aciertos++;
      txt += (i+1) + ") " + (ok ? "Correcto" : "Incorrecto") +
             " (valor correcto: " + correct[i].toFixed(2) + ")<br>";
    }

    txt += "<br><b>Aciertos: " + aciertos + " / 4</b>";
    divRes.innerHTML = txt;
  }

  btnNuevo.addEventListener("click", nuevo);
  btnVerificar.addEventListener("click", verificar);

  // Primer ejercicio al cargar
  nuevo();
})();
</script>
    `;
  }
};
