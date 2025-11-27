import { DEFAULT_LESSON_ID } from "../config/constants.js";
import { createLessonFlow } from "../controller/lesson-flow.js";
import { installSidebarEvents } from "../UI/sidebar.js";

window.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("unitContenter");
  const textRoot = document.querySelector(".textContent");
  const toggleBtn = document.querySelector(".leftsideBtn");

  const flow = createLessonFlow({ menu, textRoot, toggleBtn });

  // UI 事件綁定 → 流程控制器
  installSidebarEvents({
    menu,
    toggleBtn,
    onSelect: flow.onSelectLesson
  });

  // 啟動流程（hash / 預設選單）
  flow.start(DEFAULT_LESSON_ID);
});