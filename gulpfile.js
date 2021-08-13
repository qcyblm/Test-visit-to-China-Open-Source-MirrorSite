const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-html-minifier-terser');
const htmlclean = require('gulp-htmlclean');
const terser = require('gulp-terser');
const workbox = require("workbox-build");
gulp.task('compress', () =>
  gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
    .pipe(terser())
    .pipe(gulp.dest('./public'))
)
gulp.task('minify-css', () => {
    return gulp.src(['./public/**/*.css'])
        .pipe(cleanCSS({
            compatibility: 'ie11'
        }))
        .pipe(gulp.dest('./public'));
});
gulp.task('minify-html', () => {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true, 
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        }))
        .pipe(gulp.dest('./public'))
});
gulp.task('generate-service-worker', () => {
  return workbox.injectManifest({
    swSrc: './sw.js',
    swDest: './public/sw.js',
    globDirectory: './public',
    globPatterns: ['index.html'],
    modifyURLPrefix: {
        '': './'
    }
  }).then(({count, size, warnings}) => {
    warnings.forEach(console.warn);
    console.log(`${count} 文件将被预缓存 共占用 ${size/1024} Kb`);
  });
});
gulp.task("default",gulp.series("generate-service-worker",gulp.parallel('compress','minify-css', 'minify-html')));
