var RR = RR || {};

RR.chooseDeviceView = (function(){
  var _clickAction;

  var init = function init(clickAction) {
    _clickAction = clickAction;
  }

  var render = function render(devices) {
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
      }
    }
  }

  // PRIVATE

  var _deviceCard = function _deviceCard(device) {
    var card = document.createElement('A');

    card.classList.add("btn", "btn-card", "center-block");
    card.setAttribute("data-type", "device");
    card.setAttribute("data-id", device.id);
    card.textContent = "Set Zones on " + device.name;

    card.addEventListener("click", _clickAction);

    return card
  }

  return {
    init: init,
    render: render
  }
})();
