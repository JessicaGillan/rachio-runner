
RR.setZonesView = (function(){
  var _controls, _clickAction;

  var init = function(clickAction) {
    _clickAction = clickAction;
  }

  var render = function render(zones) {
    RR.fadeFlashes();

    var _wrapper = document.getElementById('js-app');

    _wrapper.innerHTML = ""; // Reset View

    _setUpControls();

    // Add Header
    var _header = document.createElement('H2');
    _header.textContent = "Select when you'd like to water and for how long...";
    _wrapper.appendChild(_header);

    // Add DONE button
    _wrapper.appendChild(_doneButton());

    // Add Zone Cards
    if(zones) {
      var _zWrapper = document.createElement('DIV');
      _zWrapper.classList.add("zone-wrapper");

      var i = zones.length;
      while(i--) {
        _zWrapper.appendChild(_zoneRow(zones[i]));
      }

      _wrapper.appendChild(_zWrapper)
    }
  }

  var renderConfirmation = function renderConfirmation(message) {
    var $modal = $('#confirmationModal');

    $modal.modal('show');
    $modal.find('.modal-title').text(message);
  }

  // PRIVATE

  var _doneButton = function _doneButton() {
    var done = document.createElement('A');
    done.textContent = 'Submit ✓';
    done.classList.add("btn", "btn-success", "btn-submit", "center-block");

    done.addEventListener("click", function(e) {
      _clickAction(e, _getZoneSettings());
    })

    return done
  }

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
      _toggleSelect(e.target);

    })

    if(zone.imageUrl) card.style.backgroundImage = "url(" + zone.imageUrl + ")";

    return card
  }

  var _toggleSelect = function(element) {
    if(element.getAttribute('data-state') === "selected") {
      element.setAttribute("data-state", "unselected");
      element.classList.remove("selected");

      element.parentNode.getElementsByTagName("INPUT")[0].disabled = true;
      // element.parentNode.getElementsByTagName("SELECT")[0].disabled = true;
    } else {
      element.setAttribute("data-state", "selected");
      element.classList.add("selected");

      element.parentNode.getElementsByTagName("INPUT")[0].disabled = false;
      // element.parentNode.getElementsByTagName("SELECT")[0].disabled = false;
    }
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

    // TODO Add delay setting with setTimeout
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

  var _getZoneSettings = function(){
    var selected = document.getElementsByClassName('selected');

    var zoneInfo = {};
    var zones = [];
    for (var i = 0; i < selected.length; i++) {
      zoneInfo = {};
      zoneInfo.id = selected[i].getAttribute('data-id');
      zoneInfo.duration = selected[i].parentNode.getElementsByTagName("INPUT")[0].value * 60; // Set duration in seconds
      zoneInfo.sortOrder = i + 1;

      zones.push(zoneInfo);
    }

    return zones
  }

  return {
    init: init,
    render: render,
    renderConfirmation: renderConfirmation
  }
})();
