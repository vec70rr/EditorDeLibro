// Simuladores Capítulo 3 — Principio fundamental del conteo
// Cumple con la interfaz de tu plataforma: export default { render }.
// - render(...): devuelve un HTML string (no usa appendChild).
// - Interactividad vía event delegation global (document.addEventListener).
// - LaTeX: re-typeset con MathJax v3 (typesetPromise) o KaTeX auto-render si existen.

const SimPF = (() => {
  // ---------------- Utils ----------------
  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seed) {
    const s = Math.floor((typeof seed === "number" ? seed : Date.now()) % 2 ** 32);
    return mulberry32(s >>> 0);
  }
  function randInt(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }
  function shuffle(rng, arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function typeset(root) {
    // MathJax v3
    if (window.MathJax?.typesetPromise) {
      try { window.MathJax.typesetPromise(root ? [root] : undefined); } catch {}
      return;
    }
    // KaTeX auto-render (si tu editor lo usa)
    if (typeof window.renderMathInElement === "function") {
      try {
        window.renderMathInElement(root || document.body, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
        });
      } catch {}
    }
  }

  // ---------------- Estado por widget (en el DOM) ----------------
  // Usamos data-uid para encontrar y actualizar cada tarjeta sin necesitar referencias del host.
  function htmlCard({ uid, title }) {
    return `
      <section class="pf-card" data-pf="card" data-uid="${uid}">
        <div class="pf-head">
          <div class="pf-title">${title}</div>
          <div class="pf-ctrls">
            <button class="pf-btn" data-action="new" data-uid="${uid}">Nuevo ejercicio</button>
            <button class="pf-btn" data-action="toggle" data-uid="${uid}">Mostrar solución</button>
          </div>
        </div>
        <div class="pf-seed">seed: —</div>
        <div class="pf-prob"><em>Pulsa “Nuevo ejercicio” para generar una instancia.</em></div>
        <div class="pf-sol" style="display:none;"></div>
      </section>
    `;
  }

  // Generadores
  function genABC() {
    const rng = makeRng(Date.now());
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 2, 6);
    const a_sol = a * b;
    const b_sol = a * b * b;
    const c_sol = a * b * Math.max(0, b - 1) * a;
    return {
      seed: `${a}-${b}`,
      problem: `
        <p>Entre los puntos $A$ y $B$ existen <b>${a}</b> caminos distintos, y entre $B$ y $C$ existen <b>${b}</b> caminos distintos.</p>
        <ol>
          <li>a) ¿De cuántas maneras se puede ir de $A$ a $C$ pasando por $B$?</li>
          <li>b) ¿De cuántas maneras se puede ir de $A$ a $C$, pasando por $B$, y regresar a $B$?</li>
          <li>c) ¿De cuántas maneras se puede hacer un viaje redondo de $A$ a $C$ y volver a $A$, si <u>no se permite</u> usar el mismo tramo más de una vez?</li>
        </ol>
      `,
      solution: `
        <p><b>Regla del producto</b></p>
        <p>a) $${a}\\times${b} = ${a_sol}.$</p>
        <p>b) $${a}\\times${b}\\times${b} = ${b_sol}.$</p>
        <p>c) $${a}\\times${b}\\times(${b}-1)\\times${a} = ${c_sol}.$</p>
      `,
    };
  }

  function genDirigidos() {
    const rng = makeRng(Date.now() + 17);
    const ab = randInt(rng, 1, 3);
    const ba = randInt(rng, 1, 3);
    const bc = randInt(rng, 1, 2);
    const cb = randInt(rng, 1, 2);
    const ca = randInt(rng, 1, 2);
    const ac = 0;
    const a_sol = ab * ba;
    const b_sol = ab * bc * ca * ba;
    return {
      seed: `${ab}-${ba}-${bc}-${cb}-${ca}`,
      problem: `
        <p>Red de caminos dirigidos:</p>
        <ul>
          <li>$A\\to B$: ${ab}, $B\\to A$: ${ba}</li>
          <li>$B\\to C$: ${bc}, $C\\to B$: ${cb}</li>
          <li>$C\\to A$: ${ca}, $A\\to C$: ${ac}</li>
        </ul>
        <ol>
          <li>a) ¿Cuántos viajes redondos $A\\to B\\to A$ hay?</li>
          <li>b) ¿Cuántos viajes redondos $A\\to B\\to C\\to A$ hay?</li>
        </ol>
      `,
      solution: `
        <p>a) $${ab}\\times${ba} = ${a_sol}.$</p>
        <p>b) $${ab}\\times${bc}\\times${ca}\\times${ba} = ${b_sol}.$</p>
        <p>Nota: tomamos $A\\to C=0$ para emular la figura del libro.</p>
      `,
    };
  }

  function permutations(n, r) { let res = 1; for (let i = 0; i < r; i++) res *= (n - i); return res; }
  function countKDigitsNoRepeat(digits, k, noLeadingZero = true) {
    const m = digits.length, has0 = digits.includes(0);
    if (k > m) return 0;
    if (!noLeadingZero || !has0) return permutations(m, k);
    const first = m - 1;
    return first * permutations(m - 1, k - 1);
  }
  function count3DigitsGreaterThanTNoRepeat(digits, T, noLeadingZero = true) {
    const Ds = [...digits].sort((a, b) => a - b);
    const [t1, t2, t3] = [Math.floor(T / 100), Math.floor((T % 100) / 10), T % 10];
    const D1 = noLeadingZero ? Ds.filter((d) => d !== 0) : Ds.slice();
    let count = 0;
    for (const h of D1.filter((d) => d > t1)) {
      const rest = Ds.filter((d) => d !== h);
      count += rest.length * (rest.length - 1);
    }
    if (D1.includes(t1)) {
      const rest2 = Ds.filter((d) => d !== t1);
      for (const d of rest2.filter((x) => x > t2)) {
        const rest3 = rest2.filter((x) => x !== d);
        count += rest3.length;
      }
      if (rest2.includes(t2)) {
        const rest3 = rest2.filter((x) => x !== t2);
        count += rest3.filter((u) => u > t3).length;
      }
    }
    return count;
  }
  function genNumeros() {
    const rng = makeRng(Date.now() + 33);
    const base = shuffle(rng, [0,1,2,3,4,5,6,7,8,9]);
    const size = randInt(rng, 4, 6);
    let D = base.slice(0, size);
    if (!D.some((d) => d >= 3)) D[0] = 7;

    const T = 200 + randInt(rng, 0, 589);
    const allowRepeat = rng() < 0.5;
    const m = D.length, has0 = D.includes(0);
    const mEff = has0 ? m - 1 : m;

    const A_total = allowRepeat ? mEff * m * m : countKDigitsNoRepeat(D, 3, true);
    const B_total = count3DigitsGreaterThanTNoRepeat(D, T, true);
    const C_total = countKDigitsNoRepeat(D, 4, true);
    const total = B_total + C_total;

    const setStr = [...D].sort((a,b)=>a-b).join(", ");

    return {
      seed: `${setStr}|T=${T}|rep=${allowRepeat}`,
      problem: `
        <p>Con el conjunto de dígitos $D=\\{${setStr}\\}$:</p>
        <ol>
          <li>A) ¿Cuántos números de <b>tres cifras</b> se pueden formar ${allowRepeat ? "permitiendo la repetición" : "sin permitir repetición"}?</li>
          <li>B) ¿Cuántos números de <b>tres cifras</b> mayores que $${T}$ se pueden formar <b>sin</b> repetición?</li>
          <li>C) ¿Cuántos números de <b>cuatro cifras</b> se pueden formar <b>sin</b> repetición?</li>
          <li>D) Total buscado = B + C.</li>
        </ol>
      `,
      solution: `
        <p><b>A)</b> ${allowRepeat ? "Con" : "Sin"} repetición: ${allowRepeat ? `$${mEff}\\times${m}\\times${m}$` : `$${mEff}\\times${m-1}\\times${m-2}$`} = <b>${A_total}</b>.</p>
        <p><b>B)</b> Conteo lexicográfico con $${T}$ (sin repetición): <b>${B_total}</b>.</p>
        <p><b>C)</b> Cuatro cifras sin repetición: $${has0 ? m-1 : m}\\times${m-1}\\times${m-2}\\times${m-3}=${C_total}$.</p>
        <p><b>D)</b> $${B_total}+${C_total}=\\boxed{${total}}$.</p>
      `,
    };
  }

  // ---------------- Event delegation global (una sola vez) ----------------
  let listenersInstalled = false;
  function installListenersOnce() {
    if (listenersInstalled) return;
    listenersInstalled = true;

    document.addEventListener("click", (ev) => {
      const btn = ev.target.closest?.(".pf-btn[data-action]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const uid = btn.getAttribute("data-uid");
      const card = document.querySelector(`.pf-card[data-uid="${uid}"]`);
      if (!card) return;

      const type = card.getAttribute("data-type");
      const seedEl = card.querySelector(".pf-seed");
      const probEl = card.querySelector(".pf-prob");
      const solEl = card.querySelector(".pf-sol");
      const toggleBtn = card.querySelector('.pf-btn[data-action="toggle"]');

      if (action === "new") {
        let out;
        if (type === "abc") out = genABC();
        else if (type === "dir") out = genDirigidos();
        else if (type === "num") out = genNumeros();
        else return;

        seedEl.textContent = `seed: ${out.seed}`;
        probEl.innerHTML = out.problem;
        solEl.innerHTML = out.solution;
        solEl.style.display = "none";
        if (toggleBtn) toggleBtn.textContent = "Mostrar solución";
        typeset(card);
      }

      if (action === "toggle") {
        const isHidden = solEl.style.display === "none";
        solEl.style.display = isHidden ? "block" : "none";
        btn.textContent = isHidden ? "Ocultar solución" : "Mostrar solución";
        typeset(card);
      }
    });
  }

  // ---------------- HTML y render ----------------
  const CSS = `
    .pf-card { border:1px solid #e3e3e3; border-radius:10px; padding:14px; margin:16px 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    .pf-head { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px; }
    .pf-title { font-weight:600; }
    .pf-ctrls { display:flex; gap:6px; flex-wrap:wrap; }
    .pf-btn { cursor:pointer; border:1px solid #ccc; background:#f9f9f9; padding:6px 10px; border-radius:8px; }
    .pf-btn:hover { background:#f1f1f1; }
    .pf-prob, .pf-sol { line-height:1.6; }
    .pf-sol { margin-top:8px; padding-top:8px; border-top:1px dashed #ddd; }
    .pf-seed { font-size:12px; color:#666; margin-bottom:6px; }
  `;

  function uid() { return Math.random().toString(36).slice(2, 10); }

  function render(/* target?, props? */) {
    // Ignoramos cualquier argumento y devolvemos un HTML string.
    installListenersOnce();

    const u1 = uid(), u2 = uid(), u3 = uid();
    const html = `
      <style>${CSS}</style>
      <h3>Capítulo 3 — Simuladores: Principio fundamental del conteo</h3>

      ${htmlCard({ uid: u1, title: "Ejemplo 2 — Caminos A–B–C" }).replace('data-pf="card"', 'data-pf="card" data-type="abc"')}
      ${htmlCard({ uid: u2, title: "Ejemplo 3 — Grafo dirigido y viajes redondos" }).replace('data-pf="card"', 'data-pf="card" data-type="dir"')}
      ${htmlCard({ uid: u3, title: "Ejemplos 4 y 5 — Formación de números" }).replace('data-pf="card"', 'data-pf="card" data-type="num"')}
      <p style="font-size:12px;color:#666;margin-top:8px;">Tip: pulsa “Nuevo ejercicio” para generar parámetros aleatorios. Si no ves fórmulas, verifica que el motor LaTeX de tu editor esté activo en modo vista.</p>
    `;
    // No manipulamos el DOM; devolvemos el string.
    return html;
  }

  return { render };
})();

export default SimPF;