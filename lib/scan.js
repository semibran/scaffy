var tree = require("@semibran/fs-tree")
var pixie = require("pixie")

// scan(src, opts, cb) -> keywords
// > reads all {{keywords}} in a given template folder
module.exports = function scan(src, opts, cb) {
	var open = opts.open || "{{"
	var close = opts.close || "}}"
	tree.read(src, function (err, source) {
		if (err) return cb(err)
		var template = pixie.parse(JSON.stringify(source), open, close)
		var exprs = template[1]
		var keywords = []
		for (var i = 0; i < exprs.length; i++) {
			var expr = exprs[i]
			if (keywords.indexOf(expr) === -1) {
				keywords.push(expr)
			}
		}
		cb(null, keywords)
	})
}
