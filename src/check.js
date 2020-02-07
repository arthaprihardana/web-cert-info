/*
 * @Author: Artha Prihardana 
 * @Date: 2019-08-26 17:07:37 
 * @Last Modified by: Artha Prihardana
 * @Last Modified time: 2020-02-07 14:37:59
 */
import https from 'https';

function isEmpty(object) {
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) return false;
  }

  return true;
}

function pemEncode(str, n) {
  var ret = [];

  for (var i = 1; i <= str.length; i++) {
    ret.push(str[i - 1]);
    var mod = i % n;

    if (mod === 0) {
      ret.push('\n');
    }
  }

  var returnString = `-----BEGIN CERTIFICATE-----\n${ret.join('')}\n-----END CERTIFICATE-----`;

  return returnString;
}

function getOptions(url, port, protocol) {
  return {
    hostname: url,
    agent: false,
    rejectUnauthorized: false,
    ciphers: 'ALL',
    port,
    protocol
  };
}

function validateUrl(url) {
  if (url.length <= 0 || typeof url !== 'string') {
    throw Error('url ga valid');
  }
}

function handleRequest(options, resolve, reject) {
  return https.get(options, function(res) {
    var certificate = res.socket.getPeerCertificate();

    if (isEmpty(certificate) || certificate === null) {
      reject({ message: 'ga ada sertifikat' });
    } else {
      if (certificate.raw) {
        certificate.pemEncoded = pemEncode(certificate.raw.toString('base64'), 64);
      }
      resolve(certificate);
    }
  });
}

function get(url, timeout, port, protocol) {
  validateUrl(url);

  port = port || 443;
  protocol = protocol || 'https:';

  var options = getOptions(url, port, protocol);

  return new Promise(function(resolve, reject) {
    var req = handleRequest(options, resolve, reject);

    if (timeout) {
      req.setTimeout(timeout, function() {
        reject({ message: 'rto' });
        req.abort();
      });
    }

    req.on('error', function(e) {
      reject(e);
    });

    req.end();
  });
}

// module.exports = {
//   get: get
// };

export default {
  get: get
};

