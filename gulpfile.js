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

// -- NODE ---------------------------------------------------------------------

const Node = {
	build() {
		return gulp.src('./src/**/*.js', { since: gulp.lastRun(Node.build) })
			.pipe(gulpPreProcess({ context: { TARGET: 'NODEJS' } }))
			.pipe(gulp.dest('./dist/node/'));
	}
};

// - BROWSER -------------------------------------------------------------------

const Browser = {

	// ES5
	Es5: {
		addDependency() {
			return gulp.src([
				'./node_modules/id-sequence/dist/es5/**/*.js',
				'./node_modules/id-sequence/dist/es5/**/*.min.js',
				'./node_modules/id-sequence/dist/es5/**/*.min.js.map'
			], { since: gulp.lastRun(Browser.Es5.addDependency) })
				.pipe(gulp.dest('./dist/browser/es5/'));
		},
		build() {
			return gulp.src('./src/**/*.js', { since: gulp.lastRun(Browser.Es5.build) })
				.pipe(gulpPreProcess({ context: { TARGET: 'BROWSER_ES5' } }))
				.pipe(gulpBabel())
				.pipe(gulp.dest('./dist/browser/es5/'))
				.pipe(gulpRename((path) => path.basename += '.min'))
				.pipe(gulpSourceMaps.init())
				.pipe(gulpUglify())
				.pipe(gulpSourceMaps.write('.'))
				.pipe(gulp.dest('./dist/browser/es5/'));
		}
	},

	// ES6
	Es6: {
		addDependency() {
			return gulp.src([
				'./node_modules/id-sequence/dist/es6/**/*.js',
				'./node_modules/id-sequence/dist/es6/**/*.min.js',
				'./node_modules/id-sequence/dist/es6/**/*.min.js.map'
			], { since: gulp.lastRun(Browser.Es6.addDependency) })
				.pipe(gulp.dest('./dist/browser/es6/'));
		},
		build() {
			return gulp.src('./src/**/*.js', { since: gulp.lastRun(Browser.Es6.build) })
				.pipe(gulpPreProcess({ context: { TARGET: 'BROWSER_ES6' } }))
				.pipe(gulp.dest('./dist/browser/es6/'))
				.pipe(gulpRename((path) => path.basename += '.min'))
				.pipe(gulpSourceMaps.init())
				.pipe(gulpTerser())
				.pipe(gulpSourceMaps.write('.'))
				.pipe(gulp.dest('./dist/browser/es6/'));
		}
	},

	// ES6 MODULE
	Es6Module: {
		addDependency() {
			return gulp.src([
				'./node_modules/id-sequence/dist/es6-module/**/*.js',
				'./node_modules/id-sequence/dist/es6-module/**/*.min.js',
				'./node_modules/id-sequence/dist/es6-module/**/*.min.js.map'
			], { since: gulp.lastRun(Browser.Es6Module.addDependency) })
				.pipe(gulp.dest('./dist/browser/es6-module/'));
		},
		build() {
			return gulp.src('./src/**/*.js', { since: gulp.lastRun(Browser.Es6Module.build) })
				.pipe(gulpPreProcess({ context: { TARGET: 'BROWSER_ES6_MODULE' } }))
				.pipe(gulp.dest('./dist/browser/es6-module/'))
				.pipe(gulpRename((path) => path.basename += '.min'))
				.pipe(gulpSourceMaps.init())
				.pipe(gulpTerser())
				.pipe(gulpSourceMaps.write('.'))
				.pipe(gulp.dest('./dist/browser/es6-module/'));
		}
	}
}

// -- EXPORT -------------------------------------------------------------------

const addDependency = gulp.parallel(
	Browser.Es5.addDependency,
	Browser.Es6.addDependency,
	Browser.Es6Module.addDependency
);

const build = gulp.parallel(
	Node.build,
	Browser.Es5.build,
	Browser.Es6.build,
	Browser.Es6Module.build
);

function watch() {
	gulp.watch('src/**/*.js', build);
}

module.exports = {
	build: gulp.series(cleanup, addDependency, build),
	watch: gulp.series(cleanup, addDependency, build, watch)
};
