// imagen_conjuntos.js
// Simulador estático — Figura tipo 2.6 (A ∪ B ∪ C)
// Uso en tu editor: [simulador:imagen_conjuntos]

export default {
  render: (_params, simName = "A ∪ B ∪ C") => {
    const id = "sim_" + Math.random().toString(36).slice(2);

    return `
<div id="${id}" style="margin-top:10px; text-align:center;">
  <div style="font-weight:bold; margin-bottom:10px;">
    ${simName}
  </div>

  <svg width="420" height="260" style="background:#fdfbf7; border:3px solid #6b4f3a;">
    <!-- Círculo A -->
    <circle cx="170" cy="110" r="65"
            fill="rgba(200,180,150,0.25)"
            stroke="#6b4f3a" stroke-width="3" />
    <!-- A a la IZQUIERDA, bien separada -->
    <text x="80" y="115"
          font-size="22" font-family="serif" fill="#6b4f3a">A</text>

    <!-- Círculo B -->
    <circle cx="260" cy="110" r="65"
            fill="rgba(200,180,150,0.25)"
            stroke="#6b4f3a" stroke-width="3" />
    <!-- B a la DERECHA, bien separada -->
    <text x="345" y="115"
          font-size="22" font-family="serif" fill="#6b4f3a">B</text>

    <!-- Círculo C (abajo) -->
    <circle cx="215" cy="160" r="65"
            fill="rgba(200,180,150,0.25)"
            stroke="#6b4f3a" stroke-width="3" />
    <!-- C a la DERECHA del círculo inferior -->
    <text x="305" y="170"
          font-size="22" font-family="serif" fill="#6b4f3a">C</text>
  </svg>

  <div style="font-size:14px; margin-top:8px; color:#444;">
    Representación de la unión <b>A ∪ B ∪ C</b>.
  </div>
</div>
`;
  }
};
