var assert = require('assert');

import { add, mul } from "../add.js";

describe("add function testing", function() {
  it('1 + 2 should be 3', function() {
    assert.strictEqual(add(1, 2), 3);
  });
  
  it('-6 + 2 should be -4', function() {
    assert.strictEqual(add(-5, 2), -3);
  });

  it('-6 * 2 should be -12', function() {
    assert.strictEqual(mul(-5, 2), -10);
  });

});
