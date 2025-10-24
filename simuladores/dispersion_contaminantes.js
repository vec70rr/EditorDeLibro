export default {
  render: (params, simName = 'Modelo de Penacho Gaussiano') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    // Valores por defecto razonables
    const defaultQ = params[0] || 100; // g/s
    const defaultU = params[1] || 5;   // m/s at 10m
    const defaultH = params[2] || 50;  // m

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          
          <h4>Parámetros de Entrada</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; align-items: end; margin-bottom: 1rem;">
            <div>
              <label for="${id_base}_q">Tasa Emisión Q (g/s):</label>
              <input type="number" id="${id_base}_q" value="${defaultQ}" step="10" style="width: 100%;">
            </div>
            <div>
              <label for="${id_base}_u">Vel. Viento U (m/s a 10m):</label>
              <input type="number" id="${id_base}_u" value="${defaultU}" step="0.5" style="width: 100%;">
            </div>
            <div>
              <label for="${id_base}_h">Altura Chimenea H (m):</label>
              <input type="number" id="${id_base}_h" value="${defaultH}" step="5" style="width: 100%;">
            </div>
            <div>
              <label for="${id_base}_stability">Estabilidad (A-F):</label>
              <select id="${id_base}_stability" style="width: 100%;">
                <option value="A">A (Muy inestable)</option>
                <option value="B">B (Inestable)</option>
                <option value="C">C (Lig. inestable)</option>
                <option value="D" selected>D (Neutra)</option>
                <option value="E">E (Lig. estable)</option>
                <option value="F">F (Estable)</option>
              </select>
            </div>
             <div>
              <label for="${id_base}_terrain">Terreno:</label>
              <select id="${id_base}_terrain" style="width: 100%;">
                <option value="rural" selected>Rural</option>
                <option value="urban">Urbano</option>
              </select>
            </div>
          </div>
          
          <h4>Punto de Cálculo</h4>
           <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem; align-items: end; margin-bottom: 1rem;">
             <div>
              <label for="${id_base}_x">Distancia X (m):</label>
              <input type="number" id="${id_base}_x" value="1000" step="100" style="width: 100%;">
            </div>
             <div>
              <label for="${id_base}_y">Distancia Y (m):</label>
              <input type="number" id="${id_base}_y" value="0" step="10" style="width: 100%;">
            </div>
             <div>
              <label for="${id_base}_z">Altura Z (m):</label>
              <input type="number" id="${id_base}_z" value="0" step="1" style="width: 100%;">
            </div>
          </div>
            
          <button class="btn-sim" id="${id_base}_calculateBtn" style="width: 100%;">Calcular Concentración</button>

          <hr style="margin: 1.5rem 0;">

          <h3>Resultados del Cálculo</h3>
          <div id="${id_base}_results" style="font-size: 1.1em; color: #333;">
             <p>Ingrese los parámetros y haga clic en Calcular.</p>
          </div>
          
        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);

          window['toggleSim_' + id_base] = function() { /* ... (código de toggle estándar) ... */
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';
            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ${simName}';
              btn.classList.add('btn-sim-rojo');
              calculatePlume(); // Calcular al abrir
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ${simName}';
              btn.classList.remove('btn-sim-rojo');
            }
          };

          // --- Funciones de cálculo (Basadas en ISC3 - simplificadas) ---
          
          // Coeficientes de dispersión Sigma Y/Z (Terreno RURAL - Pasquill-Gifford)
          // Devuelve [sigma_y, sigma_z] en metros para una distancia x en METROS
          function getRuralSigmas(stability, x_m) {
              const x_km = x_m / 1000.0; // Fórmulas usan km
              let sigma_y, sigma_z;
              
              // Sigma Y (Rural)
              const y_coeffs = {
                  'A': [213, 0.894], 'B': [156, 0.894], 'C': [104, 0.894], 
                  'D': [68, 0.894], 'E': [50.5, 0.894], 'F': [34, 0.894]
              };
              sigma_y = y_coeffs[stability][0] * Math.pow(x_km, y_coeffs[stability][1]);

              // Sigma Z (Rural) - Fórmulas aproximadas comunes (ver ISC3 para más precisión)
              // Estas son simplificaciones; el código MATLAB usa tablas más complejas
              const z_coeffs = { // [a, b, c] for sigma_z = a * x^b / (1 + c*x)^d ; d is often 0 or 1
                  'A': [440.8, 1.941, 9.27], // Hay muchas variantes de estas fórmulas
                  'B': [106.6, 1.149, 3.3],
                  'C': [61.0, 0.911, 0], 
                  'D': [33.2, 0.725, -1.7],
                  'E': [22.8, 0.678, -1.3],
                  'F': [14.35, 0.740, -0.35]
              };
               // Usando una forma más simple a*x^b
              const z_simple_coeffs = { // coefs [a, b] para sigma_z = a * x_km^b (aproximación)
                  'A': [24.167, 2.5334], // ¡Ojo! Estos son los coeffs y del MATLAB original, ¡error! Usar otros.
                  'B': [18.333, 1.8096], // ¡Corregir!
                  'C': [12.5, 1.0857],
                  'D': [8.333, 0.7238],
                  'E': [6.25, 0.5428],
                  'F': [4.167, 0.3619]
              };
               // Usaremos una fórmula de potencia simple como primera aproximación
              const a = {'A': 400,'B': 120,'C': 80,'D': 40,'E': 30,'F': 20}[stability]; // Valores aproximados
              const b = {'A': 0.91,'B': 0.91,'C': 0.91,'D': 0.71,'E': 0.71,'F': 0.71}[stability]; // Exponentes aproximados
              sigma_z = a * Math.pow(x_km, b);

              return [sigma_y, sigma_z];
          }
          
          // Coeficientes de dispersión Sigma Y/Z (Terreno URBANO - McElroy-Pooler)
          function getUrbanSigmas(stability, x_m) {
              let sigma_y, sigma_z;
              const x = x_m; // Usan metros directamente
              
              // Sigma Y (Urbano)
              const cy = {'A': 0.32, 'B': 0.32, 'C': 0.22, 'D': 0.16, 'E': 0.11, 'F': 0.11}[stability];
              sigma_y = cy * x * Math.pow(1 + 0.0004 * x, -0.5);

              // Sigma Z (Urbano)
              const cz_coeffs = { // [a, b, c, d] for a*x*(b+c*x)^d
                  'A': [0.24, 1, 0.001, 0.5], 'B': [0.24, 1, 0.001, 0.5], 'C': [0.20, 1, 0, 0],
                  'D': [0.14, 1, 0.0003, -0.5], 'E': [0.08, 1, 0.0015, -0.5], 'F': [0.08, 1, 0.0015, -0.5]
              };
              const cz = cz_coeffs[stability];
              sigma_z = cz[0] * x * Math.pow(cz[1] + cz[2] * x, cz[3]);
              
              return [sigma_y, sigma_z];
          }

          const calculatePlume = () => {
            const Q = parseFloat($('q').value) || 0;
            const u_ref = parseFloat($('u').value) || 1; // Velocidad a 10m
            const h = parseFloat($('h').value) || 50; // Altura física
            const stability = $('stability').value;
            const terrain = $('terrain').value;
            const x = parseFloat($('x').value) || 1; // Distancia downwind
            const y = parseFloat($('y').value) || 0; // Distancia crosswind
            const z = parseFloat($('z').value) || 0; // Altura receptor

            const resultsDiv = $('results');
            
            if (Q <= 0 || u_ref <= 0 || h < 0 || x <= 0) {
              resultsDiv.innerHTML = '<p style="color:red;">Error: Q, U, H deben ser positivos, X debe ser mayor que 0.</p>';
              return;
            }

            // --- Cálculos Simplificados ---
            const z0 = h; // Altura efectiva = física (sin plume rise)
            const h_ref = 10; // Altura de referencia del viento U
            
            // Exponente 'p' de la ley de potencia del viento (simplificado)
            // Varía con estabilidad y terreno, usamos valores promedio de ISC3
            let p;
            if (terrain === 'rural') {
                p = {'A':0.07, 'B':0.07, 'C':0.10, 'D':0.15, 'E':0.35, 'F':0.55}[stability];
            } else { // Urbano
                p = {'A':0.15, 'B':0.15, 'C':0.20, 'D':0.25, 'E':0.30, 'F':0.30}[stability];
            }
            
            // Velocidad del viento a la altura efectiva z0
            const u_stack = u_ref * Math.pow(z0 / h_ref, p);
            
            // Obtener sigmas según terreno
            let sigmas;
            if (terrain === 'rural') {
                sigmas = getRuralSigmas(stability, x);
            } else {
                sigmas = getUrbanSigmas(stability, x);
            }
            const sigma_y = sigmas[0];
            const sigma_z = sigmas[1];

            // --- Ecuación Gaussiana (sin reflexión ni deposición) ---
            const C = (Q / (2 * Math.PI * u_stack * sigma_y * sigma_z)) *
                      Math.exp(-0.5 * Math.pow(y / sigma_y, 2)) *
                      ( Math.exp(-0.5 * Math.pow((z - z0) / sigma_z, 2)) ); // Sin término de reflexión

            // Mostrar Resultados
            resultsDiv.innerHTML = 
              '<h4>Resultados:</h4>' +
              '<p>Velocidad viento a altura H ('+z0.toFixed(1)+'m): <b>' + u_stack.toFixed(2) + ' m/s</b></p>' +
              '<p>Coeficientes de Dispersión en X='+x+'m:</p>' +
              '<ul><li>Sigma Y (σy): <b>' + sigma_y.toFixed(2) + ' m</b></li>' +
              '<li>Sigma Z (σz): <b>' + sigma_z.toFixed(2) + ' m</b></li></ul>' +
              '<p><b>Concentración C en ('+x+', '+y+', '+z+') = ' + C.toExponential(3) + ' g/m³</b></p>';
          };

          $('calculateBtn').addEventListener('click', calculatePlume);
          
          // Calcular al inicio para mostrar algo
          // calculatePlume(); 
          // Comentado para que el usuario haga el primer clic

        })();
      </script>
    `;
  }
};