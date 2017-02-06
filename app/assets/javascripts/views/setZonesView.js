
RR.setZonesView = (function(){

  var render = function render(zones) {
    var _wrapper = document.getElementById('js-app');

    _wrapper.innerHTML = ""; // Reset View

    // Add Header
    var _header = document.createElement('H2')
    _header.textContent = "Select when you'd like to water and for how long...";
    _wrapper.appendChild(_header);

    // Add Zone Cards
    if(zones) {
      var i = zones.length;
      while(i--) {
        _wrapper.appendChild(_zoneCard(zones[i]));
      }
    }
  }

  // PRIVATE

  var _zoneCard = function _zoneCard(zone) {
    var card = document.createElement('A');

    card.classList.add("btn", "btn-card", "center-block");
    card.setAttribute("data-type", "zone");
    card.setAttribute("data-id", zone.id);

    card.textContent = zone.name || "Zone " + zone.zoneNumber;

    if(zone.imageUrl) card.style.backgroundImage = "url(" + zone.imageUrl + ")";

    return card
  }

  return {
    render: render
  }
})();
