var fs = require('fs'),
    path = require('path');

var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;
var SLASH_RE = /\\\\/g;
var MODULEHEADER_RE = /define\(.*\){\n*/;


// var srcFile = './test/ctrl/testCtrl.js';
// // 主文件ID, 即seajs.use的入口
// var mainID = '/LIB/gulp-seajs/test/dest/testCtrl.js';


// console.log( __dirname);


var G = {
    requriedDep: {},
    ProductCode:  '',
};





function buildSeajsFile( srcPath, id, code ){
    if( !code ){
        code = fs.readFileSync( srcPath, 'utf-8');
    }
    
    var rawDep =  collectDep( code );
    G.ProductCode +=  consProductCode( code, id, rawDep );

    rawDep.forEach( function( x, i, a ){
        var depItem = path.resolve( path.dirname( srcPath ), x );
        if( G.requriedDep[ depItem ] ){
            // 已经添加的依赖不再操作
        }
        else{
            // 添加到"已依赖"
            G.requriedDep[ depItem ] = true;
            // 递归处理: 读code 取依赖, 检测, 构建模块
            // console.log( depItem );

            // 根据mainID 和 模块依赖关系, 推断出被依赖的模块的id
            // 依据: 主模块被use后, 会根据内部的require的id去找依赖的模块, 依赖的id, 就是模块之间的路径关系
            var subID = path.resolve( path.dirname( id ), x );
            buildSeajsFile( depItem+'.js', subID  );
        }
    } );
}


// buildSeajsFile( srcFile, mainID );
// console.log( G.ProductCode );










function collectDep( code ){
    var ret = [];
    code.replace(SLASH_RE, "")
        .replace(REQUIRE_RE, function(m, m1, m2) {
            if (m2) {
                ret.push(m2);
            }
        });
    return ret;
}

function consProductCode( code, id, dep ){
    // console.log( ' module id is: ' + id );
    var pre = 'define( \''+ id + '\', ' + '[' + '], function( require, exports, module){\n';
    code = code.replace( MODULEHEADER_RE, pre);
    return code + '\n';
}




var seajsHeadArr = [
    'define( function(){',
    'define( function(require ){',
    'define( function(exports ){',
    'define( function(require, exports){',
    'define( function(require, exports, module ){',
    'define( \'leagalID\', function(require, exports, module ){',
    'define( \'leagalID\', [\'dep1\', \'dep2\'], function(require, exports, module ){'
 ];


// seajsHeadArr.forEach( function(x){
//     var r = MODULEHEADER_RE.test(x);
//     console.log( r );
// } );


module.exports = function( srcPath, mainID, code ){

    // add target file to required
    G.requriedDep[ path.resolve(srcPath) ] = true;
    
    buildSeajsFile( srcPath, mainID );
    return G.ProductCode;
};
