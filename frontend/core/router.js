// ══════════════════════════════════════════════════════════
// ROUTER — page switching, same pattern as QuantTERMINAL_OS
// ══════════════════════════════════════════════════════════

window.ROUTER = {
  current: 'heatmap',
  pages: {},

  register(id, initFn) {
    this.pages[id] = { init: initFn, ready: false };
  },

  navigate(id) {
    if (!this.pages[id]) return;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const page = document.getElementById('page-' + id);
    const nav = document.querySelector(`.nav-item[data-page="${id}"]`);
    if (page) page.classList.add('active');
    if (nav) nav.classList.add('active');
    this.current = id;
    if (!this.pages[id].ready) {
      this.pages[id].init();
      this.pages[id].ready = true;
    } else if (this.pages[id].refresh) {
      this.pages[id].refresh();
    }
  }
};
