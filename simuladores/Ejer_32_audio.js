// Ejer_32_audio.js
// Ejercicio interactivo — Sistema de audio (técnicas de conteo)
// Uso en tu editor: [simulador:ejer_32_audio]

export default {
  render: (_params, simName = "Ejercicio — Selección de componentes de audio") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="padding:15px;font-family:sans-serif;max-width:800px">

  <h3 style="margin-top:0">${simName}</h3>

  <p>
    Una tienda vende un sistema de sonido completo: <b>receptor</b>, <b>reproductor de CD</b>, <b>bocinas</b> y <b>tornamesa</b>.
    El cliente puede escoger un componente de cada tipo, según las siguientes opciones:
  </p>

  <div style="border:1px solid #ddd;padding:10px;border-radius:6px;background:#f9fafb;margin-bottom:10px;font-size:14px">
    <b>Datos del problema</b><br>
    • Receptor (5 opciones): Kenwood, Onkyo, Pioneer, <b>Sony</b>, Sherwood<br>
    • Reproductor de CD (4 opciones): Onkyo, Pioneer, <b>Sony</b>, Technics<br>
    • Bocinas (3 opciones): Boston, Infinity, Polk (ninguna es Sony)<br>
    • Tornamesa (4 opciones): Onkyo, <b>Sony</b>, Teac, Technics
  </div>

  <p style="margin:6px 0">
    Escribe las respuestas de los incisos 1 a 3 como <b>números enteros</b> y las de los incisos 4 y 5 como
    <b>probabilidades en forma decimal</b> (por ejemplo 0.55). Luego pulsa <b>"Verificar respuestas"</b>.
  </p>

  <table style="border-collapse:collapse;width:100%;max-width:750px;font-size:14px">
    <tr>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Ítem</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Descripción</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Tu respuesta</th>
    </tr>
    <tr>
      <td style="padding:4px">1)</td>
      <td style="padding:4px">Número total de sistemas posibles (sin restricciones).</td>
      <td style="padding:4px"><input id="${id}_r1" type="number" step="1" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">2)</td>
      <td style="padding:4px">Número de sistemas en los que <b>receptor y CD son Sony</b>.</td>
      <td style="padding:4px"><input id="${id}_r2" type="number" step="1" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">3)</td>
      <td style="padding:4px">Número de sistemas en los que <b>ningún componente es Sony</b>.</td>
      <td style="padding:4px"><input id="${id}_r3" type="number" step="1" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">4)</td>
      <td style="padding:4px">
        Probabilidad de que un sistema seleccionado al azar tenga <b>al menos un componente Sony</b>.
      </td>
      <td style="padding:4px"><input id="${id}_r4" type="number" step="0.0001" style="width:120px"></td>
    </tr>
    <tr>
      <td style="padding:4px">5)</td>
      <td style="padding:4px">
        Probabilidad de que el sistema tenga <b>exactamente un componente Sony</b>.
      </td>
      <td style="padding:4px"><input id="${id}_r5" type="number" step="0.0001" style="width:120px"></td>
    </tr>
  </table>

  <div style="margin-top:10px">
    <button id="${id}_nuevo">Nuevo ejercicio / limpiar</button>
    <button id="${id}_verificar" style="margin-left:8px">Verificar respuestas</button>
  </div>

  <div id="${id}_res" style="margin-top:10px;font-size:14px"></div>

  <!-- Panel visual extra -->
  <div id="${id}_panelInfo" style="margin-top:14px;font-size:13px;display:none">
    <b>Resumen visual de sistemas posibles</b>
    <div style="margin-top:6px">
      <table id="${id}_tablaResumen" style="border-collapse:collapse;font-size:12px">
        <tr>
          <th style="border-bottom:1px solid #ddd;padding:3px;text-align:left">Categoría</th>
          <th style="border-bottom:1px solid #ddd;padding:3px;text-align:right">Cantidad</th>
          <th style="border-bottom:1px solid #ddd;padding:3px;text-align:right">Porcentaje</th>
        </tr>
      </table>
    </div>

    <div style="margin-top:10px">
      <b>Proporción de sistemas con Sony vs sin Sony</b><br>
      <div style="border-radius:4px;border:1px solid #ccc;overflow:hidden;width:100%;max-width:420px;height:20px;display:flex;margin-top:4px">
        <div id="${id}_barSony" style="height:100%;background:#16a34a;width:50%"></div>
        <div id="${id}_barNoSony" style="height:100%;background:#e5e7eb;width:50%"></div>
      </div>
      <div style="font-size:12px;margin-top:4px">
        <span id="${id}_lblSony"></span> con Sony &nbsp;|&nbsp;
        <span id="${id}_lblNoSony"></span> sin Sony
      </div>
    </div>
  </div>

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

  var panelInfo    = root.querySelector("#${id}_panelInfo");
  var tablaResumen = root.querySelector("#${id}_tablaResumen");
  var barSony      = root.querySelector("#${id}_barSony");
  var barNoSony    = root.querySelector("#${id}_barNoSony");
  var lblSony      = root.querySelector("#${id}_lblSony");
  var lblNoSony    = root.querySelector("#${id}_lblNoSony");

  function calcularCorrectos() {
    var total = 5 * 4 * 3 * 4; // todos los sistemas

    // Receptor y CD Sony:
    // Receptor: 1 (Sony); CD: 1 (Sony); bocinas: 3; tornamesa: 4
    var rcSony = 1 * 1 * 3 * 4;

    // Ningún componente Sony:
    // Receptor: 4 no Sony; CD: 3 no Sony; bocinas: 3; tornamesa: 3 no Sony
    var sinSony = 4 * 3 * 3 * 3;

    // Al menos un Sony = total - sinSony
    var alMenosUno = total - sinSony;

    // Exactamente un Sony:
    // Caso 1: solo receptor es Sony
    var soloR = 1 * 3 * 3 * 3;
    // Caso 2: solo CD es Sony
    var soloC = 4 * 1 * 3 * 3;
    // Caso 3: solo tornamesa es Sony
    var soloT = 4 * 3 * 3 * 1;

    var exactUno = soloR + soloC + soloT;

    var masDeUno = alMenosUno - exactUno;

    var pAlMenosUno = alMenosUno / total;
    var pExactUno   = exactUno   / total;

    return {
      total: total,
      rcSony: rcSony,
      sinSony: sinSony,
      alMenosUno: alMenosUno,
      exactUno: exactUno,
      masDeUno: masDeUno,
      c1: total,
      c2: rcSony,
      c3: sinSony,
      c4: pAlMenosUno,
      c5: pExactUno
    };
  }

  function limpiar() {
    r1.value = "";
    r2.value = "";
    r3.value = "";
    r4.value = "";
    r5.value = "";
    divRes.innerHTML = '<i>Escribe tus respuestas y luego pulsa "Verificar respuestas".</i>';
    if (panelInfo) {
      panelInfo.style.display = "none";
    }
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

  function actualizarPanelVisual(c) {
    if (!panelInfo) return;
    panelInfo.style.display = "block";

    if (tablaResumen) {
      function fila(nombre, cantidad) {
        var p = cantidad / c.total * 100;
        return '<tr>' +
          '<td style="padding:3px">' + nombre + '</td>' +
          '<td style="padding:3px;text-align:right">' + cantidad.toLocaleString() + '</td>' +
          '<td style="padding:3px;text-align:right">' + p.toFixed(2) + '%</td>' +
        '</tr>';
      }

      tablaResumen.innerHTML =
        '<tr>' +
          '<th style="border-bottom:1px solid #ddd;padding:3px;text-align:left">Categoría</th>' +
          '<th style="border-bottom:1px solid #ddd;padding:3px;text-align:right">Cantidad</th>' +
          '<th style="border-bottom:1px solid #ddd;padding:3px;text-align:right">Porcentaje</th>' +
        '</tr>' +
        fila("Todos los sistemas", c.total) +
        fila("Sin ningún componente Sony", c.sinSony) +
        fila("Con al menos un Sony", c.alMenosUno) +
        fila("Con exactamente un Sony", c.exactUno) +
        fila("Con más de un Sony", c.masDeUno);
    }

    if (barSony && barNoSony && lblSony && lblNoSony) {
      var pConSony = c.alMenosUno / c.total;
      var pSinSony = c.sinSony    / c.total;
      barSony.style.width   = (pConSony * 100).toFixed(1) + '%';
      barNoSony.style.width = (pSinSony * 100).toFixed(1) + '%';
      lblSony.textContent   = c.alMenosUno.toLocaleString() + " (" + (pConSony*100).toFixed(2) + "%)";
      lblNoSony.textContent = c.sinSony.toLocaleString()    + " (" + (pSinSony*100).toFixed(2) + "%)";
    }
  }

  function verificar() {
    var c = calcularCorrectos();

    var c1 = checkEntero(r1, c.c1);
    var c2 = checkEntero(r2, c.c2);
    var c3 = checkEntero(r3, c.c3);
    var c4 = checkProb  (r4, c.c4);
    var c5 = checkProb  (r5, c.c5);

    var lista = [c1,c2,c3,c4,c5];
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
    html += linea("1", "Total de sistemas posibles", c1, false);
    html += linea("2", "Sistemas con receptor y CD Sony", c2, false);
    html += linea("3", "Sistemas sin ningún componente Sony", c3, false);
    html += linea("4", "Probabilidad de al menos un componente Sony", c4, true);
    html += linea("5", "Probabilidad de exactamente un componente Sony", c5, true);

    html += "<br><b>Aciertos: " + aciertos + " de 5</b>";

    divRes.innerHTML = html;

    actualizarPanelVisual(c);
  }

  btnNuevo.addEventListener("click", limpiar);
  btnVerificar.addEventListener("click", verificar);

  limpiar();

})();
</script>
    `;
  }
};
