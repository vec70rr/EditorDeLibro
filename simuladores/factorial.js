export default {
  render: (params, simName = 'Simulador de Factorial') => {
    const n = parseInt(params[0]) || 5;
    
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;
    const id_btn = `${id_base}_btn`;
    const id_container = `${id_base}_container`;
    const id_result = `${id_base}_result`;
    const id_input = `${id_base}_input`;

    return `
      <div>
        <button id="${id_btn}" class="btn-sim" onclick="toggleSim_${id_base}()">
          Mostrar ${simName}
        </button>

        <div id="${id_container}" class="simulador-box" style="display:none; margin-top:10px;">
          <p id="${id_result}"></p>
          <div>
            <label for="${id_input}">Número (ej. 5): </label>
            <input id="${id_input}" type="number" value="${n}" style="margin: 5px;">
            <button onclick="calculateFactorial_${id_base}()">Aceptar</button>
          </div>
        </div>
      </div>
      <script>
        function toggleSim_${id_base}() {
          const container = document.getElementById('${id_container}');
          const btn = document.getElementById('${id_btn}');
          const isHidden = container.style.display === 'none';

          if (isHidden) {
            container.style.display = 'block';
            btn.textContent = 'Ocultar ${simName}';
            btn.classList.add('btn-sim-rojo');
            calculateFactorial_${id_base}();
          } else {
            container.style.display = 'none';
            btn.textContent = 'Mostrar ${simName}';
            btn.classList.remove('btn-sim-rojo');
          }
        }

        function calculateFactorial_${id_base}() {
          const input = document.getElementById('${id_input}');
          const resultElement = document.getElementById('${id_result}');
          const n = parseInt(input.value);

          if (isNaN(n) || n < 0) {
            resultElement.innerHTML = 'Error: El número debe ser no negativo.';
            return;
          }
          if (n > 170) { // Límite para evitar Infinity en JS
            resultElement.innerHTML = 'Error: El número es demasiado grande para calcular.';
            return;
          }

          let steps = n + '! = ';
          let result = 1;
          if (n === 0) {
            steps = '0! = 1';
          } else {
            for (let i = n; i > 1; i--) {
              result *= i;
              steps += i + ' × ';
            }
            steps += '1 = ' + result.toLocaleString();
          }
          resultElement.innerHTML = steps;
        }
      </script>
    `;
  }
};