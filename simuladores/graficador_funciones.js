export default {
  render: (params, simName = 'Graficador de Funciones') => {
    const expr = params[0] || 'sin(x)';
    
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;
    const id_btn = `${id_base}_btn`;
    const id_container = `${id_base}_container`;
    const id_canvas = `${id_base}_canvas`;
    const id_input = `${id_base}_input`;

    return `
      <div>
        <button id="${id_btn}" class="btn-sim" onclick="toggleSim_${id_base}()">
          Mostrar ${simName}
        </button>

        <div id="${id_container}" class="simulador-box" style="display:none; margin-top:10px;">
          <canvas id="${id_canvas}" width="400" height="200" style="border: 1px solid #ccc; background: #fff;"></canvas>
          <div>
            <label for="${id_input}">Función f(x): </label>
            <input id="${id_input}" type="text" value="${expr}" style="margin: 5px; min-width: 150px;">
            <button onclick="updateGraph_${id_base}()">Graficar</button>
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
            updateGraph_${id_base}();
          } else {
            container.style.display = 'none';
            btn.textContent = 'Mostrar ${simName}';
            btn.classList.remove('btn-sim-rojo');
          }
        }

        function updateGraph_${id_base}() {
          try {
            const input = document.getElementById('${id_input}');
            const canvas = document.getElementById('${id_canvas}');
            if (!input || !canvas) return;

            const ctx = canvas.getContext('2d');
            const exprNode = math.parse(input.value);
            const expr = exprNode.compile();
            
            const xMin = -10, xMax = 10, yMin = -5, yMax = 5;
            const width = canvas.width, height = canvas.height;
            
            ctx.clearRect(0, 0, width, height);

            // Ejes
            ctx.strokeStyle = '#ddd';
            ctx.beginPath();
            const y0 = height - (0 - yMin) / (yMax - yMin) * height;
            ctx.moveTo(0, y0); ctx.lineTo(width, y0);
            const x0 = (0 - xMin) / (xMax - xMin) * width;
            ctx.moveTo(x0, 0); ctx.lineTo(x0, height);
            ctx.stroke();

            // Función
            ctx.strokeStyle = '#004080';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            let firstPoint = true;
            for (let px = 0; px < width; px++) {
              const x = xMin + (xMax - xMin) * (px / width);
              let y;
              try { y = expr.evaluate({ x }); } catch (e) { y = NaN; }
              
              const py = height - (y - yMin) / (yMax - yMin) * height;

              if (isFinite(py)) {
                if (firstPoint) {
                  ctx.moveTo(px, py);
                  firstPoint = false;
                } else {
                  ctx.lineTo(px, py);
                }
              } else {
                firstPoint = true;
              }
            }
            ctx.stroke();
            ctx.lineWidth = 1;

          } catch (error) {
            console.error('Error al graficar:', error);
            const canvas = document.getElementById('${id_canvas}');
            if(canvas) {
              const ctx = canvas.getContext('2d');
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = 'red';
              ctx.font = '14px Arial';
              ctx.fillText('Error en la expresión', 10, 20);
            }
          }
        }
      </script>
    `;
  }
};