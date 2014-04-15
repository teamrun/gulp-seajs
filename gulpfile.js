var gulp = require('gulp');

var seajsBuilder = require('./index.js');

var opt = require('./testBuildOption.js');


gulp.task( 'default', function(){
    gulp.src( opt.srcFile )
        .pipe( seajsBuilder( opt.mainID ) )
        .pipe( gulp.dest( opt.destPath ) );
});