# Laravel Mix PHP manifest

This Laravel Mix extension creates a PHP manifest file from the manifest JSON file. This has the advandage that you can include the file directly in your PHP code without having to parse a JSON file.

## Usage

```javascript
const mix = require('laravel-mix');
require('laravel-mix-php-manifest');

mix.version();
mix.phpManifest({
    // options ...
});
```

## Options

### **dir** (string)
Set the relative or absolute output directory for the PHP manifest file. Default: Same directory as JSON manifest.

### **deleteJson** (boolean)
Delete the JSON manifest file. Default: `false`.

## License

MIT