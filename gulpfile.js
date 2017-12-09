

// These tasks will be run when you just type "gulp"
gulp.task('default', [ 'clientBuild']);
//gulp.task('default', [ 'clientscripts', 'serverscripts' ]);

/*
// This task can be run alone with "gulp clientscripts"
gulp.task('clientscripts', () => {
  return clientTsProject.src()
                        .pipe(clientTsProject())
                        .js
                        .pipe(gulp.dest('dist/client'));
});
*/

gulp.task('clientBuild', function (cb) {
  exec('ng build', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

/*
// This task can be run alone with "gulp serverscripts"
gulp.task('serverscripts', () => {
  return serverTsProject.src()
                        .pipe(serverTsProject())
                        .js
                        .pipe(gulp.dest('dist/server'));
});
*/
// By adding this, we can run "gulp watch" to automatically
// run the build when we change a script
gulp.task('watch', () => {
  gulp.watch('client/src/**/*.*', [ 'clientBuild' ]);
  //gulp.watch('server/src/**/*.ts', [ 'serverscripts' ]);
});


//Minification makes the output even uglier by putting the 
//entire file on one line, saving file size, which is 
//especially important for the client code.
/*
gulp.task('clientscripts', () => {
  return clientTsProject.src()
                        .pipe(clientTsProject())
                        .js
                        .pipe(uglify())
                        .pipe(gulp.dest('dist/client'));
});
gulp.task('servercripts', () => {
  return serverTsProject.src()
                        .pipe(serverTsProject())
                        .js
                        .pipe(uglify())
                        .pipe(gulp.dest('dist/server'));
});
*/


//source maps come in, they act as a bridge between 
//the JavaScript and the TypeScript. Applications, such 
//as your browser, can use the source maps to figure out 
//where the JavaScript came from. If your application has 
//an error, the browser can use the source map to figure 
//out what line of the original TypeScript file caused the error.
/*
gulp.task('clientscripts', () => {
  return clientTsProject.src()
                        .pipe(sourcemaps.init())
                        .pipe(clientTsProject())
                        .js
                        .pipe(uglify())
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest('dist/client'));
});

gulp.task('servercripts', () => {
  return serverTsProject.src()
                        .pipe(sourcemaps.init())
                        .pipe(serverTsProject())
                        .js
                        .pipe(uglify())
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest('dist/server'));
});
*/