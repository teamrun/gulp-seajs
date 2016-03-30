var fs = require('fs');
var path = require('path');
var url = require('url');

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

// seajs config
// Bino Yip
var C = {

};




function buildSeajsFile( srcPath, id, code ){
    // console.log('code: '+ srcPath);
    if( !code ){
        code = fs.readFileSync( srcPath, 'utf-8');
    }
    // console.log( id );
    var rawDep =  collectDep( code, srcPath );
    G.ProductCode +=  consProductCode( code, id, rawDep );

    G.depMap[ id ] = [];
    // console.log('rawDep: '+ rawDep);
    rawDep.forEach( function( x, i, a ){
        if( path.extname( x ) === '.js' ){
            x = x.substring( 0, x.lastIndexOf( '.js' ) );
        }
        // console.log( '解析下一个需要读取的文件的路径: \n\t 本文件路径:' + srcPath + ';\n\t\t  require引入的文件相对路径: ' + x  );
        // windows下, 如果是基础文件的全路径, 会影响../查找父级目录, 需要换成srcPath的dirPath
        var depItem = path.resolve(  path.dirname(srcPath), x );
        // console.log('resolve出的路径是: ' + depItem );

        if( G.requriedDep[ depItem ] ){
            // 已经添加的依赖不再操作
        }
        else{
            // 添加到"已依赖"
            G.requriedDep[ depItem ] = true;

            // 根据mainID 和 模块依赖关系, 推断出被依赖的模块的id
            // 依据: 主模块被use后, 会根据内部的require的id去找依赖的模块, 依赖的id, 就是模块之间的路径关系
            // node 0.11.14使用url.resolve会将带有{}的路径进行转义
            var subID = decodeURIComponent(url.resolve( id, x ));
            // 构建依赖表
            G.depMap[id].push( subID );

            // 带有{}的路径,里面填充的是seajs.config.vars,这是运行时依赖.不通过这个来解析路径, 保留即可
            if( pathWithVar.test( depItem ) ){
                
            }
            else{
                // 递归处理: 读code 取依赖, 检测, 构建模块
                // console.log( 'gonna read file ' + depItem + ',   its id is ' + subID );
                // TODO 放开注释...
                buildSeajsFile( depItem+'.js', subID  );
            }
        }
    } );
}






function collectDep( code, srcPath ){
    var ret = [];
    code.replace(SLASH_RE, "")
        .replace(REQUIRE_RE, function(m, m1, m2) {
            if (m2) {
                ret.push(m2);
            }
        });
    // return ret;
    return replaceDep(ret, srcPath);
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


// 读取config文件对象
// Bino Yip
function readConfigToObj(options) {
    var CONFIG_RE = /[\s\S]*seajs.config\s*\(|\)[\s\S]*;*$/g,
        config = {},
        code = '';

    if (options || options.configSrc) {
        code = fs.readFileSync(options.configSrc, 'utf-8').replace(CONFIG_RE, '');
    }
    // console.log('code: '+ code);
    if (code) {
        try {
            config = eval("("+ code +")");
        } catch(e) {
            console.log('Config file error!!!!');
        }
    }
    return config;
}


// 处理require路径（base、paths、alias）
// Bino Yip
function replaceDep(rawDep, srcPath) {
    var dep = rawDep || [],
        _cwd = process.cwd(),
        _base = C.base || './',
        _paths = C.paths,
        _alias = C.alias,
        PATHS_RE = /^([^/:]+)(\/.+)$/,
        ABSOLUTE_RE = /^\/\/.|:\//,
        ROOT_DIR_RE = /^.*?\/\/.*?\//;


    // require路径替换alias
    var parseAlias = function(id) {
        return _alias && _alias[id] ? _alias[id] : id;
    };

    // require路径替换paths
    var parsePaths = function(id) {
        var m;
        if (_paths && (m = id.match(PATHS_RE)) && _paths[m[1]]) {
            id = _paths[m[1]] + m[2];
        }
        return id;
    };

    // require路径转换成主文件的相对路径
    var transRelPath = function(id) {
        var ret,
            first = id.charCodeAt(0);

        // Relative
        if (first === 46 /* "." */ ) {
            ret = id;
        }
        // Top-level
        else {
            ret = path.relative(path.dirname(srcPath), path.resolve(_cwd, _base) + '\\' + id);
        }
        
        return ret;
    };

    return dep.map(function(x){
        var item = x;

        item = parseAlias(item);
        item = parsePaths(item);
        item = transRelPath(item);

        return item;
    });
}


module.exports = function( srcPath, mainID, code, options ){
    // console.log( '接收到的参数有: ' );
    // console.log( srcPath + ' | ' + mainID );
    G = {
        requriedDep: {},
        ProductCode:  '',
        depMap: {

        }
    };

    C = readConfigToObj(options);

    // add target file to required
    G.requriedDep[ url.resolve(srcPath, '') ] = true;
    // console.log( 'gonna read file:  ' + srcPath + ',   its id is:  ' + mainID );
    buildSeajsFile( srcPath, mainID );
    // 所有的文件都构建好之后才有完整的依赖列表
    // console.log( G.depMap );

    return fillDepArr( G.depMap, G.ProductCode, mainID );
};
