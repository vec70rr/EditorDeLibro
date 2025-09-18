export default {
  // Ahora la función render acepta un segundo argumento: el nombre del simulador
  render: (params, simName = 'Simulador') => {
    const cx = params[0] || '100';
    const cy = params[1] || '100';
    const r = params[2] || '50';
    
    // ID único para todos los elementos de esta instancia del simulador
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;
    const id_btn = `${id_base}_btn`;
    const id_container = `${id_base}_container`;
    const id_canvas = `${id_base}_canvas`;
    const id_cx = `${id_base}_cx`;
    const id_cy = `${id_base}_cy`;
    const id_r = `${id_base}_r`;

    return `
      <div>
        <button id="${id_btn}" class="btn-sim" onclick="toggleSim_${id_base}()">
          Mostrar ${simName}
        </button>

        <div id="${id_container}" class="simulador-box" style="display:none; margin-top:10px;">
          <canvas id="${id_canvas}" width="400" height="200" style="border: 1px solid #ccc; background: #fff;"></canvas>
          <div style="display: flex; gap: 15px; align-items: center; margin-top: 10px; flex-wrap: wrap;">
            <label for="${id_cx}">Centro X:</label>
            <input id="${id_cx}" type="number" value="${cx}" style="width: 60px;">
            <label for="${id_cy}">Centro Y:</label>
            <input id="${id_cy}" type="number" value="${cy}" style="width: 60px;">
            <label for="${id_r}">Radio:</label>
            <input id="${id_r}" type="number" value="${r}" style="width: 60px;">
            <button onclick="drawCircle_${id_base}()">Dibujar</button>
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
            // Dibuja la primera vez que se abre
            drawCircle_${id_base}();
          } else {
            container.style.display = 'none';
            btn.textContent = 'Mostrar ${simName}';
            btn.classList.remove('btn-sim-rojo');
          }
        }

        function drawCircle_${id_base}() {
          try {
            const canvas = document.getElementById('${id_canvas}');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const centerX = parseInt(document.getElementById('${id_cx}').value);
            const centerY = parseInt(document.getElementById('${id_cy}').value);
            const radius = parseInt(document.getElementById('${id_r}').value);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = '#004080';
            ctx.lineWidth = 2;
            ctx.stroke();
          } catch (e) {
            console.error('Error al dibujar círculo:', e);
          }
        }
      </script>
    `;
  }
};