export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Tiny JS/Strudel syntax highlighter
export function hl(code) {
  const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|`[^`]*`|'(?:[^'\\]|\\.)*')|(^\s*[\w$]+:(?=\s))|(\.[a-zA-Z_$][\w$]*)|(\b\d+(?:\.\d+)?\b|(?<![\w.])\.\d+)|([a-zA-Z_$][\w$]*)(?=\s*\()|(=>|\$:)/gm;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const [t] = m;
    const cls = m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'lab' : m[4] ? 'met' : m[5] ? 'num' : m[6] ? 'fn' : 'op';
    out += `<span class="k-${cls}">${esc(t)}</span>`;
    last = m.index + t.length;
  }
  return out + esc(code.slice(last));
}
export const pre = (code, cls = '') => `<pre class="${cls}">${hl(code.replace(/^\n/, ''))}</pre>`;
export const card = (title, body, o = {}) =>
  `<section class="card ${o.cls || ''}" style="${o.c ? `--c:var(--${o.c});` : ''}${o.style || ''}"><h3>${o.tag ? `<span class="tag">${o.tag}</span>` : ''}${title}${o.src ? `<span class="src">${o.src}</span>` : ''}</h3>${body}</section>`;
export const ex = (code, desc, viz) => `<div class="ex"><div class="lbl"><code>${hl(code)}</code><span>${desc}</span></div>${viz || ''}</div>`;
let pageNo = 0;
export const page = (title, sub, acc, body, o = {}) => {
  pageNo++;
  return `<div class="page" style="--acc:var(--${acc});${o.acc2 ? `--acc2:var(--${o.acc2});` : ''}">
  ${o.noHeader ? '' : `<header class="ph"><span class="num">${String(pageNo).padStart(2, '0')}</span><h1>${title}</h1><div class="sub">${sub}</div></header>`}
  ${body}
  <footer class="pf"><span>STRUDEL · CHEAT SHEET · live coding de música electrónica</span><span>verificado contra @strudel/core 1.2.6 · superdough 1.3.0</span><span>${pageNo}</span></footer></div>`;
};
