var Window = require('browser-window');
var path = require('path');

exports.showWindow = function (){
  var sendWindow = new Window({
    center: true,
    height: 200,
    width: 450,
    resizable: false
  });
  sendWindow.loadUrl('file://' + path.join(__dirname, '../send.html'));
}
