#!/usr/bin/env node
var scaffy = require("../lib/scaffy")
var pkg = require("../package.json")
var fs = require("fs")
var join = require("path").join
var parse = require("minimist")
var cwd = process.cwd()
var args = process.argv.slice(2)
var argv = parse(args, {
  "--": true,
  boolean: [ "help", "version" ],
  alias: {
    h: "help",
    v: "version",
    i: "input",
    o: "output",
    c: "config",
    O: "open",
    C: "close"
  }
})

if (!args.length || argv.help) {
  var path = join(__dirname, "help.txt")
  var help = fs.readFileSync(path, "utf8")
  console.log(help)
  process.exit()
}

if (argv.version) {
  console.log("v" + pkg.version)
  process.exit()
}

var src = argv.input || argv._[0]
var dest = argv.output || argv._[1]
var config = argv.config
var data = null
if (config) {
  var path = join(cwd, config)
  try {
    data = JSON.parse(fs.readFileSync(path, "utf8"))
  }
  catch (err) {
    console.log(err.toString())
    process.exit()
  }
} else {
  data = parse(argv["--"])
  delete data._
}

var opts = {
  data: data,
  open: argv.open,
  close: argv.close,
}

scaffy(src, dest, opts, function (err) {
  if (err) return console.log(err.toString())
})
