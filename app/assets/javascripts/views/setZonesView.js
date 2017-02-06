
RR.setZonesView = (function(){
  var _controls;

  var render = function render(zones) {
    var _wrapper = document.getElementById('js-app');

    _wrapper.innerHTML = ""; // Reset View

    _setUpControls();

    // Add Header
    var _header = document.createElement('H2');
    _header.textContent = "Select when you'd like to water and for how long...";
    _wrapper.appendChild(_header);

    // Add DONE button
    var _done = document.createElement('A');
    _done.textContent = 'Submit ✓';
    _done.classList.add("btn", "btn-success", "btn-submit", "center-block");
    _wrapper.appendChild(_done);

    // Add Zone Cards
    if(zones) {
      var i = zones.length;
      while(i--) {
        _wrapper.appendChild(_zoneRow(zones[i]));
      }
    }
  }

  // PRIVATE

  var _zoneRow = function _zoneRow(zone) {
    var row = document.createElement('DIV');
    row.classList.add("center-block", "zone");


    row.appendChild(_zoneCard(zone));
    row.appendChild(_controls.cloneNode(true));

    row.setAttribute("data-type", "zone");
    row.setAttribute("data-id", zone.id);
    row.setAttribute("data-state", "unselected");

    return row
  }

  var _zoneCard = function _zoneCard(zone) {
    var card = document.createElement('A');

    card.classList.add("btn", "btn-card");
    card.setAttribute("data-type", "zone");
    card.setAttribute("data-id", zone.id);

    card.textContent = zone.name || "Zone " + zone.zoneNumber;

    card.addEventListener("click", function(e){
      if(e.target.getAttribute('data-state') === "selected") {
        e.target.setAttribute("data-state", "unselected");
        e.target.classList.remove("selected");

        e.target.parentNode.getElementsByTagName("INPUT")[0].disabled = true;
        // e.target.parentNode.getElementsByTagName("SELECT")[0].disabled = true;
      } else {
        e.target.setAttribute("data-state", "selected");
        e.target.classList.add("selected");

        e.target.parentNode.getElementsByTagName("INPUT")[0].disabled = false;
        // e.target.parentNode.getElementsByTagName("SELECT")[0].disabled = false;
      }
    })

    if(zone.imageUrl) card.style.backgroundImage = "url(" + zone.imageUrl + ")";

    return card
  }

  var _setUpControls = function _setUpControls() {
    _controls = document.createElement('FORM');
    _controls.classList.add('form-inline');

    var formGroup = document.createElement('DIV');
    formGroup.classList.add('form-group');

    var duration = formGroup.cloneNode(true);
    duration.innerHTML = " run for ";
    duration.innerHTML += "<input type=\"number\" class=\"form-control\" min=\"5\" max=\"120\" name=\"settings.duration\" value=\"6\" disabled=\"true\">";

    var delay = formGroup.cloneNode(true);
    delay.innerHTML = " minutes "  // minutes in
    // delay.appendChild(_createDelaySelect(0,12));
    // delay.innerHTML += " hours"

    _controls.appendChild(duration);
    _controls.appendChild(delay);
  }

  var _createDelaySelect = function _createDelaySelect(min, max){
    var hours = document.createElement('SELECT');
    hours.disabled = true;

    var option = document.createElement("option");

    var o;
    for (var i = min; i <= max; i++) {
      o = option.cloneNode();
      o.text = String(i);
      o.value = String(i);

      hours.appendChild(o);
    }

    return hours
  }

  return {
    render: render
  }
})();
