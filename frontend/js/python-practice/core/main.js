import { installPopstateHandler, initOnDOMContentLoaded } from "../controller/router.js";
import { installClickDelegation } from "../events/events.js";
import { installEditorAndRunner } from "../UI/editor.js";
import { installSidebarToggle } from "../UI/sidebar.js";
import { setupButtons } from "../buttons/index.js";
import { installRandomPicker } from "../controller/random.js";
import { getSetId, loadCur } from "./state.js";
import { installChatToggle, installScrollAreaOverflowWatcher } from "../UI/layout.js";

export function initPythonPractice() {
  // Router：處理 URL / 返回主選單 / popstate
  installPopstateHandler();
  initOnDOMContentLoaded();

  // 主選單點擊事件委派
  installClickDelegation();

  // Editor + 判題按鈕初始化
  installEditorAndRunner();

  // Sidebar 收合
  installSidebarToggle();

  // 判題 / 提示 / 答案 / 翻譯 按鈕
  setupButtons();

  // 隨機出題區塊
  installRandomPicker();

  // Python 家教 chat 開關 ＋ 捲動區 overflow 樣式
  installChatToggle();
  installScrollAreaOverflowWatcher();

  // 方便除錯：保留原本掛在 window 上的工具
  window.getSetId = getSetId;
  window.loadCur = loadCur;
}

// DOM Ready 後初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPythonPractice, { once: true });
} else {
  initPythonPractice();
}
