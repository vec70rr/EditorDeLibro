// Simulador — Teorema de Bayes
export default {
  render: (_params, simName = "Simulador: Teorema de Bayes") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
      <div id="${id}">
        <button id="${id}_btnToggle" class="btn-sim">
          Abrir ${simName}
        </button>

        <div id="${id}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <style>
            #${id}_container { font-family: system-ui, sans-serif; font-size: 14px; border-left: 4px solid #8b5cf6; }
            #${id}_container .input-group { margin-bottom: 12px; }
            #${id}_container label { display: block; font-weight: 600; color: #4b5563; font-size: 0.9em; }
            #${id}_container small { display: block; color: #6b7280; font-size: 0.8em; margin-bottom: 4px; }
            #${id}_container input { width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box; }
            #${id}_container .btn-bayes { background: #8b5cf6; color: white; border: none; padding: 8px; width: 100%; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top:5px; }
            #${id}_container .btn-sec { background: #f3f4f6; color: #374151; margin-top: 8px; }
            #${id}_container .res-bayes { margin-top: 15px; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 6px; padding: 12px; }
          </style>

          <h3>${simName}</h3>
          <p style="margin-bottom:12px; color:#64748b;">
            Actualiza una probabilidad previa P(A) dada nueva evidencia B.
          </p>

          <div class="input-group">
            <label>P(A) - A Priori</label>
            <small>Probabilidad inicial del evento.</small>
            <input type="number" id="${id}_pa" step="0.001" min="0" max="1" value="0.01">
          </div>

          <div class="input-group">
            <label>P(B|A) - Sensibilidad</label>
            <small>Probabilidad de evidencia B si A es cierto.</small>
            <input type="number" id="${id}_pba" step="0.01" min="0" max="1" value="0.99">
          </div>

          <div class="input-group">
            <label>P(B|No A) - Falsos Positivos</label>
            <small>Probabilidad de evidencia B si A es falso.</small>
            <input type="number" id="${id}_pbna" step="0.01" min="0" max="1" value="0.05">
          </div>

          <button id="${id}_btnCalc" class="btn-bayes">Calcular P(A|B)</button>
          <button id="${id}_btnRand" class="btn-bayes btn-sec">Caso Aleatorio</button>

          <div id="${id}_result" class="res-bayes" style="display:none;">
             <div id="${id}_latex" style="font-size:0.9em; overflow-x:auto;"></div>
             <div id="${id}_final" style="font-size:1.6em; font-weight:bold; color:#7c3aed; text-align:center; margin-top:10px;"></div>
             <div id="${id}_msg" style="text-align:center; font-size:0.85em; color:#5b21b6; margin-top:5px;"></div>
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
            const inpPbna = root.querySelector("#${id}_pbna");
            const resBox = root.querySelector("#${id}_result");
            const latexDiv = root.querySelector("#${id}_latex");
            const finalDiv = root.querySelector("#${id}_final");
            const msgDiv = root.querySelector("#${id}_msg");

            function calc() {
              const pa = parseFloat(inpPa.value);
              const pba = parseFloat(inpPba.value);
              const pbna = parseFloat(inpPbna.value);

              if ([pa, pba, pbna].some(x => x < 0 || x > 1)) return alert("Valores entre 0 y 1");

              // Bayes: (P(B|A)*P(A)) / [ P(B|A)P(A) + P(B|A')P(A') ]
              const num = pba * pa;
              const den = num + (pbna * (1 - pa));
              const post = num / den;

              latexDiv.innerHTML = \`$$P(A|B) = \\\\frac{\${num.toFixed(4)}}{\${den.toFixed(4)}}$$\`;
              finalDiv.textContent = \`\${(post * 100).toFixed(2)}%\`;
              msgDiv.innerHTML = \`La creencia pasó de <b>\${(pa*100).toFixed(1)}%</b> a <b>\${(post*100).toFixed(1)}%</b>.\`;
              
              resBox.style.display = "block";
              if (window.MathJax) MathJax.typesetPromise([latexDiv]).catch(()=>{});
            }

            root.querySelector("#${id}_btnCalc").addEventListener("click", calc);

            root.querySelector("#${id}_btnRand").addEventListener("click", () => {
              inpPa.value = (Math.random() * 0.1).toFixed(3);
              inpPba.value = (0.8 + Math.random() * 0.19).toFixed(2);
              inpPbna.value = (Math.random() * 0.2).toFixed(2);
              calc();
            });
          }
        })();
      </script>
    `;
  }
};