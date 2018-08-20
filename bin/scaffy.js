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

var data = argv["--"]
if (!data.length) {
	data = null
} else {
	data = parse(data)
	delete data._
}

var src = argv.input || argv._[0]
var opts = {
	data: data,
	dest: argv.output,
	open: argv.open,
	close: argv.close,
}

scaffy(src, opts, function (err, tree) {
	if (err) return console.log(err.toString())
	if (!opts.dest) {
		console.log(tree)
	}
})
