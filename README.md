# stylelint-no-px

![https://travis-ci.org/meowtec/stylelint-no-px](https://travis-ci.org/meowtec/stylelint-no-px.svg?branch=master)

A stylelint custom rule to ensure rem instead of px.

If you are using `rem` (instead of `px`) as **1px solution** or for other purposes, you should need a stylelint rule to enforce using rem. Thats it.

```less
width: 10px; // error
border: 1px solid #eee; // ok
```

## Installation

```
npm install stylelint-no-px --save-dev
```

## Usage

Add it to your stylelint config

```javascript
// .stylelintrc
{
  "plugins": [
    "stylelint-no-px"
  ],
  "rules": {
    // ...
    "meowtec/no-px": [true, { "ignore": ["1px"] }],
    // or just:
    "meowtec/no-px": true,
    // ...
  }
}
```

## Options

### ignore: Item[]

ignore value check.

Valid value of Item: `propertyName` | `'1px'` | `'${propertyName} 1px'`

### ignoreFunctions: string[]

ignore check for functions.

### example(1) (the default options)

```javascript
// all 1px is ok
"meowtec/no-px": [true, { "ignore": ["1px"] }],
```

```less
@padding-base: 20px; // error

.foo {
  border-top: 1px solid #ccc; // ok
  padding: 10px; // error
  height: 1px; // ok
  padding: @padding-base * 2;
}
```

### example(2)

```javascript
//  - all `1px` or `font` is ok
//  - rem(Npx) is ok
"meowtec/no-px": [true, { "ignore": ["1px", "font"], "ignoreFunctions": ["rem"] }],
```

```less
.foo {
  border-top: 1px solid #ccc; // ok
  height: 1px; // ok
  font-size: 24px; // ok
  padding: 10px; // error
  width: calc(100% - 10px); // error
  font-size: rem(10px); // ok
}
```

### example(3)

```javascript
// only `border + 1px` is ok
"meowtec/no-px": [true, { "ignore": ["border 1px"] }],
```

```less
.foo {
  border-top: 1px solid #ccc; // ok
  height: 1px; // error
}
```
