var RR = RR || {};

RR.mainCtrl = (function(personService, deviceView){
  var init = function init(auth_token) {
    personService.init(auth_token);
    deviceView.render(personService.getDevices());
  };

  return {
    init: init
  }
})(RR.personService, RR.chooseDeviceView);
