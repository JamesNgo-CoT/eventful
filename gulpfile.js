const del = require('del');
const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const gulpPreProcess = require('gulp-preprocess');
const gulpRename = require('gulp-rename');
const gulpSourceMaps = require('gulp-sourcemaps');
const gulpTerser = require('gulp-terser');
const gulpUglify = require('gulp-uglify');

// -- CLEAN UP -----------------------------------------------------------------

function cleanup() {
	return del('./dist/');
}

// -- BUILD NODE ---------------------------------------------------------------

function build_node() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(build_node) })
		.pipe(gulpPreProcess({ context: { TARGET: 'NODEJS' } }))
		.pipe(gulp.dest('./dist/node/'));
}

// -- DEPENDENCY BROWSER ES5 ---------------------------------------------------

function dependency_browser_es5() {
	return gulp.src([
		'./node_modules/id-sequence/dist/es5/**/*.js',
		'./node_modules/id-sequence/dist/es5/**/*.min.js',
		'./node_modules/id-sequence/dist/es5/**/*.min.js.map'
	], { since: gulp.lastRun(dependency_browser_es5) })
		.pipe(gulp.dest('./dist/browser/es5/'));
}

// -- BUILD BROWSER ES5 --------------------------------------------------------

function build_browser_es5() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(build_browser_es5) })
		.pipe(gulpPreProcess({ context: { TARGET: 'BROWSER_ES5' } }))
		.pipe(gulpBabel())
		.pipe(gulp.dest('./dist/browser/es5/'))
		.pipe(gulpRename((path) => path.basename += '.min'))
		.pipe(gulpSourceMaps.init())
		.pipe(gulpUglify())
		.pipe(gulpSourceMaps.write('.'))
		.pipe(gulp.dest('./dist/browser/es5/'));
}

// -- DEPENDENCY BROWSER ES5 ---------------------------------------------------

function dependency_browser_es6() {
	return gulp.src([
		'./node_modules/id-sequence/dist/es6/**/*.js',
		'./node_modules/id-sequence/dist/es6/**/*.min.js',
		'./node_modules/id-sequence/dist/es6/**/*.min.js.map'
	], { since: gulp.lastRun(dependency_browser_es6) })
		.pipe(gulp.dest('./dist/browser/es6/'));
}

// -- BUILD BROWSER ES6 --------------------------------------------------------

function build_browser_es6() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(build_browser_es6) })
		.pipe(gulpPreProcess({ context: { TARGET: 'BROWSER_ES6' } }))
		.pipe(gulp.dest('./dist/browser/es6/'))
		.pipe(gulpRename((path) => path.basename += '.min'))
		.pipe(gulpSourceMaps.init())
		.pipe(gulpTerser())
		.pipe(gulpSourceMaps.write('.'))
		.pipe(gulp.dest('./dist/browser/es6/'));
}

// -- DEPENDENCY BROWSER ES6 MODULE --------------------------------------------

function dependency_browser_es6Module() {
	return gulp.src([
		'./node_modules/id-sequence/dist/es6-module/**/*.js',
		'./node_modules/id-sequence/dist/es6-module/**/*.min.js',
		'./node_modules/id-sequence/dist/es6-module/**/*.min.js.map'
	], { since: gulp.lastRun(dependency_browser_es6Module) })
		.pipe(gulp.dest('./dist/browser/es6-module/'));
}

// -- BUILD BROWSER ES6 MODULE -------------------------------------------------

function build_browser_es6Module() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(build_browser_es6Module) })
		.pipe(gulpPreProcess({ context: { TARGET: 'BROWSER_ES6_MODULE' } }))
		.pipe(gulp.dest('./dist/browser/es6-module/'))
		.pipe(gulpRename((path) => path.basename += '.min'))
		.pipe(gulpSourceMaps.init())
		.pipe(gulpTerser())
		.pipe(gulpSourceMaps.write('.'))
		.pipe(gulp.dest('./dist/browser/es6-module/'));
}

// -- EXPORT -------------------------------------------------------------------

const dependency = gulp.parallel(
	dependency_browser_es5,
	dependency_browser_es6,
	dependency_browser_es6Module
);

const build = gulp.parallel(
	build_node,
	build_browser_es5,
	build_browser_es6,
	build_browser_es6Module
);

function watch() {
	gulp.watch('src/**/*.js', build);
}

module.exports = {
	build: gulp.series(cleanup, dependency, build),
	watch: gulp.series(cleanup, dependency, build, watch)
};
