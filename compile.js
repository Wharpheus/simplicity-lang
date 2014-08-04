var compiler = require("./compiler");

if(process.argv[2]) {
	compiler.compile(process.argv[2]);
}
