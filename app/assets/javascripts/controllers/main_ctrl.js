var RR = RR || {};

RR.mainCtrl = (function(personService, deviceView, zoneView){
  var STATES = {
    'zoneSelect': function() { zoneView.render(personService.getZones()) }
  }

  var init = function init(auth_token, cookies) {
    deviceView.init(goToZoneState);
    zoneView.init(setZones);

    personService.init(auth_token)
      .then( function() {
        _renderState();
      });
  };

  var goToZoneState = function goToZoneState(e) {
    e.preventDefault();

    // set device id
    RR.setCookie('device_id', e.target.getAttribute('data-id'), 1);

    // set modeSelect state in cookie
    RR.setCookie('state', 'zoneSelect', 1);

    // init and render mode view
    STATES['zoneSelect']();
  }

  // Send Zone IDs and Durations to personService
  var setZones = function setZones(e, zone_info){
    e.preventDefault();

    personService.setZones(zone_info)
     .then(function(message) {
       zoneView.renderConfirmation(message)
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
})(RR.personService, RR.chooseDeviceView, RR.setZonesView);
