export default {
  render: (params) => {
    const n = parseInt(params[0]) || 5;
    const id = `fact_${Math.random().toString(36).slice(2)}`;
    return `
      <div class="simulador-box" id="${id}_box">
        <p id="${id}_result"></p>
        <div>
          <label for="${id}_input">Número (ej. 5): </label>
          <input id="${id}_input" type="number" value="${n}" style="margin: 5px;">
          <button onclick="calculateFactorial('${id}')">Aceptar</button>
        </div>
        <script>
          function calculateFactorial(id) {
            const input = document.getElementById(id + '_input');
            const n = parseInt(input.value) || 5;
            if (n < 0) {
              document.getElementById(id + '_result').innerHTML = 'Error: El número debe ser no negativo.';
              return;
            }
            let steps = n + '! = ';
            let result = 1;
            for (let i = n; i > 1; i--) {
              result *= i;
              steps += i + ' * ';
            }
            steps += '1 = ' + result;
            document.getElementById(id + '_box').querySelector('#' + id + '_result').innerHTML = steps;
          }
          // Inicializar con el valor por defecto
          calculateFactorial('${id}');
        </script>
      </div>
    `;
  }
};