import { scrollToBottom } from "../UI/dom-tools.js";
import { typeParagraph, insertCodeBlock } from "../UI/typewriter.js";
import { createChatLi } from "../UI/render.js";
import {
  messages,
  pushMsg,
  currentChatId,
  chosenMode,
  setChosenMode,
  consumePendingMode
} from "../core/state.js";
import { chatToBackend } from "../core/transport.js";

export function createChatFlow({ chatRoot, chatInput, sendBtn, chatbox }) {

  // -----------------------------
  // 1. 封裝 UI 送出功能（給 toolbars 用）
  // -----------------------------
  function sendViaUI(arg) {
    if (typeof arg === "string") {
      chatInput.value = arg;
      chatInput.removeAttribute("data-display");
    } else if (arg && typeof arg === "object") {
      chatInput.value = arg.payload ?? "";
      if (arg.display) chatInput.setAttribute("data-display", arg.display);
      else chatInput.removeAttribute("data-display");
    }

    chatInput.dispatchEvent(new Event("input", { bubbles: true }));
    sendBtn.click();
  }

  // -----------------------------
  // 2. textarea resize callback（提供給 keyboard.js）
  // -----------------------------
  function onInputResize() {
    scrollToBottom(chatbox);
  }

  // -----------------------------
  // 3. 主流程：處理使用者送出訊息
  // -----------------------------
  let isSending = false;
  let aborter = null;

  async function handleUserSend() {
    const userText = chatInput.value.trim();
    if (!userText || isSending) return;

    const overrideDisplay = chatInput.getAttribute("data-display");
    const userDisplay = overrideDisplay || userText;
    chatInput.removeAttribute("data-display");

    isSending = true;
    sendBtn.classList.add("is-disabled");
    sendBtn.style.pointerEvents = "none";

    chatbox.appendChild(createChatLi(userDisplay, "chat-outgoing"));
    chatInput.value = "";
    scrollToBottom(chatbox, true);

    if (!messages.some(m => m.role === "system")) {
      pushMsg("system", "你是助教，回覆請用繁體中文。");
    }

    const hasChosenMode = messages.some(
      m => m.role === "user" &&
      ["1", "2", "3"].includes(String(m.content).trim())
    );

    const isControlOnly = /^[MmNnYyAa]$/.test(userText);

    if (!hasChosenMode && !isControlOnly) {
      const pending = consumePendingMode();
      if (pending) {
        pushMsg("user", String(pending));
        setChosenMode(String(pending));
      } else {
        pushMsg("user", "1");
        setChosenMode("1");
      }
    } else if (!hasChosenMode && isControlOnly && chosenMode) {
      pushMsg("user", chosenMode);
    }

    pushMsg("user", userText);

    const liIncoming = createChatLi("Thinking", "chat-incoming");
    chatbox.appendChild(liIncoming);
    scrollToBottom(chatbox, true);

    const wrapInit = liIncoming.querySelector(".ai-rich-content");
    let pNode = wrapInit?.querySelector("p");
    let dotCount = 0;
    let thinkingActive = true;

    const thinkingTimer = setInterval(() => {
      if (!thinkingActive || !pNode) return;
      dotCount = (dotCount + 1) % 4;
      pNode.textContent = "Thinking" + ".".repeat(dotCount);
    }, 400);

    try {
      aborter?.abort();
      aborter = new AbortController();

      const text = await chatToBackend(
        { chat_id: String(currentChatId), messages },
        aborter.signal
      );

      clearInterval(thinkingTimer);
      thinkingActive = false;

      let wrap = wrapInit;
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "ai-rich-content";
        if (pNode && pNode.isConnected) pNode.replaceWith(wrap);
        else liIncoming.appendChild(wrap);
      } else {
        wrap.innerHTML = "";
      }

      const scrollCb = () => scrollToBottom(chatbox);
      const finish = () => {
        pushMsg("assistant", text);

        // 交給工具列做模式切換分析
        const { analyzeAssistantText } = window.__toolbarsApi || {};
        if (analyzeAssistantText) analyzeAssistantText(text);

        scrollToBottom(chatbox, true);
      };

      if (/```/.test(text)) {
        const parts = text.split(/```/);
        let idx = 0;

        while (idx < parts.length && /^\s*$/.test(parts[idx])) idx++;

        const step = () => {
          if (idx >= parts.length) return finish();

          const seg = parts[idx++];
          if ((idx - 1) % 2 === 0) {
            typeParagraph(wrap, seg, step, scrollCb);
          } else {
            insertCodeBlock(wrap, seg, step, scrollCb);
          }
        };

        setTimeout(step, 120);
      } else {
        typeParagraph(wrap, text, finish, scrollCb);
      }
    } catch (e) {
      const wrap =
        liIncoming.querySelector(".ai-rich-content") ||
        (() => {
          const w = document.createElement("div");
          w.className = "ai-rich-content";
          liIncoming.appendChild(w);
          return w;
        })();

      wrap.innerHTML = "";
      const p = document.createElement("p");
      p.textContent = `發生錯誤：${e?.message || e}`;
      wrap.appendChild(p);
    } finally {
      isSending = false;
      sendBtn.classList.remove("is-disabled");
      sendBtn.style.pointerEvents = "";
    }
  }

  // -------------------------------------------------------------
  // 最終回傳：main.js 會取得這些控制器方法
  // -------------------------------------------------------------
  return {
    sendViaUI,
    onInputResize,
    handleUserSend
  };
}