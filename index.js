/**
 * Created by bangbang on 14/11/23.
 */
var app = require('app');
var fs = require('fs');
var path = require('path');

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

fs.exists(path.join(app.getDataPath(), 'auth.json'), function (exists){
  if (!exists){
    var weibo = require('./modules/weibo').auth();
  }
});
