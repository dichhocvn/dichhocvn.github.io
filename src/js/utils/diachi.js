// ============================================================
// diachi.js — tiện ích Địa chi dùng chung
// ============================================================

const TUVI_DIACHI_UTIL = (() => {
  const KEYS = ["ty", "suu", "dan", "mao", "thin", "ti", "ngo", "mui", "than", "dau", "tuat", "hoi"];
  const MONTH_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  function keyToIdx(key, label = "chi") {
    const idx = KEYS.indexOf(String(key || "").trim().toLowerCase());
    if (idx < 0) throw new Error(`TTL ${label} key không hợp lệ: ${key}`);
    return idx;
  }

  function nameToIdx(name, chiList) {
    const source = Array.isArray(chiList) ? chiList : (TUVI_DATA && TUVI_DATA.CHI) || [];
    return source.indexOf(name);
  }

  function splitPairToIdx(pairText) {
    const parts = String(pairText || "").split("+").map((s) => s.trim());
    return [keyToIdx(parts[0]), keyToIdx(parts[1])];
  }

  return { KEYS, MONTH_KEYS, keyToIdx, nameToIdx, splitPairToIdx };
})();
