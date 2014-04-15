var gulp = require('gulp');

var seajsBuilder = require('./index.js');

var mainFileSrc = 'test/ctrl/testCtrl.js';
var mainID = 'dist/testCtrl.js';
var destPath = 'test/dist';


gulp.task( 'default', function(){
    gulp.src( mainFileSrc )
        .pipe( seajsBuilder( mainID ) )
        .pipe( gulp.dest( destPath ) );
});