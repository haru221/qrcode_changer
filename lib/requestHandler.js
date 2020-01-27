'use strict';
const pug = require('pug');
const fs = require('fs');
const qrcode = require('qrcode');

/**
 * メインのリクエストハンドラ
 * @param {request} req 
 * @param {response} res 
 */
function handleRequest(req, res) {
  switch (req.method) {
    case 'GET':
      getHandler(req, res);
      break;
    default:
      handleBadRequest(req, res);
      break;
  }
}

/**
 * GETメソッドの処理
 * @param {request} req 
 * @param {response} res 
 */
function getHandler(req, res) {
  res.write(pug.renderFile('./views/index.pug'));
  res.end();
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

/**
 * スタイルシートの読み込み処理
 * @param {request} req 
 * @param {response} res 
 */
function handleStyleSheet(req, res) {
  const css = fs.readFileSync('./public/stylesheets/style.css');
  res.writeHeader(200, {
    'Content-Type': 'text/css'
  });
  res.end(css, 'utf-8');
}

/**
 * Javascriptの読み込み処理
 * @param {request} req 
 * @param {response} res 
 */
function handleJavascript(req, res) {
  const js = fs.readFileSync('./public/javascripts/bundle.js');
  res.writeHead(200, {
    'Content-Type': 'text/javascript'
  });
  res.end(js, 'utf-8');
}

/**
 * QRコード変換リクエストの処理
 * @param {request} req 
 * @param {response} res 
 */
function handleQrcodeRequest(req, res, data) {
  const urlData = Buffer.from(data, 'base64').toString();
  let qrcode_data = '';
  let isNotUrl = false;
  let isError = false;
  if (urlData.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/)) {
    //console.log('urlです');
    qrcode.toDataURL(urlData, (err, data) => {
      if (err) {
        qrcode_data = '';
        isError = true;
      } else {
        qrcode_data = data;
      }
      res.end('{' +
        '"qrcode_data": "' + qrcode_data + '",' +
        '"isNotUrl": ' + isNotUrl + ',' +
        '"isError": ' + isError +
      '}');
    });
  } else {
    qrcode_data = '';
    isNotUrl = true;
    res.end('{' +
      '"qrcode_data": "' + qrcode_data + '",' +
      '"isNotUrl": ' + isNotUrl + ',' +
      '"isError": ' + isError  +
    '}');
  }
}

module.exports = {
  handleRequest,
  handleFavicon,
  handleNotFound,
  handleBadRequest,
  handleStyleSheet,
  handleJavascript,
  handleQrcodeRequest,
};