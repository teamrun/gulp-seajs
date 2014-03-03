define( function(require, exports, module ){
    var view_one = require('../view/view_one'),
        view_two = require('../view/view_two'),
        view_three = require('../view/subView/view_three');

    var model_one = require('../model/model_one'),
        model_two = require('../model/model_two');

    view_one.init();
    view_two.init();

    // module.exports = tool;
} );