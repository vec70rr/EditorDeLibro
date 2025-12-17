// ================================================================
// Simulador — Permutaciones Agrupadas (Estilo estandarizado)
// ================================================================

export default {
  render: (_params, simName = 'Permutaciones Agrupadas') => {
    // Generación de ID único
    const id = "sim_" + Math.random().toString(36).slice(2);

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
            #${id}_container .formula {
              font-family: "JetBrains Mono","Fira Code",monospace;
              font-size: 13px;
              margin: 10px 0;
              background: #fff;
              padding: 8px;
              border-radius: 4px;
              border: 1px solid #bfdbfe;
            }
            #${id}_container .error-msg {
              color: #dc2626;
              font-weight: bold;
              margin-top: 5px;
            }
          </style>

          <h3>Simulador — ${simName}</h3>

          <div class="box">
            <b>1. Configuración de variables</b>
            <div style="margin-top:6px; margin-bottom:10px; font-size:13px;color:#4b5563;">
              Calcula las maneras de ordenar <b>n</b> objetos donde <b>k</b> de ellos deben permanecer juntos en un grupo.
            </div>

            <div class="input-row">
              <label>Número total de objetos (n):</label>
              <input type="number" id="${id}_n" value="10" min="1">
            </div>
            <div class="input-row">
              <label>Tamaño del grupo (k):</label>
              <input type="number" id="${id}_k" value="4" min="1">
            </div>
            
            <div style="margin-top:12px; display:flex; gap:8px;">
              <button id="${id}_btnCalc" class="primary">Calcular</button>
              <button id="${id}_btnRand">Ejemplo Aleatorio</button>
            </div>
            <div id="${id}_error" class="error-msg" style="display:none;"></div>
          </div>

          <div id="${id}_resultBox" class="box" style="display:none; background:#eff6ff; border-color:#bfdbfe;">
            <div style="font-weight:bold; color:#1e3a8a;">Resultado:</div>
            
            <div id="${id}_formula" class="formula"></div>
            
            <div style="margin-top:5px; color:#1e3a8a;">Total de maneras:</div>
            <div id="${id}_val" style="font-size:1.4em; font-weight:bold; color:#2563eb; margin:5px 0;"></div>
            
            <small style="color:#64748b; display:block; margin-top:5px;">
              Lógica: Se permutan los grupos externos (n - k + 1)! y se multiplica por las permutaciones internas del grupo k!.
            </small>
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

          if (!container || !btnToggle) return;

          // Helper para seleccionar dentro de este simulador
          const $ = (suffix) => root.querySelector("#${id}_" + suffix);

          let initialized = false;

          // --- 1. Lógica de Apertura/Cierre ---
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

          // --- 2. Lógica Matemática y Eventos ---
          function initSim(){
            const inpN = $("n");
            const inpK = $("k");
            const btnCalc = $("btnCalc");
            const btnRand = $("btnRand");
            const resBox = $("resultBox");
            const formulaDiv = $("formula");
            const valDiv = $("val");
            const errorDiv = $("error");

            if (!inpN || !inpK || !btnCalc) return;

            // Helper de formateo de números
            const formatNum = (num) => num.toLocaleString();

            // Helper de Factorial
            function factorial(n) {
              if (n < 0) return NaN;
              if (n > 170) return Infinity; // Javascript safe limit
              if (n === 0 || n === 1) return 1;
              let result = 1;
              for (let i = 2; i <= n; i++) result *= i;
              return result;
            }

            function calc() {
              // Limpiar errores previos
              errorDiv.style.display = "none";
              errorDiv.textContent = "";

              const n = parseInt(inpN.value, 10);
              const k = parseInt(inpK.value, 10);

              // Validaciones
              if (isNaN(n) || isNaN(k) || k < 1 || n < 1) {
                errorDiv.textContent = "Por favor introduce valores numéricos mayores a 0.";
                errorDiv.style.display = "block";
                resBox.style.display = "none";
                return;
              }
              if (k > n) {
                errorDiv.textContent = "Error: El grupo (k) no puede ser mayor que el total (n).";
                errorDiv.style.display = "block";
                resBox.style.display = "none";
                return;
              }

              // Cálculos
              // Fórmula: (n - k + 1)! * k!
              const n_externos = n - k + 1;
              const p_externos = factorial(n_externos);
              const p_internos = factorial(k);
              const resultado = p_externos * p_internos;

              // Mostrar Fórmula detallada
              formulaDiv.innerHTML = 
                \`P = (n - k + 1)! &times; k!<br>\` +
                \`P = (\${n} - \${k} + 1)! &times; \${k}!<br>\` +
                \`P = \${n_externos}! &times; \${k}!<br>\` +
                \`P = \${formatNum(p_externos)} &times; \${formatNum(p_internos)}\`;

              // Mostrar Resultado Final
              valDiv.textContent = formatNum(resultado);
              
              // Mostrar caja
              resBox.style.display = "block";
            }

            // Event Listener: Botón Calcular
            btnCalc.addEventListener("click", calc);

            // Event Listener: Botón Aleatorio
            btnRand.addEventListener("click", function() {
              const rN = Math.floor(Math.random() * 9) + 3; // Entre 3 y 11
              const rK = Math.floor(Math.random() * (rN - 1)) + 2; // Entre 2 y n
              inpN.value = rN;
              inpK.value = rK;
              calc();
            });

            // Trigger inicial (opcional)
            setTimeout(calc, 100);
          }
        })();
      </script>
    `;
  }
};