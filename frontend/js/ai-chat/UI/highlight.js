export function highlightBlock(codeElem) {
  if (window.hljs) {
    window.hljs.highlightElement(codeElem);
  }
}

export function applyHLJS(container) {
  if (!window.hljs) return;

  container.querySelectorAll("pre code").forEach((block) => {
    window.hljs.highlightElement(block);
  });
}