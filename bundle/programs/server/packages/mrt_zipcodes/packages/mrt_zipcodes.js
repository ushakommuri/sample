(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Zipcodes;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/mrt:zipcodes/server.js                                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Zipcodes = Npm.require('zipcodes');                                  // 1
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mrt:zipcodes'] = {
  Zipcodes: Zipcodes
};

})();
