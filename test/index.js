'use strict'

const testRule = require('stylelint-test-rule-tape')
const useRem = require('..')

const defaultTest = {
  ruleName: useRem.ruleName,

  config: [true, {ignore: ['1px']}],

  skipBasicChecks: true,

  accept: [
    { code: '.foo { border-left: 1px solid #333; }' },
    { code: '.foo { border-left: 0px solid #333; }' },
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
}

testRule(useRem.rule, defaultTest)

testRule(useRem.rule, Object.assign({}, defaultTest, {
  config: true,
}))

testRule(useRem.rule, {
  ruleName: useRem.ruleName,

  config: [true, {ignore: []}],

  skipBasicChecks: true,

  accept: [
  ],

  reject: [
    {
      code: '.foo { border-left: 1px solid #333; }',
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


testRule(useRem.rule, {
  ruleName: useRem.ruleName,

  config: [true, {ignore: ['1px', 'font']}],

  skipBasicChecks: true,

  accept: [
    { code: '.foo { border-left: 1px solid #333; }' },
    { code: '.foo { font-size: 15px; }' },
  ],

  reject: [
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

testRule(useRem.rule, {
  ruleName: useRem.ruleName,

  config: false,

  skipBasicChecks: true,

  accept: [
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
