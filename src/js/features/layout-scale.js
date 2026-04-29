// ── Responsive scale lá số ───────────────────────────────
    function scaleGrid() {
      const outer = document.getElementById('gridScalerOuter');
      const scaler = document.getElementById('gridScaler');
      const grid = document.getElementById('grid');
      if (!scaler || !grid || !outer) return;

      // Reset
      scaler.style.transform = 'scale(1)';
      outer.style.height = '';

      const gridW = grid.offsetWidth;
      const gridH = grid.offsetHeight;
      const outerW = outer.clientWidth; // đã trừ padding 5px mỗi bên

      if (outerW < gridW) {
        const scale = outerW / gridW;
        scaler.style.transformOrigin = 'top center';
        scaler.style.transform = `scale(${scale})`;
        outer.style.height = (gridH * scale) + 'px';
      } else {
        scaler.style.transform = 'scale(1)';
        outer.style.height = gridH + 'px';
      }
      // Re-render pill Triệt/Tuần theo tọa độ mới sau scale
      TUVI_RENDER.reRenderPills();
    }

    window.addEventListener('resize', scaleGrid);
