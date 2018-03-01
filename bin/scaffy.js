#!/usr/bin/env node
var vfs = require("../lib/vfs")
var pixie = require("pixie")
var fs = require("fs")
var join = require("path").join
var parse = require("minimist")
var cwd = process.cwd()
var args = process.argv.slice(2)
var argv = parse(args, {
  "--": true,
  alias: { o: "output" },
  default: {
    open: "{{",
    close: "}}"
  }
})

var src = argv._[0]
var dest = argv.output

if (!src) {
  console.log("scaffy: no source path specified")
  process.exit()
}

var open = argv.open
var close = argv.close
var data = parse(argv["--"])
delete data._

vfs.read(src, (err, template) => {
  if (err) throw err
  var source = JSON.stringify(template)
  var result = pixie.compile(pixie.parse(source, open, close), data)
  var tree = JSON.parse(result)
  if (dest) {
    vfs.write(dest, tree, (err) => {
      if (err) throw err
    })
  } else {
    console.log(tree)
  }
})
