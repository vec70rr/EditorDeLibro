document.addEventListener('DOMContentLoaded', async () => {
  // --- REFERENCIAS AL DOM ---
  const pagesListEl = document.getElementById('pagesList');
  const vistaPrevia = document.getElementById('vistaPrevia');
  const modalBg = document.getElementById('modalEditorBg');
  const modalTitulo = document.getElementById('modalTitulo');
  const inpTitulo = document.getElementById('inpTitulo');
  const inpContenido = document.getElementById('inpContenido');
  const liveTypesetEl = document.getElementById('liveTypeset');
  
  // --- ESTADO DE LA APLICACIÓN ---
  let pages = [];
  let selectedId = null;
  let idSeq = 1;
  const historyStack = [];
  let simuladoresDisponibles = [];

  // --- CONTROLES DE COMPOSICIÓN ---
  const controls = {
    fontSize: document.getElementById('fontSize'),
    lineHeight: document.getElementById('lineHeight'),
    bgColor: document.getElementById('bgColor'),
    textColor: document.getElementById('textColor'),
    paperColor: document.getElementById('paperColor'),
  };

  // --- HISTORIAL (UNDO/REDO) ---
  function pushHistory() {
    historyStack.push(JSON.stringify(pages));
    document.getElementById('btnDeshacer').disabled = historyStack.length <= 1;
  }

  function undo() {
    if (historyStack.length > 1) {
      historyStack.pop();
      pages = JSON.parse(historyStack[historyStack.length - 1]);
      selectedId = null;
      renderAll();
    }
  }

  // --- GUARDADO Y CARGA DE PROYECTOS ---
  function saveProject() {
    // Tomamos el estado actual de las páginas y lo convertimos a un texto JSON
    const projectData = JSON.stringify(pages, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    // Usamos el título de la primera página para el nombre del archivo
    const fileName = (pages[0]?.titulo || 'proyecto-libro').replace(/ /g, '_');
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function loadProject(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        // Validamos que sea un array (una simple comprobación)
        if (Array.isArray(projectData)) {
          pages = projectData;
          historyStack.length = 0; // Reiniciar el historial
          pushHistory();
          selectedId = null;
          renderAll();
          alert('¡Proyecto cargado con éxito!');
        } else {
          throw new Error('El archivo no tiene el formato de proyecto correcto.');
        }
      } catch (error) {
        console.error("Error al cargar el proyecto:", error);
        alert(`Error: No se pudo cargar el archivo. Asegúrate de que sea un archivo de proyecto válido.\n\nDetalle: ${error.message}`);
      }
    };
    reader.readAsText(file);
    // Limpiar el input para poder cargar el mismo archivo de nuevo si es necesario
    event.target.value = '';
  }

  // --- GESTIÓN DE PÁGINAS (MOVER, BORRAR, SELECCIONAR) ---
  function addPage(tipo, titulo, contenido) {
    const newPage = { id: `p${idSeq++}`, tipo, titulo, contenido };
    pages.push(newPage);
    selectedId = newPage.id;
    pushHistory();
    renderAll();
    return newPage;
  }

  function movePage(pageId, direction) {
    const index = pages.findIndex(p => p.id === pageId);
    if (index === -1) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= pages.length) return;
    const [item] = pages.splice(index, 1);
    pages.splice(newIndex, 0, item);
    pushHistory();
    renderAll();
  }

  function deletePage(pageId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta parte del libro?')) return;
    pages = pages.filter(p => p.id !== pageId);
    if (selectedId === pageId) selectedId = null;
    pushHistory();
    renderAll();
  }

  // --- RENDERIZADO ---
  function renderPagesList() {
    pagesListEl.innerHTML = "";
    pages.forEach(page => {
      const li = document.createElement('li');
      li.className = `page-item ${page.id === selectedId ? 'selected' : ''}`;
      li.onclick = () => { selectedId = page.id; renderPagesList(); };

      const title = document.createElement('div');
      title.className = 'page-title';
      title.textContent = page.titulo || '(Sin Título)';

      const actions = document.createElement('div');
      actions.className = 'page-actions';
      
      const btnEdit = document.createElement('button'); btnEdit.textContent = '✏️'; btnEdit.title = "Editar";
      btnEdit.onclick = (e) => { e.stopPropagation(); openEditor(page.id); };
      
      const btnUp = document.createElement('button'); btnUp.textContent = '🔼'; btnUp.title = "Mover Arriba";
      btnUp.onclick = (e) => { e.stopPropagation(); movePage(page.id, -1); };

      const btnDown = document.createElement('button'); btnDown.textContent = '🔽'; btnDown.title = "Mover Abajo";
      btnDown.onclick = (e) => { e.stopPropagation(); movePage(page.id, 1); };

      const btnDel = document.createElement('button'); btnDel.textContent = '🗑️'; btnDel.className = 'danger'; btnDel.title = "Eliminar";
      btnDel.onclick = (e) => { e.stopPropagation(); deletePage(page.id); };
      
      actions.append(btnEdit, btnUp, btnDown, btnDel);
      li.append(title, actions);
      pagesListEl.appendChild(li);
    });
  }

  async function renderPreview() {
    vistaPrevia.innerHTML = "";
    for (const page of pages) {
        const pageContainer = document.createElement('div');
        pageContainer.className = 'paper-container';
        const pageTitle = document.createElement('h3');
        pageTitle.textContent = page.titulo;
        const pageContent = document.createElement('div');
        pageContent.className = 'paper-content';
        pageContent.innerHTML = await parseSingleContent(page.contenido);
        pageContainer.append(pageTitle, pageContent);
        vistaPrevia.appendChild(pageContainer);
    }
    if (window.MathJax?.typesetPromise) MathJax.typesetPromise([vistaPrevia]);
  }

  function applyLiveTypeset() {
    // Ahora esta función solo se encarga de los estilos que el usuario puede cambiar.
    const css = `
      #vistaPrevia {
        background-color: ${controls.bgColor.value};
        padding: 1em;
        border-radius: 8px;
      }
      .paper-container {
        background-color: ${controls.paperColor.value};
        color: ${controls.textColor.value};
        font-size: ${controls.fontSize.value}px;
        line-height: ${controls.lineHeight.value};
        padding: 1.5em;
        margin-bottom: 1em;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
    `;
    liveTypesetEl.textContent = css;
  }

  async function parseSingleContent(contenido) {
    let result = '';
    const lines = (contenido || '').split('\n');
    for (const line of lines) {
        if (line.trim() === '') continue;
        
        if (line.startsWith('[simulador:')) {
            const match = line.match(/\[simulador:([^|\]]+)\s*\|*\s*(.*?)\]/);
            if (match) {
                const tipo = match[1].toLowerCase().trim();
                const params = match[2] ? match[2].split('|').map(p => p.trim()) : [];
                const sim = simuladoresDisponibles.find(s => s.file.replace('.js', '') === tipo);
                if (sim) {
                    try {
                        const mod = await import(`./simuladores/${sim.file}`);
                        if (mod.default && typeof mod.default.render === 'function') {
                            result += mod.default.render(params, sim.name);
                        }
                    } catch (e) { result += `<p class="error">Error al cargar simulador.</p>`; }
                } else { result += `<p class="error">Simulador no encontrado: ${tipo}</p>`; }
            }
        } else {
            result += `<p>${line}</p>`;
        }
    }
    return result.replace(/<p><\/p>/g, '');
  }
  
  function renderAll() {
    renderPagesList();
    renderPreview();
    applyLiveTypeset();
  }

  let editingId = null;
  function openEditor(pageId) {
    editingId = pageId;
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    modalTitulo.textContent = `Editando: ${page.titulo}`;
    inpTitulo.value = page.titulo;
    inpContenido.value = page.contenido;
    modalBg.hidden = false;
  }

  function saveEditor() {
    const page = pages.find(p => p.id === editingId);
    if (page) {
      page.titulo = inpTitulo.value;
      page.contenido = inpContenido.value;
      pushHistory();
      renderAll();
    }
    modalBg.hidden = true;
  }

  async function cargarSimuladores() {
    try {
      const response = await fetch('./simuladores/manifest.json');
      simuladoresDisponibles = await response.json();
    } catch (e) { console.error("Error cargando manifest.json", e); }
  }

  // --- FUNCIÓN DE MENÚS ACTUALIZADA ---
  function setupMenus() {
    const menuSimbolosEl = document.getElementById('menuSimbolos');
    const menuEcuacionesEl = document.getElementById('menuEcuaciones');
    const menuSimuladoresEl = document.getElementById('menuSimuladores');

    // Contenido HTML de los nuevos menús
    const simbolosHTML = `
      <div class="menu-cat">Conjuntos</div>
      <span class="math-item" data-code="\\mathbb{N}">ℕ</span> <span class="math-item" data-code="\\mathbb{Z}">ℤ</span>
      <span class="math-item" data-code="\\mathbb{Q}">ℚ</span> <span class="math-item" data-code="\\mathbb{R}">ℝ</span>
      <span class="math-item" data-code="\\mathbb{C}">ℂ</span>
      <div class="menu-cat">Operaciones</div>
      <span class="math-item" data-code="+">+</span> <span class="math-item" data-code="-">−</span>
      <span class="math-item" data-code="\\times">×</span> <span class="math-item" data-code="\\cdot">·</span>
      <span class="math-item" data-code="\\div">÷</span> <span class="math-item" data-code="=">=</span>
      <span class="math-item" data-code="\\neq">≠</span> <span class="math-item" data-code="\\leq">≤</span>
      <span class="math-item" data-code="\\geq">≥</span>
      <div class="menu-cat">Especiales</div>
      <span class="math-item" data-code="\\infty">∞</span> <span class="math-item" data-code="\\in">∈</span>
      <span class="math-item" data-code="\\notin">∉</span> <span class="math-item" data-code="\\subset">⊂</span>
      <span class="math-item" data-code="\\varnothing">∅</span>
      <div class="menu-cat">Griego</div>
      <span class="math-item" data-code="\\alpha">α</span> <span class="math-item" data-code="\\beta">β</span>
      <span class="math-item" data-code="\\gamma">γ</span> <span class="math-item" data-code="\\delta">δ</span>
      <span class="math-item" data-code="\\theta">θ</span> <span class="math-item" data-code="\\pi">π</span>
      <span class="math-item" data-code="\\sigma">σ</span> <span class="math-item" data-code="\\omega">ω</span>
    `;
    const ecuacionesHTML = `
      <div class="menu-cat">Estructuras Comunes</div>
      <span class="math-item" data-code="\\frac{a}{b}">Fracción</span> <span class="math-item" data-code="\\sqrt{a}">Raíz</span>
      <span class="math-item" data-code="a^{n}">Superíndice</span> <span class="math-item" data-code="a_{n}">Subíndice</span>
      <span class="math-item" data-code="\\sum_{i=1}^{n} a_i">Sumatoria</span> <span class="math-item" data-code="\\int_{a}^{b} f(x)dx">Integral</span>
      <span class="math-item" data-code="\\lim_{x\\to 0} f(x)">Límite</span> <span class="math-item" data-code="\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}">Matriz 2x2</span>
    `;

    if (menuSimbolosEl) menuSimbolosEl.innerHTML = simbolosHTML;
    if (menuEcuacionesEl) menuEcuacionesEl.innerHTML = ecuacionesHTML;
    if (menuSimuladoresEl) menuSimuladoresEl.innerHTML = simuladoresDisponibles.map(item => `<div class="math-item" data-file="${item.file}">${item.name}</div>`).join('');

    // Renderizar los símbolos de LaTeX en los menús
    if (window.MathJax?.typesetPromise) {
      MathJax.typesetPromise([menuSimbolosEl, menuEcuacionesEl]);
    }

    const menus = {
      'btnSimbolos': menuSimbolosEl,
      'btnEcuaciones': menuEcuacionesEl,
      'btnSimuladores': menuSimuladoresEl,
    };

    Object.entries(menus).forEach(([btnId, menuEl]) => {
      const btn = document.getElementById(btnId);
      if (!btn || !menuEl) return;
      
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menuEl.hidden;
        Object.values(menus).forEach(m => m.hidden = true);
        menuEl.hidden = !isHidden;
        const rect = btn.getBoundingClientRect();
        menuEl.style.top = `${rect.bottom + 5}px`;
        menuEl.style.left = `${rect.left}px`;
      });

      menuEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('math-item')) {
          let textToInsert = '';
          if (e.target.dataset.file) { // Es un simulador
            const identifier = e.target.dataset.file.replace('.js', '');
            textToInsert = `\n[simulador:${identifier}]\n`;
          } else if (e.target.dataset.code) { // Es LaTeX
            textToInsert = `\\(${e.target.dataset.code}\\)`;
          }
          if (textToInsert) insertAtCursor(inpContenido, textToInsert);
          menuEl.hidden = true;
        }
      });
    });
    
    document.body.addEventListener('click', () => Object.values(menus).forEach(m => m.hidden = true));
  }
  
  function insertAtCursor(textarea, text) {
    textarea.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, 'end');
    textarea.focus();
  }

  async function download() {
    const styles = `
      :root { --primary-color: #004080; --primary-gradient: linear-gradient(135deg, #0059b3, #003366); --secondary-gradient: linear-gradient(135deg, #e60000, #900000); }
      body { background-color: ${controls.bgColor.value}; color: ${controls.textColor.value}; font-family: "Segoe UI", Arial, sans-serif; padding: 1em; margin: 0; font-size: ${controls.fontSize.value}px; line-height: ${controls.lineHeight.value}; }
      .page { background-color: ${controls.paperColor.value}; padding: 2em; margin: 1em auto; max-width: 900px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .page h2 { color: var(--primary-color); border-bottom: 2px solid #ddd; padding-bottom: 0.3rem; }
      .btn-sim { background: var(--primary-gradient); color: white; font-family: "Segoe UI", Arial, sans-serif; font-size: 16px; font-weight: bold; border: none; border-radius: 6px; padding: 10px 18px; cursor: pointer; box-shadow: 0 3px 8px rgba(0,0,0,0.15); transition: background 0.3s ease, transform 0.2s ease; }
      .btn-sim:hover { background: #003366; transform: scale(1.02); }
      .btn-sim-rojo { background: var(--secondary-gradient) !important; }
      .btn-sim-rojo:hover { background: #900000 !important; }
      .simulador-box { background: #f9f9f9; border-left: 5px solid var(--primary-color); padding: 1rem; margin: 1.2rem 0; border-radius: 6px; color: #333; }
    `;

    let bodyHTML = '';
    for (const page of pages) {
      bodyHTML += `<div class="page"><h2>${page.titulo}</h2>${await parseSingleContent(page.contenido)}</div>`;
    }

    const finalHTML = `
      <!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${pages[0]?.titulo || 'Libro Interactivo'}</title>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"><\/script>
      <script src="https://unpkg.com/mathjs@latest/lib/browser/math.js"><\/script>
      <script src="https://unpkg.com/vis-data@7.1.4/peer/umd/vis-data.min.js"><\/script>
      <script src="https://unpkg.com/vis-network@9.1.9/peer/umd/vis-network.min.js"><\/script>
      <style>${styles}</style></head><body>${bodyHTML}</body></html>`;
      
    const blob = new Blob([finalHTML], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'libro-interactivo.html';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // --- LÓGICA PARA EL BOTÓN DE IMAGEN YA EXISTENTE ---
  const btnImagen = document.getElementById('btnImagen');
  const inpImagen = document.getElementById('inpImagen'); // El que acabamos de añadir
  
  if (btnImagen && inpImagen) {
    // 1. Conectar el clic del botón visual con el input oculto
    btnImagen.addEventListener('click', (e) => {
      e.preventDefault(); 
      inpImagen.click();
    });

    // 2. Procesar la imagen cuando se selecciona
    inpImagen.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const base64String = readerEvent.target.result;
        // Creamos el HTML de la imagen con estilos responsive
        const imgHTML = `<img src="${base64String}" alt="Imagen" style="display:block; max-width: 100%; height: auto; margin: 10px auto; border-radius: 4px;">\n`;
        
        // Usamos tu función existente 'insertAtCursor'
        insertAtCursor(inpContenido, imgHTML);
        
        // Opcional: Si quieres ver el cambio al instante en la vista previa
        // podrías llamar a saveEditor() o similar, pero como estás editando
        // basta con que aparezca el código en el textarea.
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Limpiar para permitir re-subir
    });
  }

  // --- INICIALIZACIÓN ---
  document.getElementById('btnDeshacer').onclick = undo;
  document.getElementById('btnGuardar').onclick = saveEditor;
  document.getElementById('btnCancelar').onclick = () => { modalBg.hidden = true; };
  document.getElementById('btnDescargar').onclick = download;

  // --- MODIFICAR HTML ANTERIOR ---
  document.getElementById('btnGuardarProyecto').onclick = saveProject;
  document.getElementById('btnCargarProyecto').addEventListener('change', loadProject);

  document.getElementById('btnAddPortada').onclick = () => addPage('portada', 'Portada', 'Contenido de la portada...');
  document.getElementById('btnAddPrefacio').onclick = () => addPage('prefacio', 'Prefacio', '...');
  document.getElementById('btnAddCapitulo').onclick = () => addPage('capitulo', 'Nuevo Capítulo', '...');
  document.getElementById('btnAddSeccion').onclick = () => addPage('seccion', 'Nueva Sección', '...');
  
  Object.values(controls).forEach(input => input.addEventListener('input', renderAll));

  await cargarSimuladores();
  setupMenus();
  addPage('portada', 'Título de mi Libro', 'Haz clic en "✏️" para editar esta página.');
  pushHistory();
  renderAll();

  // --- LÓGICA PARA SUBIR SIMULADORES (CON PREVISUALIZACIÓN) ---
// --- LÓGICA PARA SUBIR SIMULADORES (CON PREVISUALIZACIÓN) ---
  const modalUploadBg = document.getElementById('modalUploadBg');
  const btnOpenUpload = document.getElementById('btnOpenUpload');
  const btnCancelUpload = document.getElementById('btnCancelUpload');
  const btnConfirmUpload = document.getElementById('btnConfirmUpload');
  const btnPreviewSim = document.getElementById('btnPreviewSim');
  const uploadStatus = document.getElementById('uploadStatus');
  const uploadPreviewArea = document.getElementById('uploadPreviewArea');
  
  let validSimulatorCode = null;

  const resetUploadModal = () => {
    document.getElementById('inpSimName').value = '';
    document.getElementById('inpSimFile').value = '';
    uploadStatus.textContent = '';
    uploadPreviewArea.innerHTML = '';
    btnConfirmUpload.disabled = true;
    btnPreviewSim.disabled = false;
    validSimulatorCode = null;
  };

  btnOpenUpload.addEventListener('click', () => {
    resetUploadModal();
    modalUploadBg.hidden = false;
  });

  btnCancelUpload.addEventListener('click', () => {
    modalUploadBg.hidden = true;
  });

  btnPreviewSim.addEventListener('click', async () => {
    const file = document.getElementById('inpSimFile').files[0];
    if (!file) {
      uploadStatus.textContent = 'Por favor, selecciona un archivo .js.';
      uploadStatus.style.color = 'red';
      return;
    }

    uploadStatus.textContent = 'Cargando y validando...';
    uploadStatus.style.color = 'orange';
    uploadPreviewArea.innerHTML = '';
    btnConfirmUpload.disabled = true;
    validSimulatorCode = null;

    const code = await file.text();
    const dataUrl = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(code);

    try {
      const module = await import(dataUrl);
      if (!module.default || typeof module.default.render !== 'function') {
        throw new Error("El archivo no exporta un objeto con una función 'render'.");
      }

      const renderedHTML = module.default.render([], "Vista Previa del Simulador");
      
      // --- ¡ESTA ES LA CORRECCIÓN! ---
      // 1. Separamos el HTML del script
      const scriptRegex = /<script>([\s\S]*?)<\/script>/;
      const scriptMatch = renderedHTML.match(scriptRegex);
      const htmlContent = renderedHTML.replace(scriptRegex, '');
      const scriptContent = scriptMatch ? scriptMatch[1] : '';

      // 2. Insertamos solo el HTML visible
      uploadPreviewArea.innerHTML = htmlContent;

      // 3. Creamos y añadimos el script de forma que el navegador lo ejecute
      if (scriptContent) {
          const scriptEl = document.createElement('script');
          scriptEl.textContent = scriptContent;
          // Al añadirlo al DOM de esta manera, el script se ejecuta
          document.body.appendChild(scriptEl); 
          // Lo removemos después de un instante para no ensuciar el DOM principal
          setTimeout(() => document.body.removeChild(scriptEl), 50);
      }
      
      uploadStatus.textContent = '¡Previsualización exitosa! El simulador es válido.';
      uploadStatus.style.color = 'green';
      
      validSimulatorCode = code;
      btnConfirmUpload.disabled = false;

    } catch (error) {
      console.error("Error de previsualización:", error);
      uploadStatus.textContent = 'Error: El código del simulador tiene un error. Revisa la consola (F12) para más detalles.';
      uploadStatus.style.color = 'red';
      uploadPreviewArea.innerHTML = '<p style="color:red; font-family:monospace;">' + error.message + '</p>';
    }
  });

  btnConfirmUpload.addEventListener('click', async () => {
    const simNameInput = document.getElementById('inpSimName');
    const simFileInput = document.getElementById('inpSimFile');
    const name = simNameInput.value.trim();
    const fileName = simFileInput.files[0].name;

    if (!name || !validSimulatorCode) {
      uploadStatus.textContent = 'Error: Se necesita un nombre y un simulador válido previsualizado.';
      uploadStatus.style.color = 'red';
      return;
    }

    uploadStatus.textContent = 'Enviando al servidor... por favor espera.';
    btnConfirmUpload.disabled = true;
    btnPreviewSim.disabled = true;

    try {
      const response = await fetch('/api/upload-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, code: validSimulatorCode, fileName: fileName }),
      });

      const result = await response.json();
      if (!response.ok) { throw new Error(result.message || 'Error desconocido del servidor'); }

      uploadStatus.textContent = '¡Éxito! El simulador fue añadido. Refresca la página en 1-2 minutos para verlo en el menú.';
      uploadStatus.style.color = 'green';
      setTimeout(() => { modalUploadBg.hidden = true; }, 4000);

    } catch (error) {
      uploadStatus.textContent = 'Error al subir: ' + error.message;
      uploadStatus.style.color = 'red';
      btnConfirmUpload.disabled = false;
    } finally {
      btnPreviewSim.disabled = false;
    }
  });

});