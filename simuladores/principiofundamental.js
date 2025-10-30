export default {
  render: (params, simName = 'Visualizador de Grafos') => { // Changed default name slightly
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    // CDN links removed as they are loaded globally now

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            <div>
              <label for="${id_base}_nodes"><b>Nodos</b> (separados por coma):</label>
              <textarea id="${id_base}_nodes" style="width: 100%; height: 60px; margin-top: 4px;">A, B, C, D</textarea>
            </div>
            <div>
              <label for="${id_base}_edges"><b>Caminos</b> (ej. A -> B o A - B):</label>
              <textarea id="${id_base}_edges" style="width: 100%; height: 60px; margin-top: 4px;">A -> B, B - C, A -> C, D -> A</textarea>
              <small>Usa '->' para dirigidos, '-' para no dirigidos (o selecciona abajo).</small>
            </div>
            
            <div>
              <label for="${id_base}_edgeType"><b>Tipo de Camino:</b></label>
              <select id="${id_base}_edgeType" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px;">
                <option value="directed" selected>Dirigidos (Mostrar Flechas)</option>
                <option value="undirected">No Dirigidos (Mostrar Líneas)</option>
              </select>
            </div>
          </div>
          <button class="btn-sim" id="${id_base}_drawBtn" style="width: 100%;">Dibujar Grafo</button>

          <hr style="margin: 1.5rem 0;">
          
          <h3>Grafo Generado:</h3>
          <div id="${id_base}_network" style="width: 100%; height: 400px; border: 1px solid #ccc; background: #fff; border-radius: 6px;"></div>
        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);
          const simName = '${simName}';
          let network = null;

          window['toggleSim_' + id_base] = function() { /* ... (código toggle sin cambios) ... */
            const container = $('container'); const btn = $('btn'); const isHidden = container.style.display === 'none';
            if (isHidden) { container.style.display = 'block'; btn.textContent = 'Ocultar ' + simName; btn.classList.add('btn-sim-rojo'); if (!network) { drawGraph(); } } 
            else { container.style.display = 'none'; btn.textContent = 'Abrir ' + simName; btn.classList.remove('btn-sim-rojo'); }
          };

          function drawGraph() {
            if (typeof vis === 'undefined' || typeof vis.DataSet === 'undefined' || typeof vis.Network === 'undefined') {
              console.error('Error: Vis.js no parece estar cargado.');
              $('network').innerHTML = '<p style="color:red;padding:10px;">Error: La librería Vis.js no se cargó correctamente.</p>';
              return;
            }
              
            try {
              const nodesInput = $('nodes').value;
              const nodeLabels = nodesInput.split(',').map(s => s.trim()).filter(Boolean);
              const nodes = new vis.DataSet(nodeLabels.map(label => ({ id: label, label: label })));

              const edgesInput = $('edges').value;
              const edgesArray = edgesInput.split(',').map(s => s.trim()).filter(Boolean);
              
              // Determinar si usar flechas basado en el dropdown
              const edgeType = $('edgeType').value;
              const showArrows = edgeType === 'directed';

              const edges = new vis.DataSet(edgesArray.map(edge => {
                // Permitir '->' o '-' como separador
                const separator = edge.includes('->') ? '->' : '-';
                const parts = edge.split(separator);
                if (parts.length === 2) { 
                    const edgeData = { from: parts[0].trim(), to: parts[1].trim() };
                    // **MODIFICACIÓN**: Añadir 'arrows' solo si son dirigidos
                    if (!showArrows) {
                        edgeData.arrows = ''; // Vacío significa sin flechas
                    }
                    return edgeData;
                 }
                return null;
              }).filter(Boolean));

              const container = $('network');
              const data = { nodes: nodes, edges: edges };
              
              // **MODIFICACIÓN**: Ajustar opciones de edges basado en la selección
              const options = {
                layout: { hierarchical: false },
                edges: {
                  arrows: showArrows ? 'to' : undefined, // 'to' si dirigido, undefined si no dirigido
                  smooth: { // Mejorar un poco la apariencia
                    enabled: true,
                    type: "dynamic",
                    roundness: 0.5
                  }
                },
                physics: { /* ... (physics options sin cambios) ... */
                  forceAtlas2Based: { gravitationalConstant: -26, centralGravity: 0.005, springLength: 230, springConstant: 0.18 }, 
                  maxVelocity: 146, solver: 'forceAtlas2Based', timestep: 0.35, stabilization: { iterations: 150 } 
                }
              };
              
              if (network) { network.destroy(); }
              network = new vis.Network(container, data, options);

            } catch (err) {
              console.error('Error al dibujar el grafo:', err);
              $('network').innerHTML = '<p style="color:red;padding:10px;">Error al procesar la entrada. Revisa la sintaxis (ej. A -> B o A - B).</p>';
            }
          }

          $('drawBtn').addEventListener('click', drawGraph);
          // También redibujar si cambia el tipo de borde
          $('edgeType').addEventListener('change', drawGraph); 

        })();
      </script>
    `;
  }
};