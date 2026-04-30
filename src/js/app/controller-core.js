// ── Controller: kết nối form → logic → render ────────────
    let _lastJson = null;

    function lapLaSo() {
      if ((window._currentTab || 'AL') !== 'SEARCH' && typeof clearSearchResultsState === 'function' && window._searchResults?.length) {
        clearSearchResultsState();
      }
      const errEl = document.getElementById('err');
      errEl.style.display = 'none';

      if (typeof isLysoTemplateActive === 'function' && isLysoTemplateActive()) {
        try {
          if (typeof renderLysoFromCurrentInputs === 'function' && renderLysoFromCurrentInputs()) {
            const wrap = document.getElementById('lasoWrap');
            const isFirstRender = wrap.style.display === 'none' || wrap.style.display === '';
            wrap.style.display = 'block';
            if (isFirstRender) {
              wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            requestAnimationFrame(() => { applyResponsiveLayout(); });
            return;
          }
        } catch (e) {
          errEl.textContent = '⚠ ' + e.message;
          errEl.style.display = 'block';
          return;
        }
      } else if (typeof toggleLysoApiMode === 'function') {
        toggleLysoApiMode(false);
      }

      const hoTen = document.getElementById('hoTen').value.trim();
      const ngay = parseInt(document.getElementById('ngay').value);
      const thang = parseInt(document.getElementById('thang').value);
      const nam = parseInt(document.getElementById('nam').value);
      const gioSinh = document.getElementById('gio').value.trim();
      const gioiTinh = document.getElementById('gt').value;

      // Tính toán — logic.js
      let lasoJson;
      try {
        lasoJson = TUVI_LOGIC.compute({ hoTen, ngay, thang, nam, gioSinh, gioiTinh });
      } catch (e) {
        errEl.textContent = '⚠ ' + e.message;
        errEl.style.display = 'block';
        return;
      }

      _lastJson = lasoJson;

      // Cập nhật chatbot info
      updateChatInfo(lasoJson);

      // // Tiêu đề
      // document.getElementById('lsTitle').textContent = hoTen
      //   ? `LÁ SỐ TỬ VI — ${hoTen.toUpperCase()}`
      //   : 'LÁ SỐ TỬ VI ĐẨU SỐ';

      // Render — render.js
      const gridEl = document.getElementById('grid');
      TUVI_RENDER.render(lasoJson, gridEl);

      // Hiện lá số — chỉ scroll lần đầu
      const wrap = document.getElementById('lasoWrap');
      const isFirstRender = wrap.style.display === 'none' || wrap.style.display === '';
      wrap.style.display = 'block';
      if (isFirstRender) {
        wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Scale responsive + layout
      requestAnimationFrame(() => { scaleGrid(); applyResponsiveLayout(); });
    }
