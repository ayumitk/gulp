var gulp         = require('gulp');

// local server
var browserSync  = require('browser-sync').create();

// css
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var csscomb      = require('gulp-csscomb');
var sass         = require('gulp-sass');

// js
var uglify       = require('gulp-uglify');

// images
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');
var mozjpeg      = require('imagemin-mozjpeg');

// template engine
var nunjucks     = require('gulp-nunjucks-render');



// Static Server + watch
gulp.task('serve', ['nunjucks','sass','scripts','images'], function() {

    browserSync.init({
        server: "../"
    });

    gulp.watch("src/scss/*.scss", ['sass']);
	gulp.watch("src/js/*.js", ['scripts']);
	gulp.watch("src/images/*.{png,jpg}", ['images']);
	gulp.watch("src/templates/**/*.njk", ['nunjucks']);
    gulp.watch("src/**", browserSync.reload);
});



// render templates
gulp.task('nunjucks', function () {
	return gulp.src('src/templates/*.njk')
		.pipe(nunjucks({
			path: ['src/templates/']
		}))
		.pipe(gulp.dest('../'));
});



// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/*.scss")

		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))

		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))

		.pipe(csscomb())

		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))

		.pipe(gulp.dest("../css"))

		.pipe(browserSync.reload({
			stream: true,
		}));
});

// Minify JavaScript files
gulp.task('scripts', function() {
	gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('../js'));
});


gulp.task('images', function() {
	gulp.src('src/images/*.{png,jpg}')
		.pipe(imagemin([
			pngquant({
				quality: '65-80',
				speed: 1,
				floyd:0
			}),
			mozjpeg({
				quality:85,
				progressive: true
			}),
			imagemin.svgo(),
			imagemin.optipng(),
			imagemin.gifsicle()
		]))
		.pipe(gulp.dest('../images'));
});



gulp.task('default', ['serve']);
