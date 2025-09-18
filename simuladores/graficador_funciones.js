export default {
  render: (params) => {
    const expr = params[0] || 'sin(x)';
    const id = `graf_${Math.random().toString(36).slice(2)}`;
    return `
      <div class="simulador-box" id="${id}_box">
        <canvas id="${id}_canvas" width="400" height="200" style="border: 1px solid #ccc;"></canvas>
        <div>
          <label for="${id}_input">Función f(x): </label>
          <input id="${id}_input" type="text" value="${expr}" style="margin: 5px; min-width: 150px;">
          <button onclick="updateGraph('${id}')">Graficar</button>
        </div>
      </div>
      <script>
        function updateGraph(id) {
          try {
            const input = document.getElementById(id + '_input');
            const canvas = document.getElementById(id + '_canvas');
            if (!input || !canvas) return;

            const ctx = canvas.getContext('2d');
            const expr = math.compile(input.value);
            
            const xMin = -10, xMax = 10, yMin = -5, yMax = 5;
            const width = canvas.width, height = canvas.height;
            
            ctx.clearRect(0, 0, width, height);

            // Dibujar ejes
            ctx.strokeStyle = '#ddd';
            ctx.beginPath();
            // Eje X
            const y0 = height - (0 - yMin) / (yMax - yMin) * height;
            ctx.moveTo(0, y0);
            ctx.lineTo(width, y0);
            // Eje Y
            const x0 = (0 - xMin) / (xMax - xMin) * width;
            ctx.moveTo(x0, 0);
            ctx.lineTo(x0, height);
            ctx.stroke();

            // Dibujar función
            ctx.strokeStyle = '#235f95';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            let firstPoint = true;
            for (let px = 0; px < width; px++) {
              const x = xMin + (xMax - xMin) * (px / width);
              let y;
              try { 
                y = expr.evaluate({ x }); 
              } catch (e) { 
                y = NaN; // Si hay un error en la evaluación, es un punto discontinuo
              }
              
              const py = height - (y - yMin) / (yMax - yMin) * height;

              if (isFinite(py)) { // Solo dibujar si el punto es válido
                if (firstPoint) {
                  ctx.moveTo(px, py);
                  firstPoint = false;
                } else {
                  ctx.lineTo(px, py);
                }
              } else {
                firstPoint = true; // Forzar un moveTo en el siguiente punto válido
              }
            }
            ctx.stroke();
            ctx.lineWidth = 1;

          } catch (error) {
            console.error('Error al graficar:', error);
            const canvas = document.getElementById(id + '_canvas');
            if(canvas) {
              const ctx = canvas.getContext('2d');
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = 'red';
              ctx.font = '14px Arial';
              ctx.fillText('Error en la expresión', 10, 20);
            }
          }
        }
        // Llamada inicial para que la gráfica aparezca al cargar
        updateGraph('${id}');
      </script>
    `;
  }
};