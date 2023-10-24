module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],

  plugins: [
    "stylelint-declaration-strict-value",
    "stylelint-declaration-block-no-ignored-properties",
    "stylelint-high-performance-animation",
    "stylelint-selector-tag-no-without-class",
    "stylelint-use-nesting",
    "stylelint-csstree-validator",
    "stylelint-plugin-logical-css",
  ],

  rules: {
    // base
    "max-nesting-depth": 3, // just google 'the-inception-rule'

    // url() function
    "function-url-no-scheme-relative": true, // use explicit https
    "function-url-quotes": "always",

    // fonts
    "font-weight-notation": "numeric",

    // media queries
    "media-feature-name-no-unknown": [true, { ignoreMediaFeatureNames: [/.*-(inline|block)-size/] }],

    // vendor prefixes are forbidden, use autoprefixer
    "at-rule-no-vendor-prefix": true,
    "media-feature-name-no-vendor-prefix": true,
    "property-no-vendor-prefix": true,
    "value-no-vendor-prefix": true,
    "selector-no-vendor-prefix": true,

    // comments

    // scss declarations

    "plugin/declaration-block-no-ignored-properties": true,
    "scale-unlimited/declaration-strict-value": [
      ["/color/", "z-index", "font-size", "font-family"],
      {
        ignoreKeywords: {
          "": ["inherit"],
          "/color/": ["currentColor", "transparent", "inherit"],
        },
        disableFix: true,
      },
    ],

    // css selectors
    "selector-attribute-quotes": "always",
    "selector-max-universal": 1,
    "selector-max-specificity": "1,3,3", // id,class,type
    "selector-max-compound-selectors": 3,

    // scss if-else
    "at-rule-empty-line-before": [
      "always",
      {
        ignoreAtRules: ["else"],
        except: ["blockless-after-same-name-blockless", "first-nested"],
        ignore: ["after-comment"],
      },
    ],

    // using only oklch colors
    "color-named": "never",

    // use performant animations
    "plugin/no-low-performance-animation-properties": true,

    // forbids to use `div` and `span` without class names
    "plugin/selector-tag-no-without-class": ["div", "span"],

    // always use nesting where possible
    "csstools/use-nesting": "always",

    // use valid css
    "csstree/validator": {
      ignoreAtrules: ["container"],
      ignoreProperties: ["container", "container-type", "container-name", "text-wrap"],
    },

    "alpha-value-notation": "number",

    "declaration-block-no-redundant-longhand-properties": null,

    // Logical properties
    "plugin/use-logical-properties-and-values": [true, { severity: "warning" }],
    "plugin/use-logical-units": [true, { severity: "warning" }],

    "selector-class-pattern": null,
    "custom-property-pattern": null,
  },
};
