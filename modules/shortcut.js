/**
 * Created by bangbang on 14/11/23.
 */
var cut = require('global-shortcut');
var weibo = require('./weibo');
var send = cut.register('alt+shift+s', function (){
    weibo.showWindow();
});
