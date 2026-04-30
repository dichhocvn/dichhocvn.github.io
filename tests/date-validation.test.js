const { assert, validateSolarDateInput, validateAmLichDateInput } = require("./test-lib");

module.exports = [
  {
    name: "date-validation: invalid solar date 31/2 rejected",
    fn: () => {
      const out = validateSolarDateInput(31, 2, 2050);
      assert.equal(out.ok, false);
    },
  },
  {
    name: "date-validation: valid lunar date accepted",
    fn: () => {
      const out = validateAmLichDateInput(8, 2, 2050);
      assert.equal(out.ok, true);
    },
  },
];
