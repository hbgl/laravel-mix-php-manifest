const mix = require('laravel-mix');
require('laravel-mix-php-manifest');

mix.setPublicPath('public');
mix.version();
mix.phpManifest();

mix.js('assets/sample.js', 'sample.js');
