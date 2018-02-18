'use strict';

let gulp = require('gulp');
let ts = require('gulp-typescript');
let uglify = require('gulp-uglify');
let sourcemaps = require('gulp-sourcemaps');
//let exec = require('child_process').exec;
const spawn = require('cross-spawn');
var child = require('child_process');
var fs = require('fs');
var nodemon = require('gulp-nodemon');
   

let clientTsProject = ts.createProject('client/tsconfig.json');
let serverTsProject = ts.createProject('server/tsconfig.json');
//debugger;


gulp.task('default', ['watchclient'], function(){
  return nodemon({
    script: 'server/src/bin/www',
  })
  .on('restart', function(){
    console.log('restarted');
  })
})

gulp.task('watchclient', function() {
    gulp.watch('client/src/**/*.*', function () {
        spawn('ng', ['build'], { stdio: 'inherit' });
    });
});




//gulp.task('default', [ 'clientBuild']);
gulp.task('watch-dev', ['watchclient']);

gulp.task('clientBuild', () => {
  spawn('ng', ['build'], { stdio: 'inherit' });
});

// By adding this, we can run "gulp watch" to automatically
gulp.task('watch', () => {
  gulp.watch('client/src/**/*.*', [ 'clientBuild' ]);
  //gulp.watch('server/src/**/*.ts', [ 'serverscripts' ]);
});


