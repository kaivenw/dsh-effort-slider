/** 把 styles.css（esbuild 以 text loader 打进来）注入一次；重复调用幂等。 */

const TAG_ID = '@local/dsh-effort-slider/styles.css';

export function installStyles(doc, css) {
  if (doc === undefined || doc === null || typeof css !== 'string') return;
  if (doc.querySelector('style[data-dsh-effort-slider]') !== null) return;
  const tag = doc.createElement('style');
  tag.dataset.dshEffortSlider = '';
  tag.dataset.plugin = '@local/dsh-effort-slider';
  tag.dataset.pluginCss = TAG_ID;
  tag.textContent = css;
  doc.head.appendChild(tag);
}
