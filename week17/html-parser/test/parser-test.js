var assert = require('assert');

import { parseHTML } from "../src/parser.js"

describe("parser html:", function() {
  it('<a></a>', function() {
    let tree = parseHTML("<a></a>");
    assert.strictEqual(tree.children[0].tagName, "a");
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it("<a href></a>", function() {
    let tree = parseHTML("<a href></a>");
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it("<a href id></a>", function() {
    let tree = parseHTML("<a href id></a>");
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href="abc" id></a>', function() {
    let tree = parseHTML('<a href="abc" id></a>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a id=abc ></a>', function() {
    let tree = parseHTML('<a id=abc></a>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href="abc"/>', function() {
    let tree = parseHTML('<a href="abc"/>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a id=\'abc\' ></a>', function() {
    let tree = parseHTML('<a id=\'abc\' ></a>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a />', function() {
    let tree = parseHTML('<a />');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<A></A>', function() {
    let tree = parseHTML('<A></A>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<A />', function() {
    let tree = parseHTML('<A />');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<> fff', function() {
    let tree = parseHTML('<> fff');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].type, "text");
  });

  it('<a href =" ">', function() {
    let tree = parseHTML('<a href =" ">');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  it('<a href= " ">', function() {
    let tree = parseHTML('<a href= " ">');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });
})