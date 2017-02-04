var RR = RR || {};

RR.mainCtrl = (function(personService){
  var init = function init(auth_token) {
    personService.init(auth_token)
  };

  return {
    init: init
  }
})(RR.personService);
