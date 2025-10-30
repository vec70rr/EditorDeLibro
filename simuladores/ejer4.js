// ejer10_freemode.js
// Ejercicio 10 — Ordenaciones con repetición (modo libre: no exige orden fijo)
// Uso en tu editor: [simulador:ejer10_freemode]

export default {
  render: (_params, simName = 'Ejercicio 10 — Ordenaciones con repetición (libre)') => {
    const id = `sim_${Math.random().toString(36).slice(2)}`;

    return `
<div id="${id}" class="simulador-box" style="margin-top:8px">
  <div style="font-weight:700;margin-bottom:8px">${simName}</div>

  <h4 style="margin:6px 0">Parte A — Ordenaciones con repetición de <b>orden 1</b> para {a,b,c,d}</h4>
  <div class="rowA" style="display:flex;gap:14px;flex-wrap:wrap"></div>
  <div style="font-size:12px;color:#475569;margin:6px 0 10px">
    Escribe en <b>minúsculas</b> y presiona <b>Probar</b> (o Enter). Cualquier letra válida <i>no repetida</i> es aceptada.
  </div>

  <h4 style="margin:6px 0">Parte B — Ordenaciones con repetición de <b>orden 2</b> (pares de {a,b,c,d})</h4>
  <div class="rowB" style="display:grid;grid-template-columns:repeat(4,auto);gap:10px 18px"></div>
  <div style="font-size:12px;color:#475569;margin:6px 0">
    Se aceptan pares válidos (ej.: aa, cd, ba, …) sin seguir un orden específico y sin repetir.
  </div>

  <div style="display:flex;gap:10px;align-items:center;margin-top:10px">
    <button class="btnTry" style="appearance:none;border:1px solid #cbd5e1;background:#f8fafc;border-radius:6px;padding:6px 10px;cursor:pointer">Probar</button>
    <button class="btnReset" style="appearance:none;border:1px solid #cbd5e1;background:#f8fafc;border-radius:6px;padding:6px 10px;cursor:pointer">Reiniciar</button>
    <div class="score" style="font-weight:700">Progreso: 0 / 20</div>
  </div>
  <div class="hint" style="font-size:12px;color:#64748b;margin-top:6px"></div>
</div>

<script>
(() => {
  const root = document.getElementById('${id}');
  if (!root) return;

  const letras = ['a','b','c','d'];

  // Pools de respuestas disponibles (se irán "gastando")
  let poolA = new Set(letras);
  let poolB = new Set();
  for (const i of letras) for (const j of letras) poolB.add(i+j);

  const TOTAL = poolA.size + poolB.size;

  const rowA = root.querySelector('.rowA');
  const rowB = root.querySelector('.rowB');
  const btnTry = root.querySelector('.btnTry');
  const btnReset = root.querySelector('.btnReset');
  const score = root.querySelector('.score');
  const hint  = root.querySelector('.hint');

  const makeBox = (ph, disabled) => {
    const wrap = document.createElement('div'); wrap.style.display='flex'; wrap.style.alignItems='center'; wrap.style.gap='6px';
    const input = document.createElement('input');
    input.placeholder = ph;
    input.style.width = '70px';
    input.style.textAlign = 'center';
    input.style.textTransform = 'lowercase';
    input.style.padding = '6px 8px';
    input.style.border = '1px solid #cbd5e1';
    input.style.borderRadius = '6px';
    input.style.background = disabled ? '#e5e7eb' : '#fff';
    input.style.color = disabled ? '#6b7280' : '#111';
    input.disabled = !!disabled;

    const ico = document.createElement('span');
    ico.style.width='16px';
    ico.style.display='inline-block';
    ico.style.fontWeight='700';

    wrap.appendChild(input); wrap.appendChild(ico);
    return {wrap,input,ico};
  };

  const aInputs=[], aIcons=[], bInputs=[], bIcons=[];
  for(let i=0;i<4;i++){ const {wrap,input,ico}=makeBox('letra', i!==0); aInputs.push(input); aIcons.push(ico); rowA.appendChild(wrap); }
  for(let i=0;i<16;i++){ const {wrap,input,ico}=makeBox('par', true); bInputs.push(input); bIcons.push(ico); rowB.appendChild(wrap); }

  let okCount=0;
  const updateScore=()=>{ score.textContent = 'Progreso: '+okCount+' / '+TOTAL; };

  const setOK=(inp,ico)=>{ inp.style.borderColor='#16a34a'; inp.style.background='#ecfdf5'; ico.textContent='✓'; };
  const setBAD=(inp,ico)=>{ inp.style.borderColor='#dc2626'; inp.style.background='#fef2f2'; ico.textContent='×'; };
  const clearMark=(inp,ico)=>{ inp.style.borderColor='#cbd5e1'; ico.textContent=''; };
  const enableNext=(arr,idx)=>{ if(idx+1<arr.length){ const el=arr[idx+1]; el.disabled=false; el.style.background='#fff'; el.style.color='#111'; el.focus(); } };

  const firstPending = ()=>{
    for(let i=0;i<aInputs.length;i++) if(!aInputs[i].disabled) return {set:'A',i};
    for(let i=0;i<bInputs.length;i++) if(!bInputs[i].disabled) return {set:'B',i};
    return null;
  };

  [...aInputs,...bInputs].forEach(el=>{
    el.addEventListener('input', ()=>{ el.value=(el.value||'').toLowerCase(); clearMark(el, el.nextSibling); });
    el.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); doTry(); } });
  });

  const err = (msg)=>{ hint.textContent = msg; };

  function tryA(i){
    const inp = aInputs[i], ico = aIcons[i];
    const val = (inp.value||'').trim().toLowerCase();
    if (val.length!==1 || !poolA.has(val)) {
      setBAD(inp,ico);
      if(val.length!==1) err('Parte A: escribe solo 1 letra (a, b, c o d).');
      else err(poolA.size? 'Esa letra no está disponible (o ya se usó).' : 'Ya no quedan letras disponibles.');
      return false;
    }
    poolA.delete(val);
    setOK(inp,ico); inp.disabled=true; okCount++; updateScore();
    // Si terminaste A, habilita la primera de B
    if(i===aInputs.length-1) enableNext(bInputs,-1); else enableNext(aInputs,i);
    err('');
    return true;
  }

  function tryB(i){
    const inp = bInputs[i], ico = bIcons[i];
    const val = (inp.value||'').trim().toLowerCase();
    const valid = val.length===2 && val.split('').every(c => ['a','b','c','d'].includes(c));
    if(!valid || !poolB.has(val)){
      setBAD(inp,ico);
      if(!valid) err('Parte B: escribe un par válido de {a,b,c,d}, por ejemplo: aa, cd, ba.');
      else err('Ese par ya se usó o no está disponible.');
      return false;
    }
    poolB.delete(val);
    setOK(inp,ico); inp.disabled=true; okCount++; updateScore();
    enableNext(bInputs,i);
    err('');
    return true;
  }

  function doTry(){
    const cur = firstPending();
    if(!cur) return;
    if(cur.set==='A') tryA(cur.i); else tryB(cur.i);
  }

  function doReset(){
    // restaurar pools
    poolA = new Set(['a','b','c','d']);
    poolB = new Set(); for (const i of ['a','b','c','d']) for (const j of ['a','b','c','d']) poolB.add(i+j);
    okCount=0; updateScore(); err('');

    aInputs.forEach((el,i)=>{ el.value=''; el.disabled=i!==0; el.style.background=i? '#e5e7eb':'#fff'; el.style.color=i? '#6b7280':'#111'; el.style.borderColor='#cbd5e1'; aIcons[i].textContent=''; });
    bInputs.forEach((el,i)=>{ el.value=''; el.disabled=true;  el.style.background='#e5e7eb'; el.style.color='#6b7280'; el.style.borderColor='#cbd5e1'; bIcons[i].textContent=''; });
    aInputs[0].focus();
  }

  btnTry.addEventListener('click', doTry);
  btnReset.addEventListener('click', doReset);

  // inicio
  updateScore();
  aInputs[0].focus();
})();
</script>
    `;
  }
};