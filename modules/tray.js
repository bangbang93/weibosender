/**
 * Created by bangbang on 14/11/23.
 */
var menu = require('menu');
var Tray = require('tray');
var path = require('path');
var icon;

module.exports = exports = function (app){
    icon = new Tray(path.join(__dirname,'../img/icon.png'));
    var menus = [{
        label: '退出',
        type: 'normal',
        click: function (){
          app.emit('quitRequest');
        }
      },
      {
        label: '发微博',
        type: 'normal',
        click: function (){
          app.emit('sendWeibo');
        }
      }
    ];
    var contextMenu = menu.buildFromTemplate(menus);
    icon.setToolTip('发微博');
    icon.setContextMenu(contextMenu);
};
