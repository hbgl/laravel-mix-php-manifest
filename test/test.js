const { describe, it } = require('mocha');
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

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
		setup_webpack_mix_js({ dirName: 'nested' });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'nested', 'mix-manifest.php'));
		assert.isTrue(exists);
	});

	it('puts manifest in absolute dir', function () {
		setup_webpack_mix_js({ dirName: path.join(__dirname, 'public', 'nested') });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'nested', 'mix-manifest.php'));
		assert.isTrue(exists);
	});

	it('uses a different file name', function () {
		setup_webpack_mix_js({ fileName: 'differently-named-manifest.php' });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'differently-named-manifest.php'));
		assert.isTrue(exists);
	});

	it('uses a different file name and dir name', function () {
		setup_webpack_mix_js({ dirName: 'nested', fileName: 'differently-named-manifest.php' });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'nested', 'differently-named-manifest.php'));
		assert.isTrue(exists);
	});

	it('uses a different path', function () {
		const manifest_path = path.join(__dirname, 'public', 'a', 'b', 'differently-named-manifest.php');
		// Path should override dirName and fileName.
		setup_webpack_mix_js({
			path: manifest_path,
			dirName: path.join('x', 'y'),
			fileName: 'xy-manifest.php'
		});
		run_mix();
		const exists = fs.existsSync(manifest_path);
		assert.isTrue(exists);
	});

	it('deletes json manifest', function () {
		setup_webpack_mix_js({ deleteJsonManifest: true });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'mix-manifest.json'));
		assert.isFalse(exists);
	});

	it('allows options to be changed', function () {
		setup_webpack_mix_js({ deleteJsonManifest: true }, { deleteJsonManifest: false });
		run_mix();
		const exists = fs.existsSync(path.join(__dirname, 'public', 'mix-manifest.json'));
		assert.isTrue(exists);
	});

	it('use different eol squence and indentation', function () {
		setup_webpack_mix_js({ endOfLineSequence: '\r\n', indentation: '\t' });
		run_mix();
		const php_code = fs.readFileSync(path.join(__dirname, 'public', 'mix-manifest.php')).toString();
		assert.equal(php_code, "<?php\r\nreturn [\r\n\t'/foo.js' => '/foo.js?id=ff59af8d768ee969a92a',\r\n];\r\n");
	});

	it('after callbacks registered after plugin will run after it', function () {
		const mixJs = `
const mix = require('laravel-mix');
const fs = require('fs');
require('../index');
mix.setPublicPath('test/public');
mix.copy('test/assets/foo.js', 'test/public/foo.js');
mix.version(['test/public/foo.js']);
const phpManifestPath = __dirname + '/public/mix-manifest.php';
mix.after(function () {
	if (fs.existsSync(phpManifestPath)) {
		throw new Error('Expected PHP manifest to not exist yet.');
	}
});
mix.phpManifest();
mix.after(function () {
	if (!fs.existsSync(phpManifestPath)) {
		throw new Error('Expected PHP manifest to exist.');
	}
});\n`;
		fs.writeFileSync(webpack_mix_js_path(), mixJs);
		run_mix(); // Should not throw
	});
});

function run_mix() {
	child_process.execSync('npx mix --mix-config test/webpack.mix.js');
}

function setup_webpack_mix_js(...many_options) {
	if (many_options.length === 0) {
		many_options.push({});
	}
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