export default {
  render: (params, simName = 'Diagrama de Tallos y Hojas') => {
    const id_base = `sim_${Math.random().toString(36).slice(2)}`;

    return `
      <div>
        <button id="${id_base}_btn" class="btn-sim" onclick="toggleSim_${id_base}()">
          Abrir ${simName}
        </button>

        <div id="${id_base}_container" style="display:none; margin-top:10px;">
          
          <style>
            #${id_base}_container .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; align-items: end; margin-bottom: 1rem; }
            #${id_base}_container .grid label { display: flex; flex-direction: column; }
            #${id_base}_container input, #${id_base}_container select { padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-top: 4px; }
            #${id_base}_container .btn-clear { background: #eef2f7; color: #223; border: 1px solid #cfd7e3; }
            #${id_base}_container .wrap { overflow-x: auto; }
            #${id_base}_container table { width: 100%; border-collapse: collapse; margin: 1rem 0; background: #fff; }
            #${id_base}_container caption { padding: 6px; color: #666; font-size: 0.9em; }
            #${id_base}_container th { background: var(--primary-color, #004080); color: white; padding: 10px; }
            #${id_base}_container td, #${id_base}_container th { border: 1px solid #ccc; padding: 10px 12px; text-align: right; }
            #${id_base}_container tbody tr:nth-child(even) { background: #f7f7f7; }
            #${id_base}_container .mono { font-family: monospace; }
            #${id_base}_container .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
            #${id_base}_container .legend { margin-bottom: 10px; font-weight: bold; }
            #${id_base}_container .note { font-size: 0.9em; color: #555; }
            #${id_base}_container .stem-box { padding: 1rem; background: #f0f5fa; border-radius: 8px; }
            #${id_base}_container .pos-row { display: flex; flex-wrap: wrap; gap: 8px; }
            #${id_base}_container .tag { display: inline-block; padding: 6px 10px; border-radius: 6px; border: 1px solid #ccc; cursor: pointer; }
            #${id_base}_container .tag.leaf { background: #e6f7ff; border-color: #91d5ff; }
            #${id_base}_container .tag.stem { background: #fffbe6; border-color: #ffe58f; }
            #${id_base}_container .tag input { display: none; }
            #${id_base}_container .tag input:checked + span { font-weight: bold; text-decoration: underline; }
            #${id_base}_container .bad { color: #c00000; font-weight: bold; }
            @media (max-width: 768px) { #${id_base}_container .two-col { grid-template-columns: 1fr; } }
          </style>
            
          <div class="info-block"><h1>Simulador de gráficos de tallos y hojas</h1><p style="margin:0; text-align:justify">Un <strong>diagrama de tallos y hojas</strong> es una representación gráfica de un conjunto de datos numéricos 
    que se construye separando las cifras de cada número en dos partes: el <em>tallo</em> (stem) y la <em>hoja</em> (leaf). 
    El tallo está formado por las cifras de mayor valor posicional (por ejemplo, centenas o decenas), mientras que la hoja 
    contiene las cifras de menor valor posicional (como unidades, décimas o centésimas). De este modo, cada dato se descompone 
    en un tallo y una hoja que, al organizarse en una tabla, permiten visualizar la distribución de los datos de manera clara 
    y ordenada. <br><br>
    Por ejemplo, consideremos el número <strong>1246.98760</strong>. Este número tiene varias cifras: 1 en la posición de 
    millar, 2 en centenas, 4 en decenas y 6 en unidades, seguido de 9 (décimas), 8 (centésimas), 7 (milésimas), 6 (diezmilésimas) 
    y 0 (cienmilésimas). Si definimos como tallo las cifras de los millares y las centenas, el tallo será <strong>12</strong>. 
    Si, por otro lado, consideramos como hoja las decenas, unidades y centécimas, la hoja podría representarse 
    como <strong>468</strong>. En la tabla del diagrama, en la primera columna aparecería el tallo (12) y en la segunda 
    columna la hoja (468). <br><br>
    Esta representación facilita identificar valores típicos, la dispersión de los datos y la presencia de posibles valores 
    atípicos, constituyéndose en una herramienta práctica dentro de la estadística descriptiva.</p></div>
          <h2>1) Genera la tabla de datos</h2>
          <div class="grid">
            <label>Filas <input id="${id_base}_rows" type="number" min="1" max="30" value="6"></label>
            <label>Columnas <input id="${id_base}_cols" type="number" min="1" max="20" value="10"></label>
            <label>Formato <select id="${id_base}_format"><option value="0">Enteros</option><option value="1" selected>1 decimal</option><option value="2">2 decimales</option><option value="mix">Mixto</option></select></label>
            <label>Rango (0 a …) <input id="${id_base}_maxVal" type="number" min="9" max="9999" value="99"></label>
            <div><button class="btn-sim" id="${id_base}_gen">Generar</button> <button class="btn-sim btn-clear" id="${id_base}_clear">Limpiar</button></div>
          </div>
          <div class="wrap" id="${id_base}_tableWrap"></div>
          <h2>2) Define tallo y hoja, y construye el diagrama</h2>
          <div class="grid">
            <label>Modo <select id="${id_base}_mode"><option value="fast" selected>Rápido</option><option value="advanced">Avanzado</option></select></label>
            <div id="${id_base}_fastBox" class="grid" style="grid-column:1/-1;">
              <label>Primer dígito de la <strong>hoja</strong> <select id="${id_base}_leafStart"><option value="ones">Unidades</option><option value="tenths" selected>Décimas</option><option value="hundredths">Centésimas</option></select></label>
              <label>Cifras en la <strong>hoja</strong> <input id="${id_base}_leafLen" type="number" min="1" max="4" value="1"></label>
              <label>Usar tallo completo <select id="${id_base}_stemAll"><option value="yes" selected>Sí</option><option value="no">No, limitar</option></select></label>
              <label id="${id_base}_stemLenBox" style="display:none">Cifras en el <strong>tallo</strong> <input id="${id_base}_stemLen" type="number" min="1" max="6" value="2"></label>
            </div>
            <div id="${id_base}_advBox" style="display:none; grid-column:1/-1;">
              <div id="${id_base}_posInfo" class="mono"></div><strong>Posiciones de la hoja</strong><div id="${id_base}_leafPosRow" class="pos-row"></div><strong>Posiciones del tallo (opcional)</strong><div id="${id_base}_stemPosRow" class="pos-row"></div><div id="${id_base}_advWarn" class="bad" style="display:none;"></div>
            </div>
            <label style="grid-column:1/-1;">Redondeo <select id="${id_base}_roundRule"><option value="round" selected>Redondear</option><option value="truncate">Truncar</option></select></label>
            <div style="grid-column:1/-1;"><button class="btn-sim" id="${id_base}_build">Construir diagrama</button></div>
          </div>
          <div class="two-col" style="margin-top:10px">
            <div><div id="${id_base}_legend" class="stem-box note">Leyenda…</div>
            <div class="note">
            <strong>Interpretación:</strong> El <em>tallo</em> contiene las cifras de mayor valor posicional (izquierda)
            y la <em>hoja</em> las de menor valor (derecha), según la frontera que elegiste.
          </div></div>
            <div class="wrap">
              <table id="${id_base}_stemTable">
                <caption>Diagrama de tallos y hojas</caption>
                <thead><tr><th style="width:160px">Tallo</th><th>Hojas (ordenadas)</th></tr></thead>
                <tbody id="${id_base}_stemBody"><tr><td colspan="2" style="text-align:center;">Aún no hay datos</td></tr></tbody>
              </table>
            </div>
          </div>
            <h2>¿Cómo se construye? (resumen)</h2>
    <ol>
      <li>Fija la <strong>frontera</strong> entre tallo (cifras de mayor valor) y hoja (menor valor): rápido o avanzando por posiciones.</li>
      <li><strong>Cuantiza</strong> los datos al último dígito de la hoja (redondeo o truncado) para que la partición sea estable.</li>
      <li>Convierte a enteros según la escala de la hoja y <strong>separa</strong>: hoja = últimos L dígitos, tallo = resto a la izquierda.</li>
      <li><strong>Agrupa</strong> y <strong>ordena</strong> las hojas por cada tallo. Muestra la leyenda con la configuración elegida.</li>
    </ol>
        </div>
      </div>

      <script>
        (function() {
          const id_base = '${id_base}';
          const $ = (id) => document.getElementById(id_base + '_' + id);
          let MATRIX = [];

          function randomMatrix(r, c, maxVal, fmt) {
            const data = [];
            for(let i=0;i<r;i++){
              const row=[];
              for(let j=0;j<c;j++){
                const decs = (fmt==='mix') ? Math.floor(Math.random()*3) : Number(fmt);
                const base = Math.random()*maxVal;
                const val  = Math.round(base * (10**decs)) / (10**decs);
                row.push(val);
              }
              data.push(row);
            }
            return data;
          }

          function renderDataTable(matrix) {
            const wrap = $("tableWrap");
            if(!matrix.length){ wrap.innerHTML=""; return; }
            const rows = matrix.length, cols = matrix[0].length;
            let thead = "<tr>";
            for(let j=0;j<cols;j++) thead += '<th>c' + (j+1) + '</th>';
            thead += "</tr>";
            const fmtSel = $("format").value;
            const tbody = matrix.map(r=>{
              return "<tr>"+r.map(v=>{
                let s = (fmtSel==='0') ? v.toFixed(0) : (fmtSel==='1') ? v.toFixed(1) : (fmtSel==='2') ? v.toFixed(2) : String(v);
                return '<td>' + s + '</td>';
              }).join("")+"</tr>";
            }).join("");
            wrap.innerHTML = '<table><caption>Datos generados ('+rows+'×'+cols+')</caption><thead>'+thead+'</thead><tbody>'+tbody+'</tbody></table>';
          }

          function positionsFromData(values) {
            const strVals = values.map(v => String(v).includes(".") ? String(v) : String(v) + ".");
            let maxInt = 1, maxDec = 0;
            for(const s of strVals){
              const [a,b] = s.split(".");
              maxInt = Math.max(maxInt, a.replace(/^0+/,"").length || 1);
              maxDec = Math.max(maxDec, (b||"").length);
            }
            const pos = [];
            for(let i=maxInt-1; i>=-maxDec; i--) pos.push(i);
            return pos;
          }

          function posLabel(p) {
            switch(p){
              case 2: return "centenas"; case 1: return "decenas"; case 0: return "unidades";
              case -1: return "décimas"; case -2: return "centésimas"; case -3: return "milésimas";
              default: return '10^(' + p + ')';
            }
          }
          
          function renderPositionPickers(positions) {
            $("posInfo").textContent = positions.map(p=>posLabel(p)).join(" | ");
            const mk = (p, kind) => '<label class="tag ' + kind + '"><input type="checkbox" value="' + p + '" /><span>' + posLabel(p) + '</span></label>';
            $("leafPosRow").innerHTML = positions.map(p => mk(p, "leaf")).join("");
            $("stemPosRow").innerHTML = positions.map(p => mk(p, "stem")).join("");
            $("advWarn").style.display = "none";
          }

          function readChecked(containerId) {
            return Array.from($(containerId).querySelectorAll('input:checked')).map(ch => Number(ch.value)).sort((a,b)=>b-a);
          }
          
          function validateBlocks(stemSel, leafSel) {
            const warn = $("advWarn"); warn.style.display = "none";
            if(!leafSel.length){ warn.textContent = "Selecciona al menos una posición para la hoja."; warn.style.display = "block"; return false; }
            const isContig = arr => arr.every((v,i)=> i===0 || arr[i-1]===v+1);
            if(!isContig(leafSel)){ warn.textContent = "Las posiciones de la hoja deben ser contiguas."; warn.style.display = "block"; return false; }
            if(stemSel.length){
              if(!isContig(stemSel)){ warn.textContent = "Las del tallo también deben ser contiguas."; warn.style.display = "block"; return false; }
              if(stemSel[stemSel.length-1] !== leafSel[0]+1){ warn.textContent = "El tallo debe estar pegado a la izquierda de la hoja."; warn.style.display = "block"; return false; }
            }
            return true;
          }

          function quantizeByLeafBlock(x, lastLeafPos, rule) {
            const k = Math.max(0, -lastLeafPos); const scale = 10**k;
            if(rule==='truncate') return Math.trunc(x*scale)/scale;
            return Math.round(x*scale)/scale;
          }

          function groupPairs(pairs, leafLen) {
            const map = new Map();
            for(const {stem, leaf} of pairs){
              if(!map.has(stem)) map.set(stem, []);
              map.get(stem).push(leaf);
            }
            const stemsSorted = Array.from(map.keys()).sort((a,b)=>a-b);
            return stemsSorted.map(st => ({
              stem: st.toString(),
              leaves: map.get(st).sort((a,b)=>a-b).map(l => l.toString().padStart(leafLen,'0'))
            }));
          }

          function buildByFast(matrix, leafStart, leafLen, useAllStem, stemLen, rule) {
            const kLeaf = ({ones:0, tenths:1, hundredths:2})[leafStart];
            const lastLeafPos = -(kLeaf + leafLen - 1);
            const ints = matrix.flat().map(v=>quantizeByLeafBlock(v, lastLeafPos, rule)).map(v => Math.round(v * (10**Math.max(0, -lastLeafPos))));
            const modLeaf = 10**leafLen;
            const pairs = ints.map(N => {
              const leaf = Math.abs(N % modLeaf);
              let stem = Math.trunc(N / modLeaf);
              if(useAllStem==='no'){ const m = 10**stemLen; stem = (N<0?-1:1) * (Math.abs(stem) % m); }
              return {stem, leaf};
            });
            return groupPairs(pairs, leafLen);
          }
          
          function buildByAdvanced(matrix, stemSel, leafSel, rule) {
            const lastLeafPos = leafSel[leafSel.length-1];
            const L = leafSel.length;
            const usePartialStem = stemSel.length > 0;
            const S = stemSel.length;
            const ints = matrix.flat().map(v=>quantizeByLeafBlock(v, lastLeafPos, rule)).map(v => Math.round(v * (10**Math.max(0, -lastLeafPos))));
            const modLeaf = 10**L;
            const pairs = ints.map(N => {
              const leaf = Math.abs(N % modLeaf);
              let stem = Math.trunc(N / modLeaf);
              if(usePartialStem){ const m = 10**S; stem = (N<0?-1:1) * (Math.abs(stem) % m); }
              return {stem, leaf};
            });
            return groupPairs(pairs, L);
          }

          function renderStemLeaf(rows, legendText) {
            const body = $("stemBody");
            if(!rows.length){ body.innerHTML = '<tr><td colspan="2" style="text-align:center;">No hay datos</td></tr>'; return; }
            body.innerHTML = rows.map(({stem, leaves})=>'<tr><td class="mono" style="text-align:center">' + stem + '</td><td class="mono">' + leaves.join(" ") + '</td></tr>').join("");
            $("legend").innerHTML = '<strong>Leyenda:</strong> ' + legendText;
          }

          window['toggleSim_' + id_base] = function() {
            const container = $('container');
            const btn = $('btn');
            const isHidden = container.style.display === 'none';
            if (isHidden) {
              container.style.display = 'block';
              btn.textContent = 'Ocultar ${simName}';
              btn.classList.add('btn-sim-rojo');
              if (!MATRIX.length) { $('gen').click(); }
            } else {
              container.style.display = 'none';
              btn.textContent = 'Abrir ${simName}';
              btn.classList.remove('btn-sim-rojo');
            }
          }
          
          $("stemAll").addEventListener("change", () => $("stemLenBox").style.display = $("stemAll").value === "no" ? "" : "none");
          $("mode").addEventListener("change", () => {
            const adv = $("mode").value === "advanced";
            $("fastBox").style.display = adv ? "none" : "";
            $("advBox").style.display = adv ? "" : "none";
            if(adv && MATRIX.length) renderPositionPickers(positionsFromData(MATRIX.flat()));
          });
          $("gen").addEventListener("click", () => {
            MATRIX = randomMatrix(+$("rows").value, +$("cols").value, +$("maxVal").value, $("format").value);
            renderDataTable(MATRIX);
            if($("mode").value==="advanced") renderPositionPickers(positionsFromData(MATRIX.flat()));
          });
          $("clear").addEventListener("click", () => { MATRIX = []; renderDataTable([]); $("stemBody").innerHTML = '<tr><td colspan="2" style="text-align:center;">Aún no hay datos</td></tr>'; $("legend").textContent="Leyenda…"; });
          $("build").addEventListener("click", () => {
            if(!MATRIX.length) { alert("Primero genera datos."); return; }
            const rule = $("roundRule").value;
            let diag, legendText;
            if($("mode").value === "fast"){
              diag = buildByFast(MATRIX, $("leafStart").value, +$("leafLen").value, $("stemAll").value, +$("stemLen").value, rule);
              legendText = 'Hoja empieza en las ' + $("leafStart").options[$("leafStart").selectedIndex].text.toLowerCase() + ' y tiene ' + $("leafLen").value + ' cifra(s).';
            } else {
              const leafSel = readChecked("leafPosRow"), stemSel = readChecked("stemPosRow");
              if(!validateBlocks(stemSel, leafSel)) return;
              diag = buildByAdvanced(MATRIX, stemSel, leafSel, rule);
              legendText = 'Hoja usa posiciones: ' + leafSel.map(posLabel).join(", ") + '.';
            }
            renderStemLeaf(diag, legendText);
          });
        })();
      </script>
    `;
  }
};