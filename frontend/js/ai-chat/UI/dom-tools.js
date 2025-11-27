export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = String(text);
  return node;
}

export function escapeHTML(str = "") {
  return String(str).replace(/[&<>]/g, ch =>
    ch === "&" ? "&amp;" :
    ch === "<" ? "&lt;" : "&gt;"
  );
}

export function renderBoldText(text) {
  const safe = escapeHTML(text);
  const html = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const span = document.createElement("span");
  span.innerHTML = html;
  return span;
}

export function renderMessageWithCode(text) {
  const wrap = document.createElement("div");
  wrap.className = "ai-rich-content";

  const parts = String(text).split(/```/);

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      const p = document.createElement("p");
      p.appendChild(renderBoldText(parts[i]));
      wrap.appendChild(p);
    } else {
      const holder = document.createElement("div");
      wrap.appendChild(holder);
    }
  }
  return wrap;
}

export function isNearBottom(elem, gap = 48) {
  return elem.scrollHeight - elem.scrollTop - elem.clientHeight < gap;
}

export function scrollToBottom(elem, force = false) {
  if (force || isNearBottom(elem)) {
    elem.scrollTop = elem.scrollHeight;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  }
}