# Laravel Mix PHP manifest


![Node.js CI](https://github.com/hbgl/laravel-mix-php-manifest/workflows/Node.js%20CI/badge.svg) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/hbgl/laravel-mix-php-manifest/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/laravel-mix-php-manifest.svg)](https://www.npmjs.com/package/laravel-mix-php-manifest)

This Laravel Mix extension creates a PHP manifest file for your build. You can include the PHP manifest directly in your PHP code without having to parse the JSON manifest.

## Installation

```bash
npm install laravel-mix-php-manifest --save-dev
```

## Usage

_webpack.mix.js_
```javascript
const mix = require('laravel-mix');
require('laravel-mix-php-manifest');

mix.version();
mix.phpManifest({ /* options */ });

mix.js('assets/sample.js', 'sample.js');
```

Generates this PHP manifest file:

_mix-manifest.php_
```php
<?php
return [
    '/sample.js' => '/sample.js?id=45e1156324c7d3576a75',
];
```

See the [example](https://github.com/hbgl/laravel-mix-php-manifest/tree/main/example) for more information.

## Options

### **dirName** (string)
Set the relative or absolute output directory for the PHP manifest file. Default: Same directory as JSON manifest.

### **fileName** (string)
Set the file name of the PHP manifest file. Default: Same as JSON manifest with php file extension.

### **path** (string)
Set full path of the PHP manifest file. Overrides `dirName` and `fileName`.

### **deleteJsonManifest** (boolean)
Delete the JSON manifest file. Default: `false`.

### **endOfLineSequence** (string)
The end-of-line sequence used in the PHP manifest file. Default: `\n`.

### **indentation** (string)
The string used to indent entries in the PHP manifest file. Default: four spaces.

## License
This library is licensed under the [MIT license](https://opensource.org/licenses/MIT).