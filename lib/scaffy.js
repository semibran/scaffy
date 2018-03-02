var tree = require("@semibran/fs-tree")
var pixie = require("pixie")

module.exports = function scaffy(src, opts, cb) {
  if (!src) {
    return cb(new Error("scaffy: no source path specified"))
  }
  var dest = opts.dest
  var data = opts.data || {}
  var open = opts.open || "{{"
  var close = opts.close || "}}"
  tree.read(src, function (err, source) {
    if (err) throw err
    var template = pixie.parse(JSON.stringify(source), open, close)
    var result = JSON.parse(pixie.compile(template, data))
    if (!dest) {
      cb(null, result)
    } else {
      tree.write(dest, result, cb)
    }
  })
}
