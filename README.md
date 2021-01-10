# Laravel Mix PHP manifest


![Node.js CI](https://github.com/hbgl/laravel-mix-php-manifest/workflows/Node.js%20CI/badge.svg) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/hbgl/laravel-mix-php-manifest/blob/main/LICENSE)

This Laravel Mix extension creates a PHP manifest file from the manifest JSON file. This has the advandage that you can include the file directly in your PHP code without having to parse a JSON file.

## Installation

```bash
npm install laravel-mix-php-manifest
```

## Usage

webpack.mix.js
```javascript
const mix = require('laravel-mix');
require('laravel-mix-php-manifest');

mix.version();
mix.phpManifest({ /* options */ });
```

## Options

### **dirName** (string)
Set the relative or absolute output directory for the PHP manifest file. Default: Same directory as JSON manifest.

### **fileName** (string)
Set the file name of the PHP manifest file. Default: Same as JSON manifest with php file extension.

### **path** (string)
Set full path of the PHP manifest file. Overrides `dirName` and `fileName`.

### **deleteJsonManifest** (boolean)
Delete the JSON manifest file. Default: `false`.

## License

MIT