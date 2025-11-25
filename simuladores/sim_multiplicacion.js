// Simulador — Regla de Multiplicación
export default {
  render: (_params, simName = "Simulador: Regla de Multiplicación") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
      <div id="${id}">
        <button id="${id}_btnToggle" class="btn-sim">
          Abrir ${simName}
        </button>

        <div id="${id}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <style>
            #${id}_container { font-family: system-ui, sans-serif; font-size: 14px; border-left: 4px solid #10b981; }
            #${id}_container .input-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            #${id}_container input { width: 80px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; text-align: right; }
            #${id}_container .result-box { background: #ecfdf5; border: 1px solid #d1fae5; padding: 12px; border-radius: 6px; margin-top: 15px; }
            #${id}_container .btn-calc { background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
            #${id}_container .btn-rand { background: #6b7280; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
          </style>

          <h3>${simName}</h3>
          <p style="margin-bottom:12px; color:#64748b;">
            Probabilidad de una secuencia: Ocurre A y luego ocurre B.
          </p>

          <div class="input-row">
            <label>P(A) - Probabilidad evento 1:</label>
            <input type="number" id="${id}_pa" step="0.01" min="0" max="1" value="0.50">
          </div>
          <div class="input-row">
            <label>P(B|A) - Prob. evento 2 dado 1:</label>
            <input type="number" id="${id}_pba" step="0.01" min="0" max="1" value="0.30">
          </div>

          <div style="margin-top:10px; display:flex; gap:8px;">
            <button id="${id}_btnCalc" class="btn-calc">Calcular P(A ∩ B)</button>
            <button id="${id}_btnRand" class="btn-rand">Aleatorio</button>
          </div>

          <div id="${id}_result" class="result-box" style="display:none;">
            <div style="font-weight:bold; color:#065f46; margin-bottom:5px;">Cálculo:</div>
            <div id="${id}_math" style="font-family:monospace;"></div>
            <div id="${id}_final" style="font-size:1.4em; font-weight:bold; color:#059669; margin-top:8px;"></div>
          </div>
        </div>
      </div>

      <script>
        (function(){
          const root = document.getElementById("${id}");
          if (!root) return;
          
          const container = root.querySelector("#${id}_container");
          const btnToggle = root.querySelector("#${id}_btnToggle");
          let initialized = false;

          btnToggle.addEventListener("click", () => {
            const isHidden = container.style.display === "none";
            if (isHidden) {
              container.style.display = "block";
              btnToggle.textContent = "Ocultar " + "${simName}";
              btnToggle.classList.add("btn-sim-rojo");
              if (!initialized) {
                initSim();
                initialized = true;
              }
            } else {
              container.style.display = "none";
              btnToggle.textContent = "Abrir " + "${simName}";
              btnToggle.classList.remove("btn-sim-rojo");
            }
          });

          function initSim() {
            const inpPa = root.querySelector("#${id}_pa");
            const inpPba = root.querySelector("#${id}_pba");
            const resBox = root.querySelector("#${id}_result");
            const mathDiv = root.querySelector("#${id}_math");
            const finalDiv = root.querySelector("#${id}_final");

            function calc() {
              const pa = parseFloat(inpPa.value);
              const pba = parseFloat(inpPba.value);
              
              if(pa < 0 || pa > 1 || pba < 0 || pba > 1) return alert("Las probabilidades deben estar entre 0 y 1");

              const res = pa * pba;

              mathDiv.innerHTML = \`$$P(A \\\\cap B) = \${pa} \\\\cdot \${pba}$$\`;
              finalDiv.textContent = \`= \${res.toFixed(4)} (\${(res*100).toFixed(2)}%)\`;
              resBox.style.display = "block";

              if (window.MathJax) MathJax.typesetPromise([mathDiv]).catch(()=>{});
            }

            root.querySelector("#${id}_btnCalc").addEventListener("click", calc);

            root.querySelector("#${id}_btnRand").addEventListener("click", () => {
              inpPa.value = Math.random().toFixed(2);
              inpPba.value = Math.random().toFixed(2);
              calc();
            });
          }
        })();
      </script>
    `;
  }
};