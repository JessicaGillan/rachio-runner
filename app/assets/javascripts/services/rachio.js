var rachioRun = rachioRun || {};

rachioRun.rachio = (function($){
  var BASE_URL = 'https://api.rach.io/1/public',
      CONTENT_TYPE = 'application/json',
      TIMEOUT = 5000;

  var REQUEST = {
    'fetch': _fetchRequest,
    'ajax': _ajaxRequest
  }

  var _fetchHeaders, _ajaxHeaders = {},
      _person_id, _reqType;

  var init = function init(auth_token) {
    // Use 'fetch()' if available
    if(!!self.fetch){
      _reqType = 'fetch'
      _fetchHeaders = new Headers();
      _fetchHeaders.append("Authorization", "Bearer " + auth_token);
      _fetchHeaders.append("Content-Type", CONTENT_TYPE);
    } else {
      _reqType = 'ajax';
    }

    _setUpAjax(auth_token);
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

  var _setUpAjax = function _setUpAjax(token) {
    _ajaxHeaders.Authorization = 'Bearer ' + token;
  }

  var _fetchRequest = function _fetchRequest(urlEnd, options) {
    options = options || {};
    var init = {};

    init.headers = _fetchHeaders;
    init.mode = 'cors';
    init.method = options.method || 'GET';

    if(options.data) {
      return _ajaxRequest(urlEnd, options)
    } else {
      var fetchReq = new Promise(function (resolve, reject) {
        fetch(_buildUrl(urlEnd), init)
        .then(function(response) {
          if(response.ok) {
            return response.json()
          } else {
            console.error("Error! ", response)
            return response.json();
          }
        })
        .then(function (responseObj) { resolve(responseObj) })
        .catch(function(err) { reject(err); });
      })

      return Promise.race([fetchReq, _timeout(TIMEOUT).then(function () {
        console.error('Network operation timed out');
      })]);
    }
  }

  var _timeout = function _timeout(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  var _ajaxRequest = function _ajaxRequest(urlEnd, options) {
    options = options || {};

    var init = {};
    init.url = _buildUrl(urlEnd);
    init.method = options.method || 'GET';

    init.headers = _ajaxHeaders;
    init.contentType = CONTENT_TYPE;
    init.timeout = TIMEOUT;

    if(options.data) {
      init.data = JSON.stringify(options.data),
      init.dataType = 'json'
    }

    init.success = function (data) { return data; };
    init.error = function (data) {
      console.error("Error" + data);
      return data;
    };

    return $.ajax(init)
  }

  var _sendRequest = function(urlEnd, options) {
    if(_reqType === 'fetch'){
      return _fetchRequest(urlEnd, options)
    } else {
      return _ajaxRequest(urlEnd, options)
    }
  }

  return {
    init: init,
    getPerson: getPerson,
    startMultiple: startMultiple
  }
})($);
