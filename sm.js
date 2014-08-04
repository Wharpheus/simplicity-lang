var keywords = ["function", "var", "for", "while"];
var expressionTokens = ["(", ")", "[", "]", '"'];
var openExpressionTokens = ["(", "["];
var closeExpressionTokens = [")", "]"];
var assignmentOperators = ["="];
var iterators = ["each"];

var modules = ["http"];//, "render"]; //TODO: load from modules.ez

var inArray = function(array, item) {
	for(var i=0; i<array.length; i++)
		if(array[i] === item) return true;
	return false;
};

var State = {
	BLOCK: 0,
	MODULE_CALL: 1,
	EXPRESSION: 2,
	STRING: 3,
	OBJECT: 4,
	ARRAY: 5,
	ITERATOR: 6
};
// PROGRAM STATE
var scopeTokens = [];
var scopePairs = {"{": "}", "(": ")"};
var scoped = {};
var moduleCall = [];
var state = State.BLOCK;
var states = [];

var initState = function() {
	scopeTokens = [];
	scopePairs = {"{": "}", "(": ")"};
	scoped = {};
	moduleCall = [];
	state = State.BLOCK;
	states = [];
};

var compiled = "/* Compiled by Simplicity compiler v0.01 */\n";
//TODO: make cache busting depend on whether DEV or PROD
compiled += 'require.config({urlArgs: "bust=" + (new Date()).getTime()});';
compiled += "\n\n";

var emit = function(string) {
	compiled += string;
	//console.log("EMIT: "+string);
};

// var addToModuleScope = function(name) {
// 	scoped[name] = {type: "module"};
// };

var isExpressionToken = function(token) {
	return inArray(expressionTokens, token);
};
var isOpenExpressionToken = function(token) {
	return inArray(openExpressionTokens, token);
};
var isCloseExpressionToken = function(token) {
	return inArray(closeExpressionTokens, token);
};
var isAssignmentOperator = function(token) {
	return inArray(assignmentOperators, token);
};
var isValidVariableName = function(token) {
	return token.match(/[a-zA-Z]+/);
};

var addToLocalVariableScope = function(name) {
	scoped[name] = {type: "variable"};
};

var isLocalVariable = function(name) {
	return scoped[name];
};

var pushModuleCall = function(token) {
	moduleCall.push(token);
};

var parseExpression = function(tokens, i) {
	depth = 1;
	var xStates = [State.EXPRESSION];
	var xString = "";
	while(depth > 0) {
		var token = tokens[i++];
		if(token === '"' && xState !== State.STRING) {
			xStates.push(State.STRING);
		} else if(token === '"' && xStates(xStates.length-1) === State.STRING) {
			xStates.pop();
		} else if(xState === State.STRING) {
			xString += token;
		}
		if(isOpenExpressionToken(token)) {
			depth++;
		} else if(isCloseExpressionToken(token)) {
			//parse
			depth--;
		}
	}
	return {x: undefined, i: i};
};

var endOfLine = false;
var emittedTokens = 0;
var insidePromiseResolution = false;

var emitTokens = function(tokens) {
	var expressionDepth = 0;

	for(var i=0; i<tokens.length; i++) {
		//console.log("I: "+i+" TOKEN: "+tokens[i]);
		var token = tokens[i];
		if(isOpenExpressionToken(token)) {
			expressionDepth++;
		}
		if(expressionDepth > 0) {
			emit(token);
			emittedTokens++;
		}
		if(isCloseExpressionToken(token)) {
			expressionDepth--;
		}
		if(token.indexOf(".") !== -1) {
			var propTree = token.split(".");
			if(inArray(modules, propTree[0])) {
//				states.push(State.MODULE_CALL);
//				pushModuleCall(token);
				emit(token);
				emittedTokens++;
			} else if(propTree[0] === "console") {
				emit(token);
				emittedTokens++;
			}
		} else if(emittedTokens === 0 && inArray(iterators, token)) {
			// wait for promise to be resolved
			var iterateeExpression = tokens[i+1];
			var sugarAs = tokens[i+2];
			var iteratorAlias = tokens[i+3];
			//console.log("ITERATOR BLOCK: "+iterateeExpression);
			if(iterateeExpression.indexOf(".") !== -1) {
				var propTree = iterateeExpression.split(".", 2);
				//console.log("Testing "+propTree[0]);
				if(isLocalVariable(propTree[0])) {
					// emit wait till resolved section
					emit(propTree[0]+".then(function(__result) {\n");
					//emit("console.log(JSON.stringify(__result));\n");
					insidePromiseResolution = true;
					var collectionRef = "__result."+propTree[1];
					//emit("console.log("+collectionRef+".length);\n");
					emit("for(var i=0; i<"+collectionRef+".length; i++) {\n");
					emit("var "+iteratorAlias+" = "+collectionRef+"[i];\n");
//					emit("for(var "+iteratorAlias+" in __result."+propTree[1]+")");
				}
			}
			i+=4; //Note: skip opening brace as we re-emit it
			console.log(iterateeExpression, sugarAs, iteratorAlias);
		} else if(emittedTokens === 0 && !scoped[token] && isValidVariableName(token)) {
			emit("var "+token); // must be a promise!
			emittedTokens++;
			addToLocalVariableScope(token);
		} else if(expressionDepth === 0 && isAssignmentOperator(token)) {
			emit(" " + token + " ");
			emittedTokens++;
		}
		if(token === "\n" && emittedTokens > 0) {
			emit(";\n");
			emittedTokens = 0;
		}
		if(token === "{" || token === "}") {
			emit(token);
			if(token === "}") {
				if(state === State.ITERATOR) {
//					emit("}\n");
					state = State.BLOCK;
				}
				if(insidePromiseResolution) {
					emit("\n});\n");
				}
			} else {
				emit("\n");
			}
			emittedTokens = 0;
		}
	}
};

var emitModulesOpen = function() {
	if(modules.length > 0) {
		emit("require([");
		var mods_unquoted_str = modules.join(", ");
		var mods = [];
		for(var i=0; i<modules.length; i++) {
			//addToModuleScope(modules[i]);
			mods.push('"' + modules[i] + '.sim"');
		}
		var mods_quoted_str = mods.join(",");
		emit(mods_quoted_str);
		emit("], function(" + mods_unquoted_str + ") {\n");
		scopeTokens.push("{");
		scopeTokens.push("(");
	}
};

var emidModulesClose = function() {
	emit("});\n");
};

exports.parse = function(tokens) {
	initState();
	emitModulesOpen();
	emitTokens(tokens);
	emidModulesClose();

	// for(var i=0; i<scopeTokens.length; i++) {
	// 	emit(scopePairs[scopeTokens[i]]);
	// }
	// emit(";");
	return compiled;
};