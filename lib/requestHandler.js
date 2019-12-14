'use strict';
const pug = require('pug');
const fs = require('fs');
const qrcode = require('qrcode');

let qrcode_data = '';
let isNotUrl = false;
let isError = false;
/**
 * メインのリクエストハンドラ
 * @param {request} req 
 * @param {response} res 
 */
function handleRequest(req, res) {
  switch (req.method) {
    case 'GET':
      res.write(pug.renderFile('./views/index.pug', {
        data: qrcode_data,
        isNotUrl: isNotUrl,
        isError: isError
      }));
      res.end();
      break;
    case 'POST':
      isError = false;
      isNotUrl = false;
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', () => {
        const decoded = decodeURIComponent(body).toString();
        const url = decoded.split('=')[1];
        // URL形式かどうかをチェック
        if (url.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/)) {
          console.log('urlです');
          qrcode.toDataURL(url, (err, data) => {
            if (err) {
              console.error(err);
              qrcode_data = '';
              isError = true;
            } else {
              qrcode_data = data;
            }
            handleRedirect(req, res);
          });
        } else {
          qrcode_data = '';
          isNotUrl = true;
          handleRedirect(req, res);
          console.log('urlではありません');
        }
      });
      break;
    default:
      handleBadRequest(req, res);
      break;
  }
}

/**
 * faviconを返す
 * @param {request} req 
 * @param {response} res 
 */
function handleFavicon(req, res) {
  const favicon = fs.readFileSync('./favicon.ico');
    res.writeHead(200, {
      'Content-Type': 'image/vnd.microsoft.icon'
    });
    res.end(favicon);
}

/**
 * ページが見つからなかった場合の処理
 * @param {request} req 
 * @param {response} res 
 */
function handleNotFound(req, res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('ページが見つかりません');
}

/**
 * リダイレクト処理
 * @param {request} req 
 * @param {response} res 
 */
function handleRedirect(req, res) {
  res.writeHead(303, {
    'Location': '/qrcode_changer'
  });
  res.end();
}

/**
 * 未対応のメソッドの場合の処理
 * @param {request} req 
 * @param {response} res 
 */
function handleBadRequest(req, res) {
  res.writeHead(400, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('未対応のメソッドです');
}

module.exports = {
  handleRequest,
  handleFavicon,
  handleNotFound,
  handleBadRequest,
};