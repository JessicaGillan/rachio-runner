var RR = RR || {};

RR.mainCtrl = (function(personService, deviceView, modeView, zoneView){
  var STATES = {
    'modeSelect': modeView.render,
    'zoneSelect': function() { zoneView.render(personService.getZones()) }
  }

  var init = function init(auth_token, cookies) {
    deviceView.init(goToModeState);
    modeView.init(goToZoneState);
    zoneView.init(setZones);

    personService.init(auth_token)
      .then( function() {
        _renderState();
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

    // set modeSelect state in cookie
    RR.setCookie('state', 'zoneSelect', 1);

    // init and render mode view
    STATES['zoneSelect']();
  }

  // Send Zone IDs and Durations to personService
  var setZones = function setZones(e, options){
    e.preventDefault();

    personService.setZones(options)
     .then(function(response) {
        
        RR.clearCookies(['state', 'device_id']);
        _renderState();
     })
  }

  // PRIVATE

  var _renderState = function _renderState() {
    // Store state in cookies cookies in case of refresh
    var state = RR.getCookie('state');

    if(state && STATES[state]) {
      STATES[state]();
    } else {
      deviceView.render(personService.getDevices());
    }
  }

  return {
    init: init
  }
})(RR.personService, RR.chooseDeviceView, RR.modeView, RR.setZonesView);
