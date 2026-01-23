/**
 * @file Moss grammar for tree-sitter
 * @author whiting <171428442@qq.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

var name = token(/[a-zA-Z_][a-zA-Z_0-9]*/);
var int = token(/[+-]?\d+/);

module.exports = grammar({
  name: "moss",

  rules: {
    source_file: ($) => repeat(seq(field("assign", $.assign), ";")),
    assign: ($) =>
      prec.right(-2, seq(field("key", $.name), "=", field("value", $.value))),
    scope: ($) =>
      seq("{", choice(repeat1(seq(field("assign", $.assign), ";")), "="), "}"),
    set: ($) => seq("{", repeat(seq(field("key", $.name), ",")), "}"),
    value: ($) =>
      choice(
        $.function,
        $.scope,
        $.set,
        $.int,
        $.string,
        $.find,
        $.meta_find,
        $.find_in,
        $.meta_find_in,
        $.call,
        $.bracket,
        $.trivial,
      ),
    int: ($) => int,
    string: ($) =>
      seq(
        '"',
        repeat(field("content", $.string_content)),
        token.immediate('"'),
      ),
    string_content: ($) => choice($.string_raw, $.string_escape),
    string_raw: ($) => token.immediate(/[^"\\]+/),
    string_escape: ($) => token.immediate(/\\./),
    call: ($) =>
      prec.right(1, seq(field("func", $.value), field("param", $.value))),
    find: ($) => $.name,
    meta_find: ($) => seq("@", field("name", $.name_imd)),
    find_in: ($) =>
      prec.left(
        2,
        seq(
          field("value", $.value),
          token.immediate("."),
          field("name", $.name_imd),
        ),
      ),
    meta_find_in: ($) =>
      prec.left(
        2,
        seq(
          field("value", $.value),
          token.immediate(".@"),
          field("name", $.name_imd),
        ),
      ),
    name: ($) => name,
    name_imd: ($) => token.immediate(name),
    function: ($) => seq(field("param", $.name), "->", field("scope", $.scope)),
    bracket: ($) => seq("(", field("value", $.value), ")"),
    trivial: ($) => seq("(", ")"),
  },
});
