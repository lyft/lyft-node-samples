/* dependencies */
var request = require('request');
var rp = require('request-promise');
var lyft = require('node-lyft');

var defaultClient = lyft.ApiClient.instance;

/* global configuration */
var config = require('../../../config/config');

/* ============== */
/* Helper Methods */
/* ============== */

var getPublicCode = function (req, res) {
  return rp({
    method: 'POST',
    uri: config.LYFT_API_URI + '/oauth/token',
    auth: {
      username: config.LYFT_CLIENT_ID,
      password: config.LYFT_CLIENT_SECRET
    },
    json: {
      grant_type: 'client_credentials',
      scope: 'public'
    }
  })
}

var publicRequest = function (res, cb) {
  getPublicCode()
    .then((codeResponse) => {
      defaultClient.authentications['User Authentication'].accessToken = codeResponse.access_token;
      var lyftPublicApi = new lyft.PublicApi();

      cb(lyftPublicApi).then((response) => res.status(200).json(response))
        .catch((err) => {
          res.status(400).json({ error: err })
        });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ meta: { success: false, error: err } });
    })
};

var getCode = function (req, res) {
  return rp({
    method: 'POST',
    uri: config.LYFT_API_URI + '/oauth/token',
    auth: {
      username: config.LYFT_CLIENT_ID,
      password: (config.USE_SANDBOX ? 'SANDBOX-' : '') + config.LYFT_CLIENT_SECRET
    },
    json: {
      grant_type: 'authorization_code',
      code: req.session.lyftAuthorizationCode
    }
  });
}

/* ============== */
/* Route Handlers */
/* ============== */

exports.getEta = function (req, res, next) {
  function cb(lyftApi) {
    return lyftApi.getETA(req.query.lat, req.query.lng);
  }
  publicRequest(res, cb);
};