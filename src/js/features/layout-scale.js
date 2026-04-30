// ── Responsive scale lá số ───────────────────────────────
    function cssLengthToPx(len, anchorEl) {
      const raw = String(len || '').trim();
      if (!raw) return 0;
      if (/^-?\d+(\.\d+)?$/.test(raw)) return Number.parseFloat(raw);
      const probe = document.createElement('div');
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      probe.style.height = raw;
      probe.style.pointerEvents = 'none';
      (anchorEl || document.body || document.documentElement).appendChild(probe);
      const px = probe.getBoundingClientRect().height || 0;
      probe.remove();
      return px;
    }

    function scaleGrid() {
      const outer = document.getElementById('gridScalerOuter');
      const scaler = document.getElementById('gridScaler');
      const grid = document.getElementById('grid');
      const wrap = document.getElementById('lasoWrap');
      if (!scaler || !grid || !outer || !wrap) return;

      const HAN_NAV_TOP_GAP_PX = 3;
      const BASE_ROWS = 4;
      const INNER_ROW_GAPS_PX = BASE_ROWS - 1;
      const OUTER_BORDER_PX = 4; // .grid border 2px top + 2px bottom

      // Reset
      scaler.style.transform = 'scale(1)';
      outer.style.height = '';

      const gridW = grid.offsetWidth;
      const actualGridH = grid.offsetHeight;
      const outerW = outer.clientWidth; // đã trừ padding 5px mỗi bên
      const reserveTopRaw = getComputedStyle(wrap).getPropertyValue('--laso-overflow-top-reserve');
      const reserveTopPx = cssLengthToPx(reserveTopRaw, wrap);
      const cellHRaw = getComputedStyle(wrap).getPropertyValue('--laso-cell-height');
      const cellHPx = cssLengthToPx(cellHRaw, wrap);
      const baseGridH = cellHPx * BASE_ROWS + INNER_ROW_GAPS_PX + OUTER_BORDER_PX;
      const overflowExtra = Math.max(0, actualGridH - baseGridH);
      const scale = outerW < gridW ? (outerW / gridW) : 1;
      const overflowScaled = overflowExtra * scale;
      const baseScaled = baseGridH * scale;
      const translateY = reserveTopPx - overflowScaled;

      scaler.style.transformOrigin = 'top center';
      scaler.style.transform = `translateY(${translateY}px) scale(${scale})`;
      // Khung giữ cố định theo base height + reserve, để các block dưới đứng yên.
      outer.style.height = (baseScaled + reserveTopPx + HAN_NAV_TOP_GAP_PX) + 'px';
      // Re-render pill Triệt/Tuần theo tọa độ mới sau scale
      TUVI_RENDER.reRenderPills();
    }

    window.addEventListener('resize', scaleGrid);
