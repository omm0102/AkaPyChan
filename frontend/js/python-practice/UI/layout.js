// 控制「需要求助家教嗎？」 → 開/關 chat 面板
export function installChatToggle() {
  document.addEventListener("click", (e) => {

    // 支援動態插入的 openChat 按鈕
    const openBtn = e.target.closest(".openChat");
    const hideBtn = e.target.closest(".hiddenBtn");

    const chatbot = document.querySelector(".chat-editor .chatbot");
    const editor = document.querySelector(".chat-editor .editor");

    if (!chatbot || !editor) return;

    if (openBtn) {
      chatbot.classList.add("open");
      editor.classList.add("shrink");
      return;
    }

    if (hideBtn) {
      chatbot.classList.remove("open");
      editor.classList.remove("shrink");
      return;
    }
  });
}

// 監控 .scroll-area 是否內容溢出 → 加上 is-overflow class
export function installScrollAreaOverflowWatcher() {
  const area = document.querySelector(".scroll-area");
  if (!area) return;

  function updateOverflowState() {
    const isOverflow = area.scrollHeight > area.clientHeight + 1;
    area.classList.toggle("is-overflow", isOverflow);
  }

  // 初始檢查
  updateOverflowState();

  // 捲動時 / 視窗 resize 時重新檢查
  area.addEventListener("scroll", updateOverflowState);
  window.addEventListener("resize", updateOverflowState);
}
