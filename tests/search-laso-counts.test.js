const { assert, TUVI_LOGIC, solar2Lunar } = require("./test-lib");

const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tị", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const CAT_TINH_TARGETS = new Set(["thiên khôi", "thiên việt", "văn xương", "văn khúc", "hóa lộc", "hóa quyền", "hóa khoa", "tả phụ", "hữu bật"]);
const HUNG_TINH_TARGETS = new Set(["linh tinh", "hỏa tinh", "kình dương", "đà la", "địa không", "địa kiếp", "hóa kỵ"]);

function normalizeStarName(name) {
  return String(name || "")
    .replace(/^(ĐV\.|L\.)\s*/i, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(miếu|vượng|đắc|hãm|mieu|vuong|dac|ham)\b/gi, " ")
    .replace(/(?:^|\s)[mvbh](?=\s|$)/gi, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function countForCase({ dd, mm, yy, gioSinh }) {
  const lunar = solar2Lunar(dd, mm, yy);
  const laso = TUVI_LOGIC.compute({
    hoTen: "Search Count Test",
    ngay: lunar.ngay,
    thang: lunar.thang,
    nam: lunar.nam,
    gioSinh,
    gioiTinh: "nam",
  });
  const menh = laso.cung.find((c) => c.cungChuc === "Mệnh");
  const menhChi = CHI.indexOf(menh.diaChi);
  const doiChi = (menhChi + 6) % 12;
  const tam = [[8, 0, 4], [5, 9, 1], [2, 6, 10], [11, 3, 7]].find((g) => g.includes(menhChi)) || [];
  const related = new Set([menhChi, doiChi, ...tam]);
  const cungs = laso.cung.filter((c) => related.has(CHI.indexOf(c.diaChi)));
  let catCount = 0;
  let hungCount = 0;
  cungs.forEach((c) =>
    c.sao.forEach((s) => {
      const n = normalizeStarName(s.name);
      if (CAT_TINH_TARGETS.has(n)) catCount++;
      if (HUNG_TINH_TARGETS.has(n)) hungCount++;
    })
  );
  return { menhChi: menh.diaChi, catCount, hungCount };
}

module.exports = [
  {
    name: "search-counts: 30/04/2026 DL gio Suu has expected cat/hung",
    fn: () => {
      const out = countForCase({ dd: 30, mm: 4, yy: 2026, gioSinh: "01:00" });
      assert.equal(out.menhChi, "Mão");
      assert.equal(out.catCount, 4);
      assert.equal(out.hungCount, 1);
    },
  },
  {
    name: "search-counts: 30/04/2026 DL gio Mao has expected cat/hung",
    fn: () => {
      const out = countForCase({ dd: 30, mm: 4, yy: 2026, gioSinh: "05:00" });
      assert.equal(out.menhChi, "Sửu");
      assert.equal(out.catCount, 4);
      assert.equal(out.hungCount, 1);
    },
  },
];

