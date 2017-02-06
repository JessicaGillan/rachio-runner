var RR = RR || {};

RR.mainCtrl = (function(personService, deviceView, modeView, zoneView){
  var STATES = {
    'modeSelect': modeView.render,
    'zoneSelect': function() { zoneView.render(personService.getZones()) }
  }

  var init = function init(auth_token, cookies) {
    deviceView.init(goToModeState);
    modeView.init(goToZoneState);

    personService.init(auth_token)
      .then( function() {
        // Store state in cookies cookies in case of refresh
        var state = RR.getCookie('state');

        if(state && STATES[state]) {
          STATES[state]();
        } else {
          deviceView.render(personService.getDevices());
        }
      });
  };

  var goToModeState = function goToModeState(e) {
    e.preventDefault();

    // set device id
    RR.setCookie('device_id', e.target.getAttribute('data-id'), 1);

    // set modeSelect state in cookie
    RR.setCookie('state', 'modeSelect', 1);

    // init and render mode view
    STATES['modeSelect']();
  };

  var goToZoneState = function goToZoneState(e) {
    e.preventDefault();

    // init zone ctrler

    // set modeSelect state in cookie
    RR.setCookie('state', 'zoneSelect', 1);

    // init and render mode view
    STATES['zoneSelect']();
  }

  return {
    init: init
  }
})(RR.personService, RR.chooseDeviceView, RR.modeView, RR.setZonesView);
