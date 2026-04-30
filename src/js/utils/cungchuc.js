// ============================================================
// cungchuc.js — tiện ích Cung chức dùng chung
// ============================================================

const TUVI_CUNGCHUC_UTIL = (() => {
  const ORDER = [
    "Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch", "Quan Lộc", "Nô Bộc",
    "Thiên Di", "Tật Ách", "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ",
  ];

  function indexOf(name, list) {
    const source = Array.isArray(list) ? list : ((TUVI_DATA && TUVI_DATA.TEN_CUNG) || ORDER);
    return source.indexOf(name);
  }

  return { ORDER, indexOf };
})();

globalThis.TUVI_CUNGCHUC_UTIL = TUVI_CUNGCHUC_UTIL;
