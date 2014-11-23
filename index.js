/**
 * Created by bangbang on 14/11/23.
 */
var app = require('app');
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
