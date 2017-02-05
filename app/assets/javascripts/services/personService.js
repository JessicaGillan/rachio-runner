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

  return {
    init: init,
    getDevices: getDevices
  }
})(RR.rachio);
