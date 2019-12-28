'use strict';
const assert = require('assert');
const pug = require('pug');

describe('#入力チェック', () => {
  it('入力がURL形式の場合', () => {
    const html = pug.renderFile('./views/index.pug', {
      data: 'http://test.co.jp',
      isNotUrl: false,
      isError: false
    });
    assert(html.includes('生成したQRコード'));
  });

  it('入力がURL形式ではない場合', () => {
    const html = pug.renderFile('./views/index.pug', {
      data: '',
      isNotUrl: true,
      isError: false
    });
    assert(html.includes('URLではありません'));
  });

  it('URL変換時にエラーが発生した場合', () => {
    const html = pug.renderFile('./views/index.pug', {
      data: '',
      isNotUrl: false,
      isError: true
    });
    assert(html.includes('変換時にエラーが発生しました'));
  });
});