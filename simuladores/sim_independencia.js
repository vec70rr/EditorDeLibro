// ================================================================
// Simulador — Verificador de Independencia (Ejemplo 2.32)
// ================================================================

export default {
  render: (_params, simName = 'Verificador de Independencia') => {
    const id = "sim_independencia" + Math.random().toString(36).slice(2);

    return `
      <div id="${id}">
        <button id="${id}_btnToggle" class="btn-sim">
          Abrir ${simName}
        </button>

        <div id="${id}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <style>
            #${id}_container { font-family: system-ui, sans-serif; font-size: 14px; }
            #${id}_container .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #fff; margin-top: 8px; }
            #${id}_container .input-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            #${id}_container input { width: 80px; padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; text-align: right; }
            #${id}_container button { padding: 6px 12px; border-radius: 6px; border: 1px solid #d1d5db; cursor: pointer; background: #f3f4f6; }
            #${id}_container button.primary { background: #3b82f6; color: white; border: none; }
            #${id}_container .formula { font-family: "JetBrains Mono", monospace; font-size: 13px; margin: 10px 0; background: #f8fafc; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0; }
            #${id}_container .tag { display:inline-block; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:12px; }
            #${id}_container .tag-indep { background:#dcfce7; color:#166534; }
            #${id}_container .tag-dep { background:#fee2e2; color:#991b1b; }
            #${id}_container .error-msg { color: #dc2626; font-weight: bold; margin-top: 5px; font-size: 13px; }
          </style>

          <h3>Simulador — ${simName}</h3>

          <div class="box">
            <b>1. Datos del Problema</b>
            <div style="margin-top:6px; margin-bottom:10px; font-size:13px; color:#4b5563;">
              Ingresa las probabilidades (0.0 a 1.0) para verificar si A y B son estadísticamente independientes.
            </div>

            <div class="input-row">
              <label>Probabilidad P(A):</label>
              <input type="number" id="${id}_pa" value="0.50" step="0.01" max="1" min="0">
            </div>
            <div class="input-row">
              <label>Probabilidad P(B):</label>
              <input type="number" id="${id}_pb" value="0.30" step="0.01" max="1" min="0">
            </div>
            <div class="input-row">
              <label>Intersección P(A ∩ B):</label>
              <input type="number" id="${id}_pinter" value="0.15" step="0.01" max="1" min="0">
            </div>
            
            <div style="margin-top:12px; display:flex; gap:8px;">
              <button id="${id}_btnCalc" class="primary">Verificar</button>
              <button id="${id}_btnRand">Ejemplo Aleatorio</button>
            </div>
            <div id="${id}_error" class="error-msg" style="display:none;"></div>
          </div>

          <div id="${id}_resultBox" class="box" style="display:none; background:#eff6ff; border-color:#bfdbfe;">
            <div style="font-weight:bold; color:#1e3a8a; display:flex; justify-content:space-between;">
              <span>Análisis:</span>
              <span id="${id}_status" class="tag"></span>
            </div>
            
            <div id="${id}_formula" class="formula"></div>
            
            <div id="${id}_conclusion" style="font-size:0.95em; color:#1e3a8a; margin-top:5px;"></div>
          </div>
        </div>
      </div>

      <script>
        (function(){
          const root = document.getElementById("${id}");
          if (!root) return; 

          const simName = "${simName}";
          const container = root.querySelector("#${id}_container");
          const btnToggle = root.querySelector("#${id}_btnToggle");
          const $ = (suffix) => root.querySelector("#${id}_" + suffix);

          let initialized = false;

          btnToggle.addEventListener("click", function(){
            const hidden = container.style.display === "none" || container.style.display === "";
            if (hidden) {
              container.style.display = "block";
              btnToggle.textContent = "Ocultar " + simName;
              btnToggle.classList.add("btn-sim-rojo");
              if (!initialized) { initialized = true; initSim(); }
            } else {
              container.style.display = "none";
              btnToggle.textContent = "Abrir " + simName;
              btnToggle.classList.remove("btn-sim-rojo");
            }
          });

          function initSim(){
            const inpPa = $("pa");
            const inpPb = $("pb");
            const inpInter = $("pinter");
            const btnCalc = $("btnCalc");
            const btnRand = $("btnRand");
            const resBox = $("resultBox");
            const formulaDiv = $("formula");
            const statusSpan = $("status");
            const conclusionDiv = $("conclusion");
            const errorDiv = $("error");

            function calc() {
              errorDiv.style.display = "none";
              const pa = parseFloat(inpPa.value);
              const pb = parseFloat(inpPb.value);
              const inter = parseFloat(inpInter.value);

              // Validaciones básicas
              if (isNaN(pa) || isNaN(pb) || isNaN(inter)) return showError("Ingresa números válidos.");
              if (pa < 0 || pa > 1 || pb < 0 || pb > 1 || inter < 0 || inter > 1) return showError("Las probabilidades deben estar entre 0 y 1.");
              if (inter > pa || inter > pb) return showError("La intersección no puede ser mayor que P(A) o P(B).");

              // Cálculo de P(A|B)
              // Evitar división por cero
              let p_agivenb = 0;
              let textoCond = "";
              
              if (pb === 0) {
                 textoCond = "Indefinido (P(B)=0)";
              } else {
                 p_agivenb = inter / pb;
                 textoCond = p_agivenb.toFixed(4);
              }

              // Comparación para independencia: P(A|B) == P(A) ?
              // Usamos un pequeño margen de error para flotantes
              const epsilon = 0.0001;
              const product = pa * pb;
              const isIndependent = Math.abs(inter - product) < epsilon;

              // Renderizado
              let html = \`Criterio 1: P(A|B) = P(A)?<br>\`;
              html += \`P(A|B) = \${inter} / \${pb} = <b>\${textoCond}</b><br>\`;
              html += \`P(A) = <b>\${pa}</b><br><br>\`;
              
              html += \`Criterio 2: P(A ∩ B) = P(A)·P(B)?<br>\`;
              html += \`\${inter} \${isIndependent ? '≈' : '≠'} (\${pa} · \${pb}) = \${product.toFixed(4)}\`;

              formulaDiv.innerHTML = html;

              if (isIndependent) {
                statusSpan.textContent = "INDEPENDIENTES";
                statusSpan.className = "tag tag-indep";
                conclusionDiv.textContent = "La ocurrencia de B no afecta la probabilidad de A.";
              } else {
                statusSpan.textContent = "DEPENDIENTES";
                statusSpan.className = "tag tag-dep";
                conclusionDiv.textContent = "Existe una relación entre los eventos. La probabilidad cambia dado el evento condicionante.";
              }
              
              resBox.style.display = "block";
            }

            function showError(msg) {
              errorDiv.textContent = msg;
              errorDiv.style.display = "block";
              resBox.style.display = "none";
            }

            btnCalc.addEventListener("click", calc);

            btnRand.addEventListener("click", function() {
              // Generar caso aleatorio (a veces indep, a veces dep)
              const wantIndep = Math.random() > 0.5;
              const pa = Number((Math.random() * 0.8 + 0.1).toFixed(2));
              const pb = Number((Math.random() * 0.8 + 0.1).toFixed(2));
              
              inpPa.value = pa;
              inpPb.value = pb;

              if (wantIndep) {
                // Forzar independencia: Inter = Pa * Pb
                inpInter.value = (pa * pb).toFixed(4);
              } else {
                // Forzar dependencia: Inter aleatoria (pero válida)
                const minP = Math.min(pa, pb);
                let randInter = Math.random() * minP;
                // Asegurar que no sea accidentalmente igual al producto
                if (Math.abs(randInter - (pa*pb)) < 0.01) randInter *= 0.5;
                inpInter.value = randInter.toFixed(2);
              }
              calc();
            });

            setTimeout(calc, 200);
          }
        })();
      </script>
    `;
  }
};