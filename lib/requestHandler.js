'use strict';
const pug = require('pug');
const Cookies = require('cookies');
const fs = require('fs');
const crypto = require('crypto');
const qrcode = require('qrcode');

const userIdKey = 'identification';
const dataMap = new Map();

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
    case 'POST':
      postHandler(req, res);
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
  const cookies = new Cookies(req, res);
  const userId = cookies.get(userIdKey);
  const data = dataMap.get(userId);
  let qrcode_data = '';
  let isNotUrl = false;
  let isError = false;
  if (data) {
    qrcode_data = data.qrcode_data;
    isNotUrl = data.isNotUrl;
    isError = data.isError;
    // 保持していたデータの削除
    dataMap.delete(userId);
    cookies.set(userIdKey, "", { maxAge: 0 });
  }
  res.write(pug.renderFile('./views/index.pug', {
    data: qrcode_data,
    isNotUrl: isNotUrl,
    isError: isError
  }));
  res.end();
}

/**
 * POSTメソッドの処理
 * @param {request} req 
 * @param {response} res 
 */
function postHandler(req, res) {
  let isError = false;
  let isNotUrl = false;
  let qrcode_data = '';
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  }).on('end', () => {
    const decoded = decodeURIComponent(body).toString();
    const url = decoded.split('=')[1];
    // URL形式かどうかをチェック
    if (url.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/)) {
      //console.log('urlです');
      qrcode.toDataURL(url, (err, data) => {
        if (err) {
          //console.error(err);
          qrcode_data = '';
          isError = true;
        } else {
          qrcode_data = data;
        }
        setData(req, res, {
          qrcode_data: qrcode_data,
          isNotUrl: isNotUrl,
          isError: isError
        });
        handleRedirect(req, res);
      });
    } else {
      qrcode_data = '';
      isNotUrl = true;
      setData(req, res, {
        qrcode_data: qrcode_data,
        isNotUrl: isNotUrl,
        isError: isError
      });
      handleRedirect(req, res);
      //console.log('urlではありません');
    }
  });
}

/**
 * データの保存
 * @param {request} req 
 * @param {response} res 
 * @param {data} data 
 */
function setData(req, res, data) {
  const cookies = new Cookies(req, res);
  const userId = crypto.randomBytes(8).toString('hex');
  cookies.set(userIdKey, userId);
  dataMap.set(userId, {
    qrcode_data: data.qrcode_data,
    isError: data.isError,
    isNotUrl: data.isNotUrl
  });
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

function handleStyleSheet(req, res) {
  const css = fs.readFileSync('./css/style.css');
  res.writeHeader(200, {
    'Content-Type': "text/css"
  });
  res.end(css, 'utf-8');
}

module.exports = {
  handleRequest,
  handleFavicon,
  handleNotFound,
  handleBadRequest,
  handleStyleSheet,
};