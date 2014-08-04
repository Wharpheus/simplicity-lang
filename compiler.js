var fs = require("fs"),
	comments = require("./comments"),
	lexer = require("./lexer"),
	sm = require("./sm");

exports.compileString = function(string) {
	var withoutComments = comments.strip(string);

	var tokens = lexer.lex(withoutComments);
	// console.log(tokens);
	// console.log("---------");

	var compiled = sm.parse(tokens);

	console.log(compiled);

	return compiled;
};

exports.compile = function(filename) {
	var file = fs.readFileSync(filename + ".sim", "utf8");

	var string = this.compileString(file);

	fs.writeFile(filename + ".js", string, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Compiled to "+filename+".js");
		}
	});
};