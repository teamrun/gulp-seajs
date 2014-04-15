var assert = require('assert');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

var should = require('should');

var opt = require('./testBuildOption.js');

var buildedFile = path.join( opt.destPath, path.basename( opt.srcFile ) );
// 为啥有地方有俩转义符? 字符串一个转译, 正则一个转译
var moduleDefineReg = new RegExp( 'define\\( \'(.+)\',', 'g' );
var depListReg = new RegExp( 'define\\( \''+ opt.mainID.replace(/\//g, '\\/') + '\', \\[([^\\]]+)', 'g' );
var MODULE_COUNT = 7;
var DEPLIST_LENGTH = MODULE_COUNT-1;


// 读取构建配置
describe('read build option file', function(){
    it('should have full options: srcFile, mainID, destPath', function(){
        opt.should.have.property('srcFile');
        opt.should.have.property('mainID');
        opt.should.have.property('destPath');
    });
});

// 执行构建
describe( 'exec build cmd', function(){
    // 移除之前的文件
    before( function( done ){
        fs.unlink( buildedFile, function( err, result ){
            // console.log( arguments );
            var removeSuc = Boolean( err === null || err.errno === 34 );
            removeSuc.should.be.ok;
            done();
        });
    } );
    // 构建新文件
    before( function( done ){
        exec('gulp', function( err, stdOut, stdErr){
            // Warning: No assertions can be done on null and undefined.
            assert.equal( err, null );
            assert.equal( stdErr, '' );
            done();
        });
    } );

    
    // done must be passed to it 's handler
    it('destPath should exits a file named by srcFile', function( done ){
        fs.stat( buildedFile, function( err, info ){
            assert.equal( err, null );
            done();
        });
    });

    
} );


// 读取构建后的文件
// assert
//      应该有mainID的模块
//      mainID有依赖列表
//      应该生成指定个数的模块: define\(.+ 应该有n个

describe('check builded file', function(){
    var buildCode;
    before( function( done ){
        fs.readFile( buildedFile, 'utf-8', function( err, content ){
            assert.equal( err, null );
            buildCode = content;
            done();
        } );
    } );

    it('should have mainID', function(){
        var hasMainID = buildCode.indexOf( 'define( \''+ opt.mainID + '\',' );
        hasMainID.should.be.above(-1);
    });

    it('should have dependency list in main module, and its length is '+DEPLIST_LENGTH, function(){
        var depListMatch, depList;
        buildCode.replace( depListReg, function(){
            depListMatch = arguments[0];
            if( arguments[1] ){
                depList = arguments[1].split(',');
            }
            
            return '';
        } );
        depListMatch.should.be.ok;
        (depList.length).should.be.eql( DEPLIST_LENGTH );
    });

    it('should have '+MODULE_COUNT+' modules in builded code', function(){
        var moduleMatch = buildCode.match( moduleDefineReg );
        (moduleMatch.length).should.be.eql( MODULE_COUNT );
    });
});