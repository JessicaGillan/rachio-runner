var rachioRun = rachioRun || {};

rachioRun.mainCtrl = (function(personService, deviceView, zoneView){
  "use strict";
  
  var STATES = {
    'zoneSelect': function() { zoneView.render(personService.getZones()) }
  }

  var init = function init(auth_token, cookies) {
    deviceView.init(goToZoneState);
    zoneView.init(setZones, cancel);

    personService.init(auth_token)
      .then( function() {
        _renderState();
      });
  };

  var goToZoneState = function goToZoneState(e) {
    e.preventDefault();

    // set device id
    rachioRun.setCookie('device_id', e.target.getAttribute('data-id'), 1);

    // set modeSelect state in cookie
    rachioRun.setCookie('state', 'zoneSelect', 1);

    // init and render mode view
    STATES['zoneSelect']();
  }

  // Send Zone IDs and Durations to personService
  var setZones = function setZones(e, zone_info){
    e.preventDefault();

    personService.setZones(zone_info)
     .then(function(message) {
       zoneView.renderConfirmation(message)
        rachioRun.clearCookies(['state', 'device_id']);
        _renderState();

     })
  }

  // Cancel zone setting
  var cancel = function cancel(e, zone_info){
    e.preventDefault();

    rachioRun.clearCookies(['state', 'device_id']);
    _renderState();
  }

  // PRIVATE

  var _renderState = function _renderState() {
    // Store state in cookies cookies in case of refresh
    var state = rachioRun.getCookie('state');

    if(state && STATES[state]) {
      STATES[state]();
    } else {
      deviceView.render(personService.getDevices());
    }
  }

  return {
    init: init
  }
})(rachioRun.personService, rachioRun.chooseDeviceView, rachioRun.setZonesView);
