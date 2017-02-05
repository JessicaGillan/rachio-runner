var RR = RR || {};

RR.chooseDeviceView = (function(){

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
    var card = document.createElement('DIV');
    var inner = document.createElement('DIV');
    var link = document.createElement('A');

    card.classList.add("panel", "panel-default", "card", "device");
    card.setAttribute("data-type", "device");
    card.setAttribute("data-id", device.id);

    inner.classList.add("panel-body");
    inner.textContent = device.name;

    card.appendChild(inner);
    link.appendChild(card);

    return link
  }

  return {
    render: render
  }
})();
