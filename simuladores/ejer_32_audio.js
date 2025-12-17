// Ejer_32_audio_mejorado.js
// Ejercicio interactivo — Sistema de audio (técnicas de conteo)
// Versión mejorada con interfaz visual moderna y explicaciones detalladas

export default {
  render: (_params, simName = "🎵 Configurador de Sistema de Audio") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div>
  <button id="${id}_btn" class="btn-sim" onclick="toggleSim_${id}()" style="
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(139, 92, 246, 0.2);
    transition: all 0.3s ease;
  ">
    🔊 Abrir ${simName}
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
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      color: white;
      padding: 20px;
      text-align: center;
    ">
      <h2 style="margin: 0; font-size: 1.8em;">🎵 Configurador de Sistema de Audio</h2>
      <p style="margin: 10px 0 0; opacity: 0.9;">
        Calcula combinaciones y probabilidades en sistemas de audio con componentes Sony
      </p>
    </div>

    <div id="${id}" style="padding: 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px;">

      <!-- VISUALIZACIÓN DE COMPONENTES -->
      <div style="
        background: linear-gradient(to right, #faf5ff, #f0f9ff);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 25px;
        position: relative;
        overflow: hidden;
      ">
        <div style="position: absolute; right: -20px; top: -20px; font-size: 5em; opacity: 0.1;">🎵</div>
        <h3 style="margin-top: 0; color: #333;">🔊 Componentes Disponibles</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 20px;">
          <!-- Receptor -->
          <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.05); border-left: 4px solid #8b5cf6;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #8b5cf6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">1</div>
              <div style="font-weight: bold; color: #555;">Receptor</div>
            </div>
            <div style="font-size: 1.3em; font-weight: bold; color: #8b5cf6; margin-bottom: 8px;">5 opciones</div>
            <div style="font-size: 0.9em; color: #666;">
              <span style="color: #dc2626; font-weight: bold;">Sony</span>, Kenwood, Onkyo, Pioneer, Sherwood
            </div>
          </div>
          
          <!-- Reproductor de CD -->
          <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.05); border-left: 4px solid #6366f1;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #6366f1; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">2</div>
              <div style="font-weight: bold; color: #555;">Reproductor CD</div>
            </div>
            <div style="font-size: 1.3em; font-weight: bold; color: #6366f1; margin-bottom: 8px;">4 opciones</div>
            <div style="font-size: 0.9em; color: #666;">
              <span style="color: #dc2626; font-weight: bold;">Sony</span>, Onkyo, Pioneer, Technics
            </div>
          </div>
          
          <!-- Bocinas -->
          <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.05); border-left: 4px solid #10b981;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">3</div>
              <div style="font-weight: bold; color: #555;">Bocinas</div>
            </div>
            <div style="font-size: 1.3em; font-weight: bold; color: #10b981; margin-bottom: 8px;">3 opciones</div>
            <div style="font-size: 0.9em; color: #666;">
              Boston, Infinity, Polk
            </div>
          </div>
          
          <!-- Tornamesa -->
          <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.05); border-left: 4px solid #f59e0b;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #f59e0b; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">4</div>
              <div style="font-weight: bold; color: #555;">Tornamesa</div>
            </div>
            <div style="font-size: 1.3em; font-weight: bold; color: #f59e0b; margin-bottom: 8px;">4 opciones</div>
            <div style="font-size: 0.9em; color: #666;">
              <span style="color: #dc2626; font-weight: bold;">Sony</span>, Onkyo, Teac, Technics
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 2px dashed #8b5cf6;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: bold; color: #555;">Total de sistemas posibles:</div>
              <div style="font-size: 1.5em; font-weight: bold; color: #8b5cf6;">5 × 4 × 3 × 4 = <span id="${id}_totalFormula">?</span></div>
            </div>
            <div style="font-size: 2em; color: #ddd;">🎯</div>
            <div>
              <div style="font-weight: bold; color: #555;">Marca Sony disponible en:</div>
              <div style="font-size: 1.2em; color: #dc2626; font-weight: bold;">Receptor, CD, Tornamesa</div>
            </div>
          </div>
        </div>
      </div>

      <!-- EJERCICIOS INTERACTIVOS -->
      <h3 style="color: #333; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">📝 Ejercicios de cálculo</h3>
      <p style="color: #666; margin-bottom: 20px;">Resuelve los siguientes problemas usando técnicas de conteo y probabilidad.</p>
      
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
            <h4 style="margin: 0; color: #8b5cf6;">1️⃣ Total de sistemas posibles</h4>
            <div style="background: #f5f3ff; color: #8b5cf6; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Sin restricciones
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Multiplica las opciones de cada componente:
          </p>
          <div style="
            background: #faf5ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
            font-size: 1.1em;
          ">
            5 × 4 × 3 × 4 = <span id="${id}_calc1" style="font-weight: bold; color: #8b5cf6;">?</span>
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
            " placeholder="Ej: 240">
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
            <h4 style="margin: 0; color: #8b5cf6;">2️⃣ Receptor y CD Sony</h4>
            <div style="background: #fee2e2; color: #dc2626; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Sony en ambos
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Solo 1 opción Sony para receptor y CD:
          </p>
          <div style="
            background: #fef2f2;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
            font-size: 1.1em;
          ">
            1 × 1 × 3 × 4 = <span id="${id}_calc2" style="font-weight: bold; color: #dc2626;">?</span>
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
            " placeholder="Ej: 12">
          </div>
        </div>
        
        <!-- Ejercicio 3 -->
        <div id="${id}_card3" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #8b5cf6;">3️⃣ Sin componentes Sony</h4>
            <div style="background: #f0f9ff; color: #0ea5e9; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Sony en ninguno
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Evitar Sony en receptor, CD y tornamesa:
          </p>
          <div style="
            background: #f0f9ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
            font-size: 1.1em;
          ">
            4 × 3 × 3 × 3 = <span id="${id}_calc3" style="font-weight: bold; color: #0ea5e9;">?</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta:</label>
            <input id="${id}_r3" type="number" step="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 108">
          </div>
        </div>
        
        <!-- Ejercicio 4 -->
        <div id="${id}_card4" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #8b5cf6;">4️⃣ Probabilidad: al menos un Sony</h4>
            <div style="background: #fef3c7; color: #d97706; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Complemento
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Usa el complemento: P(al menos uno) = 1 - P(ninguno)
          </p>
          <div style="
            background: #fef3c7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
            font-size: 1.1em;
          ">
            1 - (sinSony / total) = <span id="${id}_calc4" style="font-weight: bold; color: #d97706;">?</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta (0 a 1):</label>
            <input id="${id}_r4" type="number" step="0.0001" min="0" max="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 0.55">
          </div>
        </div>
        
        <!-- Ejercicio 5 -->
        <div id="${id}_card5" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #8b5cf6;">5️⃣ Probabilidad: exactamente un Sony</h4>
            <div style="background: #dcfce7; color: #059669; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Suma de casos
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Suma los 3 casos posibles: Sony solo en receptor, CD o tornamesa
          </p>
          <div style="
            background: #dcfce7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
            font-size: 1.1em;
          ">
            P(solo receptor) + P(solo CD) + P(solo tornamesa) = <span id="${id}_calc5" style="font-weight: bold; color: #059669;">?</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta (0 a 1):</label>
            <input id="${id}_r5" type="number" step="0.0001" min="0" max="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 0.4125">
          </div>
        </div>
        
        <!-- Visualización de casos Sony -->
        <div id="${id}_card6" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          grid-column: span 2;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #8b5cf6;">🔍 Visualización de casos Sony</h4>
            <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Distribución
            </div>
          </div>
          
          <div style="
            background: #faf5ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          ">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
              <div>
                <div style="font-weight: bold; color: #555;">Total de sistemas:</div>
                <div id="${id}_totalVis" style="font-size: 1.5em; font-weight: bold; color: #8b5cf6;">?</div>
              </div>
              <div style="font-size: 2em; color: #ddd;">➔</div>
              <div>
                <div style="font-weight: bold; color: #555;">Distribución Sony:</div>
                <div id="${id}_distSony" style="font-size: 1.2em; color: #dc2626; font-weight: bold;">?</div>
              </div>
            </div>
            
            <div style="margin-top: 20px;">
              <div style="font-weight: bold; margin-bottom: 10px; color: #555;">Proporción de sistemas:</div>
              <div style="
                background: #e0e0e0;
                border-radius: 10px;
                height: 30px;
                overflow: hidden;
                margin-bottom: 10px;
                display: flex;
              ">
                <div id="${id}_barSinSony" style="
                  background: linear-gradient(to right, #0ea5e9, #3b82f6);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 0.9em;
                ">Sin Sony</div>
                <div id="${id}_barUnSony" style="
                  background: linear-gradient(to right, #10b981, #059669);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 0.9em;
                ">1 Sony</div>
                <div id="${id}_barDosOMasSony" style="
                  background: linear-gradient(to right, #dc2626, #ef4444);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 0.9em;
                ">2+ Sony</div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: #777;">
                <div id="${id}_lblSinSony">0%</div>
                <div id="${id}_lblUnSony">0%</div>
                <div id="${id}_lblDosOMasSony">0%</div>
              </div>
            </div>
          </div>
          
          <div style="font-size: 0.9em; color: #666; background: #f8fafc; padding: 10px; border-radius: 6px;">
            <b>💡 Tip:</b> Para calcular "exactamente un Sony", suma los casos donde Sony aparece solo en receptor, solo en CD, o solo en tornamesa.
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
        background: #faf5ff;
        border-radius: 10px;
      ">
        <button id="${id}_nuevo" style="
          background: white;
          color: #8b5cf6;
          border: 2px solid #8b5cf6;
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span>🔄</span> Nuevo ejercicio
        </button>
        
        <button id="${id}_verificar" style="
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 14px 40px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span>✅</span> Verificar todas las respuestas
        </button>
      </div>

      <!-- RESULTADOS -->
      <div id="${id}_res" style="
        margin-top: 30px;
        padding: 25px;
        background: #faf5ff;
        border-radius: 10px;
        display: none;
      ">
        <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
          <span>📊</span> Resultados de tu evaluación
        </h3>
        <div id="${id}_resultadosDetalle" style="margin: 20px 0;"></div>
        
        <div style="margin-top: 30px;">
          <h4 style="color: #333; margin-bottom: 15px;">📈 Resumen detallado</h4>
          <div id="${id}_panelInfo" style="display: none;">
            <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
              <h5 style="margin-top: 0; color: #555;">Distribución de sistemas por presencia de Sony</h5>
              <table id="${id}_tablaResumen" style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f5f3ff;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #8b5cf6;">Categoría</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #8b5cf6;">Cantidad</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #8b5cf6;">Porcentaje</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #8b5cf6;">Fórmula</th>
                  </tr>
                </thead>
                <tbody id="${id}_tablaResumenBody">
                </tbody>
              </table>
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
        btn.textContent = '🔇 Ocultar ${simName}';
        btn.style.background = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
      }
    } else {
      container.style.display = 'none';
      if (btn) {
        btn.textContent = '🔊 Abrir ${simName}';
        btn.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)';
      }
    }
  };

  var root = document.getElementById("${id}");
  if (!root) return;

  var btnNuevo     = root.querySelector("#${id}_nuevo");
  var btnVerificar = root.querySelector("#${id}_verificar");
  var divRes       = root.querySelector("#${id}_res");
  var resultadosDetalle = root.querySelector("#${id}_resultadosDetalle");

  var r1 = root.querySelector("#${id}_r1");
  var r2 = root.querySelector("#${id}_r2");
  var r3 = root.querySelector("#${id}_r3");
  var r4 = root.querySelector("#${id}_r4");
  var r5 = root.querySelector("#${id}_r5");

  var panelInfo    = root.querySelector("#${id}_panelInfo");
  var tablaResumenBody = root.querySelector("#${id}_tablaResumenBody");
  
  // Elementos visuales
  var totalFormula = root.querySelector("#${id}_totalFormula");
  var calc1 = root.querySelector("#${id}_calc1");
  var calc2 = root.querySelector("#${id}_calc2");
  var calc3 = root.querySelector("#${id}_calc3");
  var calc4 = root.querySelector("#${id}_calc4");
  var calc5 = root.querySelector("#${id}_calc5");
  
  // Barras de visualización
  var barSinSony = root.querySelector("#${id}_barSinSony");
  var barUnSony = root.querySelector("#${id}_barUnSony");
  var barDosOMasSony = root.querySelector("#${id}_barDosOMasSony");
  var lblSinSony = root.querySelector("#${id}_lblSinSony");
  var lblUnSony = root.querySelector("#${id}_lblUnSony");
  var lblDosOMasSony = root.querySelector("#${id}_lblDosOMasSony");
  var totalVis = root.querySelector("#${id}_totalVis");
  var distSony = root.querySelector("#${id}_distSony");
  
  // Tarjetas para efectos
  var cards = [];
  for (var i = 1; i <= 6; i++) {
    cards.push(root.querySelector("#${id}_card" + i));
  }

  function calcularCorrectos() {
    var total = 5 * 4 * 3 * 4; // todos los sistemas

    // Receptor y CD Sony:
    // Receptor: 1 (Sony); CD: 1 (Sony); bocinas: 3; tornamesa: 4
    var rcSony = 1 * 1 * 3 * 4;

    // Ningún componente Sony:
    // Receptor: 4 no Sony; CD: 3 no Sony; bocinas: 3; tornamesa: 3 no Sony
    var sinSony = 4 * 3 * 3 * 3;

    // Al menos un Sony = total - sinSony
    var alMenosUno = total - sinSony;

    // Exactamente un Sony:
    // Caso 1: solo receptor es Sony
    var soloR = 1 * 3 * 3 * 3;
    // Caso 2: solo CD es Sony
    var soloC = 4 * 1 * 3 * 3;
    // Caso 3: solo tornamesa es Sony
    var soloT = 4 * 3 * 3 * 1;

    var exactUno = soloR + soloC + soloT;

    var masDeUno = alMenosUno - exactUno;

    var pAlMenosUno = alMenosUno / total;
    var pExactUno   = exactUno   / total;
    var pMasDeUno   = masDeUno   / total;

    return {
      total: total,
      rcSony: rcSony,
      sinSony: sinSony,
      alMenosUno: alMenosUno,
      exactUno: exactUno,
      masDeUno: masDeUno,
      c1: total,
      c2: rcSony,
      c3: sinSony,
      c4: pAlMenosUno,
      c5: pExactUno,
      pSinSony: sinSony / total,
      pMasDeUno: pMasDeUno
    };
  }

  function limpiar() {
    r1.value = "";
    r2.value = "";
    r3.value = "";
    r4.value = "";
    r5.value = "";
    
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
    
    // Restablecer fórmulas
    var c = calcularCorrectos();
    totalFormula.textContent = "?";
    calc1.textContent = "?";
    calc2.textContent = "?";
    calc3.textContent = "?";
    calc4.textContent = "?";
    calc5.textContent = "?";
    
    // Restablecer visualización
    totalVis.textContent = "?";
    distSony.textContent = "?";
    
    // Restablecer barras
    if (barSinSony && barUnSony && barDosOMasSony) {
      barSinSony.style.width = "0%";
      barUnSony.style.width = "0%";
      barDosOMasSony.style.width = "0%";
      barSinSony.innerHTML = "Sin Sony";
      barUnSony.innerHTML = "1 Sony";
      barDosOMasSony.innerHTML = "2+ Sony";
    }
    
    if (lblSinSony && lblUnSony && lblDosOMasSony) {
      lblSinSony.textContent = "0%";
      lblUnSony.textContent = "0%";
      lblDosOMasSony.textContent = "0%";
    }
    
    resultadosDetalle.innerHTML = '<p style="color: #777;">Escribe tus respuestas y luego pulsa "Verificar todas las respuestas".</p>';
  }

  function checkEntero(input, correcto, card) {
    var txt = input.value.trim();
    if (txt === "") return { ok:false, vacio:true, correcto:correcto };
    var val = parseInt(txt, 10);
    if (isNaN(val)) return { ok:false, vacio:false, formato:true, correcto:correcto };
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
    
    return { ok:ok, vacio:false, formato:false, correcto:correcto, usuario:val };
  }

  function checkProb(input, correcto, card) {
    var txt = input.value.trim();
    if (txt === "") return { ok:false, vacio:true, correcto:correcto };
    var val = parseFloat(txt);
    if (isNaN(val)) return { ok:false, vacio:false, formato:true, correcto:correcto };
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
    
    return { ok:ok, vacio:false, formato:false, correcto:correcto, usuario:val };
  }

  function actualizarPanelVisual(c) {
    if (!panelInfo) return;
    panelInfo.style.display = "block";

    // Actualizar fórmulas en los ejercicios
    totalFormula.textContent = c.total;
    calc1.textContent = c.total;
    calc2.textContent = c.rcSony;
    calc3.textContent = c.sinSony;
    calc4.textContent = c.c4.toFixed(4);
    calc5.textContent = c.c5.toFixed(4);
    
    // Actualizar visualización
    totalVis.textContent = c.total.toLocaleString();
    distSony.textContent = c.alMenosUno.toLocaleString() + " con Sony";
    
    // Actualizar barras de distribución
    if (barSinSony && barUnSony && barDosOMasSony) {
      var pSinSony = (c.sinSony / c.total) * 100;
      var pUnSony = (c.exactUno / c.total) * 100;
      var pDosOMasSony = (c.masDeUno / c.total) * 100;
      
      // Animar las barras
      setTimeout(function() {
        barSinSony.style.width = pSinSony.toFixed(1) + '%';
        barUnSony.style.width = pUnSony.toFixed(1) + '%';
        barDosOMasSony.style.width = pDosOMasSony.toFixed(1) + '%';
        
        // Actualizar texto dentro de las barras
        barSinSony.innerHTML = pSinSony.toFixed(1) + '%';
        barUnSony.innerHTML = pUnSony.toFixed(1) + '%';
        barDosOMasSony.innerHTML = pDosOMasSony.toFixed(1) + '%';
      }, 300);
      
      // Actualizar etiquetas
      if (lblSinSony && lblUnSony && lblDosOMasSony) {
        lblSinSony.textContent = pSinSony.toFixed(1) + '%';
        lblUnSony.textContent = pUnSony.toFixed(1) + '%';
        lblDosOMasSony.textContent = pDosOMasSony.toFixed(1) + '%';
      }
    }

    // Actualizar tabla de resultados
    if (tablaResumenBody) {
      function fila(nombre, cantidad, formula) {
        var p = (cantidad / c.total) * 100;
        return '<tr style="border-bottom: 1px solid #f0f0f0;">' +
          '<td style="padding: 12px;">' + nombre + '</td>' +
          '<td style="padding: 12px; text-align: right; font-weight: bold;">' + cantidad.toLocaleString() + '</td>' +
          '<td style="padding: 12px; text-align: right; color: #8b5cf6;">' + p.toFixed(2) + '%</td>' +
          '<td style="padding: 12px; text-align: right; font-family: monospace; font-size: 0.9em;">' + formula + '</td>' +
        '</tr>';
      }

      tablaResumenBody.innerHTML =
        fila("Total sistemas posibles", c.total, "5 × 4 × 3 × 4") +
        fila("Receptor y CD Sony", c.rcSony, "1 × 1 × 3 × 4") +
        fila("Sin ningún Sony", c.sinSony, "4 × 3 × 3 × 3") +
        fila("Al menos un Sony", c.alMenosUno, c.total + " - " + c.sinSony) +
        fila("Exactamente un Sony", c.exactUno, "(1×3×3×3) + (4×1×3×3) + (4×3×3×1)") +
        fila("Más de un Sony", c.masDeUno, c.alMenosUno + " - " + c.exactUno);
    }
  }

  function verificar() {
    var c = calcularCorrectos();

    var c1 = checkEntero(r1, c.c1, cards[0]);
    var c2 = checkEntero(r2, c.c2, cards[1]);
    var c3 = checkEntero(r3, c.c3, cards[2]);
    var c4 = checkProb(r4, c.c4, cards[3]);
    var c5 = checkProb(r5, c.c5, cards[4]);

    var lista = [c1,c2,c3,c4,c5];
    var aciertos = 0;
    for (var i=0; i<lista.length; i++) {
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
    html += linea("1", "Total de sistemas posibles (sin restricciones)", c1, false);
    html += linea("2", "Número de sistemas con receptor y CD Sony", c2, false);
    html += linea("3", "Número de sistemas sin ningún componente Sony", c3, false);
    html += linea("4", "Probabilidad de al menos un componente Sony", c4, true);
    html += linea("5", "Probabilidad de exactamente un componente Sony", c5, true);

    // Añadir resumen de aciertos
    var porcentaje = Math.round((aciertos / 5) * 100);
    var colorAciertos = porcentaje >= 80 ? "#10b981" : porcentaje >= 60 ? "#f59e0b" : "#dc2626";
    
    html += '<div style="margin-top: 20px; padding: 20px; background: white; border-radius: 10px; text-align: center; border: 2px solid ' + colorAciertos + ';">' +
            '<h3 style="margin: 0; color: ' + colorAciertos + ';">🎯 Resultado final: ' + aciertos + ' de 5</h3>' +
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
  var inputs = [r1, r2, r3, r4, r5];
  inputs.forEach(function(input) {
    if (input) {
      input.addEventListener('focus', function() {
        this.style.borderColor = "#8b5cf6";
        this.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
      });
      
      input.addEventListener('blur', function() {
        this.style.borderColor = "#ddd";
        this.style.boxShadow = "none";
      });
    }
  });

  btnNuevo.addEventListener("click", limpiar);
  btnVerificar.addEventListener("click", verificar);

  // Inicializar
  limpiar();

  // Añadir evento para mostrar fórmulas al hacer clic en Verificar sin respuestas
  btnVerificar.addEventListener("click", function() {
    // Si no hay respuestas, al menos mostrar las fórmulas correctas
    var todasVacias = inputs.every(function(input) {
      return input.value.trim() === "";
    });
    
    if (todasVacias) {
      var c = calcularCorrectos();
      actualizarPanelVisual(c);
    }
  });

})();
</script>
    `;
  }
};