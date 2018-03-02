var tree = require("@semibran/fs-tree")
var pixie = require("pixie")

module.exports = function scaffy(src, dest, opts, cb) {
  if (!src) {
    return cb(new Error("scaffy: no source path specified"))
  }
  if (!dest) {
    return cb(new Error("scaffy: no destination path specified"))
  }
  var data = opts.data || {}
  var open = opts.open || "{{"
  var close = opts.close || "}}"
  tree.read(src, function (err, source) {
    if (err) throw err
    var template = pixie.parse(JSON.stringify(source), open, close)
    var result = JSON.parse(pixie.compile(template, data))
    tree.write(dest, result, cb)
  })
}
