var RR = RR || {};

RR.personService = (function(rachio){
  var _person = {};

  var init = function init(auth_token) {
    rachio.init(auth_token);

    return rachio.getPerson()
            .then(function(person) {
              _person = person;
            });
  };

  var getDevices = function getDevices() {
    return _person.devices
  }

  var getCurrentDeviceZones = function getCurrentDeviceZones() {
    var id = RR.getCookie('device_id');

    if(id) return _zonesForDevice(id);

    return _sort(_person.devices[0].zones, true)
  }

  // PRIVATE

  var _zonesForDevice = function _zonesForDevice(id) {
    for (var i = 0; i < _person.devices.length; i++) {
      if(_person.devices[i].id === id) return _sort(_person.devices[i].zones, true);
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
    getZones: getCurrentDeviceZones
  }
})(RR.rachio);
