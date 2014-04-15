var cp = require('child_process');
var spawn = cp.spawn;

describe( 'test', function(){
    it('tt', function( done ){
        cp.exec('gulp', function(  ){
            console.log( arguments );
            done();
        });

        // gulp = spawn('ll');

        // gulp.stdout.on('data', function (data) {
        //     console.log('stdout: ' + data);
        // });

        // gulp.stderr.on('data', function (data) {
        //     console.log('stderr: ' + data);
        // });

        // gulp.on('close', function (code) {
        //     console.log('child process exited with code ' + code);
        //     done();
        // });
    });  
})


