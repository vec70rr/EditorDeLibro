// Ejer_34_teclados.js
// Ejercicio interactivo — Teclados defectuosos (técnicas de conteo y probabilidad)
// Uso en tu editor: [simulador:ejer_34_teclados]

export default {
  render: (_params, simName = "Ejercicio — Selección de teclados defectuosos") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="padding:15px;font-family:sans-serif;max-width:800px">

  <h3 style="margin-top:0">${simName}</h3>

  <p>
    Un taller de reparación tiene actualmente <b>25 teclados averiados</b>:
    <b>6</b> con <b>defectos eléctricos</b> y <b>19</b> con <b>defectos mecánicos</b>.
    Se seleccionan al azar <b>5 teclados</b> para una inspección completa (sin reemplazo).
  </p>

  <div style="border:1px solid #ddd;padding:10px;border-radius:6px;background:#f9fafb;margin-bottom:10px;font-size:14px">
    <b>Datos del problema</b><br>
    • Total de teclados: 25<br>
    • Con defecto eléctrico: 6<br>
    • Con defecto mecánico: 19<br>
    • Tamaño de la muestra: 5 teclados (sin importar el orden dentro de la muestra)
  </div>

  <p style="margin:6px 0">
    Escribe las respuestas de los incisos 1 y 2 como <b>números enteros</b> y la del inciso 3 como
    <b>probabilidad en forma decimal</b> (por ejemplo 0.85). Luego pulsa <b>"Verificar respuestas"</b>.
  </p>

  <table style="border-collapse:collapse;width:100%;max-width:750px;font-size:14px">
    <tr>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Ítem</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Descripción</th>
      <th style="border-bottom:1px solid #ddd;text-align:left;padding:4px">Tu respuesta</th>
    </tr>
    <tr>
      <td style="padding:4px">1)</td>
      <td style="padding:4px">
        Número total de maneras de seleccionar <b>5 teclados</b> de los 25 (sin importar el orden).
      </td>
      <td style="padding:4px"><input id="${id}_r1" type="number" step="1" style="width:140px"></td>
    </tr>
    <tr>
      <td style="padding:4px">2)</td>
      <td style="padding:4px">
        Número de maneras de seleccionar 5 teclados de modo que <b>exactamente 2</b> tengan
        defecto eléctrico (y los otros 3 sean mecánicos).
      </td>
      <td style="padding:4px"><input id="${id}_r2" type="number" step="1" style="width:140px"></td>
    </tr>
    <tr>
      <td style="padding:4px">3)</td>
      <td style="padding:4px">
        Probabilidad de que en una muestra aleatoria de 5 teclados 
        <b>al menos 4 tengan defecto mecánico</b>.
      </td>
      <td style="padding:4px"><input id="${id}_r3" type="number" step="0.0001" style="width:140px"></td>
    </tr>
  </table>

  <div style="margin-top:10px">
    <button id="${id}_nuevo">Nuevo ejercicio / limpiar</button>
    <button id="${id}_verificar" style="margin-left:8px">Verificar respuestas</button>
  </div>

  <div id="${id}_res" style="margin-top:10px;font-size:14px"></div>

  <!-- Panel visual extra -->
  <div id="${id}_panelInfo" style="margin-top:14px;font-size:13px;display:none">
    <b>Distribución del número de teclados mecánicos en la muestra</b>
    <div id="${id}_tablaDist" style="margin-top:6px;font-size:12px"></div>
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

  var panelInfo = root.querySelector("#${id}_panelInfo");
  var tablaDist = root.querySelector("#${id}_tablaDist");

  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    if (k > n - k) k = n - k;
    var res = 1;
    for (var i = 1; i <= k; i++) {
      res = res * (n - k + i) / i;
    }
    return Math.round(res);
  }

  function calcularCorrectos() {
    var total = comb(25, 5);

    // Exactamente 2 defectos eléctricos (2 eléctricos, 3 mecánicos)
    var formas2Elec = comb(6, 2) * comb(19, 3);

    // Al menos 4 mecánicos: (4 mecánicos, 1 eléctrico) o (5 mecánicos, 0 eléctricos)
    var formas4Mec1Elec = comb(19, 4) * comb(6, 1);
    var formas5Mec      = comb(19, 5);

    var formasAlMenos4Mec = formas4Mec1Elec + formas5Mec;
    var pAlMenos4Mec = formasAlMenos4Mec / total;

    return {
      total: total,
      formas2Elec: formas2Elec,
      formasAlMenos4Mec: formasAlMenos4Mec,
      pAlMenos4Mec: pAlMenos4Mec
    };
  }

  function limpiar() {
    r1.value = "";
    r2.value = "";
    r3.value = "";
    divRes.innerHTML = '<i>Escribe tus respuestas y luego pulsa "Verificar respuestas".</i>';
    if (panelInfo) {
      panelInfo.style.display = "none";
    }
    if (tablaDist) {
      tablaDist.innerHTML = "";
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

  function construirDistribucion(total) {
    // Distribución del número de teclados mecánicos en la muestra (0 a 5)
    var filas = [];
    var maxProb = 0;
    var dist = [];

    for (var m = 0; m <= 5; m++) {
      var e = 5 - m;
      if (m > 19 || e > 6) continue;
      var formas = comb(19, m) * comb(6, e);
      var prob = formas / total;
      dist.push({ m: m, formas: formas, prob: prob });
      if (prob > maxProb) maxProb = prob;
    }

    var html = '<table style="border-collapse:collapse;width:100%;max-width:500px">';
    html += '<tr>' +
              '<th style="border-bottom:1px solid #ddd;padding:3px;text-align:left"># mecánicos</th>' +
              '<th style="border-bottom:1px solid #ddd;padding:3px;text-align:right">Formas</th>' +
              '<th style="border-bottom:1px solid #ddd;padding:3px;text-align:right">Probabilidad</th>' +
              '<th style="border-bottom:1px solid #ddd;padding:3px;text-align:left">Gráfico</th>' +
            '</tr>';

    for (var i = 0; i < dist.length; i++) {
      var d = dist[i];
      var ancho = maxProb > 0 ? (d.prob / maxProb * 100) : 0;
      html += '<tr>' +
                '<td style="padding:3px">' + d.m + '</td>' +
                '<td style="padding:3px;text-align:right">' + d.formas.toLocaleString() + '</td>' +
                '<td style="padding:3px;text-align:right">' + d.prob.toFixed(4) + '</td>' +
                '<td style="padding:3px">' +
                  '<div style="border:1px solid #ddd;width:100%;max-width:200px;height:10px;border-radius:3px;overflow:hidden">' +
                    '<div style="height:100%;width:' + ancho.toFixed(1) + '%;background:#0ea5e9"></div>' +
                  '</div>' +
                '</td>' +
              '</tr>';
    }

    html += '</table>';
    return html;
  }

  function actualizarPanelVisual(c) {
    if (!panelInfo || !tablaDist) return;
    panelInfo.style.display = "block";
    tablaDist.innerHTML = construirDistribucion(c.total);
  }

  function verificar() {
    var c = calcularCorrectos();

    var c1 = checkEntero(r1, c.total);
    var c2 = checkEntero(r2, c.formas2Elec);
    var c3 = checkProb  (r3, c.pAlMenos4Mec);

    var lista = [c1,c2,c3];
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
    html += linea("1", "Número total de maneras de seleccionar 5 teclados", c1, false);
    html += linea("2", "Número de maneras con exactamente 2 defectos eléctricos", c2, false);
    html += linea("3", "Probabilidad de que al menos 4 teclados sean mecánicos", c3, true);

    html += "<br><b>Aciertos: " + aciertos + " de 3</b>";

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
