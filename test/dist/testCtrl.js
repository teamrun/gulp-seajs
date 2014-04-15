define( 'dist/testCtrl.js', ['view/view_one', 'common/tool', 'view/view_two', 'view/subView/view_three', 'model/model_one', 'model/model_two'], function( require, exports, module){
    var view_one = require('../view/view_one'),
        view_two = require('../view/view_two'),
        view_three = require('../view/subView/view_three');

    var model_one = require('../model/model_one'),
        model_two = require('../model/model_two');

    console.log(model_one.name);
    console.log(model_two.name);

    view_one.init();
    view_two.init();

    // module.exports = tool;
} );
define( 'view/view_one', ['common/tool'], function( require, exports, module){
    var tool = require('../common/tool');


    function init(){
        console.log('bind event 11111');
        tool.hammer();
        console.log('init view 11111');
    }
    exports.init = init;
} );
define( 'common/tool', [], function( require, exports, module){
    var tool = {
        hammer: function(){
            console.log( 'a smith\'s tool');
        }
    };

    module.exports = tool;
} );
define( 'view/view_two', [], function( require, exports, module){
    var tool = require('../common/tool');
    
    function init(){
        console.log('bind event 2222');
        console.log('init view 22222');
    }


    exports.init = init;
} );
define( 'view/subView/view_three', [], function( require, exports, module){
    var tool = require('../../common/tool');
    function init(){
        console.log('bind event 11111');
        console.log('init view 11111');
    }
    exports.init = init;
} );
define( 'model/model_one', [], function( require, exports, module){
    var M_one = {
        name: 'this is Model one...'
    };


    module.exports = M_one;
} );
define( 'model/model_two', [], function( require, exports, module){
    var M_two = {
        name: 'Model two here~'
    };


    module.exports = M_two;
} );
