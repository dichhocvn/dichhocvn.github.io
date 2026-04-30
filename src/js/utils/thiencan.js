// ============================================================
// thiencan.js — tiện ích Thiên can dùng chung
// ============================================================

const TUVI_THIENCAN_UTIL = (() => {
  const NAMES = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const KEYS = ["giap", "at", "binh", "dinh", "mau", "ky", "canh", "tan", "nham", "quy"];

  function keyToIdx(key) {
    const idx = KEYS.indexOf(String(key || "").trim().toLowerCase());
    if (idx < 0) throw new Error(`TTL can key không hợp lệ: ${key}`);
    return idx;
  }

  function nameToIdx(name, canList) {
    const source = Array.isArray(canList) ? canList : NAMES;
    return source.indexOf(name);
  }

  return { NAMES, KEYS, keyToIdx, nameToIdx };
})();

globalThis.TUVI_THIENCAN_UTIL = TUVI_THIENCAN_UTIL;
