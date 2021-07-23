# Laravel Mix PHP manifest example

This example describes a basic use case for the package [Laravel Mix PHP manifest](https://github.com/hbgl/laravel-mix-php-manifest).

Running the example:

```bash
cd /path/to/example
npm install
npx mix
php sample.php
```

## 1. Installation

Install required packages.

```bash
npm install laravel-mix --save-dev
npm install laravel-mix-php-manifest --save-dev
```

## 2. Set up webpack.mix.js

Require `laravel-mix-php-manifest` and call `mix.phpManifest` in your webpack.mix.js file to generate a PHP manifest. Add additional [options](https://github.com/hbgl/laravel-mix-php-manifest#options) as needed.

_webpack.mix.js_
```javascript
const mix = require('laravel-mix');
require('laravel-mix-php-manifest'); // <--

mix.setPublicPath('public');
mix.version();
mix.phpManifest({
    // dirName: 'somedir',
    // fileName: 'mymanifest.php',
    // path: '/full/path/to/mymanifest.php',
    // deleteJsonManifest: true,
    // endOfLineSequence: '\n',
    // indentation: '    ',
});

mix.js('assets/sample.js', 'sample.js');
```

## 3. Run mix

```bash
npx mix
```

Outputs this PHP manifest file:

_mix-manifest.php_
```php
<?php
return [
    '/sample.js' => '/sample.js?id=45e1156324c7d3576a75',
];
```

## 4. Use manifest

Include the generated PHP manifest in your script to access the contents.

_sample.php_
```php
<?php

$manifest = require(__DIR__ . '/public/mix-manifest.php');

echo "\nManifest contents:\n";
echo "------------------------------------------------\n";
foreach ($manifest as $key => $entry) {
    echo "$key => $entry\n";
}
```

Run the sample:

```bash
php sample.php
```

Outputs:

```
Manifest contents:
------------------------------------------------
/sample.js => /sample.js?id=45e1156324c7d3576a75
```