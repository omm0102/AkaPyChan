import { ensureHLJSAssets } from "../config/assets.js";
import { SELECTORS } from "../config/constants.js";

import { bindEnterToSend } from "../events/keyboard.js";
import { mountToolbars } from "../UI/toolbars.js";

import { createChatFlow } from "../controller/chat-flow.js";

if (!window.__chat_inited) {
  window.__chat_inited = true;

  window.addEventListener("DOMContentLoaded", () => {
    ensureHLJSAssets();

    // 取得必要 DOM
    const chatRoot = document.querySelector(SELECTORS.chatRoot);
    const chatInput = chatRoot?.querySelector("textarea");
    const sendBtn = chatRoot?.querySelector("i");
    const chatbox = document.querySelector(SELECTORS.chatbox);

    if (!chatInput || !sendBtn || !chatbox) {
      console.warn("[chat] 缺少必要節點，略過初始化。");
      return;
    }

    // 初始化聊天流程控制器
    const flow = createChatFlow({ chatRoot, chatInput, sendBtn, chatbox });

    const toolbarsApi = mountToolbars(chatRoot, chatbox, flow.sendViaUI);
    window.__toolbarsApi = toolbarsApi;

    bindEnterToSend(chatInput, sendBtn, () => flow.onInputResize());
    sendBtn.addEventListener("click", flow.handleUserSend);

    // 綁定 Enter to send
    bindEnterToSend(chatInput, sendBtn, () => flow.onInputResize());

    // 綁定按鈕事件 → 送出訊息
    sendBtn.addEventListener("click", flow.handleUserSend);

    const firstLi = document.querySelector(".chatbox .chat-incoming");
    const aiContent = firstLi?.querySelector(".ai-rich-content");
    const firstP = aiContent?.querySelector("p");

    if (firstP && aiContent) {
      const originalText = firstP.textContent.trim();
      aiContent.innerHTML = "";
      import("../UI/typewriter.js").then(({ typeParagraph }) => {
        typeParagraph(
          aiContent,
          originalText,
          () => {},
          () => {}
        );
      });
    }

    console.log("[ai-chat] 初始化完成！");
  });
}
