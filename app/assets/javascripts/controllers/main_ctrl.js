var RR = RR || {};

RR.mainCtrl = (function(personService, deviceView, modeView){
  var STATES = {
    'modeSelect': modeView.render,
    'zoneSelect': null
  }

  var init = function init(auth_token, cookies) {
    personService.init(auth_token)
      .then( function() {
        // Store state in cookies cookies in case of refresh
        var state = _getCookie('state');

        if(state && STATES[state]) {
          STATES[state]();
        } else {
          deviceView.render(personService.getDevices(), goToModeState);
        }
      });
  };

  var goToModeState = function goToModeState(e) {
    e.preventDefault();

    // set modeSelect state in cookie
    _setCookie('state', 'modeSelect', 1);

    // init and render mode view
    STATES['modeSelect']();
  };

  // PRIVATE

  var _setCookie = function _setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  var _getCookie = function _getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }

  return {
    init: init
  }
})(RR.personService, RR.chooseDeviceView, RR.modeView);
