#!/usr/bin/env node
var scaffy = require("../lib/scaffy")
var scan = require("../lib/scan")
var priority = require("./priority.json")
var pkg = require("../package.json")
var fs = require("fs")
var path = require("path")
var readline = require("readline")
var parse = require("minimist")
var cwd = process.cwd()
var args = process.argv.slice(2)
var argv = parse(args, {
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

if (argv.help) {
	var help = fs.readFileSync(path.join(__dirname, "help.txt"), "utf8")
	console.log(help)
	process.exit()
}

if (argv.version) {
	console.log("v" + pkg.version)
	process.exit()
}

var data = {}
var src = argv.input || argv._[0] || process.cwd()
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
	if (keywords.length) {
		for (var i = 0; i < keywords.length; i++) {
			var keyword = keywords[i]
			if (data[keyword]) {
				keywords.splice(i--, 1)
			}
		}

		keywords.sort(function (a, b) {
			return findpriority(a) - findpriority(b)
		})

		function findpriority(keyword) {
			var index = priority.indexOf(keyword)
			return index >= 0 ? index : parseInt(keyword[0], 36) * keywords.length
		}

		var index = 0
		ask(keywords, index, data, write)
	} else {
		write(data)
	}
})

function write(data) {
	opts.data = data
	opts.dest = opts.dest || src || data.name || process.cwd()
	scaffy(src, opts, function (err) {
		if (err) return console.log(err.toString())
		console.log("write to `" + path.normalize(opts.dest) + "` successful")
	})
}

function ask(keywords, index, data, cb) {
	var keyword = keywords[index]
	if (keyword) {
		index++
		var prompt = format(keywords, keyword, index)
		io.question(prompt, function (value) {
			data[keyword] = value
			if (keywords[index]) {
				ask(keywords, index, data, cb)
			}
		})
	} else {
		cb(data)
		io.close()
	}
}

function format(keywords, keyword, index, value) {
	return "(" + index + "/" + keywords.length + ") " + keyword + ": " + (value || "")
}
