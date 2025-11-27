// Ejer_29_dominios.js
// Ejercicio interactivo — Nombres de dominio (técnicas de conteo)
// Uso en tu editor: [simulador:ejer_29_dominios]

export default {
  render: (_params, simName = "Ejercicio — Técnicas de conteo (nombres de dominio)") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="padding:15px;font-family:sans-serif;max-width:800px">

  <h3 style="margin-top:0">${simName}</h3>

  <p>
    Considera nombres de dominio formados con letras minúsculas del alfabeto inglés (26 letras)
    y dígitos (10 dígitos). Trabajaremos con nombres de longitud 2, 3 y 4 caracteres.
  </p>

  <p>
    Supondremos que aún hay exactamente <b>97,786</b> nombres de 4 caracteres (letras o dígitos)
    que no han sido registrados. Con esta información, responde los incisos de abajo.
  </p>

  <div style="border:1px solid #ddd;padding:10px;border-radius:6px;background:#f9fafb;margin-bottom:10px;font-size:14px">
    <b>Datos que puedes usar</b><br>
    • Letras permitidas: 26<br>
    • Dígitos permitidos: 10<br>
    • Total de caracteres posibles (letra o dígito): 36<br>
    • Nombres de 4 caracteres con letras o dígitos: 36^4<br>
    • Nombres de 4 caracteres aún libres: 97,786
  </div>

  <p style="margin:6px 0">
    Escribe las respuestas de los incisos 1 a 6 como <b>números enteros</b> (por ejemplo 1296),
    y la respuesta del inciso 7 como <b>probabilidad en forma decimal</b> (por ejemplo 0.94).
    Luego pulsa <b>"Verificar respuestas"</b>.
  </p>

  <table style="border-collapse:collapse;width:100%;max-width:750px;font-size:14px">
    <tr>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Ítem</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Descripción</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Tu respuesta</th>
    </tr>
    <tr>
      <td style="padding:4px">1)</td>
      <td style="padding:4px">Número de nombres de dominio de <b>exactamente 2 letras</b> (solo letras).</td>
      <td style="padding:4px"><input id="${id}_r1" type="number" step="1" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">2)</td>
      <td style="padding:4px">Número de nombres de dominio de <b>2 caracteres</b> si se permiten <b>letras y dígitos</b>.</td>
      <td style="padding:4px"><input id="${id}_r2" type="number" step="1" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">3)</td>
      <td style="padding:4px">Número de nombres de dominio de <b>exactamente 3 letras</b>.</td>
      <td style="padding:4px"><input id="${id}_r3" type="number" step="1" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">4)</td>
      <td style="padding:4px">Número de nombres de dominio de <b>3 caracteres</b> con letras y dígitos.</td>
      <td style="padding:4px"><input id="${id}_r4" type="number" step="1" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">5)</td>
      <td style="padding:4px">Número de nombres de dominio de <b>exactamente 4 letras</b>.</td>
      <td style="padding:4px"><input id="${id}_r5" type="number" step="1" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">6)</td>
      <td style="padding:4px">Número de nombres de dominio de <b>4 caracteres</b> con letras y dígitos.</td>
      <td style="padding:4px"><input id="${id}_r6" type="number" step="1" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">7)</td>
      <td style="padding:4px">
        Probabilidad de que un nombre de 4 caracteres (letra o dígito) elegido al azar
        <b>ya esté registrado</b>.
      </td>
      <td style="padding:4px"><input id="${id}_r7" type="number" step="0.0001" style="width:120px"></td>
    </tr>
  </table>

  <div style="margin-top:10px">
    <button id="${id}_nuevo">Nuevo ejercicio / limpiar</button>
    <button id="${id}_verificar" style="margin-left:8px">Verificar respuestas</button>
  </div>

  <div id="${id}_res" style="margin-top:10px;font-size:14px"></div>

</div>

<script>
(function(){
  var root = document.getElementById("${id}");
  if (!root) return;

  var btnNuevo     = root.querySelector("#${id}_nuevo");
  var btnVerificar = root.querySelector("#${id}_verificar");
  var divRes       = root.querySelector("#${id}_res");

  var r1 = root.querySelector("#${id}_r1");
  var r2 = root.querySelector("#${id}_r2");
  var r3 = root.querySelector("#${id}_r3");
  var r4 = root.querySelector("#${id}_r4");
  var r5 = root.querySelector("#${id}_r5");
  var r6 = root.querySelector("#${id}_r6");
  var r7 = root.querySelector("#${id}_r7");

  var letras = 26;
  var digitos = 10;
  var totalChars = letras + digitos;

  function calcularCorrectos() {
    var total2_letras = Math.pow(letras, 2);
    var total2_mix    = Math.pow(totalChars, 2);
    var total3_letras = Math.pow(letras, 3);
    var total3_mix    = Math.pow(totalChars, 3);
    var total4_letras = Math.pow(letras, 4);
    var total4_mix    = Math.pow(totalChars, 4);

    var libres4 = 97786;
    var ocupados4 = total4_mix - libres4;
    var probOcupado = ocupados4 / total4_mix;

    return {
      c1: total2_letras,
      c2: total2_mix,
      c3: total3_letras,
      c4: total3_mix,
      c5: total4_letras,
      c6: total4_mix,
      c7: probOcupado
    };
  }

  function limpiar() {
    r1.value = "";
    r2.value = "";
    r3.value = "";
    r4.value = "";
    r5.value = "";
    r6.value = "";
    r7.value = "";
    divRes.innerHTML = '<i>Escribe tus respuestas y luego pulsa "Verificar respuestas".</i>';
  }

  function checkEntero(input, correcto) {
    var txt = input.value.trim();
    if (txt === "") return { ok:false, vacio:true, correcto:correcto };
    var val = parseInt(txt, 10);
    if (isNaN(val)) return { ok:false, vacio:false, formato:true, correcto:correcto };
    var ok = (val === correcto);
    return { ok:ok, vacio:false, formato:false, correcto:correcto, usuario:val };
  }

  function checkProb(input, correcto) {
    var txt = input.value.trim();
    if (txt === "") return { ok:false, vacio:true, correcto:correcto };
    var val = parseFloat(txt);
    if (isNaN(val)) return { ok:false, vacio:false, formato:true, correcto:correcto };
    var ok = Math.abs(val - correcto) <= 0.0001;
    return { ok:ok, vacio:false, formato:false, correcto:correcto, usuario:val };
  }

  function verificar() {
    var c = calcularCorrectos();

    var c1 = checkEntero(r1, c.c1);
    var c2 = checkEntero(r2, c.c2);
    var c3 = checkEntero(r3, c.c3);
    var c4 = checkEntero(r4, c.c4);
    var c5 = checkEntero(r5, c.c5);
    var c6 = checkEntero(r6, c.c6);
    var c7 = checkProb  (r7, c.c7);

    var lista = [c1,c2,c3,c4,c5,c6,c7];
    var aciertos = 0;
    for (var i=0; i<lista.length; i++) {
      if (lista[i].ok) aciertos++;
    }

    function linea(num, txt, c, esProb) {
      var icon = c.ok ? "✅" : "❌";
      var detalle;
      if (c.vacio) {
        if (esProb) {
          detalle = " (sin respuesta; valor correcto ≈ " + c.correcto.toFixed(4) + ")";
        } else {
          detalle = " (sin respuesta; valor correcto: " + c.correcto + ")";
        }
      } else if (c.formato) {
        detalle = " (formato no válido; ";
        if (esProb) {
          detalle += "usa un número decimal; correcto ≈ " + c.correcto.toFixed(4) + ")";
        } else {
          detalle += "usa un entero; correcto: " + c.correcto + ")";
        }
      } else if (!c.ok) {
        if (esProb) {
          detalle = " (tu respuesta: " + c.usuario.toFixed(4) +
                    "; correcto ≈ " + c.correcto.toFixed(4) + ")";
        } else {
          detalle = " (tu respuesta: " + c.usuario +
                    "; correcto: " + c.correcto + ")";
        }
      } else {
        if (esProb) {
          detalle = " (correcto ≈ " + c.correcto.toFixed(4) + ")";
        } else {
          detalle = " (correcto: " + c.correcto + ")";
        }
      }
      return num + ") " + txt + " " + icon + detalle + "<br>";
    }

    var html = "<b>Resultado de tus respuestas:</b><br><br>";
    html += linea("1", "Nombres de 2 letras", c1, false);
    html += linea("2", "Nombres de 2 caracteres (letra o dígito)", c2, false);
    html += linea("3", "Nombres de 3 letras", c3, false);
    html += linea("4", "Nombres de 3 caracteres (letra o dígito)", c4, false);
    html += linea("5", "Nombres de 4 letras", c5, false);
    html += linea("6", "Nombres de 4 caracteres (letra o dígito)", c6, false);
    html += linea("7", "Probabilidad de que un nombre de 4 caracteres ya esté registrado", c7, true);

    html += "<br><b>Aciertos: " + aciertos + " de 7</b>";

    divRes.innerHTML = html;
  }

  btnNuevo.addEventListener("click", limpiar);
  btnVerificar.addEventListener("click", verificar);

  limpiar();

})();
</script>
    `;
  }
};
