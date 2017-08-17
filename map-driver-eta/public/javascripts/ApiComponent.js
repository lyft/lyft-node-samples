window.ApiComponent = (function (window, document) {

  /* =================== */
  /* Convenience Methods */
  /* =================== */

  function requestJson(method, url, successCallback, failureCallback) {
    successCallback = successCallback || console.log;
    failureCallback = failureCallback || console.error || console.warn || console.log;
    var xhr = (typeof XDomainRequest !== 'undefined') ?
      (new XDomainRequest()) :
      (new XMLHttpRequest());
    xhr.onreadystatechange = function (event) {
      if (event.target.readyState === 4) {
        /* parse response as JSON */
        var responseJson;
        try { responseJson = window.JSON.parse(event.target.response); }
        catch (exception) { return failureCallback(event.target.response, exception); }
        /* perform callback according to HTTP status code */
        if (xhr.status > 0 && xhr.status < 400) {
          return successCallback(responseJson);
        } else {
          return failureCallback(responseJson);
        }
      }
    };
    xhr.open(method, url, true);
    xhr.send();
  }

  /* =========== */
  /* API Methods */
  /* =========== */

  function getApiLyftEta(latitude, longitude, successCallback, failureCallback) {
    successCallback = successCallback || function (res) {
      console.log(res.eta_estimates);
    };
    return requestJson('GET', '/api/lyft/eta?lat=' + latitude + '&lng=' + longitude, successCallback, failureCallback);
  }

  /* ===================================== */
  /* Publicly-Exposed Properties & Methods */
  /* ===================================== */

  return {
    getApiLyftEta: getApiLyftEta
  };

})(window, window.document);