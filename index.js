/**
 * Created by bangbang on 14/11/23.
 */
var app = require('app');
var fs = require('fs');
var path = require('path');
var weibo = require('./modules/weibo');

app.on('ready', function (){
    var cut = require('./modules/shortcut');
    var menu = require('./modules/tray')(app);

});

app.on('quitRequest', function (){
  app.quit();
});

app.on('will-quit', function (){
  console.log('quit');
});

app.on('sendWeibo', function (){
  weibo.showWindow();
});

fs.exists(path.join(app.getDataPath(), 'auth.json'), function (exists){
  if (!exists){
    weibo.auth();
  }
});

fs.exists(app.getDataPath(), function (exists){
    if (!exists){
        fs.mkdir(app.getDataPath());
    }
});