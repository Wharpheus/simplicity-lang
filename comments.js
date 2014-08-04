exports.strip = function(string) {
	var inLineComment = false;
	var inStarComments = false;

	var lex = function(line) {
		var tokens = line.split(" ");
		for(var i=0; i<tokens.length; i++) {
			var token = tokens[i];
			if(!inLineComment && token.indexOf("/*") === 0) {
				inStarComments = true;
			}
			if(!inStarComments && token.indexOf("//") === 0) {
				inLineComment = true;
			}
			if(inStarComments && token.indexOf("*/") === 0) {
				inStarComments = false;
				continue;
			}
			if(!inLineComment && !inStarComments && token) {
				withoutComments += token + " ";
	//			consume(token);
			}
		}
		if(!inLineComment && !inStarComments) {
			withoutComments += "\n";
		}
		inLineComment = false;
	};

	var lines = string.split("\n");
	var withoutComments = "";

	for(var i=0; i<lines.length; i++) {
		lex(lines[i]);
	}

	return withoutComments;
};