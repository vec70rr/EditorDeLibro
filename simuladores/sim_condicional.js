// ================================================================
// Simulador — Probabilidad Condicional (Enfoque de Conjuntos)
// Requisitos / cómo funciona en el editor de libro interactivo:
//
// 1. Este archivo exporta un objeto con un método `render(params, simName)`
//    que devuelve un string HTML + <script>, tal como espera tu editor.
// 2. Se genera un ID único por instancia: `sim_XXXX`.
//    Eso permite tener varios simuladores en la misma página sin choques.
// 3. NO se crean funciones globales tipo `toggleSim_*` ni se usan
//    atributos `onclick=""` en el HTML. Todo se maneja con
//    `addEventListener` dentro de un <script> autoejecutable (IIFE).
// 4. Todos los elementos se seleccionan relativos al contenedor raíz
//    `#sim_XXXX`, usando IDs del tipo `${id}_loquesea`.
// 5. El botón "Abrir/Ocultar" solo inicializa la lógica del simulador
//    la primera vez que se abre (lazy init).
// 6. El archivo se puede llamar con mayúsculas o minúsculas, porque
//    NO dependemos del nombre del archivo para construir funciones.
// ================================================================

export default {
  render: (_params, simName = "Simulador: Probabilidad Condicional") => {
    const id = "sim_" + Math.random().toString(36).slice(2); // id único

    return `
      <div id="${id}">
        <button id="${id}_btnToggle" class="btn-sim">
          Abrir ${simName}
        </button>

        <div id="${id}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <style>
            #${id}_container {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 14px;
            }
            #${id}_container .box {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 12px;
              background: #fff;
              margin-top: 8px;
            }
            #${id}_container .input-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
            }
            #${id}_container input {
              width: 80px;
              padding: 4px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              text-align: right;
            }
            #${id}_container button {
              padding: 6px 12px;
              border-radius: 6px;
              border: 1px solid #d1d5db;
              cursor: pointer;
              background: #f3f4f6;
            }
            #${id}_container button.primary {
              background: #3b82f6;
              color: white;
              border: none;
            }
            #${id}_container .bar-track {
              height: 12px;
              background: #e5e7eb;
              border-radius: 6px;
              margin-top: 8px;
              overflow: hidden;
            }
            #${id}_container .bar-fill {
              height: 100%;
              background: #3b82f6;
              width: 0%;
              transition: width 0.3s;
            }
            #${id}_container .formula {
              font-family: "JetBrains Mono","Fira Code",monospace;
              font-size: 14px;
              margin: 5px 0;
            }
          </style>

          <h3>Simulador — Probabilidad Condicional</h3>

          <div class="box">
            <b>1. Define los conjuntos</b>
            <div style="margin-top:6px;font-size:13px;color:#4b5563;">
              Calcula P(A|B): La probabilidad de A dado que el universo se redujo a B.
            </div>
            <div class="input-row">
              <label>Total de casos (N):</label>
              <input type="number" id="${id}_n" value="100">
            </div>
            <div class="input-row">
              <label>Casos en B (Condición):</label>
              <input type="number" id="${id}_b" value="40">
            </div>
            <div class="input-row">
              <label>Intersección (A y B):</label>
              <input type="number" id="${id}_inter" value="10">
            </div>
            
            <div style="margin-top:12px; display:flex; gap:8px;">
              <button id="${id}_btnCalc" class="primary">Calcular P(A|B)</button>
              <button id="${id}_btnRand">Valores aleatorios</button>
            </div>
          </div>

          <div id="${id}_resultBox" class="box" style="display:none; background:#eff6ff; border-color:#bfdbfe;">
            <div style="font-weight:bold; color:#1e3a8a;">Resultado:</div>
            <div id="${id}_formula" class="formula"></div>
            <div id="${id}_val" style="font-size:1.2em; font-weight:bold; color:#2563eb; margin:8px 0;"></div>
            <div class="bar-track">
              <div id="${id}_bar" class="bar-fill"></div>
            </div>
            <small style="color:#64748b; display:block; margin-top:5px;">
              El denominador ahora es B (${id}_b), no N. El espacio muestral se redujo al evento B.
            </small>
          </div>
        </div>
      </div>

      <script>
        (function(){
          const root = document.getElementById("${id}");
          if (!root) return; // por si el editor inserta el script antes del contenedor

          const simName = "${simName}";
          const container = root.querySelector("#${id}_container");
          const btnToggle = root.querySelector("#${id}_btnToggle");

          if (!container || !btnToggle) return;

          // Helper para seleccionar dentro de este simulador
          const $ = (suffix) => root.querySelector("#${id}_" + suffix);

          let initialized = false;

          btnToggle.addEventListener("click", function(){
            const hidden = container.style.display === "none" || container.style.display === "";
            if (hidden) {
              container.style.display = "block";
              btnToggle.textContent = "Ocultar " + simName;
              btnToggle.classList.add("btn-sim-rojo");
              if (!initialized) {
                initialized = true;
                initSim();
              }
            } else {
              container.style.display = "none";
              btnToggle.textContent = "Abrir " + simName;
              btnToggle.classList.remove("btn-sim-rojo");
            }
          });

          function initSim(){
            const inpN = $("n");
            const inpB = $("b");
            const inpInter = $("inter");
            const btnCalc = $("btnCalc");
            const btnRand = $("btnRand");
            const resBox = $("resultBox");
            const formula = $("formula");
            const valDiv = $("val");
            const bar = $("bar");

            if (!inpN || !inpB || !inpInter || !btnCalc || !btnRand || !resBox || !formula || !valDiv || !bar) return;

            function calc() {
              const n = parseFloat(inpN.value);
              const b = parseFloat(inpB.value);
              const inter = parseFloat(inpInter.value);

              // Validaciones
              if (isNaN(n) || isNaN(b) || isNaN(inter)) {
                return alert("Error: Todos los campos deben contener números válidos.");
              }
              if (inter > b) {
                return alert("Error: La intersección no puede ser mayor que B.");
              }
              if (b > n) {
                return alert("Error: B no puede ser mayor que el Total (N).");
              }
              if (b === 0) {
                return alert("Error: B no puede ser 0 (división por cero).");
              }

              const prob = inter / b;
              const pct = (prob * 100).toFixed(2);

              // Mostrar resultados
              formula.innerHTML = "P(A|B) = " + inter + " / " + b + " = " + prob.toFixed(4);
              valDiv.textContent = prob.toFixed(4) + " (" + pct + "%)";
              bar.style.width = pct + "%";
              resBox.style.display = "block";
            }

            btnCalc.addEventListener("click", calc);

            btnRand.addEventListener("click", function() {
              const n = Math.floor(Math.random() * 150) + 50;
              const b = Math.floor(Math.random() * (n - 10)) + 10;
              const inter = Math.floor(Math.random() * b);
              inpN.value = n;
              inpB.value = b;
              inpInter.value = inter;
              calc();
            });

            // Calcular automáticamente al cargar si hay valores
            setTimeout(calc, 100);
          }
        })();
      </script>
    `;
  }
};