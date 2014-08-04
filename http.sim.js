define(function(require) {
	var q = require("node_modules/q/q");

  var http = {
    get: function(url, data) {
      return q($.get(url, data, function(data, status) {
        //console.log("Success: ", data);
      }));
    }
  };

  return http;
});