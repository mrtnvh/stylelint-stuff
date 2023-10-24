const { resolve } = require("node:path");
const { describe, test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const config = require("./core");
const fs = require("fs");
const stylelint = require("stylelint");

describe("core", () => {
  describe("flags no warnings with valid css", () => {
    const validCss = fs.readFileSync(resolve(__dirname, "./core.valid.css"), "utf-8");
    let result;

    beforeEach(async () => {
      result = await stylelint.lint({
        code: validCss,
        config,
      });
    });

    test("did not error", () => {
      assert.equal(result.errored, false);
    });

    test("flags no warnings", () => {
      assert.equal(result.results[0].warnings.length, 0);
    });
  });

  describe("flags warnings with invalid css", () => {
    const invalidCss = fs.readFileSync(resolve(__dirname, "./core.invalid.css"), "utf-8");
    let result;

    beforeEach(async () => {
      result = await stylelint.lint({
        code: invalidCss,
        config,
      });
    });

    test("did error", () => {
      assert.equal(result.errored, true);
    });

    test("flags warnings", () => {
      assert.equal(result.results[0].warnings.length, 6);
    });

    test("correct warning text", () => {
      assert.deepEqual(
        result.results[0].warnings.map((w) => w.text),
        [
          'Expected variable, function or keyword for "#000" of "color" (scale-unlimited/declaration-strict-value)',
          "Unknown at-rule `@custom-media` (csstree/validator)",
          'Expected "padding" to come before "color" (order/properties-order)',
          'Expected custom media query name "--FOO" to be kebab-case',
          'Expected keyframe name "FOO" to be kebab-case',
          'Expected id selector "#FOO" to be kebab-case',
        ]
      );
    });

    test("correct rule flagged", () => {
      assert.deepStrictEqual(
        result.results[0].warnings.map((w) => w.rule),
        [
          "scale-unlimited/declaration-strict-value",
          "csstree/validator",
          "order/properties-order",
          "custom-media-pattern",
          "keyframes-name-pattern",
          "selector-id-pattern",
        ]
      );
    });

    test("correct severity flagged", () => {
      assert.equal(result.results[0].warnings[0].severity, "error");
    });

    test("correct line number", () => {
      assert.equal(result.results[0].warnings[0].line, 14);
    });

    test("correct column number", () => {
      assert.equal(result.results[0].warnings[0].column, 3);
    });
  });

  describe("deprecated rules", () => {
    const deprecatedRuleNames = Object.values(stylelint.rules)
      .filter((rule) => rule.meta.deprecated)
      .map((rule) => rule.ruleName);

    const testFn = deprecatedRuleNames.length === 0 ? test.skip : test;

    testFn("exclude deprecate rules", () => {
      // eslint-disable-next-line jest/no-standalone-expect -- If not using `it` directly, false positives occur.
      const includesDeprecatedRule = deprecatedRuleNames.some((ruleName) =>
        Object.keys(config.rules).includes(ruleName)
      );
      assert.equal(includesDeprecatedRule, false);
    });
  });
});
