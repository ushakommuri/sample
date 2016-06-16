(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Twilio;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/mrt:twilio-meteor/twilio_npm.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Twilio = Npm.require('twilio');                                      // 1
                                                                     // 2
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mrt:twilio-meteor'] = {
  Twilio: Twilio
};

})();
