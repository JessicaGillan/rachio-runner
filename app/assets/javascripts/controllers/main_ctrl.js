var RR = RR || {};

RR.mainCtrl = (function(personService, deviceView){
  var init = function init(auth_token) {
    personService.init(auth_token)
      .then( function() {
        console.log("personService devices", personService.getDevices())
        deviceView.render(personService.getDevices());
      });
  };

  return {
    init: init
  }
})(RR.personService, RR.chooseDeviceView);
