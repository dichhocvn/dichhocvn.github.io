const { assert, TUVI_DATA, TUVI_LOGIC, getAllStars } = require("./test-lib");

module.exports = [
  {
    name: "stars: important main stars exist exactly once",
    fn: () => {
      const laso = TUVI_LOGIC.compute({
        hoTen: "Star Check",
        ngay: 12,
        thang: 8,
        nam: 1990,
        gioSinh: "13:00",
        gioiTinh: "nu",
        method: "trungchau",
      });
      const all = getAllStars(laso).map((x) => x.star.name);
      const mustOne = ["Tử Vi", "Thiên Phủ", "Thất Sát", "Phá Quân"];
      mustOne.forEach((name) => {
        assert.equal(all.filter((x) => x === name).length, 1, `${name} must appear once`);
      });
    },
  },
  {
    name: "stars: triet stars align with yearly table",
    fn: () => {
      const input = {
        hoTen: "Triet Check",
        ngay: 10,
        thang: 7,
        nam: 1993,
        gioSinh: "06:00",
        gioiTinh: "nam",
      };
      const laso = TUVI_LOGIC.compute({ ...input, method: "trungchau" });
      const canNam = ((input.nam - 4) % 10 + 10) % 10;
      const trietChis = TUVI_DATA.TRIET[canNam];
      const chiIdx = TUVI_DATA.CHI;
      const hasTrietAt = new Set(
        laso.cung
          .filter((c) => c.sao.some((s) => s.name === "Triệt"))
          .map((c) => chiIdx.indexOf(c.diaChi))
      );
      assert.equal(hasTrietAt.size, 2);
      assert.ok(hasTrietAt.has(trietChis[0]));
      assert.ok(hasTrietAt.has(trietChis[1]));
    },
  },
];
