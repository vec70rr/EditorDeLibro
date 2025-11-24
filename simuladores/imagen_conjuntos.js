// imagen_conjuntos_descomposicion.js
// Descomposición de A ∪ B como unión de dos eventos excluyentes
// Uso en tu editor: [simulador:imagen_conjuntos_descomposicion]

export default {
  render: (_params, simName = 'Descomposición de A ∪ B en eventos excluyentes') => {
    const id = `sim_${Math.random().toString(36).slice(2)}`;

    return `
<div id="${id}" class="simulador-box" style="margin-top:12px;padding:12px">

  <div style="font-weight:700;font-size:15px;margin-bottom:10px">
    ${simName}
  </div>

  <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-top:4px">

    <!-- Panel 1: A ∪ B (ambas regiones sombreadas) -->
    <div style="position:relative;width:150px;height:90px;border:1px solid #b3b3b3;border-radius:4px;background:#fafafa;">
      <!-- círculo A -->
      <div style="
        position:absolute;left:26px;top:18px;
        width:60px;height:60px;border-radius:50%;
        border:2px solid #8b6b3c;
        background:rgba(120,120,120,0.28);
      "></div>
      <!-- círculo B -->
      <div style="
        position:absolute;left:64px;top:18px;
        width:60px;height:60px;border-radius:50%;
        border:2px solid #8b6b3c;
        background:rgba(120,120,120,0.28);
      "></div>
      <!-- etiquetas A y B -->
      <div style="position:absolute;left:20px;top:10px;font-style:italic;font-size:14px;">A</div>
      <div style="position:absolute;right:20px;top:10px;font-style:italic;font-size:14px;">B</div>
    </div>

    <!-- signo igual -->
    <div style="font-size:20px;font-weight:600;">=</div>

    <!-- Panel 2: región izquierda (A \\ B) sombreada -->
    <div style="position:relative;width:150px;height:90px;border:1px solid #b3b3b3;border-radius:4px;background:#fafafa;">
      <!-- círculo A (sombreado) -->
      <div style="
        position:absolute;left:26px;top:18px;
        width:60px;height:60px;border-radius:50%;
        border:2px solid #8b6b3c;
        background:rgba(120,120,120,0.28);
      "></div>
      <!-- círculo B (solo contorno) -->
      <div style="
        position:absolute;left:64px;top:18px;
        width:60px;height:60px;border-radius:50%;
        border:2px solid #8b6b3c;
        background:transparent;
      "></div>
    </div>

    <!-- símbolo de unión -->
    <div style="font-size:20px;font-weight:600;">∪</div>

    <!-- Panel 3: región derecha (B \\ A) sombreada -->
    <div style="position:relative;width:150px;height:90px;border:1px solid #b3b3b3;border-radius:4px;background:#fafafa;">
      <!-- círculo A (solo contorno) -->
      <div style="
        position:absolute;left:26px;top:18px;
        width:60px;height:60px;border-radius:50%;
        border:2px solid #8b6b3c;
        background:transparent;
      "></div>
      <!-- círculo B (sombreado) -->
      <div style="
        position:absolute;left:64px;top:18px;
        width:60px;height:60px;border-radius:50%;
        border:2px solid #8b6b3c;
        background:rgba(120,120,120,0.28);
      "></div>
    </div>

  </div>
</div>
    `;
  }
};
