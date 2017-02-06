
RR.setZonesView = (function(){

  var render = function render() {
    var _wrapper = document.getElementById('js-app');

    _wrapper.innerHTML = ""; // Reset View

    // Add Header

    // Add Zone Cards
  }

  // PRIVATE

  var _zoneCard = function _zoneCard() {
    var card = document.createElement('A');

    card.classList.add("btn", "btn-card", "center-block");
    card.setAttribute("data-type", "");
    card.setAttribute("data-id");
    card.textContent = "place holder";

    return card
  }

  return {
    render: render
  }
})();
