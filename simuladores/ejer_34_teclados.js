// Ejer_34_teclados_mejorado.js
// Ejercicio interactivo — Teclados defectuosos (técnicas de conteo y probabilidad)
// Versión mejorada con interfaz visual moderna SIN respuestas en los cuadros

export default {
  render: (_params, simName = "⌨️ Análisis de Teclados Defectuosos") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div>
  <button id="${id}_btn" class="btn-sim" onclick="toggleSim_${id}()" style="
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);
    transition: all 0.3s ease;
  ">
    ⌨️ Abrir ${simName}
  </button>

  <div id="${id}_container" class="simulador-box" style="
    display: none;
    margin-top: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    background: white;
  ">

    <!-- ENCABEZADO VISUAL -->
    <div style="
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      padding: 20px;
      text-align: center;
    ">
      <h2 style="margin: 0; font-size: 1.8em;">⌨️ Análisis de Teclados Defectuosos</h2>
      <p style="margin: 10px 0 0; opacity: 0.9;">
        Calcula combinaciones y probabilidades en muestras de teclados defectuosos
      </p>
    </div>

    <div id="${id}" style="padding: 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px;">

      <!-- VISUALIZACIÓN DE DATOS -->
      <div style="
        background: linear-gradient(to right, #f0fdf4, #ecfdf5);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 25px;
        position: relative;
        overflow: hidden;
      ">
        <div style="position: absolute; right: -20px; top: -20px; font-size: 5em; opacity: 0.1;">⌨️</div>
        <h3 style="margin-top: 0; color: #333;">📊 Datos del Problema</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
          <!-- Total teclados -->
          <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.05); border-left: 4px solid #059669;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #059669; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">∑</div>
              <div style="font-weight: bold; color: #555;">Total de teclados</div>
            </div>
            <div style="font-size: 1.8em; font-weight: bold; color: #059669;">25</div>
          </div>
          
          <!-- Defectos eléctricos -->
          <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.05); border-left: 4px solid #3b82f6;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">⚡</div>
              <div style="font-weight: bold; color: #555;">Defecto eléctrico</div>
            </div>
            <div style="font-size: 1.8em; font-weight: bold; color: #3b82f6;">6</div>
            <div style="font-size: 0.9em; color: #666; margin-top: 5px;">24% del total</div>
          </div>
          
          <!-- Defectos mecánicos -->
          <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.05); border-left: 4px solid #8b5cf6;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #8b5cf6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">🔧</div>
              <div style="font-weight: bold; color: #555;">Defecto mecánico</div>
            </div>
            <div style="font-size: 1.8em; font-weight: bold; color: #8b5cf6;">19</div>
            <div style="font-size: 0.9em; color: #666; margin-top: 5px;">76% del total</div>
          </div>
          
          <!-- Tamaño muestra -->
          <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.05); border-left: 4px solid #f59e0b;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #f59e0b; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">📦</div>
              <div style="font-weight: bold; color: #555;">Tamaño muestra</div>
            </div>
            <div style="font-size: 1.8em; font-weight: bold; color: #f59e0b;">5</div>
            <div style="font-size: 0.9em; color: #666; margin-top: 5px;">Sin reemplazo</div>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 2px dashed #059669;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: bold; color: #555;">Notación de combinaciones:</div>
              <div style="font-size: 1.2em; font-family: 'Courier New', monospace; color: #059669;">
                C(n, k) = n! / [k!(n-k)!]
              </div>
            </div>
            <div style="font-size: 2em; color: #ddd;">🎯</div>
            <div>
              <div style="font-weight: bold; color: #555;">Selección:</div>
              <div style="font-size: 1.2em; color: #3b82f6; font-weight: bold;">
                Sin orden, sin reemplazo
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- EJERCICIOS INTERACTIVOS -->
      <h3 style="color: #333; border-bottom: 2px solid #059669; padding-bottom: 10px;">📝 Ejercicios de cálculo</h3>
      <p style="color: #666; margin-bottom: 20px;">Resuelve los siguientes problemas usando combinatoria y probabilidad.</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; margin-bottom: 30px;">
        
        <!-- Ejercicio 1 -->
        <div id="${id}_card1" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #059669;">1️⃣ Total de muestras posibles</h4>
            <div style="background: #f0fdf4; color: #059669; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Combinaciones
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Número de maneras de seleccionar 5 teclados de 25 (sin orden):
          </p>
          <div style="
            background: #f0fdf4;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
            font-size: 1.1em;
          ">
            C(25, 5) = <span id="${id}_calc1" style="font-weight: bold; color: #059669; min-width: 80px; display: inline-block;">______</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta:</label>
            <input id="${id}_r1" type="number" step="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Escribe tu respuesta aquí">
          </div>
        </div>
        
        <!-- Ejercicio 2 -->
        <div id="${id}_card2" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #059669;">2️⃣ Exactamente 2 eléctricos</h4>
            <div style="background: #eff6ff; color: #3b82f6; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Producto de combinaciones
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            2 eléctricos de 6 y 3 mecánicos de 19:
          </p>
          <div style="
            background: #eff6ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
            font-size: 1.1em;
          ">
            C(6, 2) × C(19, 3) = <span id="${id}_calc2" style="font-weight: bold; color: #3b82f6; min-width: 80px; display: inline-block;">______</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta:</label>
            <input id="${id}_r2" type="number" step="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Escribe tu respuesta aquí">
          </div>
        </div>
        
        <!-- Ejercicio 3 -->
        <div id="${id}_card3" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          grid-column: span 2;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #059669;">3️⃣ Probabilidad: al menos 4 mecánicos</h4>
            <div style="background: #f5f3ff; color: #8b5cf6; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Suma de probabilidades
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p style="margin: 0 0 15px; color: #555;">
                Casos posibles:
              </p>
              <div style="
                background: #f5f3ff;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
              ">
                <div style="margin-bottom: 10px;">
                  <div style="font-weight: bold; color: #555; margin-bottom: 5px;">Caso A: 4 mecánicos</div>
                  <div style="font-family: 'Courier New', monospace; font-size: 0.95em;">
                    C(19, 4) × C(6, 1) = <span id="${id}_calc3a" style="font-weight: bold; color: #8b5cf6;">______</span>
                  </div>
                </div>
                <div>
                  <div style="font-weight: bold; color: #555; margin-bottom: 5px;">Caso B: 5 mecánicos</div>
                  <div style="font-family: 'Courier New', monospace; font-size: 0.95em;">
                    C(19, 5) × C(6, 0) = <span id="${id}_calc3b" style="font-weight: bold; color: #8b5cf6;">______</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <p style="margin: 0 0 15px; color: #555;">
                Cálculo de probabilidad:
              </p>
              <div style="
                background: #fef3c7;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                font-family: 'Courier New', monospace;
                font-size: 1.1em;
                text-align: center;
              ">
                P = (A + B) / Total = <span id="${id}_calc3" style="font-weight: bold; color: #d97706; min-width: 80px; display: inline-block;">______</span>
              </div>
            </div>
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta (probabilidad 0-1):</label>
            <input id="${id}_r3" type="number" step="0.0001" min="0" max="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 0.85 (sin comas)">
          </div>
        </div>
        
        <!-- Visualización de distribución -->
        <div id="${id}_card4" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          grid-column: span 2;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #059669;">📊 Distribución de teclados mecánicos</h4>
            <div style="background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Después de verificar
            </div>
          </div>
          
          <div style="
            background: #faf5ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          ">
            <div id="${id}_tablaDist" style="margin: 20px 0;">
              <div style="text-align: center; color: #666; font-style: italic;">
                Verifica tus respuestas para ver la distribución completa
              </div>
            </div>
            
            <div style="margin-top: 20px;">
              <div style="font-weight: bold; margin-bottom: 10px; color: #555;">Proporción en gráfico:</div>
              <div style="
                background: #e0e0e0;
                border-radius: 10px;
                height: 30px;
                overflow: hidden;
                margin-bottom: 10px;
                display: flex;
              ">
                <div id="${id}_bar0" style="
                  background: linear-gradient(to right, #ef4444, #dc2626);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 0.8em;
                ">0</div>
                <div id="${id}_bar1" style="
                  background: linear-gradient(to right, #f97316, #ea580c);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 0.8em;
                ">1</div>
                <div id="${id}_bar2" style="
                  background: linear-gradient(to right, #f59e0b, #d97706);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 0.8em;
                ">2</div>
                <div id="${id}_bar3" style="
                  background: linear-gradient(to right, #10b981, #059669);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 0.8em;
                ">3</div>
                <div id="${id}_bar4" style="
                  background: linear-gradient(to right, #0ea5e9, #0284c7);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 0.8em;
                ">4</div>
                <div id="${id}_bar5" style="
                  background: linear-gradient(to right, #8b5cf6, #7c3aed);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 0.8em;
                ">5</div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85em; color: #777; padding: 0 5px;">
                <div>0 mecánicos</div>
                <div>1 mecánico</div>
                <div>2 mecánicos</div>
                <div>3 mecánicos</div>
                <div>4 mecánicos</div>
                <div>5 mecánicos</div>
              </div>
            </div>
          </div>
          
          <div style="font-size: 0.9em; color: #666; background: #f8fafc; padding: 10px; border-radius: 6px;">
            <b>💡 Recordatorio:</b> "Al menos 4 mecánicos" incluye los casos con 4 y 5 teclados mecánicos.
          </div>
        </div>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div style="
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 30px;
        padding: 20px;
        background: #f0fdf4;
        border-radius: 10px;
      ">
        <button id="${id}_nuevo" style="
          background: white;
          color: #059669;
          border: 2px solid #059669;
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span>🔄</span> Limpiar todo
        </button>
        
        <button id="${id}_verificar" style="
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          border: none;
          padding: 14px 40px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span>✅</span> Verificar respuestas
        </button>
        
        <button id="${id}_mostrarSoluciones" style="
          background: white;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          display: none;
        ">
          <span>👁️</span> Mostrar soluciones
        </button>
      </div>

      <!-- RESULTADOS -->
      <div id="${id}_res" style="
        margin-top: 30px;
        padding: 25px;
        background: #f0fdf4;
        border-radius: 10px;
        display: none;
      ">
        <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
          <span>📊</span> Resultados de tu evaluación
        </h3>
        <div id="${id}_resultadosDetalle" style="margin: 20px 0;"></div>
        
        <!-- SOLUCIONES (ocultas inicialmente) -->
        <div id="${id}_soluciones" style="
          margin-top: 30px;
          padding: 20px;
          background: #eff6ff;
          border-radius: 10px;
          border: 2px solid #3b82f6;
          display: none;
        ">
          <h4 style="margin-top: 0; color: #1d4ed8; display: flex; align-items: center; gap: 10px;">
            <span>📚</span> Soluciones detalladas
          </h4>
          
          <div style="margin: 15px 0;">
            <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
              <h5 style="margin: 0 0 10px 0; color: #059669;">1. Total de muestras posibles:</h5>
              <div style="font-family: 'Courier New', monospace; font-size: 1.1em; color: #555;">
                C(25, 5) = 25! / (5! × 20!) = <span id="${id}_sol1" style="font-weight: bold; color: #059669;">______</span>
              </div>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
              <h5 style="margin: 0 0 10px 0; color: #3b82f6;">2. Exactamente 2 eléctricos:</h5>
              <div style="font-family: 'Courier New', monospace; font-size: 1.1em; color: #555;">
                C(6, 2) × C(19, 3) = [6!/(2!×4!)] × [19!/(3!×16!)] = <span id="${id}_sol2" style="font-weight: bold; color: #3b82f6;">______</span>
              </div>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 15px;">
              <h5 style="margin: 0 0 10px 0; color: #8b5cf6;">3. Probabilidad al menos 4 mecánicos:</h5>
              <div style="font-family: 'Courier New', monospace; font-size: 1.1em; color: #555;">
                Caso A (4 mecánicos, 1 eléctrico): C(19,4)×C(6,1) = <span id="${id}_sol3a" style="font-weight: bold;">______</span><br>
                Caso B (5 mecánicos, 0 eléctricos): C(19,5)×C(6,0) = <span id="${id}_sol3b" style="font-weight: bold;">______</span><br>
                Total casos favorables: A + B = <span id="${id}_sol3total" style="font-weight: bold;">______</span><br>
                Probabilidad: (A + B) / Total = <span id="${id}_sol3" style="font-weight: bold; color: #8b5cf6;">______</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- PANEL DE DISTRIBUCIÓN -->
        <div id="${id}_panelInfo" style="display: none; margin-top: 30px;">
          <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <h5 style="margin-top: 0; color: #555; margin-bottom: 15px;">📈 Distribución completa</h5>
            <div id="${id}_distribucionCompleta">
              <!-- Aquí se cargará la tabla de distribución -->
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<script>
(function(){
  // Función para mostrar/ocultar el simulador
  var btn = document.getElementById("${id}_btn");
  var container = document.getElementById("${id}_container");
  
  window['toggleSim_${id}'] = function() {
    if (!container) return;
    var isHidden = (container.style.display === 'none' || container.style.display === '');
    if (isHidden) {
      container.style.display = 'block';
      if (btn) {
        btn.textContent = '❌ Ocultar ${simName}';
        btn.style.background = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
      }
    } else {
      container.style.display = 'none';
      if (btn) {
        btn.textContent = '⌨️ Abrir ${simName}';
        btn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
      }
    }
  };

  var root = document.getElementById("${id}");
  if (!root) return;

  var btnNuevo = root.querySelector("#${id}_nuevo");
  var btnVerificar = root.querySelector("#${id}_verificar");
  var btnMostrarSoluciones = root.querySelector("#${id}_mostrarSoluciones");
  var divRes = root.querySelector("#${id}_res");
  var resultadosDetalle = root.querySelector("#${id}_resultadosDetalle");
  var divSoluciones = root.querySelector("#${id}_soluciones");

  var r1 = root.querySelector("#${id}_r1");
  var r2 = root.querySelector("#${id}_r2");
  var r3 = root.querySelector("#${id}_r3");

  var panelInfo = root.querySelector("#${id}_panelInfo");
  var tablaDist = root.querySelector("#${id}_tablaDist");
  var distribucionCompleta = root.querySelector("#${id}_distribucionCompleta");
  
  // Elementos visuales
  var calc1 = root.querySelector("#${id}_calc1");
  var calc2 = root.querySelector("#${id}_calc2");
  var calc3 = root.querySelector("#${id}_calc3");
  var calc3a = root.querySelector("#${id}_calc3a");
  var calc3b = root.querySelector("#${id}_calc3b");
  
  // Barras de distribución
  var bars = [];
  for (var i = 0; i <= 5; i++) {
    bars.push(root.querySelector("#${id}_bar" + i));
  }
  
  // Elementos de soluciones
  var sol1 = root.querySelector("#${id}_sol1");
  var sol2 = root.querySelector("#${id}_sol2");
  var sol3 = root.querySelector("#${id}_sol3");
  var sol3a = root.querySelector("#${id}_sol3a");
  var sol3b = root.querySelector("#${id}_sol3b");
  var sol3total = root.querySelector("#${id}_sol3total");
  
  // Tarjetas para efectos
  var cards = [];
  for (var i = 1; i <= 4; i++) {
    cards.push(root.querySelector("#${id}_card" + i));
  }

  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    if (k > n - k) k = n - k;
    var res = 1;
    for (var i = 1; i <= k; i++) {
      res = res * (n - k + i) / i;
    }
    return Math.round(res);
  }

  function calcularCorrectos() {
    var total = comb(25, 5);
    var formas2Elec = comb(6, 2) * comb(19, 3);
    var formas4Mec1Elec = comb(19, 4) * comb(6, 1);
    var formas5Mec = comb(19, 5);
    var formasAlMenos4Mec = formas4Mec1Elec + formas5Mec;
    var pAlMenos4Mec = formasAlMenos4Mec / total;

    return {
      total: total,
      formas2Elec: formas2Elec,
      formas4Mec1Elec: formas4Mec1Elec,
      formas5Mec: formas5Mec,
      formasAlMenos4Mec: formasAlMenos4Mec,
      pAlMenos4Mec: pAlMenos4Mec
    };
  }

  function limpiar() {
    r1.value = "";
    r2.value = "";
    r3.value = "";
    
    // Restablecer tarjetas
    cards.forEach(function(card) {
      if (card) {
        card.style.borderColor = "#e0e0e0";
        card.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
      }
    });
    
    // Ocultar resultados
    divRes.style.display = "none";
    panelInfo.style.display = "none";
    divSoluciones.style.display = "none";
    btnMostrarSoluciones.style.display = "none";
    
    // Restablecer placeholders
    calc1.textContent = "______";
    calc2.textContent = "______";
    calc3.textContent = "______";
    calc3a.textContent = "______";
    calc3b.textContent = "______";
    
    // Restablecer barras
    bars.forEach(function(bar) {
      if (bar) {
        bar.style.width = "0%";
        bar.innerHTML = bar.textContent.trim();
      }
    });
    
    // Restablecer tabla de distribución
    if (tablaDist) {
      tablaDist.innerHTML = '<div style="text-align: center; color: #666; font-style: italic;">Verifica tus respuestas para ver la distribución completa</div>';
    }
    
    resultadosDetalle.innerHTML = '<p style="color: #777;">Escribe tus respuestas y luego pulsa "Verificar respuestas".</p>';
  }

  function checkEntero(input, correcto, card) {
    var txt = input.value.trim();
    if (txt === "") return { ok: false, vacio: true, correcto: correcto };
    var val = parseInt(txt, 10);
    if (isNaN(val)) return { ok: false, vacio: false, formato: true, correcto: correcto };
    var ok = (val === correcto);
    
    // Efecto visual en la tarjeta
    if (card) {
      if (ok) {
        card.style.borderColor = "#10b981";
        card.style.boxShadow = "0 5px 15px rgba(16, 185, 129, 0.2)";
      } else {
        card.style.borderColor = "#dc2626";
        card.style.boxShadow = "0 5px 15px rgba(220, 38, 38, 0.2)";
      }
    }
    
    return { ok: ok, vacio: false, formato: false, correcto: correcto, usuario: val };
  }

  function checkProb(input, correcto, card) {
    var txt = input.value.trim();
    if (txt === "") return { ok: false, vacio: true, correcto: correcto };
    var val = parseFloat(txt);
    if (isNaN(val)) return { ok: false, vacio: false, formato: true, correcto: correcto };
    var ok = Math.abs(val - correcto) <= 0.0001;
    
    // Efecto visual en la tarjeta
    if (card && card.style) {
      if (ok) {
        card.style.borderColor = "#10b981";
        card.style.boxShadow = "0 5px 15px rgba(16, 185, 129, 0.2)";
      } else {
        card.style.borderColor = "#dc2626";
        card.style.boxShadow = "0 5px 15px rgba(220, 38, 38, 0.2)";
      }
    }
    
    return { ok: ok, vacio: false, formato: false, correcto: correcto, usuario: val };
  }

  function construirDistribucion(total) {
    var html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: #f5f3ff;">' +
              '<th style="padding: 10px; text-align: left; border-bottom: 2px solid #8b5cf6;"># Mecánicos</th>' +
              '<th style="padding: 10px; text-align: left; border-bottom: 2px solid #8b5cf6;"># Eléctricos</th>' +
              '<th style="padding: 10px; text-align: right; border-bottom: 2px solid #8b5cf6;">Formas posibles</th>' +
              '<th style="padding: 10px; text-align: right; border-bottom: 2px solid #8b5cf6;">Probabilidad</th>' +
            '</tr></thead><tbody>';
    
    var maxProb = 0;
    var distribuciones = [];
    
    for (var m = 0; m <= 5; m++) {
      var e = 5 - m;
      if (m > 19 || e > 6) continue;
      var formas = comb(19, m) * comb(6, e);
      var prob = formas / total;
      distribuciones.push({ m: m, e: e, formas: formas, prob: prob });
      if (prob > maxProb) maxProb = prob;
    }
    
    // Ordenar de mayor a menor probabilidad
    distribuciones.sort(function(a, b) { return b.prob - a.prob; });
    
    distribuciones.forEach(function(d) {
      var color;
      if (d.m === 5) color = "#8b5cf6";
      else if (d.m === 4) color = "#0ea5e9";
      else if (d.m === 3) color = "#10b981";
      else if (d.m === 2) color = "#f59e0b";
      else if (d.m === 1) color = "#f97316";
      else color = "#ef4444";
      
      var anchoBarra = maxProb > 0 ? (d.prob / maxProb * 100) : 0;
      
      html += '<tr style="border-bottom: 1px solid #f0f0f0;">' +
                '<td style="padding: 10px;"><span style="font-weight: bold; color: ' + color + ';">' + d.m + '</span></td>' +
                '<td style="padding: 10px;">' + d.e + '</td>' +
                '<td style="padding: 10px; text-align: right; font-family: monospace;">' + d.formas.toLocaleString() + '</td>' +
                '<td style="padding: 10px; text-align: right; font-family: monospace;">' + d.prob.toFixed(4) + '</td>' +
              '</tr>';
    });
    
    html += '</tbody></table>';
    return { html: html, distribuciones: distribuciones };
  }

  function actualizarPanelVisual(c) {
    // Actualizar fórmulas en las tarjetas (solo después de verificar)
    calc1.textContent = c.total.toLocaleString();
    calc2.textContent = c.formas2Elec.toLocaleString();
    calc3a.textContent = c.formas4Mec1Elec.toLocaleString();
    calc3b.textContent = c.formas5Mec.toLocaleString();
    calc3.textContent = c.pAlMenos4Mec.toFixed(4);
    
    // Mostrar panel de resultados
    panelInfo.style.display = "block";
    btnMostrarSoluciones.style.display = "flex";
    
    // Construir y mostrar distribución
    var distribucion = construirDistribucion(c.total);
    if (tablaDist) {
      tablaDist.innerHTML = distribucion.html;
    }
    
    // Animar barras de distribución
    setTimeout(function() {
      var maxProb = 0;
      distribucion.distribuciones.forEach(function(d) {
        if (d.prob > maxProb) maxProb = d.prob;
      });
      
      distribucion.distribuciones.forEach(function(d) {
        var bar = bars[d.m];
        if (bar) {
          var width = maxProb > 0 ? (d.prob / maxProb * 100) : 0;
          bar.style.width = width.toFixed(1) + '%';
          bar.innerHTML = d.m + ' (' + (d.prob * 100).toFixed(1) + '%)';
        }
      });
    }, 500);
    
    // Actualizar soluciones
    sol1.textContent = c.total.toLocaleString();
    sol2.textContent = c.formas2Elec.toLocaleString();
    sol3a.textContent = c.formas4Mec1Elec.toLocaleString();
    sol3b.textContent = c.formas5Mec.toLocaleString();
    sol3total.textContent = c.formasAlMenos4Mec.toLocaleString();
    sol3.textContent = c.pAlMenos4Mec.toFixed(4);
  }

  function verificar() {
    var c = calcularCorrectos();

    var c1 = checkEntero(r1, c.total, cards[0]);
    var c2 = checkEntero(r2, c.formas2Elec, cards[1]);
    var c3 = checkProb(r3, c.pAlMenos4Mec, cards[2]);

    var lista = [c1, c2, c3];
    var aciertos = 0;
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].ok) aciertos++;
    }

    function linea(num, txt, c, esProb) {
      var icon = c.ok ? "✅" : "❌";
      var color = c.ok ? "#10b981" : "#dc2626";
      var detalle = "";
      
      if (c.vacio) {
        if (esProb) {
          detalle = '<span style="color: #777;"> (sin respuesta; valor correcto ≈ ' + c.correcto.toFixed(4) + ')</span>';
        } else {
          detalle = '<span style="color: #777;"> (sin respuesta; valor correcto: ' + c.correcto.toLocaleString() + ')</span>';
        }
      } else if (c.formato) {
        detalle = '<span style="color: #dc2626;"> (formato no válido)';
        if (esProb) {
          detalle += ' - usa un número decimal; correcto ≈ ' + c.correcto.toFixed(4) + '</span>';
        } else {
          detalle += ' - usa un entero; correcto: ' + c.correcto.toLocaleString() + '</span>';
        }
      } else if (!c.ok) {
        if (esProb) {
          detalle = '<span style="color: #dc2626;"> (tu respuesta: ' + c.usuario.toFixed(4) +
                    '; correcto ≈ ' + c.correcto.toFixed(4) + ')</span>';
        } else {
          detalle = '<span style="color: #dc2626;"> (tu respuesta: ' + c.usuario.toLocaleString() +
                    '; correcto: ' + c.correcto.toLocaleString() + ')</span>';
        }
      } else {
        if (esProb) {
          detalle = '<span style="color: #10b981;"> (correcto ≈ ' + c.correcto.toFixed(4) + ')</span>';
        } else {
          detalle = '<span style="color: #10b981;"> (correcto: ' + c.correcto.toLocaleString() + ')</span>';
        }
      }
      
      return '<div style="padding: 10px; background: ' + (c.ok ? '#f0fff4' : '#fff5f5') + '; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid ' + color + ';">' +
             '<b>' + num + ') ' + txt + '</b> ' + icon + detalle + '</div>';
    }

    var html = "";
    html += linea("1", "Número total de maneras de seleccionar 5 teclados de 25", c1, false);
    html += linea("2", "Número de maneras con exactamente 2 defectos eléctricos", c2, false);
    html += linea("3", "Probabilidad de que al menos 4 teclados sean mecánicos", c3, true);

    // Añadir resumen de aciertos
    var porcentaje = Math.round((aciertos / 3) * 100);
    var colorAciertos = porcentaje >= 90 ? "#10b981" : porcentaje >= 70 ? "#f59e0b" : "#dc2626";
    
    html += '<div style="margin-top: 20px; padding: 20px; background: white; border-radius: 10px; text-align: center; border: 2px solid ' + colorAciertos + ';">' +
            '<h3 style="margin: 0; color: ' + colorAciertos + ';">🎯 Resultado final: ' + aciertos + ' de 3</h3>' +
            '<div style="margin-top: 10px;">' +
            '<div style="background: #f0f0f0; border-radius: 10px; height: 20px; overflow: hidden; margin: 10px 0;">' +
            '<div style="background: ' + colorAciertos + '; height: 100%; width: ' + porcentaje + '%; transition: width 1s ease;"></div>' +
            '</div>' +
            '<div style="font-size: 1.2em; font-weight: bold; color: ' + colorAciertos + ';">' + porcentaje + '% correcto</div>' +
            '</div>' +
            '</div>';

    resultadosDetalle.innerHTML = html;
    divRes.style.display = "block";
    
    // Desplazarse suavemente a los resultados
    divRes.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    actualizarPanelVisual(c);
  }

  // Añadir efectos a las tarjetas al pasar el ratón
  cards.forEach(function(card, index) {
    if (card) {
      card.addEventListener('mouseenter', function() {
        if (this.style.borderColor === "#e0e0e0" || this.style.borderColor === "") {
          this.style.transform = "translateY(-5px)";
          this.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
        }
      });
      
      card.addEventListener('mouseleave', function() {
        if (this.style.borderColor === "#e0e0e0" || this.style.borderColor === "") {
          this.style.transform = "translateY(0)";
          this.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
        }
      });
    }
  });

  // Añadir efectos a los inputs
  var inputs = [r1, r2, r3];
  inputs.forEach(function(input) {
    if (input) {
      input.addEventListener('focus', function() {
        this.style.borderColor = "#059669";
        this.style.boxShadow = "0 0 0 3px rgba(5, 150, 105, 0.1)";
      });
      
      input.addEventListener('blur', function() {
        this.style.borderColor = "#ddd";
        this.style.boxShadow = "none";
      });
    }
  });

  // Botón para mostrar soluciones
  btnMostrarSoluciones.addEventListener("click", function() {
    divSoluciones.style.display = divSoluciones.style.display === "none" ? "block" : "none";
    this.innerHTML = divSoluciones.style.display === "none" ? 
      '<span>👁️</span> Mostrar soluciones' : 
      '<span>👁️</span> Ocultar soluciones';
  });

  btnNuevo.addEventListener("click", limpiar);
  btnVerificar.addEventListener("click", verificar);

  // Inicializar
  limpiar();

})();
</script>
    `;
  }
};