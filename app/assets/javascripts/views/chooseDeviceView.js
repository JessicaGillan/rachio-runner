var RR = RR || {};

RR.chooseDeviceView = (function(){
  var _wrapper = document.getElementById('js-app');
  var _header = document.createElement('H2').innerHTML = "Which Device would you like to run?"

  var render = function render(devices) {
    _wrapper.innerHTML = ""; // Reset View
    _wrapper.appendChild(_header);

    var i = devices.length;
    while(i--) {
      _wrapper.appendChild(_deviceCard(devices[i]));
    }
  }

  // PRIVATE

  var _deviceCard = function _deviceCard(device) {
    var card = document.createElement('DIV');
    card.classList.add("panel", "card", "device");
    card.addAttribute("data-type", "device");
    card.addAttribute("data-id", device.id);
    card.textContent = device.name;

    return card
  }

  return {
    render: render
  }
})();
