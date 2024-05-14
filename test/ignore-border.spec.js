import { messages, ruleName } from "../lib/index.js";

testRule({
  ruleName,
  config: [true, { ignore: ["border 1px"] }],

  accept: [{ code: ".foo { border-top: 1px solid #ccc; }" }],

  reject: [
    {
      code: ".foo { border-top: 2px solid #ccc; }",
      message: messages.rem(null),
      line: 1,
      column: 8,
    },
    {
      code: ".foo { padding: 1px; }",
      message: messages.rem(null),
      line: 1,
      column: 8,
    },
  ],
});
