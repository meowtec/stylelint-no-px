import { messages, ruleName } from "../lib/index.js";

testRule({
  ruleName,
  config: [true, { ignoreFunctions: ["rem", "rem-calc"] }],

  accept: [
    {
      code: ".foo { font-size: rem(15px); border-left: rem-calc(12px) solid #333; }",
    },
  ],

  reject: [
    {
      code: ".foo { width: calc(100% - 12px); }",
      message: messages.rem(null),
      line: 1,
      column: 8,
      only: true,
    },
  ],
});
