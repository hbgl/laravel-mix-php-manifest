const mix = require('laravel-mix');
let fs = require('fs-extra');
const path = require('path');

const config = {
    dirName: null,
    fileName: null,
    path: null,
    deleteJsonManifest: false,
    indentation: '    ',
    endOfLineSequence: '\n',
};

let registered = false;

class Plugin {
    register(pluginConfig) {
        // Registering the plugin multiple times will update the
        // config but the plugin will only run once.
        Object.assign(config, pluginConfig);

        // Add after-callback once during registration so that other
        // user-defined after-callbacks run after it.
        if (!registered) {
            mix.after(function () {
                run(Mix.manifest);
            });
            registered = true;
        }
    }
}

mix.extend('phpManifest', new Plugin());

function run(manifest) {
    const { json_path, php_path } = get_paths(manifest);
    const php_code = build_php_manifest(manifest.manifest);
    fs.ensureDirSync(path.dirname(php_path));
    fs.writeFileSync(php_path, php_code);

    if (config.deleteJsonManifest) {
        if (fs.existsSync(json_path)) {
            fs.unlinkSync(json_path);
        }
    }
}

function get_paths(manifest) {
    const json_path = manifest.path();
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

function build_php_manifest(manifestEntries) {
    const eol = config.endOfLineSequence;
    const indent = config.indentation;
    let php_code = `<?php${eol}${eol}return [${eol}`;
    for (let key in manifestEntries) {
        if (manifestEntries.hasOwnProperty(key)) {
            const esc_key = escape_single_quoted_php_string(key);
            const esc_value = escape_single_quoted_php_string(manifestEntries[key]);
            php_code += `${indent}'${esc_key}' => '${esc_value}',${eol}`;
        }
    }
    php_code += `];${eol}`;
    return php_code;
}

function escape_single_quoted_php_string(s) {
    return s.replace(/[\\']/g, c => '\\' + c);
}