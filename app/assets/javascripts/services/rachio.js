var RR = RR || {};

RR.rachio = (function($){
  var BASE_URL = 'https://api.rach.io/1/public',
      CONTENT_TYPE = 'application/json';

  var _headers = {},
      _person_id;

  var init = function init(auth_token) {
    _headers.Authorization = 'Bearer ' + auth_token;
  };

  var getPerson = function getPerson() {
    return _getPersonId().then(_getPersonInfo);
  }

  // PRIVATE

  // GET /person/info
  var _getPersonId = function _getPersonId() {
    return _sendRequest('GET', '/person/info', {
            success: function(response) { _person_id = response.id; },
            error: _stdErrorCB
          })
  }

  // GET /person/:id
  var _getPersonInfo = function _getPersonInfo() {
    return _sendRequest('GET', '/person/' + _person_id, {
            success: function(response) { return response },
            error: _stdErrorCB
          })
  }

  var _buildUrl = function _buildUrl(urlEnd) {
    return BASE_URL + urlEnd
  }

  var _sendRequest = function _sendRequest(method, endUrl, options) {
    options = options || {};

    return $.ajax({
            url: _buildUrl(endUrl),
            method: method,
            headers: _headers,
            contentType: CONTENT_TYPE,
            data: options.data,
            success: options.success,
            error: options.error,
          })
  }

  var _stdErrorCB = function _stdSuccess(response) {
    console.error("Error!", response)
  }

  return {
    init: init,
    getPerson: getPerson
  }
})($);


// $.ajax({
//   url: $el.attr("action"),
//   method: "POST",
//   contentType: 'application/json',
//   data: JSON.stringify({ name, breed_id}),
//   success: addPupCB,
// })
//
// url: "https://api.rach.io/1/public/person/info",
// type: 'GET',
// headers: {
//   // Body parser module takes URLencoded string and turns it into an object
//   Authorization: 'Bearer c3667b81-92a6-4913-b83c-64cc713cbc1e'
// }
