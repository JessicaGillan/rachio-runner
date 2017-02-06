var RR = RR || {};

RR.modeView = (function(){

  var render = function render() {
    var _wrapper = document.getElementById('js-app');

    _wrapper.innerHTML = ""; // Reset View

    // Add Header
    var _header = document.createElement('H2')
    _header.textContent = "How would you like to set the zones?";
    _wrapper.appendChild(_header);

    // Add Select Cards
    _wrapper.appendChild(_card('Altogether'));
    _wrapper.appendChild(_card('Individually'));
  }

  // PRIVATE

  var _card = function _card(message) {
    var card = document.createElement('A');

    card.classList.add("btn", "btn-card", "center-block");
    card.setAttribute("data-type", "mode");
    card.setAttribute("data-value", message);
    card.textContent = message;

    return card
  }

  return {
    render: render
  }
})();
