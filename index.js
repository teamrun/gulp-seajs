// var es = require('event-stream');
// var stream = require('stream');

var buildTool = require('./build-file');

// module.exports = function( srcPath, mainID ){
//     var doBuild = function( file, callback ){
//         console.log( arguments );

//         var code = String(file.contents);
//         file.contents = new Buffer( buildTool( srcPath, mainID, code ) );

//         callback( null, file);
//     };

//     return es.map( doBuild );
// };


var srcPath = 'test/ctrl/testCtrl.js',
    mainID = 'test/ctrl/testCtrl.js',
    code = '';

var code = buildTool( srcPath, mainID, code );

console.log( code );