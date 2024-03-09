const { resolve } = require("node:path");
const { describe, test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const config = require("./a11y");
const fs = require("fs");
const stylelint = require("stylelint");

describe("a11y", () => {
  describe("flags no warnings with valid css", () => {
    const validCss = fs.readFileSync(resolve(__dirname, "./a11y.valid.css"), "utf-8");
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
    const invalidCss = fs.readFileSync(resolve(__dirname, "./a11y.invalid.css"), "utf-8");
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
      assert.equal(result.results[0].warnings.length, 5);
    });

    test("correct warning text", () => {
      assert.deepEqual(
        result.results[0].warnings.map((w) => w.text),
        [
          'Unexpected using "content" property in .foo (a11y/content-property-no-static-value)',
          "Expected a larger font-size in .foo (a11y/font-size-is-readable)",
          'Unexpected using obsolete selector "xmp" (a11y/no-obsolete-element)',
          "Unexpected max-width in .foo (a11y/no-spread-text)",
          'Unexpected using "{ text-align: justify; }" in .foo (a11y/no-text-align-justify)',
        ]
      );
    });

    test("correct rule flagged", () => {
      assert.deepStrictEqual(
        result.results[0].warnings.map((w) => w.rule),
        [
          "a11y/content-property-no-static-value",
          "a11y/font-size-is-readable",
          "a11y/no-obsolete-element",
          "a11y/no-spread-text",
          "a11y/no-text-align-justify",
        ]
      );
    });

    test("correct severity flagged", () => {
      assert.equal(result.results[0].warnings[0].severity, "error");
    });

    test("correct line number", () => {
      assert.equal(result.results[0].warnings[0].line, 1);
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
