// ============================================================
// thiencan.js — tiện ích Thiên can dùng chung
// ============================================================

const TUVI_THIENCAN_UTIL = (() => {
  const KEYS = ["giap", "at", "binh", "dinh", "mau", "ky", "canh", "tan", "nham", "quy"];

  function keyToIdx(key) {
    const idx = KEYS.indexOf(String(key || "").trim().toLowerCase());
    if (idx < 0) throw new Error(`TTL can key không hợp lệ: ${key}`);
    return idx;
  }

  function nameToIdx(name, canList) {
    const source = Array.isArray(canList) ? canList : (TUVI_DATA && TUVI_DATA.CAN) || [];
    return source.indexOf(name);
  }

  return { KEYS, keyToIdx, nameToIdx };
})();
