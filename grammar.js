/**
 * @file Moss grammar for tree-sitter
 * @author whiting <171428442@qq.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "moss",

  rules: {
    source_file: ($) => repeat(seq(field("assign", $.assign), ";")),
    assign: ($) =>
      prec.right(-2, seq(field("key", $.name), "=", field("value", $.value))),
    scope: ($) =>
      seq("{", choice(repeat1(seq(field("assign", $.assign), ";")), "="), "}"),
    set: ($) => seq("{", repeat(seq(field("key", $.name), ",")), "}"),
    pair: ($) =>
      prec.right(-2, seq(field("key", $.name), ":", field("value", $.value))),
    dict: ($) =>
      seq("{", choice(repeat1(seq(field("pair", $.pair), ",")), ":"), "}"),
    value: ($) =>
      choice(
        $.scope,
        $.set,
        $.dict,
        $.int,
        $.string,
        $.name,
        $.call,
        $.find,
        $.bracket,
        $.builtin
      ),
    int: ($) => /[+-]?\d+/,
    string: ($) => seq('"', repeat(field("content", $.string_content)), '"'),
    string_content: ($) => choice($.string_raw, $.string_escape),
    string_raw: ($) => token.immediate(/[^"\\]+/),
    string_escape: ($) => token.immediate(/\\./),
    name: ($) => /[a-zA-Z_][a-zA-Z_0-9]*/,
    builtin: ($) => prec(1, choice($.builtin_if, $.builtin_add, $.builtin_mod)),
    builtin_if: ($) => "if",
    builtin_add: ($) => "add",
    builtin_mod: ($) => "mod",
    call: ($) =>
      prec.right(1, seq(field("func", $.value), field("param", $.value))),
    find: ($) =>
      prec.left(2, seq(field("value", $.value), field("name", $.name))),
    bracket: ($) => seq("(", field("value", $.value), ")"),
  },
});
