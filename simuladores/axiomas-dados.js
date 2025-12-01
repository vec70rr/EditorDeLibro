// axiomas_dados.js
// Ejercicio interactivo — Axiomas con espacio muestral de 2 dados
// Uso en tu editor: [simulador:axiomas_dados]

export default {
  render: (_params, simName = "Ejercicio — Probabilidades con dos dados") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="padding:15px;font-family:sans-serif;max-width:700px">

  <h3 style="margin-top:0">${simName}</h3>

  <p>
    Se lanzan dos dados justos. El espacio muestral tiene 36 resultados igualmente
    probables. Se generan eventos aleatorios A y B según la <b>suma</b> del par (d1, d2).
  </p>

  <div style="border:1px solid #ddd;padding:10px;border-radius:6px;background:#f8fafc;margin-bottom:10px">
    <b>Eventos:</b><br>
    A = "la suma es <span id="${id}_condA"></span>"<br>
    B = "la suma es <span id="${id}_condB"></span>"
  </div>

  <p>Completa las siguientes probabilidades usando decimales (por ejemplo 0.19) y luego pulsa <b>Verificar respuestas</b>.</p>

  <table style="width:100%;border-collapse:collapse">
    <tr><th>Ítem</th><th>Probabilidad</th><th>Tu respuesta</th></tr>

    <tr>
      <td>1)</td><td>P(A)</td>
      <td><input id="${id}_r1" type="number" step="0.01"></td>
    </tr>
    <tr>
      <td>2)</td><td>P(B)</td>
      <td><input id="${id}_r2" type="number" step="0.01"></td>
    </tr>
    <tr>
      <td>3)</td><td>P(A ∪ B)</td>
      <td><input id="${id}_r3" type="number" step="0.01"></td>
    </tr>
    <tr>
      <td>4)</td><td>P(A ∩ B)</td>
      <td><input id="${id}_r4" type="number" step="0.01"></td>
    </tr>
    <tr>
      <td>5)</td><td>P(A')</td>
      <td><input id="${id}_r5" type="number" step="0.01"></td>
    </tr>
  </table>

  <div style="margin-top:10px">
    <button id="${id}_nuevo">Nuevo ejercicio</button>
    <button id="${id}_verificar" style="margin-left:8px">Verificar respuestas</button>
  </div>

  <div id="${id}_res" style="margin-top:12px"></div>

</div>

<script>
(function(){
  var root = document.getElementById("${id}");
  if (!root) return;

  var condA = root.querySelector("#${id}_condA");
  var condB = root.querySelector("#${id}_condB");

  var r1 = root.querySelector("#${id}_r1");
  var r2 = root.querySelector("#${id}_r2");
  var r3 = root.querySelector("#${id}_r3");
  var r4 = root.querySelector("#${id}_r4");
  var r5 = root.querySelector("#${id}_r5");

  var divRes = root.querySelector("#${id}_res");
  var btnNuevo = root.querySelector("#${id}_nuevo");
  var btnVerificar = root.querySelector("#${id}_verificar");

  var current = { sA: 7, sB: 9 };

  function nuevo(){
    var posibles = [3,4,5,6,7,8,9,10,11,12];
    current.sA = posibles[Math.floor(Math.random() * posibles.length)];
    current.sB = posibles[Math.floor(Math.random() * posibles.length)];

    condA.textContent = current.sA;
    condB.textContent = current.sB;

    r1.value = "";
    r2.value = "";
    r3.value = "";
    r4.value = "";
    r5.value = "";
    divRes.innerHTML = '<i>Escribe tus respuestas y pulsa "Verificar".</i>';
  }

  function contarSuma(s){
    var count = 0;
    for (var d1 = 1; d1 <= 6; d1++){
      for (var d2 = 1; d2 <= 6; d2++){
        if (d1 + d2 === s) count++;
      }
    }
    return count;
  }

  function verificar(){
    var A = contarSuma(current.sA) / 36;
    var B = contarSuma(current.sB) / 36;

    var inter = (current.sA === current.sB) ? A : 0;
    var union = A + B - inter;
    var compA = 1 - A;

    var correct = [A, B, union, inter, compA];
    var inputs = [r1, r2, r3, r4, r5];

    var txt = "<b>Resultados:</b><br><br>";
    var ac = 0;

    for (var i = 0; i < inputs.length; i++){
      var val = parseFloat(inputs[i].value);
      var ok = !isNaN(val) && Math.abs(val - correct[i]) <= 0.01;
      if (ok) ac++;
      txt += (i+1) + ") " + (ok ? "✅" : "❌") +
             " (correcto: " + correct[i].toFixed(3) + ")<br>";
    }

    txt += "<br><b>Aciertos: " + ac + " / 5</b>";
    divRes.innerHTML = txt;
  }

  btnNuevo.addEventListener("click", nuevo);
  btnVerificar.addEventListener("click", verificar);

  nuevo();
})();
</script>
    `;
  }
};
