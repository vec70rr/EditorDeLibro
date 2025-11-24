export default {
  render: (params, simName = 'Vehículos: espacios muestrales y eventos') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">

          <style>
            #${id_base}_container {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 14px;
            }
            #${id_base}_container h3 {
              margin-top: 0;
            }
            #${id_base}_container .sim-veh-panel {
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              padding: 10px 12px;
              background: #f9fafb;
              margin-bottom: 10px;
            }
            #${id_base}_container .sim-veh-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-top: 6px;
            }
            #${id_base}_container .sim-veh-card {
              border-radius: 8px;
              padding: 4px 6px;
              min-width: 80px;
              text-align: center;
              border: 1px solid #e5e7eb;
              background: #ffffff;
              box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
              transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
              cursor: default;
            }
            #${id_base}_container .sim-veh-card span.code {
              font-family: "JetBrains Mono", "Fira Code", monospace;
              font-size: 12px;
              color: #374151;
            }
            #${id_base}_container .sim-veh-card span.icons {
              display: block;
              font-size: 16px;
              margin-bottom: 2px;
            }
            #${id_base}_container .sim-veh-card.sim-highlight-A {
              background: #eef2ff;
              border-color: #4f46e5;
            }
            #${id_base}_container .sim-veh-card.sim-highlight-B {
              background: #ecfdf3;
              border-color: #16a34a;
            }
            #${id_base}_container .sim-veh-card.sim-highlight-C {
              background: #fef9c3;
              border-color: #ca8a04;
            }
            #${id_base}_container .sim-veh-card.sim-highlight-D {
              background: #e0f2fe;
              border-color: #0284c7;
            }
            #${id_base}_container .sim-veh-card.sim-dimmed {
              opacity: 0.35;
            }
            #${id_base}_container .sim-veh-badges {
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
              margin-top: 6px;
            }
            #${id_base}_container .sim-veh-badge {
              border-radius: 999px;
              padding: 2px 8px;
              font-size: 11px;
              background: #e5e7eb;
            }
            #${id_base}_container .sim-veh-badge.A { background:#eef2ff; color:#3730a3; }
            #${id_base}_container .sim-veh-badge.B { background:#dcfce7; color:#166534; }
            #${id_base}_container .sim-veh-badge.C { background:#fef9c3; color:#854d0e; }
            #${id_base}_container .sim-veh-badge.D { background:#e0f2fe; color:#075985; }
            #${id_base}_container .sim-veh-badge.DC { background:#fee2e2; color:#b91c1c; }
            #${id_base}_container .sim-veh-controls-row {
              display:flex;
              flex-wrap:wrap;
              gap:8px;
              align-items:center;
              margin-top:6px;
            }
            #${id_base}_container select {
              padding:2px 4px;
              border-radius:6px;
              border:1px solid #d1d5db;
              background:#ffffff;
            }
            #${id_base}_container .sim-veh-result-box {
              margin-top:6px;
              border-radius:8px;
              padding:6px 8px;
              background:#f3f4f6;
              font-size:13px;
            }
            #${id_base}_container .sim-veh-buttons-bar button {
              margin:2px 2px 0 0;
              font-size:12px;
              padding:3px 8px;
              border-radius:999px;
              border:1px solid #d1d5db;
              background:#ffffff;
              cursor:pointer;
            }
          </style>

          <h3>Simulador — Vehículos L, R y S</h3>
          <p style="margin-top:4px">
            Tres vehículos toman una salida de autopista. Cada uno puede:
            <b>L</b> (izquierda), <b>R</b> (derecha) o <b>S</b> (seguir de frente).
            Este simulador te permite <b>explorar el espacio muestral</b> y los eventos
            A, B, C y D del problema.
          </p>

          <!-- Panel 1: Escenario elegido por el usuario -->
          <div class="sim-veh-panel">
            <b>1. Elige la dirección de cada vehículo y analiza a qué eventos pertenece</b>

            <div class="sim-veh-controls-row">
              <div>
                Vehículo 1:
                <select id="${id_base}_veh1">
                  <option value="L">🚗⬅️ L</option>
                  <option value="R">🚗➡️ R</option>
                  <option value="S">🚗⬆️ S</option>
                </select>
              </div>
              <div>
                Vehículo 2:
                <select id="${id_base}_veh2">
                  <option value="L">🚗⬅️ L</option>
                  <option value="R">🚗➡️ R</option>
                  <option value="S">🚗⬆️ S</option>
                </select>
              </div>
              <div>
                Vehículo 3:
                <select id="${id_base}_veh3">
                  <option value="L">🚗⬅️ L</option>
                  <option value="R">🚗➡️ R</option>
                  <option value="S">🚗⬆️ S</option>
                </select>
              </div>

              <button id="${id_base}_btnEval">Evaluar escenario</button>
              <button id="${id_base}_btnAleatorio" type="button">Escenario aleatorio</button>
            </div>

            <div id="${id_base}_userOutput" class="sim-veh-result-box">
              Elige una combinación y pulsa <b>“Evaluar escenario”</b>.
            </div>
          </div>

          <!-- Panel 2: Espacio muestral y botones de resaltado -->
          <div class="sim-veh-panel">
            <b>2. Espacio muestral S (27 resultados)</b>
            <p style="margin:4px 0">
              Cada tarjeta muestra un resultado posible (orden: vehículo 1, 2 y 3).
              Usa los botones para resaltar los eventos.
            </p>

            <div class="sim-veh-buttons-bar" style="margin-bottom:4px;">
              <button id="${id_base}_btnA">Resaltar A</button>
              <button id="${id_base}_btnB">Resaltar B</button>
              <button id="${id_base}_btnC">Resaltar C</button>
              <button id="${id_base}_btnD">Resaltar D</button>
              <button id="${id_base}_btnDcomp">Resaltar D'</button>
              <button id="${id_base}_btnUnionCD">Resaltar C ∪ D</button>
              <button id="${id_base}_btnInterCD">Resaltar C ∩ D</button>
              <button id="${id_base}_btnClear" style="margin-left:4px;">Limpiar</button>
            </div>

            <div id="${id_base}_infoEventos" style="font-size:12px;color:#4b5563;margin-bottom:4px;"></div>

            <div id="${id_base}_grid" class="sim-veh-grid"></div>
          </div>

          <!-- Panel 3: Resumen teórico -->
          <div class="sim-veh-panel">
            <b>3. Definiciones de los eventos del problema</b>
            <ul style="margin:6px 0 0 18px;font-size:13px;">
              <li><b>A</b>: los tres vehículos van en la misma dirección.</li>
              <li><b>B</b>: los tres vehículos toman direcciones diferentes.</li>
              <li><b>C</b>: exactamente dos de los tres vehículos dan vuelta a la derecha (R).</li>
              <li><b>D</b>: exactamente dos vehículos van en la misma dirección.</li>
            </ul>
          </div>

        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const simName = '${simName}';
          const $ = (id) => document.getElementById(id_base + '_' + id);

          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';
            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ' + simName;
              btn.classList.add('btn-sim-rojo');
              // inicializar sólo una vez si hace falta
              if (!container.dataset.ready) {
                container.dataset.ready = '1';
                initSim();
              }
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ' + simName;
              btn.classList.remove('btn-sim-rojo');
            }
          };

          function initSim() {
            const grid = $('grid');
            const infoEventos = $('infoEventos');
            const outUser = $('userOutput');

            const sel1 = $('veh1');
            const sel2 = $('veh2');
            const sel3 = $('veh3');

            const btnEval = $('btnEval');
            const btnAleatorio = $('btnAleatorio');

            const btnA = $('btnA');
            const btnB = $('btnB');
            const btnC = $('btnC');
            const btnD = $('btnD');
            const btnDcomp = $('btnDcomp');
            const btnUnionCD = $('btnUnionCD');
            const btnInterCD = $('btnInterCD');
            const btnClear = $('btnClear');

            // 1) Construir espacio muestral
            const dirs = ['L','R','S'];
            const espacio = [];
            for (let a of dirs) {
              for (let b of dirs) {
                for (let c of dirs) {
                  espacio.push(a + b + c);
                }
              }
            }

            // Eventos como conjuntos (Set)
            const A = new Set();
            const B = new Set();
            const C = new Set();
            const D = new Set();

            function contar(code, ch) {
              let c = 0;
              for (let i=0;i<code.length;i++) if (code[i] === ch) c++;
              return c;
            }

            espacio.forEach(code => {
              const cL = contar(code,'L');
              const cR = contar(code,'R');
              const cS = contar(code,'S');

              // A: los tres iguales
              if (code[0] === code[1] && code[1] === code[2]) {
                A.add(code);
              }

              // B: los tres distintos (tiene L,R,S)
              if (cL === 1 && cR === 1 && cS === 1) {
                B.add(code);
              }

              // C: exactamente dos R
              if (cR === 2) {
                C.add(code);
              }

              // D: exactamente dos vehículos en la misma dirección
              const counts = [cL, cR, cS].sort((x,y)=>x-y);
              if (counts[0] === 0 && counts[1] === 1 && counts[2] === 2) {
                D.add(code);
              }
            });

            // Complemento de D
            const Dcomp = new Set(espacio.filter(x => !D.has(x)));
            // C ∪ D y C ∩ D
            const CupD = new Set(espacio.filter(x => C.has(x) || D.has(x)));
            const CapD = new Set(espacio.filter(x => C.has(x) && D.has(x)));

            // Crear tarjetas gráficas
            const cards = {};
            function icons(code) {
              return code.split('').map(ch => {
                if (ch === 'L') return '🚗⬅️';
                if (ch === 'R') return '🚗➡️';
                return '🚗⬆️';
              }).join(' ');
            }

            espacio.forEach(code => {
              const card = document.createElement('div');
              card.className = 'sim-veh-card';
              card.dataset.code = code;
              card.innerHTML = '<span class="icons">'+icons(code)+'</span>' +
                               '<span class="code">'+code+'</span>';
              grid.appendChild(card);
              cards[code] = card;
            });

            function clearHighlights() {
              Object.values(cards).forEach(card => {
                card.classList.remove(
                  'sim-highlight-A',
                  'sim-highlight-B',
                  'sim-highlight-C',
                  'sim-highlight-D',
                  'sim-dimmed'
                );
              });
              infoEventos.textContent = '';
            }

            function highlightSet(set, tipo, desc) {
              clearHighlights();
              Object.entries(cards).forEach(([code, card]) => {
                if (set.has(code)) {
                  card.classList.add('sim-highlight-' + tipo);
                } else {
                  card.classList.add('sim-dimmed');
                }
              });
              infoEventos.innerHTML = desc;
            }

            // Botones de resaltado
            btnA.addEventListener('click', () => {
              highlightSet(A, 'A',
                '<b>Evento A</b>: los tres vehículos van en la misma dirección (LLL, RRR, SSS). ' +
                'Cardinalidad: ' + A.size + '.');
            });

            btnB.addEventListener('click', () => {
              highlightSet(B, 'B',
                '<b>Evento B</b>: los tres vehículos toman direcciones diferentes (L, R y S). ' +
                'Cardinalidad: ' + B.size + '.');
            });

            btnC.addEventListener('click', () => {
              highlightSet(C, 'C',
                '<b>Evento C</b>: exactamente dos vehículos giran a la derecha (R). ' +
                'Cardinalidad: ' + C.size + '.');
            });

            btnD.addEventListener('click', () => {
              highlightSet(D, 'D',
                '<b>Evento D</b>: exactamente dos vehículos van en la misma dirección. ' +
                'Cardinalidad: ' + D.size + '.');
            });

            btnDcomp.addEventListener('click', () => {
              highlightSet(Dcomp, 'D',
                '<b>D\'</b>: complemento de D (resultados donde NO hay exactamente dos vehículos en la misma dirección). ' +
                'Cardinalidad: ' + Dcomp.size + '.');
            });

            btnUnionCD.addEventListener('click', () => {
              highlightSet(CupD, 'D',
                '<b>C ∪ D</b>: resultados que pertenecen a C o a D (o ambos). Cardinalidad: ' + CupD.size + '.');
            });

            btnInterCD.addEventListener('click', () => {
              highlightSet(CapD, 'C',
                '<b>C ∩ D</b>: resultados que pertenecen a C y a D simultáneamente. Cardinalidad: ' + CapD.size + '.');
            });

            btnClear.addEventListener('click', clearHighlights);

            // Evaluación del escenario del usuario
            function evaluar(code) {
              const pertenece = [];
              if (A.has(code)) pertenece.push('A');
              if (B.has(code)) pertenece.push('B');
              if (C.has(code)) pertenece.push('C');
              if (D.has(code)) pertenece.push('D');

              const estaEnD = D.has(code);
              const estaEnDcomp = Dcomp.has(code);
              const estaEnCupD = CupD.has(code);
              const estaEnCapD = CapD.has(code);

              const tags = [];
              if (A.has(code)) tags.push('<span class="sim-veh-badge A">A</span>');
              if (B.has(code)) tags.push('<span class="sim-veh-badge B">B</span>');
              if (C.has(code)) tags.push('<span class="sim-veh-badge C">C</span>');
              if (D.has(code)) tags.push('<span class="sim-veh-badge D">D</span>');
              if (estaEnDcomp) tags.push('<span class="sim-veh-badge DC">D\'</span>');

              let html = '<b>Escenario elegido:</b> <code>'+code+'</code><br>';
              html += '<span style="font-size:18px;">'+icons(code)+'</span><br>';

              if (pertenece.length === 0) {
                html += 'Este resultado <b>no pertenece</b> a A, B, C ni D.<br>';
              } else {
                html += 'Pertenece a los eventos: <b>' + pertenece.join(', ') + '</b>.<br>';
              }

              html += '<div class="sim-veh-badges">'+tags.join(' ')+'</div>';

              html += '<br><b>Operaciones:</b><br>';
              html += '• Está en D\' (complemento de D): <b>' + (estaEnDcomp ? 'sí' : 'no') + '</b><br>';
              html += '• Está en C ∪ D: <b>' + (estaEnCupD ? 'sí' : 'no') + '</b><br>';
              html += '• Está en C ∩ D: <b>' + (estaEnCapD ? 'sí' : 'no') + '</b><br>';

              outUser.innerHTML = html;

              // Resaltar en el grid
              clearHighlights();
              Object.values(cards).forEach(card => {
                if (card.dataset.code === code) {
                  card.style.transform = 'scale(1.06)';
                  card.style.boxShadow = '0 0 0 2px #22c55e';
                } else {
                  card.style.transform = 'scale(1)';
                  card.style.boxShadow = '0 1px 2px rgba(15,23,42,0.04)';
                }
              });
            }

            btnEval.addEventListener('click', () => {
              const code = sel1.value + sel2.value + sel3.value;
              evaluar(code);
            });

            btnAleatorio.addEventListener('click', () => {
              function randDir() { return dirs[Math.floor(Math.random()*dirs.length)]; }
              sel1.value = randDir();
              sel2.value = randDir();
              sel3.value = randDir();
              const code = sel1.value + sel2.value + sel3.value;
              evaluar(code);
            });

          } // fin initSim

        })();
      </script>
    `;
  }
};
