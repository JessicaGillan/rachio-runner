var RR = RR || {};

RR.chooseDeviceView = (function(){
  var _clickAction;

  var init = function init(clickAction) {
    _clickAction = clickAction;
  }

  var render = function render(devices) {
    RR.fadeFlashes();

    var _wrapper = document.getElementById('js-app');

    _wrapper.innerHTML = ""; // Reset View

    // Add Header
    var _header = document.createElement('H2')
    _header.textContent = "Which device would you like to run?";
    _wrapper.appendChild(_header);

    // Add Device Cards
    if(devices) {
      var i = devices.length;
      while(i--) {
        _wrapper.appendChild(_deviceCard(devices[i]));
        _wrapper.appendChild(_enabledZones(devices[i].zones));
      }
    }
  }

  // PRIVATE

  var _deviceCard = function _deviceCard(device) {
    var card = document.createElement('A');

    card.classList.add("btn", "btn-card", "center-block");
    card.setAttribute("data-type", "device");
    card.setAttribute("data-id", device.id);

    card = _adjustForStatus(device, card);

    card.addEventListener("click", _clickAction);

    return card
  }

  var _adjustForStatus = function _adjustForStatus(device, card) {
    if (device.status === "ONLINE") {
      card.textContent = "Set Zones on " + device.name;
    } else {
      card.textContent = device.name + " is offline";
      card.attr('disabled', true);
    }

    return card
  }

  var _enabledZones = function _enabledZones(zones) {
    var zoneWrapper = document.createElement('DIV');
    zoneWrapper.classList.add("light-text", "center-block", "text-center");
    zoneWrapper.textContent = "Currently enabled: ";

    var tag = document.createElement('SPAN');
    tag.classList.add("zone-tag");

    var tag_copy;
    for (var i = 0; i < zones.length; i++) {
      if (zones[i].enabled) {
        tag_copy = tag.cloneNode();
        tag_copy.textContent = zones[i].name;
        zoneWrapper.appendChild(tag_copy);
      }
    }

    if(!tag_copy) {
      zoneWrapper.textContent = "No zones currently enabled."
    }

    return zoneWrapper
  }

  return {
    init: init,
    render: render
  }
})();
