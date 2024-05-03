import { ruleName, messages } from "../lib/index.js";

testRule({
  ruleName,
  config: [true, { remSize: 15 }],
  fix: true,

  accept: [
    { code: ".foo { border-left: 1px solid #333; }" },
    { code: ".foo { border-left: 0px solid #333; }" },
    { code: ".foo { width: 1px; }" },
  ],

  reject: [
    {
      code: ".foo { font-size: 15px; }",
      fixed: ".foo { font-size: 1rem; }",
      message: messages.rem(15),
      line: 1,
      column: 8,
    },
    {
      code: ".foo { border: 15px solid red; }",
      fixed: ".foo { border: 1rem solid red; }",
      message: messages.rem(15),
      line: 1,
      column: 8,
    },
    {
      code: ".foo { margin: 15px auto 30px; }",
      fixed: ".foo { margin: 1rem auto 2rem; }",
      message: messages.rem(15),
      line: 1,
      column: 8,
    },
    {
      code: ".foo { margin: calc(10% + 15px); }",
      fixed: ".foo { margin: calc(10% + 1rem); }",
      message: messages.rem(15),
      line: 1,
      column: 8,
    },
    {
      code: ".foo { margin-left: -10px; }",
      fixed: ".foo { margin-left: -0.66667rem; }",
      message: messages.rem(15),
      line: 1,
      column: 8,
    },
    {
      code: ".foo { margin-left: +10px; }",
      fixed: ".foo { margin-left: 0.66667rem; }",
      message: messages.rem(15),
      line: 1,
      column: 8,
    },
    {
      code: "@width: 10px;\n.foo { border-width: @width * 2 solid #333; }",
      fixed:
        "@width: 0.66667rem;\n.foo { border-width: @width * 2 solid #333; }",
      message: messages.rem(15),
      line: 1,
      column: 1,
    },
  ],
});
