// sim_ejercicios_poblacion_muestra_mc.js
// Ejercicios de opción múltiple + cálculo — Población, muestra y tipo de estudio

export default {
  render: (_params) => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:820px;margin:16px 0;">

  <!-- Botón mostrar/ocultar -->
  <button id="${id}_toggle"
          style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;border:none;cursor:pointer;font-size:13px;font-weight:600;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;box-shadow:0 8px 18px rgba(37,99,235,.35);margin-bottom:10px;">
    Ocultar simulador de ejercicios
  </button>

  <!-- Panel del simulador -->
  <div id="${id}_panel"
       style="border-radius:18px;padding:18px 18px 20px;background:#ffffff;color:#111827;border:1px solid #bfdbfe;box-shadow:0 14px 32px rgba(148,163,184,.35);">

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div>
        <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#2563eb;">
          Sección de ejercicios de opción múltiple
        </div>
        <h3 style="margin:2px 0 0;font-size:19px;font-weight:700;color:#111827;">
          Población, muestra y tipo de estudio
        </h3>
      </div>
      <div style="width:44px;height:44px;border-radius:999px;background:radial-gradient(circle at 30% 20%,#60a5fa,#22c55e);box-shadow:0 0 24px rgba(96,165,250,0.75);"></div>
    </div>

    <p style="margin:6px 0 10px;font-size:13px;color:#4b5563;max-width:760px;">
      En este bloque pondrás en práctica las ideas de <b>población</b>, <b>muestra</b>, <b>variabilidad</b> y la diferencia
      entre estudios <b>enumerativos</b> y <b>analíticos</b>. Cada ejercicio combina:
    </p>
    <ul style="margin:0 0 12px 18px;font-size:13px;color:#4b5563;padding-left:12px;">
      <li>una pregunta de <b>opción múltiple</b> (teoría), y</li>
      <li>una pregunta de <b>respuesta abierta</b> donde debes realizar un pequeño cálculo.</li>
    </ul>
    <p style="margin:0 0 14px;font-size:13px;color:#4b5563;max-width:760px;">
      Elige las opciones que consideres correctas, completa los cálculos y pulsa <b>“Verificar respuestas”</b>.
      Puedes generar un <b>nuevo conjunto de datos</b> para practicar con números diferentes.
    </p>

    <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:16px;">
      <button id="${id}_nuevo"
              style="appearance:none;border:none;border-radius:999px;padding:7px 16px;font-size:13px;font-weight:600;background:linear-gradient(135deg,#0ea5e9,#3b82f6);color:#f9fafb;cursor:pointer;box-shadow:0 10px 22px rgba(59,130,246,.35);">
        Nuevo conjunto de datos
      </button>
      <span style="font-size:12px;color:#6b7280;">(cambia ejemplos, valores y opciones)</span>
    </div>

    <div style="display:flex;flex-direction:column;gap:16px;">

      <!-- EJERCICIO 1 -->
      <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 1 — Muestra y media de calificaciones</div>
          <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#eff6ff;color:#1d4ed8;">Población y muestra</span>
        </div>

        <div id="${id}_ej1_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>

        <div style="font-size:12px;color:#374151;margin-bottom:2px;">
          <b>1.1</b> ¿Cuál de las siguientes opciones puede ser una <b>muestra de tamaño 4</b> de las
          calificaciones promedio de los estudiantes (en escala de 0 a 10)?
        </div>
        <div id="${id}_q1a_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
        <div id="${id}_q1a_fb" style="margin-top:4px;font-size:12px;"></div>

        <div style="font-size:12px;color:#374151;margin-top:8px;margin-bottom:2px;">
          <b>1.2</b> Para la muestra correcta, se tiene el siguiente conjunto de promedios:
          <span id="${id}_ej1_muestra" style="font-weight:600;"></span>.
          Calcula la <b>media aproximada</b> de estos 4 valores y escríbela (usa punto o coma decimal).
        </div>
        <input id="${id}_q1b_input"
               type="text"
               placeholder="Escribe aquí la media aproximada"
               style="width:100%;max-width:260px;margin-top:2px;border-radius:999px;border:1px solid #d1d5db;padding:6px 10px;font-size:12px;background:#f9fafb;outline:none;">
        <div id="${id}_q1b_fb" style="margin-top:4px;font-size:12px;"></div>
      </div>

      <!-- EJERCICIO 2 -->
      <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 2 — Tamaño de la muestra y tipo de estudio</div>
          <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#ecfeff;color:#0e7490;">Diseño de estudio</span>
        </div>

        <div id="${id}_ej2_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>

        <div style="font-size:12px;color:#374151;margin-bottom:2px;">
          <b>2.1</b> Respecto al objetivo del modelo de valoración de casas, este estudio se considera:
        </div>
        <div id="${id}_q2a_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
        <div id="${id}_q2a_fb" style="margin-top:4px;font-size:12px;"></div>

        <div style="font-size:12px;color:#374151;margin-top:8px;margin-bottom:2px;">
          <b>2.2</b> Según el plan descrito, se toman <b>x</b> casas en cada distrito. Calcula el
          <b>tamaño total de la muestra (número de casas)</b> y escríbelo.
        </div>
        <input id="${id}_q2b_input"
               type="text"
               placeholder="Número total de casas en la muestra"
               style="width:100%;max-width:260px;margin-top:2px;border-radius:999px;border:1px solid #d1d5db;padding:6px 10px;font-size:12px;background:#f9fafb;outline:none;">
        <div id="${id}_q2b_fb" style="margin-top:4px;font-size:12px;"></div>
      </div>

      <!-- EJERCICIO 3 -->
      <div style="padding:11px 12px 12px;border-radius:16px;background:#ffffff;border:1px solid #cbd5f5;box-shadow:0 3px 12px rgba(148,163,184,.4);border-left:4px solid #3b82f6;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div style="font-size:13px;font-weight:700;color:#111827;">Ejercicio 3 — Medidas repetidas y cálculo</div>
          <span style="font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #d1d5db;background:#fefce8;color:#854d0e;">Variabilidad y cálculo</span>
        </div>

        <div id="${id}_ej3_enun" style="font-size:12px;color:#111827;line-height:1.4;margin-bottom:6px;"></div>

        <div style="font-size:12px;color:#374151;margin-bottom:2px;">
          <b>3.1</b> ¿Qué explica mejor que las mediciones no sean idénticas?
        </div>
        <div id="${id}_q3a_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
        <div id="${id}_q3a_fb" style="margin-top:4px;font-size:12px;"></div>

        <div style="font-size:12px;color:#374151;margin-top:8px;margin-bottom:2px;">
          <b>3.2</b> Con base en los datos mostrados, calcula mentalmente la <b>media aproximada</b> y elige la opción más razonable.
        </div>
        <div id="${id}_q3b_opts" style="font-size:12px;color:#111827;margin-bottom:4px;"></div>
        <div id="${id}_q3b_fb" style="margin-top:4px;font-size:12px;"></div>
      </div>

    </div>

    <div style="margin-top:16px;display:flex;align-items:center;gap:10px;">
      <button id="${id}_verificar"
              style="appearance:none;border:none;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;background:linear-gradient(135deg,#22c55e,#16a34a);color:#f9fafb;cursor:pointer;box-shadow:0 10px 24px rgba(34,197,94,.45);">
        Verificar respuestas
      </button>
      <div id="${id}_resumen" style="font-size:13px;color:#111827;"></div>
    </div>

  </div>
</div>

<script>
(function(){
  const root = document.getElementById("${id}");
  if (!root) return;

  // Toggle mostrar/ocultar
  const panel = root.querySelector("#${id}_panel");
  const btnToggle = root.querySelector("#${id}_toggle");
  btnToggle.addEventListener("click", () => {
    const hidden = panel.style.display === "none";
    panel.style.display = hidden ? "" : "none";
    btnToggle.textContent = hidden
      ? "Ocultar simulador de ejercicios"
      : "Mostrar simulador de ejercicios";
  });

  const btnNuevo   = root.querySelector("#${id}_nuevo");
  const btnVerif   = root.querySelector("#${id}_verificar");
  const resumenEl  = root.querySelector("#${id}_resumen");

  const namePrefix = "${id}_";

  const ej1EnunEl    = root.querySelector("#${id}_ej1_enun");
  const ej1MuestraEl = root.querySelector("#${id}_ej1_muestra");
  const q1aOptsEl    = root.querySelector("#${id}_q1a_opts");
  const q1aFbEl      = root.querySelector("#${id}_q1a_fb");
  const q1bInput     = root.querySelector("#${id}_q1b_input");
  const q1bFbEl      = root.querySelector("#${id}_q1b_fb");

  const ej2EnunEl  = root.querySelector("#${id}_ej2_enun");
  const q2aOptsEl  = root.querySelector("#${id}_q2a_opts");
  const q2aFbEl    = root.querySelector("#${id}_q2a_fb");
  const q2bInput   = root.querySelector("#${id}_q2b_input");
  const q2bFbEl    = root.querySelector("#${id}_q2b_fb");

  const ej3EnunEl  = root.querySelector("#${id}_ej3_enun");
  const q3aOptsEl  = root.querySelector("#${id}_q3a_opts");
  const q3aFbEl    = root.querySelector("#${id}_q3a_fb");
  const q3bOptsEl  = root.querySelector("#${id}_q3b_opts");
  const q3bFbEl    = root.querySelector("#${id}_q3b_fb");

  const state = { questions: {}, targets: {} };

  function choice(arr){
    return arr[Math.floor(Math.random()*arr.length)];
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  function sampleWithoutReplacement(arr, k){
    const a = arr.slice();
    const out = [];
    for(let i=0;i<k && a.length>0;i++){
      const idx = Math.floor(Math.random()*a.length);
      out.push(a[idx]);
      a.splice(idx,1);
    }
    return out;
  }

  // ----- EJERCICIO 1 -----
  function generarEj1(){
    ej1EnunEl.innerHTML =
      "Considera la población formada por las <b>calificaciones promedio</b> (en escala 0–10) de todos los estudiantes de una universidad. "
      + "Una <b>muestra de tamaño 4</b> consiste en elegir cuatro de esos promedios y analizarlos.";

    // Muestra correcta de 4 promedios
    const califs = [];
    for(let i=0;i<4;i++){
      const base = 6 + Math.random()*4; // 6–10
      califs.push(parseFloat(base.toFixed(2)));
    }
    const media = califs.reduce((a,b)=>a+b,0) / califs.length;
    const mediaRed = Math.round(media*10)/10;

    // Otras opciones incorrectas
    const califsFueraRango = [12.3, 9.1, -1.0, 8.4];
    const califsTamanio3   = califs.slice(0,3);

    const opcionesA = shuffle([
      { texto: califs.map(c=>c.toFixed(2)).join(", "), tipo:"valida" },
      { texto: califsFueraRango.map(c=>c.toFixed(2)).join(", "), tipo:"rango" },
      { texto: califsTamanio3.map(c=>c.toFixed(2)).join(", "), tipo:"tam" }
    ]);

    const letters = ["A","B","C"];
    let correctA = null;
    let htmlA = "";
    opcionesA.forEach((op, idx) => {
      const v = letters[idx];
      if (op.tipo === "valida") correctA = v;
      htmlA +=
        '<label style="display:block;margin:3px 0;padding:4px 6px;border-radius:8px;border:1px solid #e5e7eb;cursor:pointer;">'
        + '<input type="radio" name="'+namePrefix+'q1a" value="'+v+'" style="margin-right:6px;">'
        + '<b>'+v+') </b>'+op.texto
        + '</label>';
    });
    q1aOptsEl.innerHTML = htmlA;

    state.questions.q1a = {
      correct: correctA,
      fbEl: q1aFbEl,
      name: namePrefix + "q1a",
      explCorrect: "Correcto. Es una lista de 4 promedios dentro de la escala 0 a 10, por lo que puede ser una muestra de esa población.",
      explIncorrect: "La muestra debe tener 4 promedios y todos deben estar entre 0 y 10."
    };
    q1aFbEl.textContent = "";

    ej1MuestraEl.textContent = califs.map(c=>c.toFixed(2)).join(", ");
    q1bInput.value = "";
    state.targets.q1b = mediaRed;
    q1bFbEl.textContent = "";
  }

  // ----- EJERCICIO 2 -----
  function generarEj2(){
    const ciudades = ["Monterrey","Guadalajara","Puebla","Querétaro","León","Tijuana"];
    const city = choice(ciudades);
    const distritos = Math.floor(8 + Math.random()*5); // 8–12
    const casasPorDistrito = Math.floor(3 + Math.random()*5); // 3–7
    const totalMuestra = distritos * casasPorDistrito;

    ej2EnunEl.innerHTML =
      "En la ciudad de <b>"+city+"</b>, dividida en <b>"+distritos+" distritos</b>, un valuador quiere construir un modelo "
      + "para estimar el valor de casas unifamiliares. Planea seleccionar <b>"+casasPorDistrito+" casas al azar en cada distrito</b>, "
      + "medir variables como antigüedad, tamaño y número de baños, y ajustar una ecuación que permita <b>predecir el valor</b> de casas similares en el futuro.";

    // 2.1 tipo de estudio: enumerativo vs analítico
    q2aOptsEl.innerHTML = [
      {v:"A", t:"Enumerativo: solo describe las casas de la muestra."},
      {v:"B", t:"Analítico: busca predecir o generalizar a casas futuras."},
      {v:"C", t:"Experimental de laboratorio."},
      {v:"D", t:"Ninguna de las anteriores."}
    ].map(op =>
      '<label style="display:block;margin:2px 0;padding:4px 6px;border-radius:8px;border:1px solid #e5e7eb;cursor:pointer;">'
      + '<input type="radio" name="'+namePrefix+'q2a" value="'+op.v+'" style="margin-right:6px;">'
      + '<b>'+op.v+') </b>'+op.t
      + '</label>'
    ).join("");

    state.questions.q2a = {
      correct: "B",
      fbEl: q2aFbEl,
      name: namePrefix + "q2a",
      explCorrect: "Correcto. El objetivo es usar el modelo para <b>predecir</b> valores de casas futuras, así que el enfoque es analítico.",
      explIncorrect: "Como se quiere usar el modelo para predecir valores más allá de los datos observados, el estudio es <b>analítico</b>, no solo enumerativo."
    };
    q2aFbEl.textContent = "";

    q2bInput.value = "";
    state.targets.q2b = totalMuestra;
    q2bFbEl.textContent = "";
  }

  // ----- EJERCICIO 3 -----
  function generarEj3(){
    // 8 observaciones alrededor de 30
    const datos = [];
    for(let i=0;i<7;i++){
      const base = 25 + Math.round(Math.random()*12); // 25–37
      datos.push(base);
    }
    const raro = Math.random()<0.5 ? -2 : 5;
    datos.splice(Math.floor(Math.random()*datos.length),0,raro);

    ej3EnunEl.innerHTML =
      "En un experimento tipo Michelson–Newcomb, se registran 8 observaciones (codificadas) del tiempo que tarda la luz en recorrer cierta distancia:"
      + "<br><br><b>"+datos.join(", ")+"</b>";

    // 3.1 causa de variación
    q3aOptsEl.innerHTML = [
      {v:"A", t:"Porque la velocidad de la luz cambia mucho de un ensayo a otro."},
      {v:"B", t:"Por errores de medición, variabilidad experimental e imprecisión de los instrumentos."},
      {v:"C", t:"Porque cada medición usa unidades diferentes."},
      {v:"D", t:"Porque se mezclan datos de experimentos totalmente distintos."}
    ].map(op =>
      '<label style="display:block;margin:2px 0;padding:4px 6px;border-radius:8px;border:1px solid #e5e7eb;cursor:pointer;">'
      + '<input type="radio" name="'+namePrefix+'q3a" value="'+op.v+'" style="margin-right:6px;">'
      + '<b>'+op.v+') </b>'+op.t
      + '</label>'
    ).join("");

    state.questions.q3a = {
      correct: "B",
      fbEl: q3aFbEl,
      name: namePrefix + "q3a",
      explCorrect: "Correcto. La variación se debe a la <b>variabilidad experimental</b>: errores de medición, ruido, etc.",
      explIncorrect: "En este tipo de experimentos se asume que la velocidad de la luz es constante; la variación proviene de los <b>errores de medición</b>."
    };
    q3aFbEl.textContent = "";

    // 3.2 media aproximada
    const n = datos.length;
    const suma = datos.reduce((a,b)=>a+b,0);
    const media = suma / n;
    const mediaRed = Math.round(media*10)/10;

    const opcionesMedia = [];
    opcionesMedia.push({v:"A", val: mediaRed});
    opcionesMedia.push({v:"B", val: mediaRed + 2});
    opcionesMedia.push({v:"C", val: mediaRed - 2});
    opcionesMedia.push({v:"D", val: mediaRed + 5});

    const opsBarajadas = shuffle(opcionesMedia);
    let correctVal = null;
    let html = "";
    opsBarajadas.forEach(op => {
      if (op.val === mediaRed) correctVal = op.v;
      html +=
        '<label style="display:block;margin:2px 0;padding:4px 6px;border-radius:8px;border:1px solid #e5e7eb;cursor:pointer;">'
        + '<input type="radio" name="'+namePrefix+'q3b" value="'+op.v+'" style="margin-right:6px;">'
        + '<b>'+op.v+') </b>'+op.val.toFixed(1)
        + '</label>';
    });
    q3bOptsEl.innerHTML = html;

    state.questions.q3b = {
      correct: correctVal,
      fbEl: q3bFbEl,
      name: namePrefix + "q3b",
      explCorrect: "Correcto. Al sumar los valores y dividir entre "+n+" se obtiene una media aproximada de <b>"+mediaRed.toFixed(1)+"</b>.",
      explIncorrect: "Si sumas las "+n+" observaciones y divides entre "+n+", la media aproximada es alrededor de <b>"+mediaRed.toFixed(1)+"</b>."
    };
    q3bFbEl.textContent = "";
  }

  // ----- GENERAR TODO -----
  function generarTodo(){
    generarEj1();
    generarEj2();
    generarEj3();
    resumenEl.textContent = "";
  }

  // ----- VERIFICAR -----
  function verificar(){
    let total = 0;
    let correctas = 0;

    function evalMC(key){
      const info = state.questions[key];
      if (!info) return;
      total++;
      const selector = 'input[name="'+info.name+'"]:checked';
      const checked = root.querySelector(selector);
      info.fbEl.style.padding = "4px 6px";
      info.fbEl.style.borderRadius = "8px";
      if (!checked){
        info.fbEl.style.background = "rgba(248,250,252)";
        info.fbEl.style.border = "1px dashed #e5e7eb";
        info.fbEl.style.color = "#b45309";
        info.fbEl.innerHTML = "Sin respuesta.";
        return;
      }
      if (checked.value === info.correct){
        correctas++;
        info.fbEl.style.background = "rgba(22,163,74,0.08)";
        info.fbEl.style.border = "1px solid #22c55e";
        info.fbEl.style.color = "#166534";
        info.fbEl.innerHTML = "✔ Correcto. " + (info.explCorrect || "");
      } else {
        info.fbEl.style.background = "rgba(248,113,113,0.08)";
        info.fbEl.style.border = "1px solid #f87171";
        info.fbEl.style.color = "#b91c1c";
        info.fbEl.innerHTML = "✘ Incorrecto. " + (info.explIncorrect || "");
      }
    }

    function evalNumeric(input, fbEl, targetKey, decimals){
      total++;
      fbEl.style.padding = "4px 6px";
      fbEl.style.borderRadius = "8px";
      const raw = (input.value || "").trim().replace(",", ".");
      const x = Number(raw);
      const target = state.targets[targetKey];

      if (!raw){
        fbEl.style.background = "rgba(248,250,252)";
        fbEl.style.border = "1px dashed #e5e7eb";
        fbEl.style.color = "#b45309";
        fbEl.innerHTML = "Sin respuesta. Intenta calcularlo.";
        return;
      }
      if (Number.isNaN(x)){
        fbEl.style.background = "rgba(248,113,113,0.08)";
        fbEl.style.border = "1px solid #f87171";
        fbEl.style.color = "#b91c1c";
        fbEl.innerHTML = "No parece un número válido. Escribe solo el valor numérico.";
        return;
      }
      const tol = decimals === 0 ? 0.5 : 0.15;
      if (Math.abs(x - target) <= tol){
        correctas++;
        fbEl.style.background = "rgba(22,163,74,0.08)";
        fbEl.style.border = "1px solid #22c55e";
        fbEl.style.color = "#166534";
        fbEl.innerHTML = "✔ Correcto (aprox.). El valor esperado es cerca de <b>"+target.toFixed(decimals)+"</b>.";
      } else {
        fbEl.style.background = "rgba(248,113,113,0.08)";
        fbEl.style.border = "1px solid #f87171";
        fbEl.style.color = "#b91c1c";
        fbEl.innerHTML = "✘ Revisa tu cálculo. El valor esperado es aproximadamente <b>"+target.toFixed(decimals)+"</b>.";
      }
    }

    evalMC("q1a");
    evalNumeric(q1bInput, q1bFbEl, "q1b", 1);

    evalMC("q2a");
    evalNumeric(q2bInput, q2bFbEl, "q2b", 0);

    evalMC("q3a");
    evalMC("q3b");

    if (total > 0){
      resumenEl.textContent = "Aciertos: " + correctas + " de " + total + " preguntas.";
    } else {
      resumenEl.textContent = "";
    }
  }

  btnNuevo.addEventListener("click", generarTodo);
  btnVerif.addEventListener("click", verificar);

  // Inicial
  generarTodo();
})();
</script>
    `;
  }
};
