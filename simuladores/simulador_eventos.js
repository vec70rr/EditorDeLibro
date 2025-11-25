// ================================================================
// Simulador — Eventos de vehículos (L, R, S)
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
  render: (_params, simName = "Simulador — eventos de vehículos") => {
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
            #${id}_container .grid {
              display:flex;
              flex-wrap:wrap;
              gap:6px;
              margin-top:6px;
            }
            #${id}_container .card {
              border:1px solid #e5e7eb;
              border-radius:8px;
              padding:4px 6px;
              min-width:80px;
              text-align:center;
              background:#fff;
              box-shadow:0 1px 2px rgba(15,23,42,0.05);
              transition:all .12s;
            }
            #${id}_container .card .code {
              font-family: "JetBrains Mono","Fira Code",monospace;
              font-size:12px;
            }
            #${id}_container .card.highlightA { background:#eef2ff; border-color:#4f46e5; }
            #${id}_container .card.highlightB { background:#dcfce7; border-color:#16a34a; }
            #${id}_container .card.highlightC { background:#fef9c3; border-color:#ca8a04; }
            #${id}_container .card.highlightD { background:#e0f2fe; border-color:#0284c7; }
            #${id}_container .card.dim { opacity:.35; }
            #${id}_container select {
              padding:2px 4px;
              border-radius:6px;
              border:1px solid #d1d5db;
            }
            #${id}_container .box {
              border:1px solid #e5e7eb;
              border-radius:10px;
              padding:10px;
              background:#f9fafb;
              margin-top:8px;
            }
          </style>

          <h3>Simulador — Vehículos L, R, S</h3>

          <div class="box">
            <b>1. Elige un escenario</b>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;align-items:center;">
              <div>Veh. 1:
                <select id="${id}_veh1">
                  <option value="L">🚗⬅ L</option>
                  <option value="R">🚗➡ R</option>
                  <option value="S">🚗⬆ S</option>
                </select>
              </div>
              <div>Veh. 2:
                <select id="${id}_veh2">
                  <option value="L">🚗⬅ L</option>
                  <option value="R">🚗➡ R</option>
                  <option value="S">🚗⬆ S</option>
                </select>
              </div>
              <div>Veh. 3:
                <select id="${id}_veh3">
                  <option value="L">🚗⬅ L</option>
                  <option value="R">🚗➡ R</option>
                  <option value="S">🚗⬆ S</option>
                </select>
              </div>
              <button id="${id}_btnEval">Evaluar escenario</button>
              <button id="${id}_btnRand">Aleatorio</button>
            </div>
            <div id="${id}_userOut" style="margin-top:6px;font-size:13px;background:#f3f4f6;border-radius:8px;padding:6px 8px;">
              Elige una combinación y pulsa <b>Evaluar escenario</b>.
            </div>
          </div>

          <div class="box">
            <b>2. Espacio muestral S (27 resultados)</b>
            <div style="margin-top:4px;font-size:12px;">
              Usa los botones para resaltar los eventos.
            </div>
            <div style="margin-top:4px;">
              <button id="${id}_btnA">A</button>
              <button id="${id}_btnB">B</button>
              <button id="${id}_btnC">C</button>
              <button id="${id}_btnD">D</button>
              <button id="${id}_btnDcomp">D'</button>
              <button id="${id}_btnUnion">C ∪ D</button>
              <button id="${id}_btnInter">C ∩ D</button>
              <button id="${id}_btnClear">Limpiar</button>
            </div>
            <div id="${id}_info" style="margin-top:4px;font-size:12px;color:#4b5563;"></div>
            <div id="${id}_grid" class="grid"></div>
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
            const grid = $("grid");
            const info = $("info");
            const out  = $("userOut");

            const v1 = $("veh1");
            const v2 = $("veh2");
            const v3 = $("veh3");
            const bEval = $("btnEval");
            const bRand = $("btnRand");

            if (!grid || !info || !out || !v1 || !v2 || !v3 || !bEval || !bRand) return;

            const dirs = ["L","R","S"];
            const espacio = [];
            for (let a of dirs)
              for (let b of dirs)
                for (let c of dirs)
                  espacio.push(a + b + c);

            const A = new Set();
            const B = new Set();
            const C = new Set();
            const D = new Set();

            function count(code, ch){ return code.split(ch).length - 1; }

            espacio.forEach(code => {
              const cL = count(code,"L");
              const cR = count(code,"R");
              const cS = count(code,"S");

              // A: tres vehículos en la misma dirección
              if (code[0] === code[1] && code[1] === code[2]) A.add(code);

              // B: los tres toman direcciones diferentes
              if (cL === 1 && cR === 1 && cS === 1) B.add(code);

              // C: exactamente dos van a la derecha (R)
              if (cR === 2) C.add(code);

              // D: exactamente dos vehículos van en la misma dirección (multiconjunto 0,1,2)
              const arr = [cL,cR,cS].sort((x,y)=>x-y);
              if (arr[0] === 0 && arr[1] === 1 && arr[2] === 2) D.add(code);
            });

            const Dcomp = new Set(espacio.filter(x => !D.has(x)));
            const CupD  = new Set(espacio.filter(x => C.has(x) || D.has(x)));
            const CapD  = new Set(espacio.filter(x => C.has(x) && D.has(x)));

            const cards = {};
            function icons(code){
              return code.split("").map(ch => {
                if (ch === "L") return "🚗⬅";
                if (ch === "R") return "🚗➡";
                return "🚗⬆";
              }).join(" ");
            }

            espacio.forEach(code => {
              const div = document.createElement("div");
              div.className = "card";
              div.dataset.code = code;
              div.innerHTML = "<div>" + icons(code) + "</div><div class=\\"code\\">" + code + "</div>";
              grid.appendChild(div);
              cards[code] = div;
            });

            function clearHighlight(){
              Object.values(cards).forEach(c => {
                c.className = "card";
                c.style.boxShadow = "0 1px 2px rgba(15,23,42,0.05)";
                c.style.transform = "scale(1)";
              });
              info.textContent = "";
            }

            function highlight(set, cls, text){
              clearHighlight();
              Object.entries(cards).forEach(([code,div]) => {
                if (set.has(code)) div.classList.add(cls);
                else div.classList.add("dim");
              });
              info.innerHTML = text;
            }

            $("btnA").onclick     = () => highlight(A,"highlightA","Evento A: tres vehículos en la misma dirección. | |A| = " + A.size);
            $("btnB").onclick     = () => highlight(B,"highlightB","Evento B: los tres toman direcciones diferentes. | |B| = " + B.size);
            $("btnC").onclick     = () => highlight(C,"highlightC","Evento C: exactamente dos van a la derecha (R). | |C| = " + C.size);
            $("btnD").onclick     = () => highlight(D,"highlightD","Evento D: exactamente dos vehículos van en la misma dirección. | |D| = " + D.size);
            $("btnDcomp").onclick = () => highlight(Dcomp,"highlightD","Complemento D': resultados donde no ocurre D. | |D'| = " + Dcomp.size);
            $("btnUnion").onclick = () => highlight(CupD,"highlightD","C ∪ D: en C o en D. | |C ∪ D| = " + CupD.size);
            $("btnInter").onclick = () => highlight(CapD,"highlightC","C ∩ D: en C y en D. | |C ∩ D| = " + CapD.size);
            $("btnClear").onclick = () => clearHighlight();

            function evalCode(code){
              const inA = A.has(code), inB = B.has(code), inC = C.has(code), inD = D.has(code);
              const inDcomp = Dcomp.has(code), inCupD = CupD.has(code), inCapD = CapD.has(code);
              let eventos = [];
              if (inA) eventos.push("A");
              if (inB) eventos.push("B");
              if (inC) eventos.push("C");
              if (inD) eventos.push("D");

              clearHighlight();
              Object.values(cards).forEach(c => {
                if (c.dataset.code === code) {
                  c.style.boxShadow = "0 0 0 2px #22c55e";
                  c.style.transform = "scale(1.06)";
                }
              });

              out.innerHTML =
                "<b>Escenario:</b> <code>" + code + "</code><br>" +
                icons(code) + "<br>" +
                "Pertenece a: " + (eventos.length ? "<b>" + eventos.join(", ") + "</b>" : "ninguno de A, B, C, D") + "<br>" +
                "Está en D': <b>" + (inDcomp ? "sí" : "no") + "</b><br>" +
                "Está en C ∪ D: <b>" + (inCupD ? "sí" : "no") + "</b><br>" +
                "Está en C ∩ D: <b>" + (inCapD ? "sí" : "no") + "</b>";
            }

            bEval.onclick = () => {
              const code = v1.value + v2.value + v3.value;
              evalCode(code);
            };

            bRand.onclick = () => {
              const r = () => dirs[Math.floor(Math.random() * dirs.length)];
              v1.value = r(); 
              v2.value = r(); 
              v3.value = r();
              evalCode(v1.value + v2.value + v3.value);
            };
          }
        })();
      </script>
    `;
  }
};
