const { assert, solar2Lunar, lunar2Solar } = require("./test-lib");

module.exports = [
  {
    name: "calendar: duong->am known Tet 2024",
    fn: () => {
      const l = solar2Lunar(10, 2, 2024);
      assert.equal(l.ngay, 1);
      assert.equal(l.thang, 1);
      assert.equal(l.nam, 2024);
    },
  },
  {
    name: "calendar: duong->am known Tet 2023",
    fn: () => {
      const l = solar2Lunar(22, 1, 2023);
      assert.equal(l.ngay, 1);
      assert.equal(l.thang, 1);
      assert.equal(l.nam, 2023);
    },
  },
  {
    name: "calendar: duong->am known Tet 2025",
    fn: () => {
      const l = solar2Lunar(29, 1, 2025);
      assert.equal(l.ngay, 1);
      assert.equal(l.thang, 1);
      assert.equal(l.nam, 2025);
    },
  },
  {
    name: "calendar: leap-year days roundtrip stable",
    fn: () => {
      const samples = [
        [29, 2, 2020],
        [29, 2, 2024],
        [28, 2, 2023],
        [31, 12, 2024],
        [1, 1, 2025],
      ];
      for (const [dd, mm, yy] of samples) {
        const l = solar2Lunar(dd, mm, yy);
        const back = lunar2Solar(l.ngay, l.thang, l.nam, l.nhuan || 0);
        assert.deepStrictEqual(back, [dd, mm, yy], `roundtrip fail at ${dd}/${mm}/${yy}`);
      }
    },
  },
  {
    name: "calendar: broad roundtrip stability",
    fn: () => {
      const samples = [
        [1, 1, 2000],
        [11, 11, 1993],
        [25, 12, 2026],
        [30, 4, 1975],
        [10, 10, 2010],
      ];
      for (const [dd, mm, yy] of samples) {
        const l = solar2Lunar(dd, mm, yy);
        const back = lunar2Solar(l.ngay, l.thang, l.nam, l.nhuan || 0);
        assert.deepStrictEqual(back, [dd, mm, yy], `roundtrip fail at ${dd}/${mm}/${yy}`);
      }
    },
  },
];
