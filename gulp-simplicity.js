var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var compiler = require('./compiler');

module.exports = function (options) {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-simplicity', 'Streaming not supported'));
			return cb();
		}

		var str = file.contents.toString();
		var filePath = file.path;

		try {
			file.contents = new Buffer(compiler.compileString(str));
			file.path = gutil.replaceExtension(filePath, '.js');
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-simplicity', err, {
				fileName: filePath
			}));
		}

		cb();
	});
};