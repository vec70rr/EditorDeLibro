// Ejer_29_dominios_mejorado.js
// Ejercicio interactivo — Nombres de dominio (técnicas de conteo)
// Versión mejorada con explicaciones visuales detalladas

export default {
  render: (_params, simName = "🌐 Generador de Nombres de Dominio") => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
<div>
  <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()" style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  ">
    🔓 Abrir ${simName}
  </button>

  <div id="${id_base}_container" class="simulador-box" style="
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      text-align: center;
    ">
      <h2 style="margin: 0; font-size: 1.8em;">🌐 Generador de Nombres de Dominio</h2>
      <p style="margin: 10px 0 0; opacity: 0.9;">
        Descubre cuántos nombres de dominio posibles existen usando técnicas de conteo
      </p>
    </div>

    <div id="${id_base}_root" style="padding: 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px;">

      <!-- EXPLICACIÓN VISUAL -->
      <div style="
        background: #f8f9ff;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 25px;
        border-left: 5px solid #667eea;
      ">
        <h3 style="margin-top: 0; color: #333;">📚 ¿Cómo se calculan los nombres de dominio?</h3>
        
        <div style="display: flex; flex-wrap: wrap; gap: 20px; margin: 15px 0;">
          <div style="flex: 1; min-width: 250px;">
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 3px 10px rgba(0,0,0,0.05);">
              <div style="font-size: 2em; color: #667eea; margin-bottom: 10px;">26</div>
              <div style="font-weight: bold; color: #555;">Letras del alfabeto</div>
              <div style="font-size: 0.9em; color: #777; margin-top: 5px;">a, b, c, ..., z</div>
            </div>
          </div>
          
          <div style="flex: 1; min-width: 250px;">
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 3px 10px rgba(0,0,0,0.05);">
              <div style="font-size: 2em; color: #764ba2; margin-bottom: 10px;">10</div>
              <div style="font-weight: bold; color: #555;">Dígitos numéricos</div>
              <div style="font-size: 0.9em; color: #777; margin-top: 5px;">0, 1, 2, ..., 9</div>
            </div>
          </div>
          
          <div style="flex: 1; min-width: 250px;">
            <div style="background: white; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 3px 10px rgba(0,0,0,0.05);">
              <div style="font-size: 2em; color: #f56565; margin-bottom: 10px;">36</div>
              <div style="font-weight: bold; color: #555;">Total de caracteres</div>
              <div style="font-size: 0.9em; color: #777; margin-top: 5px;">Letras + Dígitos</div>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px;">
          <p><b>📝 Fórmula principal:</b> Para calcular el total de combinaciones de longitud <b>n</b>:</p>
          <div style="
            background: white;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
            font-size: 1.2em;
            border: 2px dashed #667eea;
          ">
            <span style="color: #667eea;">(caracteres posibles)</span><sup style="color: #764ba2;">n</sup> = Total de combinaciones
          </div>
          <p><b>Ejemplo para longitud 2:</b> 36<sup>2</sup> = 36 × 36 = 1,296 combinaciones</p>
        </div>
      </div>

      <!-- DATOS IMPORTANTES -->
      <div style="
        background: linear-gradient(to right, #e3f2fd, #f3e5f5);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 25px;
        position: relative;
        overflow: hidden;
      ">
        <div style="position: absolute; right: -20px; top: -20px; font-size: 5em; opacity: 0.1;">💡</div>
        <h3 style="margin-top: 0; color: #333;">🎯 Datos clave del ejercicio</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
          <div style="background: rgba(255,255,255,0.9); border-radius: 8px; padding: 15px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #667eea; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">A</div>
              <div style="font-weight: bold; color: #555;">Letras</div>
            </div>
            <div style="font-size: 1.5em; font-weight: bold; color: #667eea;">26</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.9); border-radius: 8px; padding: 15px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #764ba2; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">1</div>
              <div style="font-weight: bold; color: #555;">Dígitos</div>
            </div>
            <div style="font-size: 1.5em; font-weight: bold; color: #764ba2;">10</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.9); border-radius: 8px; padding: 15px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #f56565; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">∑</div>
              <div style="font-weight: bold; color: #555;">Total caracteres</div>
            </div>
            <div style="font-size: 1.5em; font-weight: bold; color: #f56565;">36</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.9); border-radius: 8px; padding: 15px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="background: #48bb78; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">✓</div>
              <div style="font-weight: bold; color: #555;">Dominios libres (4 chars)</div>
            </div>
            <div style="font-size: 1.5em; font-weight: bold; color: #48bb78;">97,786</div>
          </div>
        </div>
      </div>

      <!-- EJERCICIOS INTERACTIVOS -->
      <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📝 Ejercicios de cálculo</h3>
      <p style="color: #666; margin-bottom: 20px;">Completa los siguientes cálculos. Usa la fórmula <b>(caracteres)<sup>longitud</sup></b> para cada caso.</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <!-- Ejercicio 1 -->
        <div id="${id_base}_card1" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #667eea;">1️⃣ Nombres de 2 letras</h4>
            <div style="background: #f0f4ff; color: #667eea; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Solo letras
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Usamos solo las 26 letras del alfabeto inglés en minúsculas.
          </p>
          <div style="
            background: #f8f9ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
          ">
            26<sup style="color: #764ba2;">2</sup> = 26 × 26 = <span id="${id_base}_formula1" style="font-weight: bold;">?</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta:</label>
            <input id="${id_base}_r1" type="number" step="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 676">
          </div>
        </div>
        
        <!-- Ejercicio 2 -->
        <div id="${id_base}_card2" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #667eea;">2️⃣ Nombres de 2 caracteres</h4>
            <div style="background: #f5f0ff; color: #764ba2; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Letras o dígitos
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Usamos las 26 letras + 10 dígitos = 36 caracteres posibles.
          </p>
          <div style="
            background: #f8f9ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
          ">
            36<sup style="color: #764ba2;">2</sup> = 36 × 36 = <span id="${id_base}_formula2" style="font-weight: bold;">?</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta:</label>
            <input id="${id_base}_r2" type="number" step="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 1296">
          </div>
        </div>
        
        <!-- Ejercicio 3 -->
        <div id="${id_base}_card3" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #667eea;">3️⃣ Nombres de 3 letras</h4>
            <div style="background: #f0f4ff; color: #667eea; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Solo letras
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Para 3 posiciones, cada una puede ser cualquiera de las 26 letras.
          </p>
          <div style="
            background: #f8f9ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
          ">
            26<sup style="color: #764ba2;">3</sup> = 26 × 26 × 26 = <span id="${id_base}_formula3" style="font-weight: bold;">?</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta:</label>
            <input id="${id_base}_r3" type="number" step="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 17576">
          </div>
        </div>
        
        <!-- Ejercicio 4 -->
        <div id="${id_base}_card4" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #667eea;">4️⃣ Nombres de 3 caracteres</h4>
            <div style="background: #f5f0ff; color: #764ba2; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Letras o dígitos
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            36 caracteres posibles para cada una de las 3 posiciones.
          </p>
          <div style="
            background: #f8f9ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
          ">
            36<sup style="color: #764ba2;">3</sup> = 36 × 36 × 36 = <span id="${id_base}_formula4" style="font-weight: bold;">?</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta:</label>
            <input id="${id_base}_r4" type="number" step="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 46656">
          </div>
        </div>
        
        <!-- Ejercicio 5 -->
        <div id="${id_base}_card5" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #667eea;">5️⃣ Nombres de 4 letras</h4>
            <div style="background: #f0f4ff; color: #667eea; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Solo letras
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            4 posiciones, cada una con 26 opciones posibles.
          </p>
          <div style="
            background: #f8f9ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
          ">
            26<sup style="color: #764ba2;">4</sup> = 26 × 26 × 26 × 26 = <span id="${id_base}_formula5" style="font-weight: bold;">?</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta:</label>
            <input id="${id_base}_r5" type="number" step="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3sense ease;
            " placeholder="Ej: 456976">
          </div>
        </div>
        
        <!-- Ejercicio 6 -->
        <div id="${id_base}_card6" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #667eea;">6️⃣ Nombres de 4 caracteres</h4>
            <div style="background: #f5f0ff; color: #764ba2; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Letras o dígitos
            </div>
          </div>
          <p style="margin: 0 0 15px; color: #555;">
            Todas las combinaciones posibles con 36 caracteres en 4 posiciones.
          </p>
          <div style="
            background: #f8f9ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
          ">
            36<sup style="color: #764ba2;">4</sup> = 36 × 36 × 36 × 36 = <span id="${id_base}_formula6" style="font-weight: bold;">?</span>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta:</label>
            <input id="${id_base}_r6" type="number" step="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 1679616">
          </div>
        </div>
        
        <!-- Ejercicio 7 - Probabilidad -->
        <div id="${id_base}_card7" style="
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border: 2px solid #e0e0e0;
          grid-column: span 2;
          transition: all 0.3s ease;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #667eea;">7️⃣ Probabilidad de que un dominio de 4 caracteres ya esté registrado</h4>
            <div style="background: #fff0f0; color: #f56565; padding: 5px 10px; border-radius: 20px; font-size: 0.9em;">
              Cálculo de probabilidad
            </div>
          </div>
          
          <div style="
            background: #f8f9ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          ">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
              <div>
                <div style="font-weight: bold; color: #555;">Total de dominios de 4 caracteres:</div>
                <div id="${id_base}_total4" style="font-size: 1.5em; font-weight: bold; color: #764ba2;">?</div>
              </div>
              <div style="font-size: 2em; color: #ddd;">➔</div>
              <div>
                <div style="font-weight: bold; color: #555;">Dominios ya registrados:</div>
                <div id="${id_base}_registrados" style="font-size: 1.5em; font-weight: bold; color: #f56565;">?</div>
              </div>
              <div style="font-size: 2em; color: #ddd;">➔</div>
              <div>
                <div style="font-weight: bold; color: #555;">Probabilidad:</div>
                <div id="${id_base}_probFormula" style="font-size: 1.5em; font-weight: bold; color: #667eea;">?</div>
              </div>
            </div>
            
            <div style="margin-top: 20px;">
              <div style="font-weight: bold; margin-bottom: 10px; color: #555;">Proporción visual:</div>
              <div style="
                background: #e0e0e0;
                border-radius: 10px;
                height: 20px;
                overflow: hidden;
                margin-bottom: 10px;
              ">
                <div id="${id_base}_barraRegistrados" style="
                  background: linear-gradient(to right, #f56565, #ed64a6);
                  height: 100%;
                  width: 0%;
                  transition: width 1s ease;
                "></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9em; color: #777;">
                <div>0%</div>
                <div>50%</div>
                <div>100%</div>
              </div>
            </div>
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Tu respuesta (probabilidad entre 0 y 1):</label>
            <input id="${id_base}_r7" type="number" step="0.0001" min="0" max="1" style="
              width: 100%;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 1.1em;
              transition: all 0.3s ease;
            " placeholder="Ej: 0.9418">
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
        background: #f8f9ff;
        border-radius: 10px;
      ">
        <button id="${id_base}_nuevo" style="
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
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
        
        <button id="${id_base}_verificar" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 40px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span>✅</span> Verificar todas las respuestas
        </button>
      </div>

      <!-- RESULTADOS -->
      <div id="${id_base}_res" style="
        margin-top: 30px;
        padding: 25px;
        background: #f8f9ff;
        border-radius: 10px;
        display: none;
      ">
        <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 10px;">
          <span>📊</span> Resultados de tu evaluación
        </h3>
        <div id="${id_base}_resultadosDetalle" style="margin: 20px 0;"></div>
        
        <div style="margin-top: 30px;">
          <h4 style="color: #333; margin-bottom: 15px;">📈 Resumen visual de resultados</h4>
          <div id="${id_base}_panelInfo" style="display: none;">
            <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
              <h5 style="margin-top: 0; color: #555;">Comparación por longitud</h5>
              <table id="${id_base}_tablaRes" style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f0f4ff;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #667eea;">Longitud</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #667eea;">Solo letras</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #667eea;">Letras o dígitos</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #667eea;">Diferencia</th>
                  </tr>
                </thead>
                <tbody id="${id_base}_tablaResBody">
                </tbody>
              </table>
            </div>
            
            <div style="background: white; border-radius: 10px; padding: 20px;">
              <h5 style="margin-top: 0; color: #555;">Dominios de 4 caracteres (letras o dígitos)</h5>
              <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <div style="font-weight: bold; color: #f56565;">Registrados: <span id="${id_base}_lblOcup"></span></div>
                  <div style="font-weight: bold; color: #48bb78;">Libres: <span id="${id_base}_lblLibre"></span></div>
                </div>
                <div style="
                  border-radius: 10px;
                  border: 1px solid #e0e0e0;
                  overflow: hidden;
                  width: 100%;
                  height: 30px;
                  display: flex;
                  margin-top: 4px;
                  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
                ">
                  <div id="${id_base}_barOcup" style="
                    height: 100%;
                    background: linear-gradient(to right, #f56565, #ed64a6);
                    width: 0%;
                    transition: width 1.5s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 0.9em;
                  "></div>
                  <div id="${id_base}_barLibre" style="
                    height: 100%;
                    background: linear-gradient(to right, #48bb78, #38a169);
                    width: 100%;
                    transition: width 1.5s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 0.9em;
                  "></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<script>
(function() {
  var id_base = '${id_base}';
  var simName = ${JSON.stringify(simName)};
  var btn = document.getElementById(id_base + '_btn');
  var container = document.getElementById(id_base + '_container');

  window['toggleSim_' + id_base] = function() {
    if (!container) return;
    var isHidden = (container.style.display === 'none' || container.style.display === '');
    if (isHidden) {
      container.style.display = 'block';
      if (btn) {
        btn.textContent = '🔒 Ocultar ' + simName;
        btn.style.background = 'linear-gradient(135deg, #f56565 0%, #ed64a6 100%)';
      }
    } else {
      container.style.display = 'none';
      if (btn) {
        btn.textContent = '🔓 Abrir ' + simName;
        btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    }
  };

  var root = document.getElementById(id_base + "_root");
  if (!root) return;

  var btnNuevo     = root.querySelector("#" + id_base + "_nuevo");
  var btnVerificar = root.querySelector("#" + id_base + "_verificar");
  var divRes       = root.querySelector("#" + id_base + "_res");
  var resultadosDetalle = root.querySelector("#" + id_base + "_resultadosDetalle");

  var r1 = root.querySelector("#" + id_base + "_r1");
  var r2 = root.querySelector("#" + id_base + "_r2");
  var r3 = root.querySelector("#" + id_base + "_r3");
  var r4 = root.querySelector("#" + id_base + "_r4");
  var r5 = root.querySelector("#" + id_base + "_r5");
  var r6 = root.querySelector("#" + id_base + "_r6");
  var r7 = root.querySelector("#" + id_base + "_r7");

  var panelInfo = root.querySelector("#" + id_base + "_panelInfo");
  var barOcup   = root.querySelector("#" + id_base + "_barOcup");
  var barLibre  = root.querySelector("#" + id_base + "_barLibre");
  var lblOcup   = root.querySelector("#" + id_base + "_lblOcup");
  var lblLibre  = root.querySelector("#" + id_base + "_lblLibre");
  var tablaResBody = root.querySelector("#" + id_base + "_tablaResBody");
  var total4 = root.querySelector("#" + id_base + "_total4");
  var registrados = root.querySelector("#" + id_base + "_registrados");
  var probFormula = root.querySelector("#" + id_base + "_probFormula");
  var barraRegistrados = root.querySelector("#" + id_base + "_barraRegistrados");

  // Elementos de fórmulas
  var formula1 = root.querySelector("#" + id_base + "_formula1");
  var formula2 = root.querySelector("#" + id_base + "_formula2");
  var formula3 = root.querySelector("#" + id_base + "_formula3");
  var formula4 = root.querySelector("#" + id_base + "_formula4");
  var formula5 = root.querySelector("#" + id_base + "_formula5");
  var formula6 = root.querySelector("#" + id_base + "_formula6");

  // Tarjetas para efectos
  var cards = [];
  for (var i = 1; i <= 7; i++) {
    cards.push(root.querySelector("#" + id_base + "_card" + i));
  }

  var letras = 26;
  var digitos = 10;
  var totalChars = letras + digitos;
  var libres4 = 97786;

  function calcularCorrectos() {
    var total2_letras = Math.pow(letras, 2);
    var total2_mix    = Math.pow(totalChars, 2);
    var total3_letras = Math.pow(letras, 3);
    var total3_mix    = Math.pow(totalChars, 3);
    var total4_letras = Math.pow(letras, 4);
    var total4_mix    = Math.pow(totalChars, 4);

    var ocupados4 = total4_mix - libres4;
    var probOcupado = ocupados4 / total4_mix;

    return {
      c1: total2_letras,
      c2: total2_mix,
      c3: total3_letras,
      c4: total3_mix,
      c5: total4_letras,
      c6: total4_mix,
      c7: probOcupado,
      libres4: libres4,
      ocupados4: ocupados4
    };
  }

  function limpiar() {
    r1.value = "";
    r2.value = "";
    r3.value = "";
    r4.value = "";
    r5.value = "";
    r6.value = "";
    r7.value = "";
    
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
    formula1.textContent = "?";
    formula2.textContent = "?";
    formula3.textContent = "?";
    formula4.textContent = "?";
    formula5.textContent = "?";
    formula6.textContent = "?";
    
    total4.textContent = "?";
    registrados.textContent = "?";
    probFormula.textContent = "?";
    barraRegistrados.style.width = "0%";
    
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
        card.style.borderColor = "#48bb78";
        card.style.boxShadow = "0 5px 15px rgba(72, 187, 120, 0.2)";
      } else {
        card.style.borderColor = "#f56565";
        card.style.boxShadow = "0 5px 15px rgba(245, 101, 101, 0.2)";
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
        card.style.borderColor = "#48bb78";
        card.style.boxShadow = "0 5px 15px rgba(72, 187, 120, 0.2)";
      } else {
        card.style.borderColor = "#f56565";
        card.style.boxShadow = "0 5px 15px rgba(245, 101, 101, 0.2)";
      }
    }
    
    return { ok:ok, vacio:false, formato:false, correcto:correcto, usuario:val };
  }

  function actualizarPanelVisual(c) {
    if (!panelInfo) return;
    panelInfo.style.display = "block";

    // Actualizar tabla de resultados
    if (tablaResBody) {
      var rows = [
        { long: 2, letras: c.c1, mix: c.c2 },
        { long: 3, letras: c.c3, mix: c.c4 },
        { long: 4, letras: c.c5, mix: c.c6 }
      ];
      
      var html = "";
      rows.forEach(function(row) {
        var diferencia = row.mix - row.letras;
        html += '<tr style="border-bottom: 1px solid #f0f0f0;">' +
                '<td style="padding: 12px; font-weight: bold;">' + row.long + ' caracteres</td>' +
                '<td style="padding: 12px; text-align: right;">' + row.letras.toLocaleString() + '</td>' +
                '<td style="padding: 12px; text-align: right;">' + row.mix.toLocaleString() + '</td>' +
                '<td style="padding: 12px; text-align: right; color: #764ba2; font-weight: bold;">+' + diferencia.toLocaleString() + '</td>' +
                '</tr>';
      });
      tablaResBody.innerHTML = html;
    }

    // Actualizar gráfico de barras
    if (barOcup && barLibre && lblOcup && lblLibre) {
      var total4_val = c.c6;
      var ocup = c.ocupados4;
      var lib = c.libres4;
      var pO = (ocup / total4_val) * 100;
      var pL = (lib / total4_val) * 100;
      
      // Animar las barras
      setTimeout(function() {
        barOcup.style.width = pO.toFixed(1) + '%';
        barLibre.style.width = pL.toFixed(1) + '%';
        
        // Añadir texto dentro de las barras
        barOcup.innerHTML = pO.toFixed(1) + '%';
        barLibre.innerHTML = pL.toFixed(1) + '%';
      }, 300);
      
      lblOcup.textContent = ocup.toLocaleString() + ' (' + pO.toFixed(2) + '%)';
      lblLibre.textContent = lib.toLocaleString() + ' (' + pL.toFixed(2) + '%)';
    }
    
    // Actualizar fórmulas en los ejercicios
    formula1.textContent = c.c1.toLocaleString();
    formula2.textContent = c.c2.toLocaleString();
    formula3.textContent = c.c3.toLocaleString();
    formula4.textContent = c.c4.toLocaleString();
    formula5.textContent = c.c5.toLocaleString();
    formula6.textContent = c.c6.toLocaleString();
    
    // Actualizar sección de probabilidad
    total4.textContent = c.c6.toLocaleString();
    registrados.textContent = c.ocupados4.toLocaleString();
    probFormula.textContent = (c.c7 * 100).toFixed(2) + '% ≈ ' + c.c7.toFixed(4);
    
    // Animar barra de probabilidad
    setTimeout(function() {
      barraRegistrados.style.width = (c.c7 * 100) + '%';
    }, 500);
  }

  function verificar() {
    var c = calcularCorrectos();
    
    var c1 = checkEntero(r1, c.c1, cards[0]);
    var c2 = checkEntero(r2, c.c2, cards[1]);
    var c3 = checkEntero(r3, c.c3, cards[2]);
    var c4 = checkEntero(r4, c.c4, cards[3]);
    var c5 = checkEntero(r5, c.c5, cards[4]);
    var c6 = checkEntero(r6, c.c6, cards[5]);
    var c7 = checkProb(r7, c.c7, cards[6]);

    var lista = [c1,c2,c3,c4,c5,c6,c7];
    var aciertos = 0;
    for (var i=0; i<lista.length; i++) {
      if (lista[i].ok) aciertos++;
    }

    function linea(num, txt, c, esProb) {
      var icon = c.ok ? "✅" : "❌";
      var color = c.ok ? "#48bb78" : "#f56565";
      var detalle = "";
      
      if (c.vacio) {
        if (esProb) {
          detalle = '<span style="color: #777;"> (sin respuesta; valor correcto ≈ ' + c.correcto.toFixed(4) + ')</span>';
        } else {
          detalle = '<span style="color: #777;"> (sin respuesta; valor correcto: ' + c.correcto.toLocaleString() + ')</span>';
        }
      } else if (c.formato) {
        detalle = '<span style="color: #f56565;"> (formato no válido)';
        if (esProb) {
          detalle += ' - usa un número decimal; correcto ≈ ' + c.correcto.toFixed(4) + '</span>';
        } else {
          detalle += ' - usa un entero; correcto: ' + c.correcto.toLocaleString() + '</span>';
        }
      } else if (!c.ok) {
        if (esProb) {
          detalle = '<span style="color: #f56565;"> (tu respuesta: ' + c.usuario.toFixed(4) +
                    '; correcto ≈ ' + c.correcto.toFixed(4) + ')</span>';
        } else {
          detalle = '<span style="color: #f56565;"> (tu respuesta: ' + c.usuario.toLocaleString() +
                    '; correcto: ' + c.correcto.toLocaleString() + ')</span>';
        }
      } else {
        if (esProb) {
          detalle = '<span style="color: #48bb78;"> (correcto ≈ ' + c.correcto.toFixed(4) + ')</span>';
        } else {
          detalle = '<span style="color: #48bb78;"> (correcto: ' + c.correcto.toLocaleString() + ')</span>';
        }
      }
      
      return '<div style="padding: 10px; background: ' + (c.ok ? '#f0fff4' : '#fff5f5') + '; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid ' + color + ';">' +
             '<b>' + num + ') ' + txt + '</b> ' + icon + detalle + '</div>';
    }

    var html = "";
    html += linea("1", "Nombres de dominio de exactamente 2 letras (solo letras)", c1, false);
    html += linea("2", "Nombres de dominio de 2 caracteres con letras y dígitos", c2, false);
    html += linea("3", "Nombres de dominio de exactamente 3 letras", c3, false);
    html += linea("4", "Nombres de dominio de 3 caracteres con letras y dígitos", c4, false);
    html += linea("5", "Nombres de dominio de exactamente 4 letras", c5, false);
    html += linea("6", "Nombres de dominio de 4 caracteres con letras y dígitos", c6, false);
    html += linea("7", "Probabilidad de que un nombre de 4 caracteres ya esté registrado", c7, true);

    // Añadir resumen de aciertos
    var porcentaje = Math.round((aciertos / 7) * 100);
    var colorAciertos = porcentaje >= 70 ? "#48bb78" : porcentaje >= 50 ? "#ed8936" : "#f56565";
    
    html += '<div style="margin-top: 20px; padding: 20px; background: white; border-radius: 10px; text-align: center; border: 2px solid ' + colorAciertos + ';">' +
            '<h3 style="margin: 0; color: ' + colorAciertos + ';">🎯 Resultado final: ' + aciertos + ' de 7</h3>' +
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
  var inputs = [r1, r2, r3, r4, r5, r6, r7];
  inputs.forEach(function(input) {
    if (input) {
      input.addEventListener('focus', function() {
        this.style.borderColor = "#667eea";
        this.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
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