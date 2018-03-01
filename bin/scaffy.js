#!/usr/bin/env node
var vfs = require("../lib/vfs")
var pixie = require("pixie")
var fs = require("fs")
var join = require("path").join
var parse = require("minimist")
var cwd = process.cwd()
var args = process.argv.slice(2)
var argv = parse(args, {
  boolean: [ "help" ],
  alias: {
    h: "help",
    i: "input",
    o: "output"
  },
  default: {
    open: "{{",
    close: "}}"
  }
})

if (!argv.input) {
  console.log("scaffy: no source path specified")
  process.exit()
}

if (!argv.output) {
  console.log("scaffy: no destination path specified")
  process.exit()
}

var src = join(cwd, argv.input)
var dest = join(cwd, argv.output)
var open = argv.open
var close = argv.close
var data = parse(argv._)
delete data._

vfs.read(src, (err, template) => {
  if (err) throw err
  var source = JSON.stringify(template)
  var result = pixie.compile(pixie.parse(source, open, close), data)
  var tree = JSON.parse(result)
  vfs.write(dest, tree, (err) => {
    if (err) throw err
  })
})
