# gulp-seajs, a seajs builder for gulp

gulp-seajs is a plugin to build seajs modules.

install:
    
    npm install gulp-seajs --save

use:
    
    var seajs = require('gulp-seajs');

    gulp.task('seajs build', function(){
        gulp.src(‘mainfile.js’)
        .pipe( seajs(‘mainID’) )
        .pipe( gulp.dest( ‘/dist’ ) );
    });

param: 

* gulp.src:  you should read the main js file which you seajs.use
* mainID: the main Module ID for the seajs app entrance

about more knowledge about seajs modules and Naming Conventions, visit [seajs docs](http://seajs.org/docs/#docs)