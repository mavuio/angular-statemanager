// Generated by CoffeeScript 1.6.2
var __hasProp = {}.hasOwnProperty;

angular.module("werkzeugh-statemanager", []).factory("statemanager", [
  "$location", function($location) {
    var currentState, fromParams, getLocationForState, sanitizeQuery, stateUpdateCount, toParams, updateLocationFromState, updateStateFromLocation;

    currentState = {};
    stateUpdateCount = 0;
    updateLocationFromState = function(state) {
      var newLocation;

      newLocation = getLocationForState(state);
      $location.path(newLocation.path);
      $location.hash(newLocation.hash);
      return $location.search(newLocation.search);
    };
    updateStateFromLocation = function() {
      var currentLocation;

      currentLocation = {
        path: $location.path(),
        hash: $location.hash() + '',
        search: $location.search()
      };
      currentState.query = currentLocation.search;
      currentState.hash = fromParams(currentLocation.hash);
      return stateUpdateCount++;
    };
    getLocationForState = function(state) {
      var newLocation;

      newLocation = {
        search: null,
        path: '',
        hash: ''
      };
      newLocation.search = sanitizeQuery(state.query);
      newLocation.hash = toParams(state.hash);
      return newLocation;
    };
    sanitizeQuery = function(query) {
      var statequery;

      statequery = {};
      angular.forEach(query, function(value, key) {
        var ok;

        ok = true;
        if (key === 'page' && value < 2) {
          ok = false;
        }
        if (value && ok) {
          return statequery[key] = value;
        }
      });
      return statequery;
    };
    toParams = function(params) {
      var pairs, proc;

      pairs = [];
      (proc = function(object, prefix) {
        var el, i, key, value, _results;

        _results = [];
        for (key in object) {
          if (!__hasProp.call(object, key)) continue;
          value = object[key];
          if (value instanceof Array) {
            _results.push((function() {
              var _i, _len, _results1;

              _results1 = [];
              for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
                el = value[i];
                _results1.push(proc(el, prefix != null ? "" + prefix + "[" + key + "][]" : "" + key + "[]"));
              }
              return _results1;
            })());
          } else if (value instanceof Object) {
            if (prefix != null) {
              prefix += "[" + key + "]";
            } else {
              prefix = key;
            }
            _results.push(proc(value, prefix));
          } else {
            _results.push(pairs.push(prefix != null ? "" + prefix + "[" + key + "]=" + value : "" + key + "=" + value));
          }
        }
        return _results;
      })(params, null);
      return pairs.join('&');
    };
    fromParams = function(str) {
      var obj;

      obj = {};
      str.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function($0, $1, $2, $3) {
        return obj[$1] = $3;
      });
      return obj;
    };
    return {
      set: function(key, value) {
        var key_parts;

        if (window.console && console.log) {
          console.log("set", key, value);
        }
        key_parts = key.split(/\./);
        currentState[key] = angular.copy(value);
        stateUpdateCount++;
        return updateLocationFromState(currentState);
      },
      setState: function(stateparams) {
        if (window.console && console.log) {
          console.log("setstate", stateparams);
        }
        currentState = angular.copy(stateparams);
        stateUpdateCount++;
        return updateLocationFromState(currentState);
      },
      get: function(key) {
        if (stateUpdateCount === 0) {
          updateStateFromLocation();
        }
        if (currentState[key] != null) {
          return currentState[key];
        }
      },
      getState: function() {
        return currentState;
      },
      syncStateToUrl: function() {
        return updateStateFromLocation();
      },
      getLocation: function() {
        return getLocationForState(currentState);
      }
    };
  }
]);

/*
//@ sourceMappingURL=werkzeugh-statemanager.map
*/
