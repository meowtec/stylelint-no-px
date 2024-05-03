import { ruleName, messages } from "../lib/index.js";

testRule({
  ruleName,
  config: [true, { remSize: 15 }],
  fix: true,
  customSyntax: 'postcss-less',

  accept: [
    { code: "@var: 1rem;" },
  ],

  reject: [
    {
      code: "@var: 15px;",
      fixed: "@var: 1rem;",
      message: messages.rem(15),
      line: 1,
      column: 1,
    },
  ],
});
