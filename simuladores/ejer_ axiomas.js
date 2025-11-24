// Ejer_axiomas.js
// Ejercicio interactivo — Axiomas con Visa y MasterCard
// Uso en tu editor: [simulador:ejer_axiomas]

export default {
  render: (_params, simName = "Ejercicio — Axiomas de probabilidad (Visa y MasterCard)") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="padding:15px;font-family:sans-serif;max-width:700px">

  <h3 style="margin-top:0">${simName}</h3>

  <p>
    Sea <b>A</b> = “tener tarjeta Visa” y <b>B</b> = “tener tarjeta MasterCard”.<br>
    Para cada ejercicio se generan valores aleatorios de <b>P(A)</b>, <b>P(B)</b> y <b>P(A ∩ B)</b>.
  </p>

  <div style="border:1px solid #ddd;padding:10px;border-radius:6px;background:#f9fafb;margin-bottom:10px">
    <b>Datos del ejercicio actual</b><br>
    P(A) = <span id="${id}_pa"></span><br>
    P(B) = <span id="${id}_pb"></span><br>
    P(A ∩ B) = <span id="${id}_pab"></span>
  </div>

  <p style="margin:6px 0">
    Con estos datos, escribe tus respuestas <b>como decimales</b> (por ejemplo 0.70) y luego pulsa
    <b>"Verificar respuestas"</b>.
  </p>

  <table style="border-collapse:collapse;width:100%;max-width:650px">
    <tr>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Ítem</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Probabilidad</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Tu respuesta</th>
    </tr>
    <tr>
      <td style="padding:4px">1)</td>
      <td style="padding:4px">P(A ∪ B)</td>
      <td style="padding:4px">
        <input id="${id}_r1" type="number" step="0.01" style="width:80px">
      </td>
    </tr>
    <tr>
      <td style="padding:4px">2)</td>
      <td style="padding:4px">P((A ∪ B)')</td>
      <td style="padding:4px">
        <input id="${id}_r2" type="number" step="0.01" style="width:80px">
      </td>
    </tr>
    <tr>
      <td style="padding:4px">3)</td>
      <td style="padding:4px">P(solo Visa)</td>
      <td style="padding:4px">
        <input id="${id}_r3" type="number" step="0.01" style="width:80px">
      </td>
    </tr>
    <tr>
      <td style="padding:4px">4)</td>
      <td style="padding:4px">P(solo MasterCard)</td>
      <td style="padding:4px">
        <input id="${id}_r4" type="number" step="0.01" style="width:80px">
      </td>
    </tr>
    <tr>
      <td style="padding:4px">5)</td>
      <td style="padding:4px">P(exactamente una tarjeta)</td>
      <td style="padding:4px">
        <input id="${id}_r5" type="number" step="0.01" style="width:80px">
      </td>
    </tr>
  </table>

  <div style="margin-top:10px">
    <button id="${id}_nuevo">Nuevo ejercicio</button>
    <button id="${id}_verificar" style="margin-left:8px">Verificar respuestas</button>
  </div>

  <div id="${id}_res" style="margin-top:10px;font-size:14px"></div>

</div>

<script>
(function(){
  var root = document.getElementById("${id}");
  if (!root) return; // por si el editor inserta el script antes del div

  var spanA  = root.querySelector("#${id}_pa");
  var spanB  = root.querySelector("#${id}_pb");
  var spanAB = root.querySelector("#${id}_pab");

  var btnNuevo     = root.querySelector("#${id}_nuevo");
  var btnVerificar = root.querySelector("#${id}_verificar");
  var divRes       = root.querySelector("#${id}_res");

  var r1 = root.querySelector("#${id}_r1");
  var r2 = root.querySelector("#${id}_r2");
  var r3 = root.querySelector("#${id}_r3");
  var r4 = root.querySelector("#${id}_r4");
  var r5 = root.querySelector("#${id}_r5");

  var current = { A: 0.6, B: 0.4, AB: 0.3 };

  function elegir(lista){
    return lista[Math.floor(Math.random() * lista.length)];
  }

  // Genera A, B y AB válidos y "bonitos"
  function nuevoEjercicio(){
    var posiblesA = [0.4, 0.5, 0.6, 0.7];
    var posiblesB = [0.3, 0.4, 0.5, 0.6];

    var A, B, AB;
    while (true) {
      A = elegir(posiblesA);
      B = elegir(posiblesB);

      var minAB = Math.max(0, A + B - 1);
      var maxAB = Math.min(A, B);

      // elegimos AB con dos decimales entre esos límites
      var v = minAB + Math.random() * (maxAB - minAB);
      AB = Math.round(v * 100) / 100;

      if (AB + 1e-9 >= minAB && AB - 1e-9 <= maxAB) break;
    }

    current.A  = A;
    current.B  = B;
    current.AB = AB;

    spanA.textContent  = A.toFixed(2);
    spanB.textContent  = B.toFixed(2);
    spanAB.textContent = AB.toFixed(2);

    r1.value = ""; r2.value = ""; r3.value = ""; r4.value = ""; r5.value = "";
    divRes.innerHTML = '<i>Escribe tus respuestas y luego pulsa "Verificar respuestas".</i>';
  }

  function verificar(){
    var A  = current.A;
    var B  = current.B;
    var AB = current.AB;

    var union   = A + B - AB;
    var ninguna = 1 - union;
    var soloA   = A - AB;
    var soloB   = B - AB;
    var exacta1 = soloA + soloB;

    function check(input, correcto){
      var val = parseFloat(input.value);
      if (isNaN(val)) return { ok:false, vacio:true, correcto:correcto };
      var ok = Math.abs(val - correcto) <= 0.01;
      return { ok:ok, vacio:false, correcto:correcto, usuario:val };
    }

    var c1 = check(r1, union);
    var c2 = check(r2, ninguna);
    var c3 = check(r3, soloA);
    var c4 = check(r4, soloB);
    var c5 = check(r5, exacta1);

    var lista = [c1,c2,c3,c4,c5];
    var aciertos = 0;
    for (var i=0;i<lista.length;i++){
      if (lista[i].ok) aciertos++;
    }

    function linea(num, txt, c){
      var icon = c.ok ? "✅" : "❌";
      var detalle;
      if (c.vacio){
        detalle = " (sin respuesta; valor correcto: " + c.correcto.toFixed(2) + ")";
      } else if (!c.ok){
        detalle = " (tu respuesta: " + c.usuario.toFixed(2) +
                  "; correcto: " + c.correcto.toFixed(2) + ")";
      } else {
        detalle = " (correcto: " + c.correcto.toFixed(2) + ")";
      }
      return num + ") " + txt + " = " + icon + detalle + "<br>";
    }

    var html = "<b>Resultado de tus respuestas (tolerancia ±0.01):</b><br><br>";
    html += linea("1", "P(A ∪ B)", c1);
    html += linea("2", "P((A ∪ B)')", c2);
    html += linea("3", "P(solo Visa)", c3);
    html += linea("4", "P(solo MasterCard)", c4);
    html += linea("5", "P(exactamente una tarjeta)", c5);
    html += "<br><b>Aciertos: " + aciertos + " de 5</b>";

    divRes.innerHTML = html;
  }

  btnNuevo.addEventListener("click", nuevoEjercicio);
  btnVerificar.addEventListener("click", verificar);

  // Primer ejercicio al cargar
  nuevoEjercicio();

})();
</script>
    `;
  }
};
