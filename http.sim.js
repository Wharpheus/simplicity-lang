/**
 * To be Simplicity compatible, all async methods SHOULD
 * return a promise.
 */
define(function(require) {
	var q = require("node_modules/q/q");
	require("node_modules/jquery/dist/jquery");

  var http = {
    get: function(url, data) {
      return q($.get(url, data));
    }
  };

  return http;
});