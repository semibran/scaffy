#!/usr/bin/env node
const { join } = require("path")
const { readFileSync } = require("fs")
const { read, write } = require("@semibran/fs-tree")
const pixie = require("pixie")
const parse = require("minimist")
const cwd = process.cwd()
const args = process.argv.slice(2)
const argv = parse(args, {
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
  },
  default: {
    open: "{{",
    close: "}}"
  }
})

if (!args.length || argv.help) {
  let path = join(__dirname, "../help")
  let help = readFileSync(path, "utf8")
  console.log(help)
  process.exit()
}

if (argv.version) {
  console.log("v1.0.0")
  process.exit()
}

let src = argv.input || argv._[0]
let dest = argv.output

if (!src) {
  console.log("scaffy: no source path specified")
  process.exit()
}

let open = argv.open
let close = argv.close
let config = argv.config
let data = null
if (config) {
  data = JSON.parse(readFileSync(config))
} else {
  data = parse(argv["--"])
  delete data._
}

read(src, (err, template) => {
  if (err) throw err
  let source = JSON.stringify(template)
  let result = pixie.compile(pixie.parse(source, open, close), data)
  let tree = JSON.parse(result)
  if (dest) {
    write(dest, tree, (err) => {
      if (err) throw err
    })
  } else {
    console.log(tree)
  }
})
