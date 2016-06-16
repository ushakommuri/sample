(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var DDP = Package.ddp.DDP;
var DDPServer = Package.ddp.DDPServer;

/* Package-scope variables */
var Autocomplete, AutocompleteTest, __coffeescriptShare;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/mizzao:autocomplete/autocomplete-server.coffee.js                             //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                 

Autocomplete = (function() {
  function Autocomplete() {}

  Autocomplete.publishCursor = function(cursor, sub) {
    return Mongo.Collection._publishCursor(cursor, sub, "autocompleteRecords");
  };

  return Autocomplete;

})();

Meteor.publish('autocomplete-recordset', function(selector, options, collName) {
  var collection;
  collection = global[collName];
  if (!collection) {
    throw new Error(collName + ' is not defined on the global namespace of the server.');
  }
  if (!collection._isInsecure()) {
    Meteor._debug(collName + ' is a secure collection, therefore no data was returned because the client could compromise security by subscribing to arbitrary server collections via the browser console. Please write your own publish function.');
    return [];
  }
  if (options.limit) {
    options.limit = Math.min(50, Math.abs(options.limit));
  }
  Autocomplete.publishCursor(collection.find(selector, options), this);
  return this.ready();
});
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mizzao:autocomplete'] = {
  Autocomplete: Autocomplete,
  AutocompleteTest: AutocompleteTest
};

})();
