var fs = require('fs'),
    path = require('path');

var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;
var SLASH_RE = /\\\\/g;
var MODULEHEADER_RE = /define\(.*\) *{\n*/;
var MODULEHEADER_RE_OBJ = /define\(.*{\n*/;

var pathWithVar =/\{[^/]+\}/;

// var srcFile = './test/ctrl/testCtrl.js';
// // 主文件ID, 即seajs.use的入口
// var mainID = '/LIB/gulp-seajs/test/dest/testCtrl.js';


// console.log( __dirname);


var G = {
    requriedDep: {},
    ProductCode:  ''
};





function buildSeajsFile( srcPath, id, code ){
    if( !code ){
        code = fs.readFileSync( srcPath, 'utf-8');
    }
    // console.log( id );
    var rawDep =  collectDep( code );
    G.ProductCode +=  consProductCode( code, id, rawDep );

    G.depMap[ id ] = [];

    rawDep.forEach( function( x, i, a ){
        if( path.extname( x ) === '.js' ){
            x = x.substring( 0, x.lastIndexOf( '.js' ) );
        }
        var depItem = path.resolve( path.dirname( srcPath ), x );

        if( G.requriedDep[ depItem ] ){
            // 已经添加的依赖不再操作
        }
        else{
            // 添加到"已依赖"
            G.requriedDep[ depItem ] = true;

            // 根据mainID 和 模块依赖关系, 推断出被依赖的模块的id
            // 依据: 主模块被use后, 会根据内部的require的id去找依赖的模块, 依赖的id, 就是模块之间的路径关系
            var subID = path.resolve( path.dirname( id ), x );
            // 构建依赖表
            G.depMap[id].push( subID );

            // 带有{}的路径,里面填充的是seajs.config.vars,这是运行时依赖.不通过这个来解析路径, 保留即可
            if( pathWithVar.test( depItem ) ){
                
            }
            else{
                // 递归处理: 读code 取依赖, 检测, 构建模块
                // console.log( depItem );
                buildSeajsFile( depItem+'.js', subID  );
            }
        }
    } );
}






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
    var pre;
    if( MODULEHEADER_RE.test( code ) ){
        pre = 'define( \''+ id + '\', ' + '[' + '], function( require, exports, module){\n';
        code = code.replace( MODULEHEADER_RE, pre);
        // console.log( 'function: ' + id );
    }
    else if( MODULEHEADER_RE_OBJ.test( code ) ){
        pre = 'define( \''+ id + '\', ' + '[' + '], {\n';
        code = code.replace( MODULEHEADER_RE_OBJ, pre);
        // console.log( code.substr(0, 100) );
    }
    return code + '\n';
}

function fillDepArr( depMap, proCode, mainID ){
    var depArr, replacEE, replacER;

    for( var key in depMap ){
        depArr = [];
        replacEE = 'define( \''+ key + '\', ' + '[' + ']';
        getDepArr( depMap, key, depArr );
        if( depArr.length > 0 ){
            replacER = 'define( \'' + key + '\', [\''+ depArr.join('\', \'') +'\']';
            proCode = proCode.replace( replacEE, replacER );
            // console.log( proCode.substr( proCode.indexOf( replacEE ), 200 ) );
            // console.log( replacEE );
            // console.log( replacER );
            // console.log( proCode.indexOf( replacEE ) );
        }
    }
    // console.log( proCode.substr(0,200) );
    return proCode;

    

    function getDepArr( depMap, id, depArr ){
        depArr = depArr? depArr : [];
        if( depMap[ id ] && depMap[ id ].length > 0 ){
            for( var i=0; i<depMap[ id ].length; i++ ){
                 depArr.push( depMap[ id ][i] );
                getDepArr( depMap, depMap[ id ][i], depArr );
            }
        }
    }
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
    // console.log( srcPath );
    G = {
        requriedDep: {},
        ProductCode:  '',
        depMap: {

        }
    };

    // add target file to required
    G.requriedDep[ path.resolve(srcPath) ] = true;
    
    buildSeajsFile( srcPath, mainID );
    // 所有的文件都构建好之后才有完整的依赖列表
    // console.log( G.depMap );

    return fillDepArr( G.depMap, G.ProductCode, mainID );
};
