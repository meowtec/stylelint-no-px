const testRule = require('stylelint-test-rule-tape')
const useRem = require('..')

testRule(useRem.rule, {
  ruleName: useRem.ruleName,

  config: {

  },

  skipBasicChecks: true,

  accept: [
    { code: '.foo { border-left: 1px solid #333; }' },
  ],

  reject: [
    {
      code: '.foo { font-size: 15px; }',
      line: 1,
      column: 8,
    },
    {
      code: '@width: 1;\n.foo { border-width: ~\'@{width}px solid #333\'; }',
      line: 2,
      column: 8,
    },
    {
      code: '@width: 10px;\n.foo { border-width: @width * 2 solid #333; }',
      line: 1,
      column: 1,
    },
  ],
})
