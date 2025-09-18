// Inicialización.
document.addEventListener('DOMContentLoaded', async () => {
  // --- Referencias a elementos del DOM (sin cambios) ---
  const tocList = document.getElementById('tocList');
  const vistaPrevia = document.getElementById('vistaPrevia');
  const htmlGenerado = document.getElementById('htmlGenerado');
  const modalBg = document.getElementById('modalBg');
  const inpTitulo = document.getElementById('inpTitulo');
  const inpContenido = document.getElementById('inpContenido');
  const btnGuardar = document.getElementById('btnGuardar');
  const btnCancelar = document.getElementById('btnCancelar');
  const btnDescargar = document.getElementById('btnDescargar');
  const btnDeshacer = document.getElementById('btnDeshacer');
  const toolbarButtons = document.querySelectorAll('.toolbar-line button');
  const tocButtons = document.querySelectorAll('.toc .toolbar button');

  // --- Estructura del libro y estado (sin cambios) ---
  let libro = [
    { tipo: 'portada', titulo: 'Portada', contenido: 'Título del Libro\nAutor\nFecha' },
    { tipo: 'prefacio', titulo: 'Prefacio', contenido: 'Introducción...' }
  ];
  let selectedIndex = null;
  let history = [];

  let simuladoresDisponibles = [];

  async function cargarSimuladores() {
    try {
      const response = await fetch('./simuladores/manifest.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      simuladoresDisponibles = await response.json();
    } catch (error) {
      console.error("Error fatal: No se pudo cargar la lista de simuladores desde 'manifest.json'", error);
      alert("Error: No se pudo cargar la lista de simuladores. Revisa el archivo 'simuladores/manifest.json'.");
    }
  }
  
  const simbolos = [
    { name: 'Fracción', code: '\\frac{a}{b}' },
    { name: 'Suma', code: '\\sum_{i=0}^{n} i' },
    { name: 'Integral', code: '\\int_{a}^{b} f(x) dx' }
  ];
  const ecuaciones = [
    { name: 'Matriz 2x2', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { name: 'Ecuación Cuadrática', code: 'ax^2 + bx + c = 0' },
    { name: 'Seno', code: '\\sin(x)' }
  ];

  function saveHistory() {
    history.push(JSON.stringify(libro));
    if (history.length > 20) history.shift();
  }

  function renderTOC() {
    tocList.innerHTML = '';
    libro.forEach((item, idx) => {
      const li = document.createElement('li');
      li.textContent = `${item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}: ${item.titulo}`;
      li.classList.add(`lvl-${['portada', 'prefacio'].includes(item.tipo) ? 0 : item.tipo === 'capitulo' ? 1 : item.tipo === 'seccion' ? 2 : 3}`);
      li.onclick = () => {
        selectedIndex = idx;
        inpTitulo.value = item.titulo;
        inpContenido.value = item.contenido;
        modalBg.style.display = 'flex';
      };
      tocList.appendChild(li);
    });
  }

  async function renderLibro() {
    // --- ¡CAMBIO IMPORTANTE! SECCIÓN DE ESTILOS ACTUALIZADA ---
    let completeHTML = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <title>Libro Generado</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
          <script src="https://unpkg.com/mathjs@latest/lib/browser/math.js"></script>
          <style>
            :root {
              --primary-color: #004080;
              --primary-gradient: linear-gradient(135deg, #0059b3, #003366);
              --secondary-gradient: linear-gradient(135deg, #e60000, #900000);
              --text-color: #333;
              --background-color: #f4f4f4;
            }
            body {
              font-family: "Segoe UI", Arial, sans-serif;
              background: var(--background-color);
              color: var(--text-color);
              margin: 0;
              padding: 2rem;
              line-height: 1.6;
            }
            .libro-container {
              background: #ffffff;
              max-width: 900px;
              margin: 0 auto;
              padding: 2rem 3rem;
              border-radius: 8px;
              box-shadow: 0 0 12px rgba(0,0,0,0.15);
            }
            h1, h2, h3, h4, h5 {
              color: var(--primary-color);
            }
            h1 { border-left: 5px solid var(--primary-color); padding-left: 0.5rem; margin-top: 0; }
            h2 { border-bottom: 2px solid #ddd; padding-bottom: 0.3rem; margin-top: 1.5rem; }
            .equation { margin: 15px 0; text-align: center; }
            img { max-width: 100%; height: auto; display: block; margin: 15px auto; border-radius: 5px; }
            .error { color: red; font-weight: bold; }
            .btn-sim {
              background: var(--primary-gradient);
              color: white;
              font-family: "Segoe UI", Arial, sans-serif;
              font-size: 16px;
              font-weight: bold;
              border: none;
              border-radius: 6px;
              padding: 10px 18px;
              cursor: pointer;
              box-shadow: 0 3px 8px rgba(0,0,0,0.15);
              transition: background 0.3s ease, transform 0.2s ease;
              margin-top: 10px;
            }
            .btn-sim:hover { background: #003366; transform: scale(1.02); }
            .btn-sim-rojo { background: var(--secondary-gradient) !important; }
            .btn-sim-rojo:hover { background: #900000 !important; }
            .simulador-box {
              background: #f9f9f9;
              border-left: 5px solid var(--primary-color);
              padding: 1rem;
              margin: 1.2rem 0;
              border-radius: 6px;
            }
            .simulador-box input[type="text"], .simulador-box input[type="number"] { border: 1px solid #ccc; border-radius: 4px; padding: 8px; }
            .simulador-box button { background-color: #333; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="libro-container">
    `;
    let previewHTML = '';
    for (const item of libro) {
      const tag = item.tipo === 'portada' ? 'h1' : item.tipo === 'prefacio' ? 'h2' : item.tipo === 'capitulo' ? 'h3' : item.tipo === 'seccion' ? 'h4' : 'h5';
      const parsedTitle = `<${tag}>${item.titulo}</${tag}>`;
      const parsedContent = await parseContenido(item.contenido);
      previewHTML += parsedTitle + parsedContent;
    }
    completeHTML += previewHTML + '</div></body></html>';
    vistaPrevia.innerHTML = previewHTML;
    htmlGenerado.value = completeHTML;
    if (window.MathJax) {
      MathJax.typesetPromise([vistaPrevia]).catch(err => console.error('MathJax error:', err));
    }
  }

  // --- El resto del archivo (parseContenido, listeners, etc.) permanece exactamente igual ---
  async function parseContenido(contenido) {
    let result = '';
    const lines = contenido.split('\n');
    for (const line of lines) {
      if (line.startsWith('$$') && line.endsWith('$$')) {
        result += `<div class="equation">\\(${line.slice(2, -2)}\\)</div>`;
      } else if (line.startsWith('[simulador:')) {
        const match = line.match(/\[simulador:([^|\]]+)\s*\|*\s*(.*?)\]/);
        if (match) {
          const tipo = match[1].toLowerCase();
          const params = match[2] ? match[2].split('|').map(p => p.trim()) : [];
          const sim = simuladoresDisponibles.find(s => s.file.replace('.js', '') === tipo);
          if (sim) {
            try {
              const mod = await import(`./simuladores/${sim.file}`);
              if (mod.default && typeof mod.default.render === 'function') {
                // Pasamos el nombre del manifest al render
                result += mod.default.render(params, sim.name); 
              } else {
                result += `<p class="error">Error: El módulo ${sim.file} no tiene un método 'render' válido.</p>`;
              }
            } catch (e) {
              console.error(`Error cargando simulador ${sim.file}:`, e);
              result += `<p class="error">Error: No se pudo cargar el simulador "${sim.name}".</p>`;
            }
          } else {
            result += `<p class="error">Error: Simulador "${tipo}" no encontrado.</p>`;
          }
        }
      } else if (line.startsWith('[imagen:')) {
        const match = line.match(/\[imagen:(.+?)\]/);
        if (match) {
          result += `<img src="${match[1]}" alt="Imagen">`;
        }
      } else if (line.trim() !== '') {
        result += `<p>${line}</p>`;
      }
    }
    return result;
  }
  
  tocButtons.forEach(btn => {
    btn.onclick = () => {
      saveHistory();
      const tipo = btn.textContent.toLowerCase();
      libro.push({
        tipo,
        titulo: `Nuevo ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
        contenido: 'Contenido...'
      });
      renderTOC();
      renderLibro();
    };
  });

  btnGuardar.onclick = () => {
    if (selectedIndex !== null) {
      saveHistory();
      libro[selectedIndex].titulo = inpTitulo.value;
      libro[selectedIndex].contenido = inpContenido.value;
      renderTOC();
      renderLibro();
    }
    modalBg.style.display = 'none';
  };
  btnCancelar.onclick = () => modalBg.style.display = 'none';

  btnDeshacer.onclick = () => {
    if (history.length > 0) {
      libro = JSON.parse(history.pop());
      renderTOC();
      renderLibro();
    }
  };

  btnDescargar.onclick = () => {
    const blob = new Blob([htmlGenerado.value], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'libro.html';
    a.click();
  };

  function insertAtCursor(text) {
    const start = inpContenido.selectionStart;
    const end = inpContenido.selectionEnd;
    const value = inpContenido.value;
    inpContenido.value = value.substring(0, start) + text + value.substring(end);
    inpContenido.selectionStart = inpContenido.selectionEnd = start + text.length;
    inpContenido.focus();
  }

  function createMenu(items, onSelect) {
    const menu = document.createElement('div');
    menu.classList.add('math-menu');
    items.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('math-item');
      div.textContent = item.name;
      div.onclick = (e) => {
        e.stopPropagation();
        onSelect(item);
        document.body.removeChild(menu);
      };
      menu.appendChild(div);
    });
    return menu;
  }

  let closeMenuHandler = null;
  function setupMenu(button, items, onSelect) {
    button.onclick = (e) => {
      e.stopPropagation();
      if (closeMenuHandler) closeMenuHandler();
      const menu = createMenu(items, onSelect);
      document.body.appendChild(menu);
      const rect = button.getBoundingClientRect();
      menu.style.position = 'absolute';
      menu.style.top = `${rect.bottom + window.scrollY}px`;
      menu.style.left = `${rect.left + window.scrollX}px`;
      menu.style.display = 'block';

      closeMenuHandler = () => {
        if (document.body.contains(menu)) document.body.removeChild(menu);
        document.removeEventListener('click', closeMenuHandler);
        closeMenuHandler = null;
      };
      setTimeout(() => document.addEventListener('click', closeMenuHandler), 0);
    };
  }

  await cargarSimuladores();
  
  setupMenu(toolbarButtons[0], simbolos, item => insertAtCursor(`$$${item.code}$$`));
  setupMenu(toolbarButtons[1], ecuaciones, item => insertAtCursor(`$$${item.code}$$`));
  
  setupMenu(toolbarButtons[2], simuladoresDisponibles, sim => {
    const identifier = sim.file.replace('.js', '');
    const shortcode = `\n[simulador:${identifier}]\n`;
    insertAtCursor(shortcode);
  });
  
  setupMenu(toolbarButtons[3], [{name: "Imagen URL", code: ""}], () => {
    insertAtCursor('\n[imagen:https://via.placeholder.com/150]\n');
  });

  renderTOC();
  renderLibro();
});