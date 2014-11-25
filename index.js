/**
 * Created by bangbang on 14/11/23.
 */
var app = require('app');
var fs = require('fs');
var path = require('path');
var weibo = require('./modules/weibo');
var cut = require('./modules/shortcut')(app);
var menu = require('./modules/tray')(app);

app.on('ready', function (){
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
        fs.mkdir(app.getDataPath(), function (){
            fs.mkdir(path.join(app.getDataPath(), 'tmp'))
        });
    } else {
        fs.exists(path.join(app.getDataPath(), 'tmp'), function (exists){
            if (!exists){
                fs.mkdir(path.join(app.getDataPath(), 'tmp'))
            } else {
                fs.readdir(path.join(app.getDataPath(), 'tmp'), function (err, files){
                    if (err){
                        throw(err);
                    } else {
                        files.forEach(function (e){
                            fs.unlink(path.join(path.join(app.getDataPath(), 'tmp'), e));
                        })
                    }
                });
            }
        })
    }
});