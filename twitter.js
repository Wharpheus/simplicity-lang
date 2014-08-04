/* Compiled by Simplicity compiler v0.01 */
require.config({urlArgs: "bust=" + (new Date()).getTime()});

require(["http.sim"], function(http) {
var response = http.get("twitter.com/redskyforge.json");
response.then(function(__result) {
for(var i=0; i<__result.followers.length; i++) {
var follower = __result.followers[i];
console.log(follower.name);
}
});
});
