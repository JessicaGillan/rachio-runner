var RR = RR || {};

RR.rachio = (function($){
  var BASE_URL = 'https://api.rach.io/1/public',
      CONTENT_TYPE = 'application/json';

  var _headers = new Headers(),
      _person_id, _auth_token;

  var init = function init(auth_token) {

    _headers.append("Authorization", "Bearer " + auth_token);
    _headers.append("Content-Type", CONTENT_TYPE);
  };

  var getPerson = function getPerson() {
    return _getPersonId().then(_getPersonInfo);
  }

  // PUT /zone/start_multiple
  // { "zones" : [{ "id" : "d8913f51-3af5-41e8-b526-7c2da3646309", "duration" : 10, "sortOrder" : 1 }] }
  var startMultiple = function startMultiple(data) {
    var options = {};
    options.method = 'PUT';
    options.data = { "zones": data };

    return _sendRequest('/zone/start_multiple', options)
  }

  // PRIVATE

  // GET /person/info
  var _getPersonId = function _getPersonId() {
    return _sendRequest('/person/info')
            .then(function(response) {
              _person_id = response.id;

              return response
            })
  }

  // GET /person/:id
  var _getPersonInfo = function _getPersonInfo() {
    return _sendRequest('/person/' + _person_id)
  }

  var _buildUrl = function _buildUrl(urlEnd) {
    return BASE_URL + urlEnd
  }

  // TODO: Add $.ajax request for fallback
  var _sendRequest = function _sendRequest(urlEnd, options) {
    options = options || {};
    var init = {};

    init.headers = _headers;
    init.mode = 'cors';
    init.method = options.method || 'GET';

    if(options.data) {
      // var data = new FormData();
      // data.append( "json", "'" + JSON.stringify(options.data) + "'");
      // // console.log("form data", data);
      // console.log("data", options.data);
      // console.log("datastring",  "'" + JSON.stringify(options.data) + "'");
      // init.body = data;

      return $.ajax({
       url: _buildUrl(urlEnd),
       type: 'PUT',
       data: JSON.stringify(options.data),
       dataType: 'json',
       // contentType: 'application/json; charset=utf-8',
       headers: {
         Authorization: "Bearer " + _auth_token
       },
       success: function (data) {
         console.log('finally worked');
         return data;
       },
       error: function(data) {
         console.error("Error", data)
         return data
       }
      })

    } else {
      return fetch(_buildUrl(urlEnd), init)
      .then(function(response) {
        if(response.ok) {
          return response.json()
        } else {
          console.error("Error! ", response)
          return response.json()
        }
      })
    }

  }

  return {
    init: init,
    getPerson: getPerson,
    startMultiple: startMultiple
  }
})($);
