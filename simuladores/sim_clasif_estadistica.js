// sim_clasif_estadistica.js
// Simulador — Estadística descriptiva vs inferencial
// Uso en tu editor: [simulador:sim_clasif_estadistica]

export default {
  render: (_params, simName = "Simulador — Descriptiva vs inferencial") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                       margin-top:12px;
                       border-radius:18px;
                       padding:18px 18px 20px;
                       background:radial-gradient(circle at top left,#0f172a,#020617);
                       color:#e5e7eb;
                       box-shadow:0 18px 40px rgba(15,23,42,0.75);">

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
    <div>
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#38bdf8;">
        Simulador interactivo
      </div>
      <h3 style="margin:2px 0 0;font-size:18px;font-weight:700;color:#f9fafb;">
        ${simName}
      </h3>
    </div>
    <div style="width:46px;height:46px;border-radius:999px;
                background:radial-gradient(circle at 30% 20%,#22c55e,#22d3ee);
                box-shadow:0 0 25px rgba(45,212,191,0.9);">
    </div>
  </div>

  <p style="margin:6px 0 14px;font-size:13px;color:#cbd5f5;max-width:720px;">
    Selecciona si cada escenario corresponde a <b>estadística descriptiva</b> o
    <b>estadística inferencial</b>. Después pulsa
    <b>“Verificar respuestas”</b> para ver aciertos, errores y una breve explicación.
  </p>

  <div style="font-size:12px;color:#a5b4fc;margin-bottom:10px;">
    Pista rápida:
    <b>Descriptiva</b> &rarr; solo resumir datos observados.
    <b>Inferencial</b> &rarr; generalizar o concluir sobre la población.
  </div>

  <!-- Escenarios -->
  <div class="escenarios" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px 12px;margin-bottom:12px;"></div>

  <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:4px;">
    <button class="btnCheck"
            style="appearance:none;border:none;border-radius:999px;
                   padding:7px 16px;font-size:13px;font-weight:600;
                   background:linear-gradient(135deg,#22c55e,#22d3ee);
                   color:#0b1120;cursor:pointer;box-shadow:0 10px 25px rgba(34,197,94,0.55);">
      Verificar respuestas
    </button>

    <button class="btnReset"
            style="appearance:none;border:1px solid #4b5563;border-radius:999px;
                   padding:6px 14px;font-size:12px;background:#020617;
                   color:#e5e7eb;cursor:pointer;">
      Nuevo conjunto
    </button>

    <div class="score" style="font-size:13px;font-weight:600;color:#e5e7eb;">
      Aciertos: 0 / 6
    </div>
  </div>

  <div class="feedback" style="margin-top:10px;font-size:12px;color:#e5e7eb;"></div>
</div>

<script>
(function(){
  const root = document.getElementById("${id}");
  if (!root) return;

  const contEsc = root.querySelector(".escenarios");
  const btnCheck = root.querySelector(".btnCheck");
  const btnReset = root.querySelector(".btnReset");
  const scoreEl = root.querySelector(".score");
  const feedbackEl = root.querySelector(".feedback");

  // --- Banco de escenarios (texto, respuesta correcta, tipo breve para explicación) ---
  const banco = [
    {
      id: "E1",
      texto: "Se construye un histograma con los porcentajes de gasto en recaudación de fondos para 60 organizaciones de caridad y se describe que la mayoría está por debajo del 20%.",
      tipo: "D",
      etiqueta: "descriptiva"
    },
    {
      id: "E2",
      texto: "Con datos de resistencia a la flexión de vigas de concreto se calcula un intervalo de confianza para la media poblacional de resistencia.",
      tipo: "I",
      etiqueta: "intervalo de confianza"
    },
    {
      id: "E3",
      texto: "En un estudio sobre aspirina, se comparan las tasas de infarto entre un grupo que toma aspirina y un grupo control para decidir si la aspirina reduce el riesgo.",
      tipo: "I",
      etiqueta: "prueba de hipótesis"
    },
    {
      id: "E4",
      texto: "Se elabora un diagrama de tallo y hoja para visualizar cómo se distribuyen los porcentajes de recaudación de fondos en la muestra.",
      tipo: "D",
      etiqueta: "resumen gráfico"
    },
    {
      id: "E5",
      texto: "A partir de una muestra de conductores, se usa la proporción observada para decidir si más del 50% de todos los conductores usan cinturón de regazo regularmente.",
      tipo: "I",
      etiqueta: "decisión sobre población"
    },
    {
      id: "E6",
      texto: "Un investigador calcula la media y la desviación estándar del ritmo cardiaco de los pacientes de una unidad de cuidados intensivos para resumir los datos registrados.",
      tipo: "D",
      etiqueta: "medidas descriptivas"
    },
    {
      id: "E7",
      texto: "Se usan las mediciones de colesterol de una muestra para predecir el rango de valores que tendrá el colesterol de un paciente futuro similar.",
      tipo: "I",
      etiqueta: "predicción"
    },
    {
      id: "E8",
      texto: "Con la muestra de presión sanguínea de 25 pacientes se construye una tabla de frecuencias y se comenta que hay algunos valores atípicos muy altos.",
      tipo: "D",
      etiqueta: "detección de atípicos"
    }
  ];

  // para cada nueva partida se eligen 6 al azar
  let seleccionActual = [];

  function barajar(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  function nuevaPartida(){
    contEsc.innerHTML = "";
    feedbackEl.innerHTML = '<i>Elige "Descriptiva" o "Inferencial" en cada escenario y luego pulsa "Verificar respuestas".</i>';
    scoreEl.textContent = "Aciertos: 0 / 6";

    seleccionActual = barajar(banco).slice(0,6);

    seleccionActual.forEach((esc, idx) => {
      const card = document.createElement("div");
      card.className = "cardEsc";
      card.style.padding = "10px 11px 11px";
      card.style.borderRadius = "12px";
      card.style.background = "rgba(15,23,42,0.9)";
      card.style.border = "1px solid rgba(148,163,184,0.45)";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.gap = "6px";
      card.style.fontSize = "12px";

      const head = document.createElement("div");
      head.style.display = "flex";
      head.style.justifyContent = "space-between";
      head.style.alignItems = "center";

      const title = document.createElement("div");
      title.innerHTML = "<b>Escenario " + (idx+1) + "</b>";
      title.style.color = "#e5e7eb";

      const badge = document.createElement("span");
      badge.className = "badge";
      badge.style.fontSize = "11px";
      badge.style.padding = "2px 8px";
      badge.style.borderRadius = "999px";
      badge.style.border = "1px solid transparent";
      badge.style.minWidth = "60px";
      badge.style.textAlign = "center";

      head.appendChild(title);
      head.appendChild(badge);

      const texto = document.createElement("div");
      texto.textContent = esc.texto;
      texto.style.color = "#cbd5f5";
      texto.style.lineHeight = "1.35";

      const selWrap = document.createElement("div");
      selWrap.style.display = "flex";
      selWrap.style.gap = "6px";
      selWrap.style.alignItems = "center";
      selWrap.style.marginTop = "4px";

      const lab = document.createElement("span");
      lab.textContent = "Clasificación:";
      lab.style.fontSize = "11px";
      lab.style.color = "#94a3b8";

      const select = document.createElement("select");
      select.dataset.id = esc.id;
      select.style.flex = "1";
      select.style.fontSize = "12px";
      select.style.borderRadius = "999px";
      select.style.padding = "3px 8px";
      select.style.border = "1px solid #4b5563";
      select.style.background = "#020617";
      select.style.color = "#e5e7eb";

      const opt0 = document.createElement("option");
      opt0.value = "";
      opt0.textContent = "— Selecciona —";
      const optD = document.createElement("option");
      optD.value = "D";
      optD.textContent = "Descriptiva";
      const optI = document.createElement("option");
      optI.value = "I";
      optI.textContent = "Inferencial";

      select.appendChild(opt0);
      select.appendChild(optD);
      select.appendChild(optI);

      selWrap.appendChild(lab);
      selWrap.appendChild(select);

      card.appendChild(head);
      card.appendChild(texto);
      card.appendChild(selWrap);

      contEsc.appendChild(card);
    });
  }

  function verificar(){
    const selects = contEsc.querySelectorAll("select");
    let aciertos = 0;
    let total = selects.length;

    const explicaciones = [];

    selects.forEach((sel) => {
      const id = sel.dataset.id;
      const escogida = sel.value;
      const esc = seleccionActual.find(e => e.id === id);
      const card = sel.closest(".cardEsc");
      const badge = card.querySelector(".badge");

      if (!esc) return;

      if (escogida === esc.tipo) {
        aciertos++;
        badge.textContent = "Correcto";
        badge.style.background = "rgba(22,163,74,0.12)";
        badge.style.borderColor = "#22c55e";
        badge.style.color = "#bbf7d0";
      } else if (escogida === "") {
        badge.textContent = "Sin respuesta";
        badge.style.background = "rgba(148,163,184,0.12)";
        badge.style.borderColor = "#64748b";
        badge.style.color = "#e5e7eb";
      } else {
        badge.textContent = "Incorrecto";
        badge.style.background = "rgba(220,38,38,0.12)";
        badge.style.borderColor = "#ef4444";
        badge.style.color = "#fecaca";
      }

      const tipoTexto = esc.tipo === "D" ? "Descriptiva" : "Inferencial";
      const razon = esc.tipo === "D"
        ? "Solo resume/describe los datos observados (" + esc.etiqueta + ")."
        : "Usa la muestra para concluir o predecir algo sobre la población (" + esc.etiqueta + ").";

      explicaciones.push(
        "<b>" + esc.id + ":</b> " + tipoTexto + " — " + razon
      );
    });

    scoreEl.textContent = "Aciertos: " + aciertos + " / " + total;

    feedbackEl.innerHTML =
      "<b>Explicación rápida de los escenarios:</b><br>" +
      explicaciones.join("<br>");
  }

  btnCheck.addEventListener("click", verificar);
  btnReset.addEventListener("click", nuevaPartida);

  // inicio
  nuevaPartida();
})();
</script>
    `;
  }
};
