# gulp-seajs, a seajs builder for gulp

gulp-seajs is a plugin to build seajs modules.

### install:
    
    npm install gulp-seajs --save

### use:
    
    var seajs = require('gulp-seajs');

    gulp.task('seajs build', function(){
        gulp.src(‘mainfile.js’)
        .pipe( seajs(‘mainID’) )
        .pipe( gulp.dest( ‘/dist’ ) );
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


### param: 

* gulp.src:  you should read the main js file which you seajs.use
* mainID: the main Module ID for the seajs app entrance

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