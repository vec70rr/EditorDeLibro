// ================================================================
// Simulador — Visualizador de Eventos (Baraja de Cartas)
// ================================================================

export default {
  render: (_params, simName = 'Visualizador de Eventos') => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
      <div id="${id}">
        <button id="${id}_btnToggle" class="btn-sim">
          Abrir ${simName}
        </button>

        <div id="${id}_container" class="simulador-box" style="display:none; margin-top:10px;">
          <style>
            #${id}_container { font-family: system-ui, sans-serif; font-size: 14px; }
            #${id}_container .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #fff; margin-top: 8px; }
            #${id}_container .control-panel { display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap; }
            #${id}_container button.scenario-btn { flex:1; padding: 8px 12px; border-radius: 6px; border: 1px solid #d1d5db; cursor: pointer; background: #f3f4f6; font-size:13px; min-width: 140px; }
            #${id}_container button.scenario-btn:hover { background: #e5e7eb; border-color:#9ca3af; }
            #${id}_container button.active { background: #3b82f6; color: white; border-color: #2563eb; font-weight:bold; }
            
            #${id}_container .visual-area { text-align:center; margin: 15px 0; padding:15px; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1; }
            #${id}_container .card { display:inline-block; width:30px; height:42px; line-height:42px; border:1px solid #ccc; border-radius:4px; background:#fff; margin:2px; font-size:18px; font-weight:bold; box-shadow:1px 1px 2px rgba(0,0,0,0.1); }
            #${id}_container .card.red { color: #dc2626; }
            #${id}_container .card.black { color: #1e293b; }
            #${id}_container .card.highlight-a { background: #dbeafe; border-color:#3b82f6; } /* Azul suave */
            #${id}_container .card.highlight-b { background: #fce7f3; border-color:#ec4899; } /* Rosa suave */
            #${id}_container .card.highlight-both { background: #e879f9; border-color:#a21caf; color:#fff !important; transform:scale(1.1); } /* Morado fuerte */
            
            #${id}_container .math-row { display:flex; justify-content:space-between; align-items:center; margin-top:5px; padding:5px 0; border-bottom:1px solid #f1f5f9; }
            #${id}_container .math-val { font-family: "JetBrains Mono", monospace; font-weight:bold; }
            #${id}_container .conclusion { margin-top:10px; padding:10px; background:#fffbeb; color:#92400e; border-radius:6px; font-size:13px; line-height:1.4; border:1px solid #fcd34d; }
          </style>

          <h3>Simulador — ${simName}</h3>

          <div class="box">
            <p style="margin-top:0; color:#64748b; font-size:13px;">
              Selecciona un escenario para visualizar la diferencia real en una baraja de 52 cartas.
            </p>

            <div class="control-panel">
              <button id="${id}_btnExcl" class="scenario-btn active">Escenario 1: Mutuamente Excluyentes</button>
              <button id="${id}_btnIndep" class="scenario-btn">Escenario 2: Independientes</button>
            </div>

            <div id="${id}_desc" style="font-weight:bold; color:#334155; margin-bottom:5px;"></div>

            <div id="${id}_visual" class="visual-area"></div>

            <div id="${id}_math">
              <div class="math-row">
                <span>Evento A:</span>
                <span id="${id}_valA" class="math-val"></span>
              </div>
              <div class="math-row">
                <span>Evento B:</span>
                <span id="${id}_valB" class="math-val"></span>
              </div>
              <div class="math-row" style="background:#f1f5f9; padding:5px; border-radius:4px;">
                <span>Intersección (A ∩ B):</span>
                <span id="${id}_valInter" class="math-val"></span>
              </div>
            </div>

            <div id="${id}_concl" class="conclusion"></div>
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
              if (!initialized) { initialized = true; renderScenario('excl'); }
            } else {
              container.style.display = "none";
              btnToggle.textContent = "Abrir " + simName;
              btnToggle.classList.remove("btn-sim-rojo");
            }
          });

          // Definición mini de baraja
          const suits = [
            {icon:'♥', color:'red', name:'Corazones'}, 
            {icon:'♦', color:'red', name:'Diamantes'}, 
            {icon:'♠', color:'black', name:'Espadas'}, 
            {icon:'♣', color:'black', name:'Tréboles'}
          ];
          const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
          
          let deck = [];
          suits.forEach(s => {
            ranks.forEach(r => {
              deck.push({ rank: r, suit: s.icon, color: s.color, id: r+s.icon });
            });
          });

          // Elementos DOM
          const btnExcl = $("btnExcl");
          const btnIndep = $("btnIndep");
          const visualDiv = $("visual");
          const descDiv = $("desc");
          const conclDiv = $("concl");
          const valA = $("valA");
          const valB = $("valB");
          const valInter = $("valInter");

          // Lógica de Renderizado
          function renderScenario(type) {
            // Limpiar
            visualDiv.innerHTML = '';
            
            let eventAName = '';
            let eventBName = '';
            let countA = 0;
            let countB = 0;
            let countInter = 0;
            
            // Función filtro
            let isA = (c) => false;
            let isB = (c) => false;

            if (type === 'excl') {
              // ESCENARIO 1: CORAZONES vs ESPADAS
              btnExcl.classList.add('active');
              btnIndep.classList.remove('active');
              
              eventAName = "Sacar Corazones (♥)";
              eventBName = "Sacar Espadas (♠)";
              descDiv.innerHTML = "Evento A: Carta es ♥ | Evento B: Carta es ♠";
              
              isA = (c) => c.suit === '♥';
              isB = (c) => c.suit === '♠';

            } else {
              // ESCENARIO 2: CORAZONES vs ASES
              btnIndep.classList.add('active');
              btnExcl.classList.remove('active');

              eventAName = "Sacar Corazones (♥)";
              eventBName = "Sacar un As (A)";
              descDiv.innerHTML = "Evento A: Carta es ♥ | Evento B: Carta es un As";
              
              isA = (c) => c.suit === '♥';
              isB = (c) => c.rank === 'A';
            }

            // Generar Cartas HTML
            // Para no saturar, mostramos solo una muestra representativa o todas pequeñas
            // Vamos a mostrar todas pero pequeñas
            deck.forEach(card => {
              const el = document.createElement('div');
              el.className = \`card \${card.color}\`;
              el.textContent = card.suit + card.rank; // Icono + Numero
              
              const matchA = isA(card);
              const matchB = isB(card);
              
              if (matchA && matchB) {
                el.classList.add('highlight-both');
                countInter++;
                countA++; countB++;
              } else if (matchA) {
                el.classList.add('highlight-a');
                countA++;
              } else if (matchB) {
                el.classList.add('highlight-b');
                countB++;
              } else {
                // Opacar las que no importan
                el.style.opacity = '0.3';
              }
              visualDiv.appendChild(el);
            });

            // Cálculos
            const total = 52;
            const pA = countA / total;
            const pB = countB / total;
            const pInter = countInter / total;
            const pTeorica = pA * pB;

            valA.textContent = \`\${countA}/52 (\${pA.toFixed(2)})\`;
            valB.textContent = \`\${countB}/52 (\${pB.toFixed(2)})\`;
            
            let htmlInter = \`\${countInter}/52 (\${pInter.toFixed(4)})\`;
            
            // Lógica de Conclusión
            if (countInter === 0) {
              // EXCLUYENTES
              htmlInter += " -> 0";
              conclDiv.className = "conclusion alert-warn";
              conclDiv.style.background = "#fffbeb"; 
              conclDiv.style.borderColor = "#fcd34d";
              conclDiv.style.color = "#92400e";
              conclDiv.innerHTML = 
                "<b>RESULTADO: MUTUAMENTE EXCLUYENTES</b><br>" +
                "Mira las cartas: No hay ninguna carta morada (mezcla de azul y rosa). " +
                "Es imposible que una carta sea Corazón y Espada a la vez. <br>" +
                "Por eso <b>P(A ∩ B) = 0</b>.";
            } else {
              // INDEPENDIENTES (o no excluyentes)
              // Verificamos independencia matemática
              const isIndependent = Math.abs(pInter - pTeorica) < 0.0001;
              
              conclDiv.className = "conclusion alert-info";
              conclDiv.style.background = "#eff6ff"; 
              conclDiv.style.borderColor = "#bfdbfe";
              conclDiv.style.color = "#1e40af";

              let text = "<b>RESULTADO: NO EXCLUYENTES (HAY INTERSECCIÓN)</b><br>";
              text += "¡Mira la carta resaltada en morado! Es el <b>As de Corazones</b>. ";
              text += "Como existe al menos un caso donde ocurren ambos a la vez, NO son excluyentes.<br><br>";
              
              if (isIndependent) {
                text += "<b>¿Son Independientes? SÍ.</b><br>";
                text += \`Matemáticamente: P(A)×P(B) = \${pA.toFixed(2)} × \${pB.toFixed(2)} = \${pTeorica.toFixed(4)}.\`;
                text += " Coincide exactamente con la intersección real.";
              }
              conclDiv.innerHTML = text;
            }
            
            valInter.textContent = htmlInter;
          }

          btnExcl.addEventListener("click", () => renderScenario('excl'));
          btnIndep.addEventListener("click", () => renderScenario('indep'));

        })();
      </script>
    `;
  }
};