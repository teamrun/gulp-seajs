var es = require('event-stream');
var stream = require('stream');

var buildTool = require('./build-file');

module.exports = function( mainID, options ){
    var doBuild = function( file, callback ){
        // console.log( file );

        var code = String(file.contents);
        var srcPath = String(file.path);
        // console.time('seajs');
        file.contents = new Buffer( buildTool( srcPath, mainID, code, options ) );
        // console.timeEnd('seajs');

        callback( null, file);
    };

    return es.map( doBuild );
};

// var srcPath = 'test/ctrl/testCtrl.js',
//     mainID = 'test/ctrl/testCtrl.js',
//     code = '';

// var code = buildTool( srcPath, mainID, code );

// console.log( code );



/* ############################################### */
/* readme
 * @param: mainID, 主模块入口的id, 请使用网站静态文件的绝对地址
 * 可以直接避免出现开发机的完整路径
 * 
 * 
 * 
 */

