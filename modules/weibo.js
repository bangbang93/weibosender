var Window = require('browser-window');
var path = require('path');
var fs = require('fs');
var ipc = require('ipc');
var app = require('app');
var request = require('request');
var dialog = require('dialog');

var window;

var auth;

fs.readFile(path.join(app.getDataPath(), 'auth.json'), function (err, data){
  auth = JSON.parse(data);
})

exports.showWindow = function (){
  var sendWindow = new Window({
    center: true,
    height: 200,
    width: 450,
    resizable: false
  });
  window = sendWindow;
  sendWindow.loadUrl('file://' + path.join(__dirname, '../html/send.html'));
  // sendWindow.openDevTools();
  sendWindow.on('close', function (){
    window = null;
  });
  var contents = sendWindow.webContents;
  contents.on('did-finish-load', function (){
    ipc.on('submit', function (event, data){
      console.log(data);
      request.post('https://api.weibo.com/2/statuses/update.json',{
        form:{
          access_token: auth.access_token,
          status: data.status
        }
      }, function (err, res, body){
        if (body.created_at){
          dialog.showMessageBox(null, {
            type: 'info',
            message: '发送成功'
          });
        }
        sendWindow.close();
      })
    })
  })
}

exports.auth = function (){
  var authWindow = new Window({
    center: true,
    title: '微博认证'
  });
  authWindow.loadUrl('http://auth.bangbang93.com/sina?url=' + encodeURIComponent('http://weibosender.bangbang93.com/callback.html'));
  window = authWindow;
  authWindow.on('close', function (){
    window = null;
  })
  ipc.on('auth', function (event, auth){
    fs.writeFile(path.join(app.getDataPath(), 'auth.json'), JSON.stringify(auth));
    authWindow.close();
  });
}
