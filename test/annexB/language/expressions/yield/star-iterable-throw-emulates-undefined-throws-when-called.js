// Copyright (C) 2020 Alexey Shvayka. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-generator-function-definitions-runtime-semantics-evaluation
description: >
  If <iterator>.throw is an object emulating `undefined` (e.g. `document.all`
  in browsers), it shouldn't be treated as if it were actually `undefined` by
  the yield* operator.
info: |
  YieldExpression : yield * AssignmentExpression

  [...]
  7. Repeat,
    [...]
    b. Else if received.[[Type]] is throw, then
      i. Let throw be ? GetMethod(iterator, "throw").
      ii. If throw is not undefined, then
        1. Let innerResult be ? Call(throw, iterator, « received.[[Value]] »).
        [...]
        4. If Type(innerResult) is not Object, throw a TypeError exception.
features: [generators, IsHTMLDDA]
---*/

var IsHTMLDDA = $262.IsHTMLDDA;
var returnCalls = 0;
var inner = {
  [Symbol.iterator]() { return this; },
  next() { return {done: false}; },
  throw: IsHTMLDDA,
  return() {
    returnCalls += 1;
    return {done: true};
  },
};

var outer = (function* () { yield* inner; })();
outer.next();
outer.throw();

assert.sameValue(returnCalls, 0);
