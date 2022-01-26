const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const gulpBeautify = require('gulp-beautify');
const gulpPreProcess = require('gulp-preprocess');
const gulpRename = require('gulp-rename');
const gulpSourceMaps = require('gulp-sourcemaps');
const gulpTerser = require('gulp-terser');
const gulpUglify = require('gulp-uglify');

const jsbeautifyrc = JSON.parse(fs.readFileSync('./.jsbeautifyrc', 'utf8'));

function cleanup() {
	return del('./dist/');
}

function build_node() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(build_node) })
		.pipe(gulpPreProcess({ context: { TARGET: 'NODEJS', ES: 6, MODULE: 'COMMONJS' } }))
		.pipe(gulpBeautify(jsbeautifyrc))
		.pipe(gulp.dest('./dist/node/'));
}

function build_browser_es5_dependencies() {
	return gulp.src([
		'./node_modules/id-sequence/dist/es5/**/*.min.js',
		'./node_modules/id-sequence/dist/es5/**/*.min.js.map'
	])
		.pipe(gulp.dest('./dist/es5/'));
}
function build_browser_es5_main() {
	return gulp.src('./src/**/*.js')
		.pipe(gulpPreProcess({ context: { TARGET: 'BROWSER', ES: 5, MODULE: null } }))
		.pipe(gulpBabel())
		.pipe(gulpBeautify(jsbeautifyrc))
		.pipe(gulp.dest('./dist/es5/'))
		.pipe(gulpRename((path) => path.basename += '.min'))
		.pipe(gulpSourceMaps.init())
		.pipe(gulpUglify())
		.pipe(gulpSourceMaps.write('.'))
		.pipe(gulp.dest('./dist/es5/'));
}
const build_browser_es5 = gulp.parallel(build_browser_es5_dependencies, build_browser_es5_main);

function build_browser_es6_dependencies() {
	return gulp.src([
		'./node_modules/id-sequence/dist/es6/**/*.min.js',
		'./node_modules/id-sequence/dist/es6/**/*.min.js.map'
	])
		.pipe(gulp.dest('./dist/es6/'));
}
function build_browser_es6_main() {
	return gulp.src('./src/**/*.js')
		.pipe(gulpPreProcess({ context: { TARGET: 'BROWSER', ES: 6, MODULE: null } }))
		.pipe(gulpBeautify(jsbeautifyrc))
		.pipe(gulp.dest('./dist/es6/'))
		.pipe(gulpRename((path) => path.basename += '.min'))
		.pipe(gulpSourceMaps.init())
		.pipe(gulpTerser())
		.pipe(gulpSourceMaps.write('.'))
		.pipe(gulp.dest('./dist/es6/'));
}
const build_browser_es6 = gulp.parallel(build_browser_es6_dependencies, build_browser_es6_main);

function build_browser_es6Module_dependencies() {
	return gulp.src([
		'./node_modules/id-sequence/dist/es6-module/**/*.min.js',
		'./node_modules/id-sequence/dist/es6-module/**/*.min.js.map'
	])
		.pipe(gulp.dest('./dist/es6-module/'));
}
function build_browser_es6Module_main() {
	return gulp.src('./src/**/*.js')
		.pipe(gulpPreProcess({ context: { TARGET: 'BROWSER', ES: 6, MODULE: 'ES6' } }))
		.pipe(gulpBeautify(jsbeautifyrc))
		.pipe(gulp.dest('./dist/es6-module/'))
		.pipe(gulpRename((path) => path.basename += '.min'))
		.pipe(gulpSourceMaps.init())
		.pipe(gulpTerser())
		.pipe(gulpSourceMaps.write('.'))
		.pipe(gulp.dest('./dist/es6-module/'));
}
const build_browser_es6Module = gulp.parallel(build_browser_es6Module_dependencies, build_browser_es6Module_main);

const build_browser = gulp.parallel(build_browser_es5, build_browser_es6, build_browser_es6Module);

const build = gulp.parallel(build_node, build_browser);

function watch() {
	gulp.watch('src/**/*.js', build);
}

module.exports = {
	build: gulp.series(cleanup, build),
	watch: gulp.series(cleanup, build, watch)
};
