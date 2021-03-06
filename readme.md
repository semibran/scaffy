# scaffy
This tool is a tiny project scaffolder that customizes a given template directory using a user-defined map.

Install it globally through npm:

```sh
npm i -g scaffy
```

The following represents an example directory to be used as a template. Notice the fields in double braces.

```
templates/module
├── lib
│   └── {{name}}.js -> ''
├── license         -> ...
├── package.json    -> '{ "name": "{{name}}", "description": "{{description}}" }'
└── readme.md       -> '# {{name}}\n> {{description}}'
```

Passing this directory into scaffy will bring up a prompt that enables you to fill in the necessary fields.

```sh
$ scaffy templates/module
scaffy v3.0.3
Using template `module`
(1/2) name: example
(2/2) description: An example module
Write to `/foo/bar/example` successful

$ cat example/readme.md
# example
> An example module

$ ls example/lib
example.js
```

This concept can be further expanded upon to cover logic-less templates as large as you deem necessary.

## usage
[![npm badge]][npm package]

### CLI
```
usage:
  $ scaffy [src] [options]

options:
  -h, --help     show this help message
  -v, --version  display package version
  -i, --input    path to source template (alias for <src>)
  -o, --output   path to which the resulting file tree is written (defaults to name arg)
  -O, --open     tag indicating the beginning of an expression (defaults to "{{")
  -C, --close    tag indicating the end of an expression (defaults to "}}")

examples:
  $ scaffy
  $ scaffy templates/module -o new-directory
```

### API

#### `scaffy(src, opts, cb(err, tree))`
Replaces all instances of the keys provided by `opts.data` within `src`. The resulting file tree is passed to `cb` via `tree`, which takes the form `folder : { name : folder | file }`.

Options:
* `data`: map detailing the keys to be replaced within the given template and their corresponding values (defaults to an empty object)
* `dest`: path to which the resulting file tree is written (defaults to `src`)
* `open`: tag indicating the beginning of an expression (defaults to `{{`)
* `close`: tag indicating the end of an expression (defaults to `}}`)

## related
* [`semibran/fs-tree`][semibran/fs-tree]: underlying basis for this module's reads and writes
* [`jamen/pixie`][jamen/pixie]: flexible templating engine responsible for this module's replacement mechanism

[npm badge]:        https://nodei.co/npm/scaffy.png?mini
[npm package]:      https://npmjs.com/package/scaffy
[semibran/fs-tree]: https://github.com/semibran/fs-tree
[jamen/pixie]:      https://github.com/jamen/pixie
