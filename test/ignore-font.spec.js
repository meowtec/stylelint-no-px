import { messages, ruleName } from "../lib/index.js";

testRule({
  ruleName,
  config: [true, { ignore: ["font"] }],

  accept: [
    { code: ".foo { font-size: 15px; }" },
    { code: ".foo { font-size: 1px; }" },
  ],

  reject: [
    {
      code: ".foo { border-left: 1px solid #333; }",
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
