var inArray = function(array, item) {
	for(var i=0; i<array.length; i++)
		if(array[i] === item) return true;
	return false;
};

exports.lex = function(string) {
//	console.log("Lexing: "+string);

	var includedDelimiters = ["(", ")", "[", "]", "\n"];
	var excludedDelimiters = [" ", ","];

	var token = "";
	var tokens = [];
	var pushToken = function() {
		if(token) {
			tokens.push(token);
			token = "";
		}
	};

	for(var i=0; i<string.length; i++) {
		var c = string[i];
		if(inArray(excludedDelimiters, c)) {
			pushToken();
		} else if(inArray(includedDelimiters, c)) {
			pushToken();
			tokens.push(c);
		}
		else {
			token += c;
		}
	}
	return tokens;
};