// ── Separator drag-to-resize ──────────────────────────────
    (function () {
      const sep = document.getElementById('separator');
      const colChat = document.getElementById('colChat');
      let dragging = false, startX = 0, startW = 0;

      sep.addEventListener('mousedown', e => {
        dragging = true; startX = e.clientX; startW = colChat.offsetWidth;
        sep.classList.add('dragging');
        document.body.style.userSelect = 'none';
      });
      document.addEventListener('mousemove', e => {
        if (!dragging) return;
        const delta = e.clientX - startX;
        const newW = Math.max(200, Math.min(600, startW + delta));
        colChat.style.width = newW + 'px';
        requestAnimationFrame(scaleGrid);
      });
      document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        sep.classList.remove('dragging');
        document.body.style.userSelect = '';
      });
    })();
