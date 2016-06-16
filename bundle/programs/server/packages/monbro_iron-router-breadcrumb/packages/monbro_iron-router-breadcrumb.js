(function () {

/* Imports */
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var _ = Package.underscore._;
var Meteor = Package.meteor.Meteor;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Breadcrumb, cssClasses, newParent;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/monbro:iron-router-breadcrumb/lib/breadcrumb.js                                 //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/* Package-scope variables */                                                               // 1
var privateVar;                                                                             // 2
                                                                                            // 3
String.prototype.capitalize = function() {                                                  // 4
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });              // 5
};                                                                                          // 6
                                                                                            // 7
var enrichRouteObject = function(path, isCurrent) {                                         // 8
  // replace all parameters in the title                                                    // 9
  var routeOptions = Router.routes[path] && Router.routes[path].options;                    // 10
  var title = (routeOptions && routeOptions.hasOwnProperty('title')) ? routeOptions.title : Router.options.defaultBreadcrumbTitle;
  if ('function' === typeof title)                                                          // 12
    title = _.bind(title, Router.current())();                                              // 13
  var params = Router.current().params;                                                     // 14
  if (title) {                                                                              // 15
    for (var i in params) {                                                                 // 16
      title = title && title.replace(                                                       // 17
        new RegExp((':'+i).replace(/\+/g, "\\+"), "g"), params[i]);                         // 18
    }                                                                                       // 19
    if (!Router.routes[path].options.noCaps)                                                // 20
      title = title && title.capitalize();                                                  // 21
  } else {                                                                                  // 22
    title = null;                                                                           // 23
                                                                                            // 24
  }                                                                                         // 25
                                                                                            // 26
  if(isCurrent) {                                                                           // 27
    cssClasses = 'active';                                                                  // 28
  } else {                                                                                  // 29
    cssClasses = '';                                                                        // 30
  }                                                                                         // 31
                                                                                            // 32
  // handle showlink attribute                                                              // 33
  // 1) if set, by route,                                                                   // 34
  // 2) fallback to global flag,                                                            // 35
  // 3) fallback to default value which is true                                             // 36
  var showLink = true;                                                                      // 37
  if(typeof Router.routes[path].options.showLink !== 'undefined') {                         // 38
    showLink = Router.routes[path].options.showLink;                                        // 39
  } else if(typeof Router.options.defaultBreadcrumbLastLink !== 'undefined' && isCurrent) { // 40
    showLink = Router.options.defaultBreadcrumbLastLink;                                    // 41
  }                                                                                         // 42
                                                                                            // 43
  if (title) return {                                                                       // 44
    'path': path,                                                                           // 45
    'params': params,                                                                       // 46
    'title': title,                                                                         // 47
    'showLink': showLink,                                                                   // 48
    'cssClasses': cssClasses,                                                               // 49
    'url': Router.routes[path].path(Router.current().params),                               // 50
    'route': Router.routes[path]                                                            // 51
  }                                                                                         // 52
}                                                                                           // 53
                                                                                            // 54
var getAllParents = function() {                                                            // 55
  if(Router.current().route) {                                                              // 56
    var current = Router.current().route.getName();                                         // 57
    var parent = Router.current().route.options.hasOwnProperty('parent') ? Router.current().route.options.parent : Router.options.parent;
    if ('function' === typeof parent)                                                       // 59
      parent = _.bind(parent, Router.current())()                                           // 60
                                                                                            // 61
    if(parent) {                                                                            // 62
      return getParentParent([enrichRouteObject(current,true),enrichRouteObject(parent)]);  // 63
    } else {                                                                                // 64
      return [enrichRouteObject(current)];                                                  // 65
    }                                                                                       // 66
  } else {                                                                                  // 67
    // no routes have been specified                                                        // 68
    return [];                                                                              // 69
  }                                                                                         // 70
                                                                                            // 71
}                                                                                           // 72
                                                                                            // 73
// parents must be always an array                                                          // 74
var getParentParent = function(parents) {                                                   // 75
  var lastParent = parents[parents.length-1];                                               // 76
  if(newParent = (lastParent && Router.routes[lastParent.path].options.parent)) {           // 77
    if ('function' === typeof newParent)                                                    // 78
      newParent = _.bind(newParent, Router.current())()                                     // 79
    parents.push(enrichRouteObject(newParent))                                              // 80
    return getParentParent(parents);                                                        // 81
  } else {                                                                                  // 82
    return parents;                                                                         // 83
  }                                                                                         // 84
}                                                                                           // 85
                                                                                            // 86
Breadcrumb = {                                                                              // 87
  getAll: function() {                                                                      // 88
    return _.compact(getAllParents()).reverse();                                            // 89
  }                                                                                         // 90
};                                                                                          // 91
                                                                                            // 92
UI.registerHelper('Breadcrumb', function(template) {                                        // 93
  return Breadcrumb.getAll();                                                               // 94
});                                                                                         // 95
                                                                                            // 96
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['monbro:iron-router-breadcrumb'] = {
  Breadcrumb: Breadcrumb
};

})();
