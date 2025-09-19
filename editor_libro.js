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
      <style>${styles}</style></head><body>${bodyHTML}</body></html>`;
      
    const blob = new Blob([finalHTML], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'libro-interactivo.html';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // --- INICIALIZACIÓN ---
  document.getElementById('btnDeshacer').onclick = undo;
  document.getElementById('btnGuardar').onclick = saveEditor;
  document.getElementById('btnCancelar').onclick = () => { modalBg.hidden = true; };
  document.getElementById('btnDescargar').onclick = download;

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
});