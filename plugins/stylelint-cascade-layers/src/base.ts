import stylelint from "stylelint";
import type { Container, ChildNode, Declaration } from "postcss";

export const ruleName = "cascade-layers/require-layers";

export const ruleMeta = {
  url: "https://github.com/mrtnvh/stylelint-stuff",
};

export const ruleMessages = stylelint.utils.ruleMessages(ruleName, {
  cascadeLayers: (type, name) => {
    return `Unexpected unlayered ${type} "${name}"`;
  },
});
