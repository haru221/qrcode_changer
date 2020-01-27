'use strict';
const assert = require('assert');
const request = require('request');
const pug = require('pug');

// サーバがlocalhost:8000で起動していないとテストは通らない
const pRequest = (options) => {
  return new Promise(function(resolve, reject) {
    request(options, function(error, res, body) {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
};

describe('#入力チェック', () => {
  it('入力がURL形式の場合', async function() {
		const res = await pRequest({
			url: 'http://localhost:8000/qrcode_request/aHR0cDovL3Rlc3QuY28uanA=',
			method: 'GET',
    });
    const jsonData = JSON.parse(res.body);
    if (jsonData.qrcode_data !== '' &&
      !jsonData.isNotUrl &&
      !jsonData.isError) {
      assert(true);
    } else {
      assert(false);
    }
  });

  it('入力がURL形式ではない場合', async function() {
    const res = await pRequest({
			url: 'http://localhost:8000/qrcode_request/aa',
			method: 'GET',
    });
    const jsonData = JSON.parse(res.body);
    if (jsonData.qrcode_data === '' &&
      jsonData.isNotUrl &&
      !jsonData.isError) {
      assert(true);
    } else {
      assert(false);
    }
  });
});