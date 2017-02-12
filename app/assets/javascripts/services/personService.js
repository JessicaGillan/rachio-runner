var rachioRun = rachioRun || {};

rachioRun.personService = (function(rachio){
  "use strict";

  var _person = {};

  var init = function init(auth_token) {
    rachio.init(auth_token);

    return rachio.getPerson()
            .then(function(person) {
              return _person = person;
            });
  };

  var getDevices = function getDevices() {
    return _person.devices
  }

  var getCurrentDeviceZones = function getCurrentDeviceZones() {
    var id = rachioRun.getCookie('device_id');

    if(id) return _zonesForDevice(id);

    return _sort(_person.devices[0].zones, true)
  }

  var setZones = function setZones(params) {
    return rachio.startMultiple(params)
            .then( function(response) {
              if (response && response.error) {
                return "Sorry, we couldn't get that request to go through."
              } else {
                return "Zones successfully set!"
              }
            })
  }

  // PRIVATE

  var _zonesForDevice = function _zonesForDevice(id) {

    // Find Correct device
    for (var d = 0; d < _person.devices.length; d++) {
      if (_person.devices[d].id === id) {

        // Get enabled zones
        var enabled = [];
        for (var z = 0; z < _person.devices[d].zones.length; z++) {
          if (_person.devices[d].zones[z].enabled) {
            enabled.push(_person.devices[d].zones[z])
          }
        }

        return _sort(enabled, true)
      }
    }

    return []
  }

  var _sort = function _sort(items, int, property) {
    property = property || "zoneNumber";

    if(int) { // Sort integers ascending
      return items.sort(function (a, b) {
                return parseInt(b[property]) - parseInt(a[property]);
              });
    }

    return items.sort(function (a, b) {
              return a[property] - b[property];
            });
  }

  return {
    init: init,
    getDevices: getDevices,
    getZones: getCurrentDeviceZones,
    setZones: setZones
  }
})(rachioRun.rachio);
