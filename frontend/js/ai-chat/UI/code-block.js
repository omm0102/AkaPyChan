import { escapeHTML } from "./dom-tools.js";

export function buildCodeBlockHtml(code, lang = "plaintext") {
  const id = `code-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `
    <div class="code-block">
      <div class="code-header">
        <span class="lang-label">${escapeHTML(lang)}</span>
        <button class="copy-btn" data-target="${id}" title="複製程式碼">複製程式碼</button>
      </div>
      <pre><code id="${id}" class="language-${escapeHTML(lang)}">${escapeHTML(code)}</code></pre>
    </div>
  `;
}