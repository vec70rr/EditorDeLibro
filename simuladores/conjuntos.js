export default {
  render: (params, simName = 'Simulador de Conjuntos') => {
    const setA = params[0] || '1,2,3';
    const setB = params[1] || '3,4,5';
    const op = params[2] || 'union';
    
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;
    const id_btn = `${id_base}_btn`;
    const id_container = `${id_base}_container`;
    const id_result = `${id_base}_result`;
    const id_inputA = `${id_base}_inputA`;
    const id_inputB = `${id_base}_inputB`;
    const id_inputOp = `${id_base}_inputOp`;

    return `
      <div>
        <button id="${id_btn}" class="btn-sim" onclick="toggleSim_${id_base}()">
          Mostrar ${simName}
        </button>

        <div id="${id_container}" class="simulador-box" style="display:none; margin-top:10px;">
          <div id="${id_result}" style="margin-bottom: 10px; font-family: monospace;"></div>
          <div>
            <div>
              <label for="${id_inputA}">Conjunto A (ej. 1,2,3): </label>
              <input id="${id_inputA}" type="text" value="${setA}" style="margin: 5px;">
            </div>
            <div>
              <label for="${id_inputB}">Conjunto B (ej. 3,4,5): </label>
              <input id="${id_inputB}" type="text" value="${setB}" style="margin: 5px;">
            </div>
            <div>
              <label for="${id_inputOp}">Operación (union, interseccion, diferencia): </label>
              <input id="${id_inputOp}" type="text" value="${op}" style="margin: 5px;">
              <button onclick="calculateSet_${id_base}()">Calcular</button>
            </div>
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
            calculateSet_${id_base}(); // Calcula el resultado la primera vez que se abre
          } else {
            container.style.display = 'none';
            btn.textContent = 'Mostrar ${simName}';
            btn.classList.remove('btn-sim-rojo');
          }
        }

        function calculateSet_${id_base}() {
          try {
            const inputA = document.getElementById('${id_inputA}');
            const inputB = document.getElementById('${id_inputB}');
            const inputOp = document.getElementById('${id_inputOp}');
            const resultElement = document.getElementById('${id_result}');

            const setA = new Set(inputA.value.split(',').map(x => x.trim()).filter(Boolean));
            const setB = new Set(inputB.value.split(',').map(x => x.trim()).filter(Boolean));
            const op = inputOp.value.toLowerCase().trim() || 'union';

            let result;
            let opSymbol = '';

            switch (op) {
              case 'union': result = new Set([...setA, ...setB]); opSymbol = 'U'; break;
              case 'interseccion': result = new Set([...setA].filter(x => setB.has(x))); opSymbol = '∩'; break;
              case 'diferencia': result = new Set([...setA].filter(x => !setB.has(x))); opSymbol = '-'; break;
              default: result = 'Operación inválida';
            }
            
            const resultStr = result instanceof Set ? '{ ' + [...result].join(', ') + ' }' : result;
            const setAStr = '{ ' + [...setA].join(', ') + ' }';
            const setBStr = '{ ' + [...setB].join(', ') + ' }';

            resultElement.innerHTML = '<p>A = ' + setAStr + '</p><p>B = ' + setBStr + '</p><p><b>A ' + opSymbol + ' B = ' + resultStr + '</b></p>';
          } catch (error) {
            console.error('Error en calculateSet:', error);
          }
        }
      </script>
    `;
  }
};