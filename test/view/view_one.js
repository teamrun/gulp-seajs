define( function(require, exports, module ){
    var tool = require('../common/tool');


    function init(){
        console.log('bind event 11111');
        tool.hammer();
        console.log('init view 11111');
    }
    exports.init = init;
} );