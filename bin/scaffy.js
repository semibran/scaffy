#!/usr/bin/env node
var scaffy = require("../lib/scaffy")
var scan = require("../lib/scan")
var pkg = require("../package.json")
var fs = require("fs")
var path = require("path")
var readline = require("readline")
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

var io = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

if (!args.length || argv.help) {
	var help = fs.readFileSync(path.join(__dirname, "help.txt"), "utf8")
	console.log(help)
	process.exit()
}

if (argv.version) {
	console.log("v" + pkg.version)
	process.exit()
}

var data = argv["--"]
if (!data.length) {
	data = {}
} else {
	data = parse(data, { string: [ "--", "_" ] })
	delete data._
}

var src = argv.input || argv._[0]
var opts = {
	data: data,
	dest: argv.output,
	open: argv.open,
	close: argv.close,
}

console.log("scaffy v" + pkg.version)
console.log("using template `" + path.basename(src) + "`")

scan(src, opts, function (err, keywords) {
	if (err) throw err
	for (var keyword in data) {
		var value = data[keyword]
		console.log("- " + keyword + ": " + value)
	}
	if (keywords.length) {
		for (var i = 0; i < keywords.length; i++) {
			var keyword = keywords[i]
			if (data[keyword]) {
				keywords.splice(i--, 1)
			}
		}
		ask(keywords, data, write)
	} else {
		write(data)
	}
})

function write(data) {
	opts.data = data
	opts.dest = opts.dest || data.name
	scaffy(src, opts, function (err) {
		if (err) return console.log(err.toString())
		console.log("write to `" + path.normalize(opts.dest) + "` successful")
	})
}

function ask(keywords, data, cb) {
	var keyword = keywords[0]
	if (keyword) {
		io.question("- " + keyword + ": ", function (value) {
			data[keyword] = value
			keywords.shift()
			ask(keywords, data, cb)
		})
	} else {
		cb(data)
		io.close()
	}
}
