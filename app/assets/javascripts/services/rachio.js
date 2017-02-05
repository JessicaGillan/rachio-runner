var RR = RR || {};

RR.rachio = (function($){
  var BASE_URL = 'https://api.rach.io/1/public',
      CONTENT_TYPE = 'application/json';

  var _headers = new Headers(),
      _person_id;

  var init = function init(auth_token) {
    _headers.append("Authorization", "Bearer " + auth_token);
    _headers.append("Content-Type", CONTENT_TYPE);
  };

  var getPerson = function getPerson() {
    return _getPersonId().then(_getPersonInfo);
  }

  // PRIVATE

  // GET /person/info
  var _getPersonId = function _getPersonId() {
    return _sendRequest('/person/info')
            .then(function(response) {
              _person_id = response.id;
            })
  }

  // GET /person/:id
  var _getPersonInfo = function _getPersonInfo() {
    return _sendRequest('/person/' + _person_id)
            .then(function(response) { return response })
  }

  var _buildUrl = function _buildUrl(urlEnd) {
    return BASE_URL + urlEnd
  }

  // TODO: Add $.ajax request for fallback
  var _sendRequest = function _sendRequest(urlEnd, options) {
    options = options || {};
    var init = {};

    init.headers = _headers;
    init.method = options.method || 'GET';
    init.data = options.data;

    return fetch(_buildUrl(urlEnd), init)
            .then(function(response) {
              if(response.ok) {
                return response.json()
              } else {
                console.error("Error! " + response)
              }
            })
  }

  return {
    init: init,
    getPerson: getPerson
  }
})($);
