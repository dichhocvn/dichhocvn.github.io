const {
  assert,
  validateSolarDateInput,
  validateAmLichDateInput,
} = require("./test-lib");

module.exports = [
  {
    name: "date-validation: solar rejects 31/4",
    fn: () => {
      const r = validateSolarDateInput(31, 4, 2024);
      assert.equal(r.ok, false);
      assert.ok(r.message && r.message.includes("30"));
    },
  },
  {
    name: "date-validation: solar rejects 30/2 non-leap",
    fn: () => {
      const r = validateSolarDateInput(30, 2, 2023);
      assert.equal(r.ok, false);
    },
  },
  {
    name: "date-validation: solar accepts 29/2 leap",
    fn: () => {
      const r = validateSolarDateInput(29, 2, 2024);
      assert.equal(r.ok, true);
    },
  },
  {
    name: "date-validation: solar rejects 29/2 non-leap",
    fn: () => {
      const r = validateSolarDateInput(29, 2, 2023);
      assert.equal(r.ok, false);
    },
  },
  {
    name: "date-validation: solar accepts normal date",
    fn: () => {
      assert.equal(validateSolarDateInput(11, 11, 1993).ok, true);
    },
  },
  {
    name: "date-validation: lunar rejects day beyond month length",
    fn: () => {
      // Tháng âm 1/1990 chỉ có 29 ngày (theo getLunarMonthDaysNoLeap trong lunar-calendar).
      const r = validateAmLichDateInput(30, 1, 1990);
      assert.equal(r.ok, false);
      assert.ok(r.message);
    },
  },
  {
    name: "date-validation: lunar rejects impossible day 31",
    fn: () => {
      const r = validateAmLichDateInput(31, 1, 2024);
      assert.equal(r.ok, false);
    },
  },
  {
    name: "date-validation: lunar accepts known valid sample",
    fn: () => {
      const r = validateAmLichDateInput(5, 9, 1993);
      assert.equal(r.ok, true);
    },
  },
];
