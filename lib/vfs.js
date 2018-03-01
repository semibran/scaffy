var fs = require("fs")
var join = require("path").join

exports.read = function read(path, cb) {
  var tree = {}
  var root = path
  fs.readdir(path, function (err, names) {
    if (err) return cb(err)
    if (!names.length) return cb(null, {})
    var count = names.length
    for (var i = 0; i < count; i++) {
      var name = names[i]
      var path = join(root, name)
      ;(function (name, path) {
        fs.stat(path, function (err, stats) {
          var reader = stats.isDirectory()
            ? read
            : fs.readFile
          reader(path, function (err, data) {
            if (err) return cb(err)
            if (data instanceof Buffer) {
              data = data.toString()
            }
            tree[name] = data
            if (!--count) {
              cb(null, tree)
            }
          })
        })
      })(name, path)
    }
  })
}

exports.write = function write(path, tree, cb) {
  var root = path
  fs.mkdir(path, function (err) {
    if (err) cb(err)
    var count = 0
    for (var name in tree) {
      var data = tree[name]
      var path = join(root, name)
      var writer = data && typeof data === "object"
        ? write
        : fs.writeFile
      count++
      writer(path, data, function (err) {
        if (err) return cb(err)
        if (!--count) {
          cb(null)
        }
      })
    }
  })
}
