import { LESSON_BASE } from "../config/constants.js";
import { fetchLessonById } from "../core/lessons-api.js";
import { renderLesson } from "../UI/render-lesson.js";
import { scrollToTop } from "../UI/dom-tools.js";

export function createLessonFlow({ menu, textRoot, toggleBtn }) {

  // 由 UI 事件通知時執行
  async function onSelectLesson(id) {
    await loadLessonById(id);
    scrollToTop();
    location.hash = "unit=" + encodeURIComponent(id);
  }

  // 讀課程資料
  async function loadLessonById(id) {
    try {
      const data = await fetchLessonById(id);
      renderLesson(data, id);
    } catch (err) {
      console.error(err);
      const base = String(LESSON_BASE || "/data/lessons").replace(/\/+$/, "");
      textRoot.innerHTML = `
        <h1 class="title">讀取失敗</h1>
        <p class="intro">
          無法載入 <code>${base + "/" + encodeURIComponent(id) + ".json"}</code><br>
          <small>${String(err.message || err)}</small>
        </p>
      `;
    }
  }

  // 處理 hash (#unit=xxx)
  async function handleHash(defaultId) {
    const m = location.hash.match(/unit=([^&]+)/);
    const id = m ? decodeURIComponent(m[1]) : null;

    if (id) {
      if (menu) {
        const node = menu.querySelector(`[data-id="${CSS.escape(id)}"]`);
        if (node) node.classList.add("active");
      }
      try {
        await loadLessonById(id);
        scrollToTop();
        return true;
      } catch {}
    }

    return false;
  }

  // 預設載入課程
  async function loadDefault(defaultId) {
    if (menu) {
      const firstValid = Array.from(menu.querySelectorAll(".M-Unit, .S-Unit"))
        .find(el => el.dataset && el.dataset.id);
      if (firstValid) {
        firstValid.click(); 
        return;
      }
    }

    await loadLessonById(defaultId);
    scrollToTop();
    location.hash = "unit=" + encodeURIComponent(defaultId);
  }

  // 啟動主流程
  async function start(defaultLessonId) {
    // hash 優先
    const ok = await handleHash(defaultLessonId);
    if (!ok) await loadDefault(defaultLessonId);
  }

  return {
    start,
    loadLessonById,
    onSelectLesson,  // 提供 UI/sidebar-events.js 呼叫
  };
}