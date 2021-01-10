const mix = require('laravel-mix');
let fs = require('fs-extra');
const path = require('path');

const config = {
    dirName: null,
    fileName: null,
    path: null,
    deleteJsonManifest: false,
};

mix.extend('phpManifest', function (context, options) {
    Object.assign(config, { enabled: true }, options);
    mix.after(run);
});

function run() {
    const { json_path, php_path } = get_paths();    
    const php_code = build_php_manifest(Mix.manifest.manifest);
    fs.ensureDirSync(path.dirname(php_path));
    fs.writeFileSync(php_path, php_code);

    if (config.deleteJsonManifest) {
        if (fs.existsSync(json_path)) {
            fs.unlinkSync(json_path);
        }
    }
}

function get_paths() {
    const json_path = Mix.manifest.path();
    let php_path;
    if (config.path) {
        php_path = config.path;
    } else {
        let base_dir;
        if (config.dirName) {
            if (path.isAbsolute(config.dirName)) {
                base_dir = config.dirName;
            } else {
                base_dir = path.join(path.dirname(json_path), config.dirName);
            }
        } else {
            base_dir = path.dirname(json_path);
        }
        let php_file_name;
        if (config.fileName) {
            php_file_name = config.fileName;
        } else {
            php_file_name = path.basename(json_path, path.extname(json_path)) + '.php';
        }
        php_path = path.join(base_dir, php_file_name);
    }
    return { json_path, php_path };
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