(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var ReactiveTable, getFilterQuery, dependOnFilters, getFilterStrings, getFilterFields;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/aslagle:reactive-table/lib/filter.js                                                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var parseFilterString = function (filterString) {                                                              // 1
  var startQuoteRegExp = /^[\'\"]/;                                                                            // 2
  var endQuoteRegExp = /[\'\"]$/;                                                                              // 3
  var filters = [];                                                                                            // 4
  var words = filterString.split(' ');                                                                         // 5
                                                                                                               // 6
  var inQuote = false;                                                                                         // 7
  var quotedWord = '';                                                                                         // 8
  _.each(words, function (word) {                                                                              // 9
    if (inQuote) {                                                                                             // 10
      if (endQuoteRegExp.test(word)) {                                                                         // 11
        filters.push(quotedWord + ' ' + word.slice(0, word.length - 1));                                       // 12
        inQuote = false;                                                                                       // 13
        quotedWord = '';                                                                                       // 14
      } else {                                                                                                 // 15
        quotedWord = quotedWord + ' ' + word;                                                                  // 16
      }                                                                                                        // 17
    } else if (startQuoteRegExp.test(word)) {                                                                  // 18
      if (endQuoteRegExp.test(word)) {                                                                         // 19
        filters.push(word.slice(1, word.length - 1));                                                          // 20
      } else {                                                                                                 // 21
        inQuote = true;                                                                                        // 22
        quotedWord = word.slice(1, word.length);                                                               // 23
      }                                                                                                        // 24
    } else {                                                                                                   // 25
      filters.push(word);                                                                                      // 26
    }                                                                                                          // 27
  });                                                                                                          // 28
  return filters;                                                                                              // 29
};                                                                                                             // 30
                                                                                                               // 31
var escapeRegex = function(text) {                                                                             // 32
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");                                                     // 33
};                                                                                                             // 34
                                                                                                               // 35
getFilterQuery = function (filterInputs, filterFields, settings) {                                             // 36
  settings = settings || {};                                                                                   // 37
  if (settings.enableRegex === undefined) {                                                                    // 38
    settings.enableRegex = false;                                                                              // 39
  }                                                                                                            // 40
  if (settings.fields) {                                                                                       // 41
    _.each(filterInputs, function (filter, index) {                                                            // 42
      if (_.any(settings.fields, function (include) { return include; })) {                                    // 43
        filterFields[index] = _.filter(filterFields[index], function (field) {                                 // 44
          return settings.fields[field];                                                                       // 45
        });                                                                                                    // 46
      } else {                                                                                                 // 47
        filterFields[index] = _.filter(filterFields[index], function (field) {                                 // 48
          return _.isUndefined(settings.fields[field]) || settings.fields[field];                              // 49
        });                                                                                                    // 50
      }                                                                                                        // 51
    });                                                                                                        // 52
  }                                                                                                            // 53
  var numberRegExp = /^\d+$/;                                                                                  // 54
  var queryList = [];                                                                                          // 55
  _.each(filterInputs, function (filter, index) {                                                              // 56
    if (filter) {                                                                                              // 57
      if (_.isObject(filter)) {                                                                                // 58
        var fieldQueries = _.map(filterFields[index], function (field) {                                       // 59
          var query = {};                                                                                      // 60
          query[field] = filter;                                                                               // 61
          return query;                                                                                        // 62
        });                                                                                                    // 63
        if (fieldQueries.length) {                                                                             // 64
            queryList.push({'$or': fieldQueries});                                                             // 65
          }                                                                                                    // 66
      } else {                                                                                                 // 67
        var filters = parseFilterString(filter);                                                               // 68
        _.each(filters, function (filterWord) {                                                                // 69
          if (settings.enableRegex === false) {                                                                // 70
            filterWord = escapeRegex(filterWord);                                                              // 71
          }                                                                                                    // 72
          var filterQueryList = [];                                                                            // 73
          _.each(filterFields[index], function (field) {                                                       // 74
            var filterRegExp = new RegExp(filterWord, 'i');                                                    // 75
            var query = {};                                                                                    // 76
            query[field] = filterRegExp;                                                                       // 77
            filterQueryList.push(query);                                                                       // 78
                                                                                                               // 79
            if (numberRegExp.test(filterWord)) {                                                               // 80
              var numberQuery = {};                                                                            // 81
              numberQuery[field] = parseInt(filterWord, 10);                                                   // 82
              filterQueryList.push(numberQuery);                                                               // 83
            }                                                                                                  // 84
                                                                                                               // 85
            if (filterWord === "true") {                                                                       // 86
              var boolQuery = {};                                                                              // 87
              boolQuery[field] = true;                                                                         // 88
              filterQueryList.push(boolQuery);                                                                 // 89
            } else if (filterWord === "false") {                                                               // 90
              var boolQuery = {};                                                                              // 91
              boolQuery[field] = false;                                                                        // 92
              filterQueryList.push(boolQuery);                                                                 // 93
            }                                                                                                  // 94
          });                                                                                                  // 95
                                                                                                               // 96
          if (filterQueryList.length) {                                                                        // 97
            var filterQuery = {'$or': filterQueryList};                                                        // 98
            queryList.push(filterQuery);                                                                       // 99
          }                                                                                                    // 100
        });                                                                                                    // 101
      }                                                                                                        // 102
    }                                                                                                          // 103
  });                                                                                                          // 104
  return queryList.length ? {'$and': queryList} : {};                                                          // 105
};                                                                                                             // 106
                                                                                                               // 107
if (Meteor.isClient) {                                                                                         // 108
  ReactiveTable = ReactiveTable || {};                                                                         // 109
                                                                                                               // 110
  var reactiveTableFilters = {};                                                                               // 111
  var callbacks = {};                                                                                          // 112
                                                                                                               // 113
  ReactiveTable.Filter = function (id, fields) {                                                               // 114
    if (reactiveTableFilters[id]) {                                                                            // 115
        return reactiveTableFilters[id];                                                                       // 116
    }                                                                                                          // 117
                                                                                                               // 118
    var filter = new ReactiveVar();                                                                            // 119
                                                                                                               // 120
    this.fields = fields;                                                                                      // 121
                                                                                                               // 122
    this.get = function () {                                                                                   // 123
      return filter.get() || '';                                                                               // 124
    };                                                                                                         // 125
                                                                                                               // 126
    this.set = function (filterString) {                                                                       // 127
      filter.set(filterString);                                                                                // 128
      _.each(callbacks[id], function (callback) {                                                              // 129
        callback();                                                                                            // 130
      });                                                                                                      // 131
    };                                                                                                         // 132
                                                                                                               // 133
    reactiveTableFilters[id] = this;                                                                           // 134
  };                                                                                                           // 135
                                                                                                               // 136
  ReactiveTable.clearFilters = function (filterIds) {                                                          // 137
    _.each(filterIds, function (filterId) {                                                                    // 138
      if (reactiveTableFilters[filterId]) {                                                                    // 139
        reactiveTableFilters[filterId].set('');                                                                // 140
      }                                                                                                        // 141
    });                                                                                                        // 142
  };                                                                                                           // 143
                                                                                                               // 144
  dependOnFilters = function (filterIds, callback) {                                                           // 145
    _.each(filterIds, function (filterId) {                                                                    // 146
      if (_.isUndefined(callbacks[filterId])) {                                                                // 147
        callbacks[filterId] = [];                                                                              // 148
      }                                                                                                        // 149
      callbacks[filterId].push(callback);                                                                      // 150
    });                                                                                                        // 151
  };                                                                                                           // 152
                                                                                                               // 153
  getFilterStrings = function (filterIds) {                                                                    // 154
    return _.map(filterIds, function (filterId) {                                                              // 155
      if (_.isUndefined(reactiveTableFilters[filterId])) {                                                     // 156
        return '';                                                                                             // 157
      }                                                                                                        // 158
      return reactiveTableFilters[filterId].get();                                                             // 159
    });                                                                                                        // 160
  };                                                                                                           // 161
                                                                                                               // 162
  getFilterFields = function (filterIds, allFields) {                                                          // 163
    return _.map(filterIds, function (filterId) {                                                              // 164
      if (_.isUndefined(reactiveTableFilters[filterId])) {                                                     // 165
        return _.map(allFields, function (field) { return field.key; });                                       // 166
      } else if (_.isEmpty(reactiveTableFilters[filterId].fields)) {                                           // 167
        return _.map(allFields, function (field) { return field.key; });                                       // 168
      } else {                                                                                                 // 169
        return reactiveTableFilters[filterId].fields;                                                          // 170
      }                                                                                                        // 171
    });                                                                                                        // 172
  };                                                                                                           // 173
                                                                                                               // 174
  Template.reactiveTableFilter.helpers({                                                                       // 175
    'class': function () {                                                                                     // 176
      return this.class || 'input-group';                                                                      // 177
    },                                                                                                         // 178
                                                                                                               // 179
    'filter': function () {                                                                                    // 180
      if (_.isUndefined(reactiveTableFilters[this.id])) {                                                      // 181
        new ReactiveTable.Filter(this.id, this.fields);                                                        // 182
      }                                                                                                        // 183
      return reactiveTableFilters[this.id].get();                                                              // 184
    }                                                                                                          // 185
  });                                                                                                          // 186
                                                                                                               // 187
  var updateFilter = _.debounce(function (template, filterText) {                                              // 188
    reactiveTableFilters[template.data.id].set(filterText);                                                    // 189
  }, 200);                                                                                                     // 190
                                                                                                               // 191
  Template.reactiveTableFilter.events({                                                                        // 192
    'keyup .reactive-table-input, input .reactive-table-input': function (event) {                             // 193
      var template = Template.instance();                                                                      // 194
      var filterText = $(event.target).val();                                                                  // 195
      updateFilter(template, filterText);                                                                      // 196
    },                                                                                                         // 197
  });                                                                                                          // 198
}                                                                                                              // 199
                                                                                                               // 200
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/aslagle:reactive-table/lib/server.js                                                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
ReactiveTable = {};                                                                                            // 1
                                                                                                               // 2
ReactiveTable.publish = function (name, collectionOrFunction, selectorOrFunction, settings) {                  // 3
    Meteor.publish("reactive-table-" + name, function (publicationId, filters, fields, options, rowsPerPage) { // 4
      check(publicationId, String);                                                                            // 5
      check(filters, [Match.OneOf(String, Object)]);                                                           // 6
      check(fields, [[String]]);                                                                               // 7
      check(options, {skip: Match.Integer, limit: Match.Integer, sort: Object});                               // 8
      check(rowsPerPage, Match.Integer);                                                                       // 9
                                                                                                               // 10
      var collection;                                                                                          // 11
      var selector;                                                                                            // 12
                                                                                                               // 13
      if (_.isFunction(collectionOrFunction)) {                                                                // 14
        collection = collectionOrFunction.call(this);                                                          // 15
      } else {                                                                                                 // 16
        collection = collectionOrFunction;                                                                     // 17
      }                                                                                                        // 18
                                                                                                               // 19
      if (!(collection instanceof Mongo.Collection)) {                                                         // 20
        console.log("ReactiveTable.publish: no collection to publish");                                        // 21
        return [];                                                                                             // 22
      }                                                                                                        // 23
                                                                                                               // 24
      if (_.isFunction(selectorOrFunction)) {                                                                  // 25
        selector = selectorOrFunction.call(this);                                                              // 26
      } else {                                                                                                 // 27
        selector = selectorOrFunction;                                                                         // 28
      }                                                                                                        // 29
      var self = this;                                                                                         // 30
      var filterQuery = _.extend(getFilterQuery(filters, fields, settings), selector);                         // 31
      if (settings && settings.fields) {                                                                       // 32
        options.fields = settings.fields;                                                                      // 33
      }                                                                                                        // 34
      var cursor = collection.find(filterQuery, options);                                                      // 35
      var count = cursor.count();                                                                              // 36
                                                                                                               // 37
      var getRow = function (row, index) {                                                                     // 38
        return _.extend({                                                                                      // 39
          "reactive-table-id": publicationId,                                                                  // 40
          "reactive-table-sort": index                                                                         // 41
        }, row);                                                                                               // 42
      };                                                                                                       // 43
                                                                                                               // 44
      var getRows = function () {                                                                              // 45
        return _.map(cursor.fetch(), getRow);                                                                  // 46
      };                                                                                                       // 47
      var rows = {};                                                                                           // 48
      _.each(getRows(), function (row) {                                                                       // 49
        rows[row._id] = row;                                                                                   // 50
      });                                                                                                      // 51
                                                                                                               // 52
      var updateRows = function () {                                                                           // 53
        var newRows = getRows();                                                                               // 54
        _.each(newRows, function (row, index) {                                                                // 55
          var oldRow = rows[row._id];                                                                          // 56
          if (oldRow) {                                                                                        // 57
            if (!_.isEqual(oldRow, row)) {                                                                     // 58
              self.changed("reactive-table-rows-" + publicationId, row._id, row);                              // 59
              rows[row._id] = row;                                                                             // 60
            }                                                                                                  // 61
          } else {                                                                                             // 62
            self.added("reactive-table-rows-" + publicationId, row._id, row);                                  // 63
            rows[row._id] = row;                                                                               // 64
          }                                                                                                    // 65
        });                                                                                                    // 66
      };                                                                                                       // 67
                                                                                                               // 68
      self.added("reactive-table-counts", publicationId, {count: count});                                      // 69
      _.each(rows, function (row) {                                                                            // 70
        self.added("reactive-table-rows-" + publicationId, row._id, row);                                      // 71
      });                                                                                                      // 72
                                                                                                               // 73
      var initializing = true;                                                                                 // 74
                                                                                                               // 75
      var handle = cursor.observeChanges({                                                                     // 76
        added: function (id, fields) {                                                                         // 77
          if (!initializing) {                                                                                 // 78
            self.changed("reactive-table-counts", publicationId, {count: cursor.count()});                     // 79
            updateRows();                                                                                      // 80
          }                                                                                                    // 81
        },                                                                                                     // 82
                                                                                                               // 83
        removed: function (id, fields) {                                                                       // 84
          self.changed("reactive-table-counts", publicationId, {count: cursor.count()});                       // 85
          self.removed("reactive-table-rows-" + publicationId, id);                                            // 86
          delete rows[id];                                                                                     // 87
          updateRows();                                                                                        // 88
        },                                                                                                     // 89
                                                                                                               // 90
        changed: function (id, fields) {                                                                       // 91
          updateRows();                                                                                        // 92
        }                                                                                                      // 93
                                                                                                               // 94
      });                                                                                                      // 95
      initializing = false;                                                                                    // 96
                                                                                                               // 97
      self.ready();                                                                                            // 98
                                                                                                               // 99
      self.onStop(function () {                                                                                // 100
        handle.stop();                                                                                         // 101
      });                                                                                                      // 102
    });                                                                                                        // 103
};                                                                                                             // 104
                                                                                                               // 105
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aslagle:reactive-table'] = {
  ReactiveTable: ReactiveTable
};

})();

//# sourceMappingURL=aslagle_reactive-table.js.map
