var Window = require('browser-window');
var path = require('path');
var fs = require('fs');
var ipc = require('ipc');
var app = require('app');
var request = require('request');
var dialog = require('dialog');

var window;

var auth;

exports.showWindow = function (){
  var sendWindow = new Window({
    center: true,
    height: 250,
    width: 450,
    resizable: false
  });
  if (!auth){
    fs.readFile(path.join(app.getDataPath(), 'auth.json'), function (err, data){
      auth = JSON.parse(data);
      if (!checkAuth()){
        exports.auth();
        sendWindow.close();
      }
    })
  } else {
    if (!checkAuth()){
      exports.auth();
      sendWindow.close();
    }
  }
  window = sendWindow;
  sendWindow.loadUrl('file://' + path.join(__dirname, '../html/send.html'));
  // sendWindow.openDevTools();
  sendWindow.on('close', function (){
    window = null;
  });
  var contents = sendWindow.webContents;
  contents.on('did-finish-load', function (){
    sendWindow.focus();
    ipc.on('submit', sendWeibo(sendWindow));
    ipc.on('submitPic', sendWeiboPic(sendWindow));
  })
};

exports.auth = function (){
  var authWindow = new Window({
    center: true,
    title: '微博认证'
  });
  authWindow.loadUrl('http://auth.bangbang93.com/sina?url=' + encodeURIComponent('http://weibosender.bangbang93.com/callback.html'));
  window = authWindow;
  authWindow.on('close', function (){
    window = null;
  });
  ipc.on('auth', function (event, auth){
    auth.time = new Date().getTime()/1000;
    fs.writeFile(path.join(app.getDataPath(), 'auth.json'), JSON.stringify(auth));
    authWindow.close();
  });
};

var sendWeibo = function (sendWindow){
  return function (event, data){
    request.post('https://api.weibo.com/2/statuses/update.json',{
      form:{
        access_token: auth.access_token,
        status: data.status
      }
    }, function (err, res, body){
      try {
        body = JSON.parse(body);
        if (!!body.created_at){
          dialog.showMessageBox({
            type: 'info',
            message: '发送成功',
            buttons: ['确定']
          });
          sendWindow.close();
        } else {
          console.log(body);
        }
      } catch (e){
        console.log(body);
      }
    })
  };
};

var sendWeiboPic = function (sendWindow){
  return function (event, data){
    request.post('https://upload.api.weibo.com/2/statuses/upload.json',{
      formData:{
        access_token: auth.access_token,
        status: data.status,
        pic: fs.createReadStream(path.join(path.join(app.getDataPath(), 'tmp'), data.pic))
      }
    }, function (err, res, body){
      body = JSON.parse(body);
      if (!!body.created_at){
        dialog.showMessageBox({
          type: 'info',
          message: '发送成功',
          buttons: ['确定']
        });
        sendWindow.close();
        fs.unlink(data.pic, function (err){
          console.log(err);
        });
      } else {
        console.log(body);
      }
    })
  };
};

var checkAuth = function (){
  var now = new Date().getTime()/1000;
  auth.time = auth.time || 0;
  auth.expires_in = parseInt(auth.expires_in);
  console.log(auth.time + auth.expires_in);
  console.log(now < auth.time + auth.expires_in);
  return now < auth.time + auth.expires_in;
};
