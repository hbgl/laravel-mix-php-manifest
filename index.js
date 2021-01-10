const mix = require('laravel-mix');
let fs = require('fs-extra');
const path = require('path');

const config = {
    dir: '',
    deleteJson: false,
};

mix.extend('phpManifest', function (context, options) {
    Object.assign(config, { enabled: true }, options);
    mix.after(run);
});

function run() {
    if (!config.enabled) {
        return;
    }
    const php_code = build_php_manifest(Mix.manifest.manifest);

    const json_path = Mix.manifest.path();
    let base_dir = path.dirname(json_path);
    if (config.dir) {
        base_dir = path.isAbsolute(config.dir) ? config.dir : path.join(base_dir, config.dir);
    }
    const php_path = path.join(base_dir, path.basename(json_path, path.extname(json_path)) + '.php');
    fs.ensureDirSync(base_dir);
    fs.writeFileSync(php_path, php_code);

    if (config.deleteJson) {
        fs.unlinkSync(json_path);
    }
}

function build_php_manifest(manifest) {
    let php_code = '<?php\nreturn [\n';
    for (let key in manifest) {
        if (manifest.hasOwnProperty(key)) {
            const esc_key = escape_single_quoted_php_string(key);
            const esc_value = escape_single_quoted_php_string(manifest[key]);
            php_code += '    \'' + esc_key + '\' => \'' + esc_value + '\',\n';
        }
    }
    php_code += '];\n';
    return php_code;
}

function escape_single_quoted_php_string(s) {
    return s.replace(/[\\']/g, c => '\\' + c);
}