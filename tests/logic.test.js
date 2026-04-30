const { assert, TUVI_LOGIC } = require("./test-lib");

module.exports = [
  {
    name: "logic: chi gio mapping boundaries",
    fn: () => {
      assert.equal(TUVI_LOGIC.chiGioFromStr("23:30"), 0);
      assert.equal(TUVI_LOGIC.chiGioFromStr("00:10"), 0);
      assert.equal(TUVI_LOGIC.chiGioFromStr("01:00"), 1);
      assert.equal(TUVI_LOGIC.chiGioFromStr("22:59"), 11);
      assert.equal(TUVI_LOGIC.chiGioFromStr("25:00"), null);
    },
  },
  {
    name: "logic: compute returns valid shape",
    fn: () => {
      const laso = TUVI_LOGIC.compute({
        hoTen: "Test User",
        ngay: 5,
        thang: 9,
        nam: 1993,
        gioSinh: "04:00",
        gioiTinh: "nam",
        method: "trungchau",
      });
      assert.ok(laso && laso.meta && Array.isArray(laso.cung));
      assert.equal(laso.cung.length, 12);
      assert.ok(laso.cung.every((c) => c.cungChuc && c.diaChi && Array.isArray(c.sao)));
      assert.equal(laso.cung.filter((c) => c.cungChuc === "Mệnh").length, 1);
      assert.equal(laso.cung.filter((c) => c.isThan).length, 1);
    },
  },
  {
    name: "logic: invalid lunar day rejected",
    fn: () => {
      assert.throws(
        () =>
          TUVI_LOGIC.compute({
            hoTen: "Bad Day",
            ngay: 31,
            thang: 1,
            nam: 2000,
            gioSinh: "10:00",
            gioiTinh: "nam",
            method: "trungchau",
          }),
        /Ngày âm lịch/
      );
    },
  },
  {
    name: "logic: thaithulang method computes with TTL tables",
    fn: () => {
      const input = {
        hoTen: "Method Compare",
        ngay: 8,
        thang: 7,
        nam: 2008,
        gioSinh: "10:30",
        gioiTinh: "nam",
      };
      const tc = TUVI_LOGIC.compute({ ...input, method: "trungchau" });
      const ttl = TUVI_LOGIC.compute({ ...input, method: "thaithulang" });
      assert.equal(ttl.meta.chiCungMenh, tc.meta.chiCungMenh);
      assert.equal(ttl.meta.tenCuc, tc.meta.tenCuc);
      assert.equal(ttl.cung.length, 12);
      assert.notEqual(JSON.stringify(ttl.cung), JSON.stringify(tc.cung));
    },
  },
];
