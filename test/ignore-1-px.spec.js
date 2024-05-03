import { ruleName, messages } from "../lib/index.js";

testRule({
  ruleName,
  config: [true, { ignore: ["1px"] }],

  accept: [
    { code: ".foo { border-left: 1px solid #333; }" },
    { code: ".foo { border-left: 0px solid #333; }" },
    { code: ".foo { width: 1px; }" },
  ],

  reject: [
    {
      code: ".foo { font-size: 15px; }",
      message: messages.rem(null),
      line: 1,
      column: 8,
    },
    {
      code: ".foo { margin-left: -10px; }",
      message: messages.rem(null),
      line: 1,
      column: 8,
    },
    {
      code: ".foo { margin-left: +10px; }",
      message: messages.rem(null),
      line: 1,
      column: 8,
    },
    {
      code: "@width: 1;\n.foo { border-width: ~'@{width}px solid #333'; }",
      message: messages.rem(null),
      line: 2,
      column: 8,
    },
    {
      code: "@width: 10px;\n.foo { border-width: @width * 2 solid #333; }",
      message: messages.rem(null),
      line: 1,
      column: 1,
    },
  ],
});
