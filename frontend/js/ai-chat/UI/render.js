// 產生聊天列（incoming/outgoing）
import { el } from "./dom-tools.js";

export function createChatLi(message, className) {
  const li = el("li", `chat ${className}`);

  if (className === "chat-incoming") {
    const icon = document.createElement("i");
    icon.className = "fas fa-robot";
    li.appendChild(icon);

    const wrap = document.createElement("div");
    wrap.className = "ai-rich-content";
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(String(message)));
    wrap.appendChild(p);
    li.appendChild(wrap);
  } else {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(String(message)));
    li.appendChild(p);
  }

  return li;
}