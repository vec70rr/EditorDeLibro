// suma_dos_numeros.js
// Ejercicio interactivo — Suma de dos números
// Uso en tu editor: [simulador:suma_dos_numeros]

export default {
  render: (_params, simName = "Ejercicio — Suma de dos números") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="padding:15px;font-family:sans-serif;max-width:600px">

  <h3 style="margin-top:0">${simName}</h3>

  <p>
    En cada ejercicio se generan dos números enteros aleatorios
    <b>a</b> y <b>b</b>. Tu tarea es escribir el valor de <b>a + b</b>.
  </p>

  <div style="border:1px solid #ddd;padding:10px;border-radius:6px;background:#f9fafb;margin-bottom:10px">
    <b>Datos del ejercicio actual</b><br>
    a = <span id="${id}_a"></span><br>
    b = <span id="${id}_b"></span><br>
  </div>

  <p style="margin:6px 0">
    Escribe el resultado de <b>a + b</b> y luego pulsa <b>"Verificar"</b>.
  </p>

  <table style="border-collapse:collapse;width:100%;max-width:400px">
    <tr>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Ítem</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Expresión</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Tu respuesta</th>
    </tr>
    <tr>
      <td style="padding:4px">1)</td>
      <td style="padding:4px">a + b</td>
      <td style="padding:4px">
        <input id="${id}_respuesta" type="number" step="1" style="width:90px">
      </td>
    </tr>
  </table>

  <div style="margin-top:10px">
    <button id="${id}_nuevo">Nuevo ejercicio</button>
    <button id="${id}_verificar" style="margin-left:8px">Verificar</button>
  </div>

  <div id="${id}_resultado" style="margin-top:10px;font-size:14px"></div>

</div>

<script>
(function(){
  var root = document.getElementById("${id}");
  if (!root) return;

  var spanA = root.querySelector("#${id}_a");
  var spanB = root.querySelector("#${id}_b");
  var inputR = root.querySelector("#${id}_respuesta");
  var btnNuevo = root.querySelector("#${id}_nuevo");
  var btnVer = root.querySelector("#${id}_verificar");
  var divRes = root.querySelector("#${id}_resultado");

  var current = { a: 0, b: 0 };

  function nuevoEjercicio(){
    // Números entre 10 y 99 (puedes cambiar el rango si quieres)
    var a = 10 + Math.floor(Math.random() * 90);
    var b = 10 + Math.floor(Math.random() * 90);

    current.a = a;
    current.b = b;

    spanA.textContent = a;
    spanB.textContent = b;
    inputR.value = "";
    divRes.innerHTML = '<i>Escribe tu respuesta y luego pulsa "Verificar".</i>';
  }

  function verificar(){
    var correcto = current.a + current.b;
    var val = parseInt(inputR.value, 10);

    if (isNaN(val)) {
      divRes.innerHTML =
        "<span style='color:#b91c1c'>Por favor escribe un número entero.</span>";
      return;
    }

    if (val === correcto) {
      divRes.innerHTML =
        "✅ <b>Correcto</b>. a + b = " + correcto + ". ¡Buen trabajo!";
    } else {
      divRes.innerHTML =
        "❌ <b>Incorrecto</b>. Tu respuesta fue " + val +
        " y el valor correcto es " + correcto + ".";
    }
  }

  btnNuevo.addEventListener("click", nuevoEjercicio);
  btnVer.addEventListener("click", verificar);

  // Primer ejercicio al cargar
  nuevoEjercicio();
})();
</script>
    `;
  }
};
