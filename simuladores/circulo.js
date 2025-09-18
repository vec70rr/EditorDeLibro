export default {
  render: (params) => {
    const cx = params[0] || '100'; // Coordenada X del centro
    const cy = params[1] || '100'; // Coordenada Y del centro
    const r = params[2] || '50';   // Radio
    const id = `circ_${Math.random().toString(36).slice(2)}`;
    return `
      <div class="simulador-box" id="${id}_box">
        <canvas id="${id}_canvas" width="400" height="200" style="border: 1px solid #ccc;"></canvas>
        <div style="display: flex; gap: 15px; align-items: center; margin-top: 10px;">
          <label for="${id}_cx">Centro X:</label>
          <input id="${id}_cx" type="number" value="${cx}" style="width: 60px;">
          <label for="${id}_cy">Centro Y:</label>
          <input id="${id}_cy" type="number" value="${cy}" style="width: 60px;">
          <label for="${id}_r">Radio:</label>
          <input id="${id}_r" type="number" value="${r}" style="width: 60px;">
          <button onclick="drawCircle('${id}')">Dibujar</button>
        </div>
      </div>
      <script>
        function drawCircle(id) {
          try {
            const canvas = document.getElementById(id + '_canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            const centerX = parseInt(document.getElementById(id + '_cx').value) || 100;
            const centerY = parseInt(document.getElementById(id + '_cy').value) || 100;
            const radius = parseInt(document.getElementById(id + '_r').value) || 50;

            // Limpiar el canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dibujar la circunferencia
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI); // Dibuja un arco completo (0 a 2*PI radianes)
            ctx.strokeStyle = '#235f95';
            ctx.lineWidth = 2;
            ctx.stroke();

          } catch (error) {
            console.error('Error al dibujar la circunferencia:', error);
          }
        }
        // Llamada inicial para que la circunferencia aparezca al cargar
        drawCircle('${id}');
      </script>
    `;
  }
};