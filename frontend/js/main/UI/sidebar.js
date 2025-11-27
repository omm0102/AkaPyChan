export function installSidebarEvents({ menu, toggleBtn, onSelect }) {

  // 左側選單事件
  if (menu) {
    menu.addEventListener("click", (e) => {
      const li = e.target.closest(".M-Unit, .S-Unit");
      if (!li || !menu.contains(li)) return;
      if (!li.dataset.id || li.classList.contains("is-disabled")) return;

      // UI 樣式更新
      menu.querySelectorAll(".active").forEach(n => n.classList.remove("active"));
      li.classList.add("active");

      // 通知 controller
      onSelect?.(li.dataset.id);
    });
  }

  // 收合 sidebar
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed");
    });
  }
}