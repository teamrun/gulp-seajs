# gulp-seajs, a seajs builder for gulp

gulp-seajs is a plugin to build seajs modules.

### install:
    
    npm install gulp-seajs --save

### test

    npm test
### use:
    
    var seajs = require('gulp-seajs');

    gulp.task('seajs build', function(){
        gulp.src('mainfile.js')
        .pipe( seajs('mainID') )   // .pipe( seajs('mainID', {configSrc: './js/config.js'}) )
        .pipe( gulp.dest( '/dist' ) );
    });

result:
    /dist/mainfile.js:

    define( 'mainID', [ 'model1', 'view1', 'view2', 'util1' ], function(){
        // ... codes here
    } );

    define( 'model1', ['dependences'], function(){
        // ... codes here
    } );

    // other module's defininations ...


config.js:

    seajs.config ({
        base: './js/',
        paths: {
            libs: 'components'
        },
        alias: {
            footer: 'libs/footer/footer'
        }
    });
    

### param: 

* gulp.src:  you should read the main js file which you seajs.use
* mainID: the main Module ID for the seajs app entrance. ~~Should be an absolute path based on your project~~ both relative path and abslute path are supported. but relative path will based on your sea.js file, it brings more complexity
* options: {configSrc: './js/seajs-config.js'} ; supported base、 alias、 paths

### feature:
* receive the entry file stream and scan for all the require dependiences
* scan require dependiences recursively
* preserve modules whose id with {vars}, like load the specific i18n file, instead of caoncat all language file into final file
* write dependience into defininations

### haven't look into yet...
* seajs.config.pathes
* seajs.config.alias
* other configs

about more knowledge about seajs modules and Naming Conventions, visit [seajs docs](http://seajs.org/docs/#docs)