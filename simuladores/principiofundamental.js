export default {
  render: (params, simName = 'Visualizador de Grafos Dirigidos') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    // ELIMINADAS LAS LÍNEAS <script src=...> y <link href=...> de aquí

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="window['toggleSim_${id_base}']()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" class="simulador-box" style="display:none; margin-top:10px;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <label for="${id_base}_nodes"><b>Nodos</b> (separados por coma):</label>
              <textarea id="${id_base}_nodes" style="width: 100%; height: 80px; margin-top: 4px;">A, B, C</textarea>
            </div>
            <div>
              <label for="${id_base}_edges"><b>Caminos / Flechas</b> (ej. A -> B, B -> C):</label>
              <textarea id="${id_base}_edges" style="width: 100%; height: 80px; margin-top: 4px;">A -> B, B -> C,A -> B, A -> B,B -> C</textarea>
            </div>
          </div>
          <button class="btn-sim" id="${id_base}_drawBtn">Dibujar Grafo</button>

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
            // Verificar si Vis.js está cargado globalmente
            if (typeof vis === 'undefined' || typeof vis.DataSet === 'undefined' || typeof vis.Network === 'undefined') {
              console.error('Error: Vis.js no parece estar cargado.');
              $('network').innerHTML = '<p style="color:red;padding:10px;">Error: La librería Vis.js no se cargó correctamente.</p>';
              return;
            }
              
            try {
              const nodesInput = $('nodes').value;
              const nodeLabels = nodesInput.split(',').map(s => s.trim()).filter(Boolean);
              // Corregido: Usar vis.DataSet
              const nodes = new vis.DataSet(nodeLabels.map(label => ({ id: label, label: label })));

              const edgesInput = $('edges').value;
              const edgesArray = edgesInput.split(',').map(s => s.trim()).filter(Boolean);
              // Corregido: Usar vis.DataSet
              const edges = new vis.DataSet(edgesArray.map(edge => {
                const parts = edge.split('->');
                if (parts.length === 2) { return { from: parts[0].trim(), to: parts[1].trim() }; }
                return null;
              }).filter(Boolean));

              const container = $('network');
              const data = { nodes: nodes, edges: edges };
              const options = { /* ... (opciones sin cambios) ... */
                layout: { hierarchical: false }, edges: { arrows: 'to' },
                physics: { forceAtlas2Based: { gravitationalConstant: -26, centralGravity: 0.005, springLength: 230, springConstant: 0.18 }, maxVelocity: 146, solver: 'forceAtlas2Based', timestep: 0.35, stabilization: { iterations: 150 } }
              };
              
              if (network) { network.destroy(); }
              // Corregido: Usar vis.Network
              network = new vis.Network(container, data, options);

            } catch (err) {
              console.error('Error al dibujar el grafo:', err);
              $('network').innerHTML = '<p style="color:red;padding:10px;">Error al procesar la entrada. Revisa la sintaxis (ej. A -> B).</p>';
            }
          }

          $('drawBtn').addEventListener('click', drawGraph);

        })();
      </script>
    `;
  }
};
