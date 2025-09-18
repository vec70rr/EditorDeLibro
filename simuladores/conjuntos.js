export default {
  render: (params) => {
    const setA = params[0] || '1,2,3';
    const setB = params[1] || '3,4,5';
    const op = params[2] || 'union';
    const id = `conj_${Math.random().toString(36).slice(2)}`;
    return `
      <div class="simulador-box" id="${id}_box">
        <div id="${id}_result" style="margin-bottom: 10px; font-family: monospace;"></div>
        <div>
          <div>
            <label for="${id}_inputA">Conjunto A (ej. 1,2,3): </label>
            <input id="${id}_inputA" type="text" value="${setA}" style="margin: 5px;">
          </div>
          <div>
            <label for="${id}_inputB">Conjunto B (ej. 3,4,5): </label>
            <input id="${id}_inputB" type="text" value="${setB}" style="margin: 5px;">
          </div>
          <div>
            <label for="${id}_inputOp">Operación (union, interseccion, diferencia): </label>
            <input id="${id}_inputOp" type="text" value="${op}" style="margin: 5px;">
            <button onclick="calculateSet('${id}')">Calcular</button>
          </div>
        </div>
      </div>
      <script>
        function calculateSet(id) {
          try {
            const inputA = document.getElementById(id + '_inputA');
            const inputB = document.getElementById(id + '_inputB');
            const inputOp = document.getElementById(id + '_inputOp');
            const resultElement = document.getElementById(id + '_result');

            if (!inputA || !inputB || !inputOp || !resultElement) return;

            const setA = new Set(inputA.value.split(',').map(x => x.trim()).filter(Boolean));
            const setB = new Set(inputB.value.split(',').map(x => x.trim()).filter(Boolean));
            const op = inputOp.value.toLowerCase().trim() || 'union';

            let result;
            let opSymbol = '';

            switch (op) {
              case 'union':
                result = new Set([...setA, ...setB]);
                opSymbol = 'U';
                break;
              case 'interseccion':
                result = new Set([...setA].filter(x => setB.has(x)));
                opSymbol = '∩';
                break;
              case 'diferencia':
                result = new Set([...setA].filter(x => !setB.has(x)));
                opSymbol = '-';
                break;
              default:
                result = 'Operación inválida';
            }
            
            // --- LÍNEAS CORREGIDAS ---
            // Se usa concatenación con '+' para evitar el error de referencia.
            const resultStr = result instanceof Set ? '{ ' + [...result].join(', ') + ' }' : result;
            const setAStr = '{ ' + [...setA].join(', ') + ' }';
            const setBStr = '{ ' + [...setB].join(', ') + ' }';

            resultElement.innerHTML = '<p>A = ' + setAStr + '</p><p>B = ' + setBStr + '</p><p><b>A ' + opSymbol + ' B = ' + resultStr + '</b></p>';
            
          } catch (error) {
            console.error('Error en calculateSet:', error);
            const resultElement = document.getElementById(id + '_result');
            if (resultElement) {
              resultElement.innerHTML = '<p style="color: red;">Error: No se pudo procesar la operación.</p>';
            }
          }
        }
        // Llamada inicial para mostrar el resultado por defecto
        calculateSet('${id}');
      </script>
    `;
  }
};