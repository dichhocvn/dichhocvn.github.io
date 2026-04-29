// ── Lưu lá số dạng ảnh PNG ───────────────────────────────
    function luuAnh() {
      const gridEl = document.getElementById('grid');
      if (!gridEl || !_lastJson) return;

      const btn = document.querySelector('.btn-save');
      btn.textContent = '⏳ Đang xuất...';
      btn.disabled = true;

      html2canvas(gridEl, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      }).then(canvas => {
        const link = document.createElement('a');
        const hoTen = _lastJson.meta.hoTen || 'laso';
        const { ngayAL, thangAL, namAL } = _lastJson.meta;
        link.download = `tuvi_${hoTen}_${ngayAL}-${thangAL}-${namAL}.png`.replace(/\s+/g, '_');
        link.href = canvas.toDataURL('image/png');
        link.click();
        btn.textContent = '💾 Lưu ảnh';
        btn.disabled = false;
      }).catch(() => {
        btn.textContent = '💾 Lưu ảnh';
        btn.disabled = false;
      });
    }
