export default {
  render: (params, simName = 'Sumador de Números') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`; // ID único

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" style="display:none; margin-top:10px; padding: 1em; border: 1px solid #ddd; border-radius: 8px; background-color: #fcfcfc;">
          
          <p>Introduce dos números y presiona "Sumar" para ver el resultado.</p>
          <div style="display:flex; gap: 10px; align-items: center; margin-bottom: 15px;">
            <label>Número 1: <input type="number" id="${id_base}_num1" value="0" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;"></label>
            <span style="font-size: 1.5em;">+</span>
            <label>Número 2: <input type="number" id="${id_base}_num2" value="0" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;"></label>
            <button id="${id_base}_calculateBtn" class="btn-sim" style="background: linear-gradient(135deg, #007bff, #0056b3);">Sumar</button>
          </div>
          <div id="${id_base}_result" style="font-size: 1.2em; font-weight: bold; color: #333;">
            Resultado: <span id="${id_base}_sumValue">0</span>
          </div>

        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);

          // Función para alternar la visibilidad del simulador
          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';

            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ${simName}';
              btn.classList.add('btn-sim-rojo');
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ${simName}';
              btn.classList.remove('btn-sim-rojo');
            }
          };

          // Lógica de suma
          const calculateSum = () => {
            const num1 = parseFloat($('num1').value || 0);
            const num2 = parseFloat($('num2').value || 0);
            const sum = num1 + num2;
            $('sumValue').textContent = sum;
          };

          // Asignar evento al botón de calcular
          $('calculateBtn').addEventListener('click', calculateSum);

          // Calcular al cargar por primera vez
          calculateSum();
        })();
      </script>
    `;
  }
};