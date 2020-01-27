'use strict';
import $ from 'jquery';

const textArea = $('#input_url');
const submitButton = $('#submit-button');
const resultMsg = $('#result-msg');
const resultImg = $('#result-img');
const resultNotUrl = $('#result-noturl');
const resultError = $('#result-error');

submitButton.click(() => {
  const base64 = Buffer.from(textArea.val()).toString('base64');
  $.get('/qrcode_request/' + base64, {}, (data) => {
    const jsonData = JSON.parse(data);
    resultMsg.hide();
    console.log(resultMsg);
    resultImg.hide();
    resultNotUrl.hide();
    resultError.hide();
    if (jsonData.qrcode_data != '' && !jsonData.isNotUrl && !jsonData.isError) {
      resultMsg.show();
      resultMsg.innerHTML;
      resultImg.attr('src', jsonData.qrcode_data);
      resultImg.show();
    } else if (jsonData.isNotUrl) {
      resultNotUrl.show();
    } else if (jsonData.isError) {
      resultError.show();
    }
  });
});