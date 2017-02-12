
rachioRun.setZonesView = (function($){
  "use strict";

  var _controls, _gal_counter, _altogether,
      _doneAction, _cancelAction;

  var CONVERSION = 0.000072; // 1 cu in/hr == 0.000072 gal/min

  var init = function(doneAction, cancelAction) {
    _doneAction = doneAction;
    _cancelAction = cancelAction;
  }

  var render = function render(zones) {
    rachioRun.fadeFlashes();

    var _wrapper = document.getElementById('js-app');

    _wrapper.innerHTML = ""; // Reset View

    _setUpControls();

    // Add Header
    var _header = document.createElement('H2');
    _header.textContent = "Select when you'd like to water and for how long...";
    _wrapper.appendChild(_header);

    // Add 'Set Altogether' Checkbox
    _wrapper.appendChild(_checkbox());

    // Add Gallon Counter
    _gal_counter = document.createElement('H3');
    _gal_counter.setAttribute("id", "gal-counter");
    _gal_counter.classList.add("light-text");
    _gal_counter.textContent = "Approximately 0 GAL"
    _wrapper.appendChild(_gal_counter);

    // Add Zone Cards
    if(zones) {
      var _zWrapper = document.createElement('DIV');
      _zWrapper.classList.add("zone-wrapper");

      _zWrapper.addEventListener("input", function(e) {
        if (_altogether) _setAllToMatch(e.target);
        updateCounter(_getGallons());
      })

      var i = zones.length;
      while(i--) {
        _zWrapper.appendChild(_zoneRow(zones[i]));
      }

      _wrapper.appendChild(_zWrapper)
    }

    // Add DONE button
    _wrapper.appendChild(_doneButton());

    // Add cancel button
    _wrapper.appendChild(_cancelButton());

    _slideUpWeather();
  }

  var renderConfirmation = function renderConfirmation(message) {
    var $modal = $('#confirmationModal');

    $modal.modal('show');
    $modal.find('.modal-title').text(message);
  }

  var updateCounter = function updateCounter(total) {
    _gal_counter.textContent = "Approximately " + Math.round(total * 10000) / 10000 + " GAL";
  }

  // PRIVATE

  var _setAllToMatch = function _setAllToMatch(target) {
    if (target.name === "settings.duration") {
      var inputs = document.getElementsByClassName('duration-input');

      for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = target.value
      }
    }
  }

  var _doneButton = function _doneButton() {
    var done = document.createElement('A');
    done.textContent = 'Submit ✓';
    done.classList.add("btn", "btn-success", "btn-submit", "pull-right");

    done.addEventListener("click", function(e) {
      _doneAction(e, _getZoneSettings());
    })

    return done
  }

  var _cancelButton = function _cancelButton() {
    var cancel = document.createElement('A');
    cancel.textContent = '< Cancel';
    cancel.classList.add("pull-left", "margin-top", "pointable");

    cancel.addEventListener("click", function(e) {
      _cancelAction(e, _getZoneSettings());
    })

    return cancel
  }

  var _zoneRow = function _zoneRow(zone) {
    var row = document.createElement('DIV');
    row.classList.add("center-block", "zone");

    row.appendChild(_zoneCard(zone));
    row.appendChild(_controls.cloneNode(true));

    row.setAttribute("data-type", "zone");
    row.setAttribute("data-id", zone.id);

    return row
  }

  var _zoneCard = function _zoneCard(zone) {
    var card = document.createElement('A');

    card.classList.add("btn", "btn-card", "zone-card");
    card.setAttribute("data-type", "zone");
    card.setAttribute("data-id", zone.id);

    if(zone.customNozzle) {
      card.setAttribute("data-inchesphr", zone.customNozzle.inchesPerHour);
    } else {
      card.setAttribute("data-inchesphr", 1.4);
    }

    card.textContent = zone.name || "Zone " + zone.zoneNumber;

    card.addEventListener("click", function(e){
      _toggleSelect(e.target);
      updateCounter(_getGallons());
    })

    if(zone.imageUrl) card.style.backgroundImage = "url(" + zone.imageUrl + ")";

    return card
  }

  var _setUpControls = function _setUpControls() {
    _controls = document.createElement('DIV');
    _controls.classList.add('form-inline');

    var duration = document.createElement('DIV');
    duration.classList.add('form-group');

    var input = document.createElement('INPUT');
    input.setAttribute("type", "number");
    input.setAttribute("min", "5");
    input.setAttribute("max", "120");
    input.setAttribute("name", "settings.duration");
    input.setAttribute("value", "6");
    input.setAttribute("disabled", "true");
    input.classList.add("form-control", "duration-input")

    var pre = document.createTextNode(" run for ");
    var post = document.createTextNode(" minutes ");

    duration.appendChild(pre);
    duration.appendChild(input);
    duration.appendChild(post);

    _controls.appendChild(duration);
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

  var _getGallons = function _getGallons() {
    var selected = document.getElementsByClassName('selected');

    var gallons = 0;
    var rate, duration;
    for (var i = 0; i < selected.length; i++) {
      rate = parseFloat(selected[i].getAttribute('data-inchesphr'));
      duration = selected[i].parentNode.getElementsByTagName("INPUT")[0].value; // duration in minutes

      gallons += rate * CONVERSION * duration
    }

    return gallons
  }

  var _checkbox = function _checkbox () {
    var wrapper = document.createElement('DIV');
    wrapper.classList.add('form-check', 'pull-right')

    wrapper.addEventListener("click", function(e) {
      if(e.target.checked !== undefined) _toggleSelectAll(e.target.checked);
    })

    var label = document.createElement('LABEL');
    label.classList.add('form-check-label', 'light-text');

    var checkbox = document.createElement('INPUT');
    checkbox.setAttribute('id', 'altogether-checkbox');
    checkbox.setAttribute('type', 'checkbox');

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode("  Set All Zones"));

    wrapper.appendChild(label)

    return wrapper;
  }

  var _toggleSelectAll = function _toggleSelectAll(checked) {
    if (checked) {
      _altogether = true;
      _selectAll();
    } else {
      _altogether = false;
      _unselectAll();
    }
  }

  var _selectAll = function _selectAll() {
    var zones = document.getElementsByClassName('zone-card');

    for (var i = 0; i < zones.length; i++) {
      _selectElement(zones[i]);
      _enableInput(zones[i]);
    }

    return zones
  }

  var _unselectAll = function _unselectAll() {
    var zones = document.getElementsByClassName('zone-card');

    for (var i = 0; i < zones.length; i++) {
      _unselectElement(zones[i]);
      _disableInput(zones[i]);
    }

    return zones
  }

  var _toggleSelect = function(element) {
    if(element.getAttribute('data-state') === "selected") {

      // User disables "Altogether mode" by unselecting one
      _altogether = false;
      document.getElementById('altogether-checkbox').checked = false;

      _unselectElement(element);
      _disableInput(element);
    } else {
      _selectElement(element);
      _enableInput(element);
    }
  }

  var _selectElement = function _selectElement(element) {
    element.setAttribute("data-state", "selected");
    element.classList.add("selected");
  }

  var _unselectElement = function _unselectElement(element) {
    element.setAttribute("data-state", "unselected");
    element.classList.remove("selected");
  }

  var _disableInput = function _disableInput(element) {
    element.parentNode.getElementsByTagName("INPUT")[0].disabled = true;
  }

  var _enableInput = function _enableInput(element) {
    element.parentNode.getElementsByTagName("INPUT")[0].disabled = false;
  }

  var _slideUpWeather = function _slideUpWeather() {
    $('#weather-wrapper').slideUp(1000);
  }

  return {
    init: init,
    render: render,
    renderConfirmation: renderConfirmation
  }
})($);
