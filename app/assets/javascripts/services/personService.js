var RR = RR || {};

RR.personService = (function(rachio){
  var _person = {};

  var init = function init(auth_token) {
    rachio.init(auth_token);
    rachio.getPerson().then( function(person) {
      _person = person;
    })
  };

  

  return {
    init: init
  }
})(RR.rachio);
