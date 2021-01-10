const { describe, it } = require('mocha');
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const { TIMEOUT } = require('dns');

describe('php-manifest', function () {
	this.timeout(30000);

	afterEach(() => {
		cleanup_webpack_mix_js();
		cleanup_public_folder();
	});

	it('works in the simple case', function () {
		setup_webpack_mix_js();
		run_mix();
		const php_code = fs.readFileSync(path.join(__dirname, 'public', 'mix-manifest.php')).toString();
		assert.equal(php_code, "<?php\nreturn [\n    '/foo.js' => '/foo.js?id=ff59af8d768ee969a92a',\n];\n");
	});

	it('puts manifest in relative dir', function () {
		setup_webpack_mix_js({ dir: 'nested' });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'nested', 'mix-manifest.php'));
		assert.isTrue(exists);
	});

	it('puts manifest in absolute dir', function () {
		setup_webpack_mix_js({ dir: path.join(__dirname, 'public', 'nested') });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'nested', 'mix-manifest.php'));
		assert.isTrue(exists);
	});

	it('deletes json manifest', function () {
		setup_webpack_mix_js({ deleteJson: true });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'mix-manifest.json'));
		assert.isFalse(exists);
	});

	it('allows options to be changed', function () {
		setup_webpack_mix_js({ deleteJson: true }, { deleteJson: false });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'mix-manifest.json'));
		assert.isTrue(exists);
	});
});

function run_mix() {
	child_process.execSync('npx mix --mix-config test/webpack.mix.js');
}

function setup_webpack_mix_js(...many_options) {
	let js = `
const mix = require('laravel-mix');
require('../index');
mix.setPublicPath('test/public');
mix.copy('test/assets/foo.js', 'test/public/foo.js');
mix.version(['test/public/foo.js']);\n`;
	for (let options of many_options) {
		const options_js = JSON.stringify(options || {});
		js += `mix.phpManifest(${options_js});\n`;
	}
	fs.writeFileSync(webpack_mix_js_path(), js);
}

function cleanup_webpack_mix_js() {
	try {
		fs.unlinkSync(webpack_mix_js_path());
	} catch (e) { }
}

function cleanup_public_folder() {
	try {
		fs.rmdirSync(path.join(__dirname, 'public'), { recursive: true });
	} catch (e) { }
}

function webpack_mix_js_path() {
	return path.join(__dirname, 'webpack.mix.js');
}