module.exports = {
  extends: ["stylelint-a11y/recommended"],
  rules: {
    "a11y/content-property-no-static-value": true,
    "a11y/font-size-is-readable": true,
    // "a11y/line-height-is-vertical-rhythmed": false,
    "a11y/media-prefers-color-scheme": true,
    // "a11y/no-display-none": false,
    // "a11y/no-obsolete-attribute": false,
    "a11y/no-obsolete-element": true,
    "a11y/no-spread-text": true,
    "a11y/no-text-align-justify": true,
  },
};
