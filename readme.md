# scaffy
This tool provides a small project scaffolder which customizes a given template directory using a user-defined map.

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

Passing this directory into scaffy with the appropriate options results in a copy of the original template with all the provided expressions filled in, like so.

```sh
$ scaffy templates/module -o example -- \
> --name=example \
> --description="An example module"

$ cat example/readme.md
# example
> An example module

$ ls example/lib
example.js
```

This template can be expanded upon even further to cover logic-less project templates as large as you deem necessary.

## usage
[![npm badge]][npm package]

## CLI
```
usage:
  $ scaffy <src> [options] -- [config options]

options:
  -h, --help     show this help message
  -v, --version  display package version
  -i, --input    path to source template (alternative to <src>)
  -o, --output   path to which the resulting file tree is written (defaults to cwd)
  -O, --open     tag indicating the beginning of an expression (defaults to "{{")
  -C, --close    tag indicating the end of an expression (defaults to "}}")

example:
  $ scaffy templates/module -o example -- \
  > --name=example \
  > --description="An example module"
```

## API

### `scaffy(src, opts, cb(err, tree))`
Replaces all instances of the keys provided by `opts.data` within `src` and writes to `opts.dest`, if provided. The resulting file tree is passed to `cb` via `tree`, which takes the form `folder : { name -> folder | file }`.

Options:
* `data`: map detailing the keys to be replaced within the given template and their corresponding values (defaults to an empty object)
* `dest`: path to which the resulting file tree is written (defaults to cwd)
* `open`: tag indicating the beginning of an expression (defaults to `{{`)
* `close`: tag indicating the end of an expression (defaults to `}}`)

## related
* [`semibran/fs-tree`][semibran/fs-tree]: underlying basis for this module's reads and writes
* [`jamen/pixie`][jamen/pixie]: flexible templating engine responsible for this module's replacement mechanism

[npm badge]:        https://nodei.co/npm/scaffy.png?mini
[npm package]:      https://npmjs.com/package/scaffy
[semibran/fs-tree]: https://github.com/semibran/fs-tree
[jamen/pixie]:      https://github.com/jamen/pixie
