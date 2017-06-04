var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');

//////////////////
// TASK OPTIONS //
//////////////////

// enable extra debug information, when possible
var __DEBUG = true;
// enable sourcemaps for Browserify bundles and Sass
var __SOURCEMAPS = true;
// clean dist files before (re)builds
var __CLEAN = true;
// minify .css and .js files
var __MINIFY = true;
// copy vendor assets from node_modules/
var __VENDOR_ASSETS = [
	'adminplus/dist/adminplus.js',
	'bootstrap/dist/js/bootstrap.min.js',
	'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
	'bootstrap-timepicker/js/bootstrap-timepicker.js',
	'bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js',
	'datatables/media/js/jquery.dataTables.min.js',
	'datatables-bootstrap3-plugin/media/js/datatables-bootstrap3.min.js',
	'jquery.fancytree/dist/jquery.fancytree-all.min.js',
	'fullcalendar/dist/fullcalendar.min.js',
	'jquery/dist/jquery.min.js',
	'moment/min/moment.min.js',
	'morris.js/morris.min.js',
	'nestable/jquery.nestable.js',
	'tether/dist/js/tether.min.js',
	'summernote/dist/summernote.min.js',
	'sweetalert/dist/sweetalert.min.js',
	'raphael/raphael-min.js',
	'jvectormap/jquery.jvectormap.min.js',
	'jvectormap/jquery-jvectormap.css',
	'nouislider/distribute/nouislider.min.js',
	'nouislider/distribute/nouislider.min.css',
	'easy-countdown/dest/jquery.countdown.min.js',
	'dropzone/dist/min/dropzone.min.js',
	'dropzone/dist/min/dropzone.min.css'
];

///////////////////////
// MAIN SOURCE PATHS //
///////////////////////

var __SRC = './src';
var __SRC_BROWSERIFY = __SRC + '/js/browserify/*.browserify.js';
var __SRC_JS = __SRC + '/js/scripts/*.js';
var __SRC_SASS = [
	__SRC + '/sass/style/*.scss',
	// Ignore partials (file names prefixed with _)
	'!' + __SRC + '/sass/**/_*.scss'
];
var __SRC_HTML = __SRC + '/html/pages/**/*.html';
var __SRC_IMAGES = __SRC + '/images/**/*';
var __SRC_DATA = __SRC + '/data/**/*';

///////////////////////////
// SOURCE EXAMPLES PATHS //
///////////////////////////

var __SRC_EXAMPLES_SASS = __SRC + '/sass/examples/*.scss';
var __SRC_EXAMPLES_JS = __SRC + '/js/examples/scripts/*.js';
var __SRC_EXAMPLES_BROWSERIFY = __SRC + '/js/examples/browserify/*.browserify.js';

/////////////////
// WATCH PATHS //
/////////////////

var __WATCH_SASS = __SRC + '/sass/style/**/**.scss';
var __WATCH_BROWSERIFY = __SRC + '/js/browserify/**/**';
var __WATCH_JS = __SRC_JS;
var __WATCH_HTML = __SRC + '/html/**/**';
var __WATCH_EXAMPLES_SASS = __SRC + '/sass/examples/**/**';
var __WATCH_EXAMPLES_JS = __SRC + '/js/examples/scripts/**/**';
var __WATCH_EXAMPLES_BROWSERIFY = __SRC + '/js/examples/browserify/**/**';

///////////////////////
// DESTINATION PATHS //
///////////////////////

var __DIST = './dist';
var __DIST_JS = __DIST + '/assets/js';
var __DIST_CSS = __DIST + '/assets/css';
var __DIST_DATA = __DIST + '/assets/data';
var __DIST_IMAGES = __DIST + '/assets/images';
var __DIST_VENDOR = __DIST + '/assets/vendor';
var __DIST_EXAMPLES = __DIST + '/examples';
var __DIST_EXAMPLES_JS = __DIST_EXAMPLES + '/js';
var __DIST_EXAMPLES_CSS = __DIST_EXAMPLES + '/css';

/////////////////
// CLEAN PATHS //
/////////////////

// clean Browserify bundles
var __CLEAN_BROWSERIFY =  __DIST_JS + '/**/**.browserify.*';
var __CLEAN_CSS = __DIST_CSS;
var __CLEAN_JS = [
	// All .js files
	__DIST_JS + '/**/**.js',
	// Except browserify bundles
	'!' + __DIST_JS + '/**/**.browserify.*'
]
var __CLEAN_HTML = __DIST + '/**/**.html';
var __CLEAN_EXAMPLES_BROWSERIFY = __DIST_EXAMPLES_JS + '/**/**.browserify.*';
var __CLEAN_EXAMPLES_JS = [
	__DIST_EXAMPLES_JS + '/**/*',
	// Exclude browserify bundles
	'!' + __DIST_EXAMPLES_JS + '/**/**.browserify.*'
];
var __CLEAN_EXAMPLES_CSS = __DIST_EXAMPLES_CSS;
var __CLEAN_DATA = __DIST_DATA;
var __CLEAN_VENDOR = __DIST_VENDOR;

////////////////
// SASS TASKS //
////////////////

function sass (src, dist) {
	return gulp.src(src)
		// (optional) sourcemaps
		.pipe($.if(__SOURCEMAPS, $.sourcemaps.init()))
		// Compile Sass
		.pipe($.sass({ 
			// Resolve Sass file imports from node_modules
			importer: require('sass-importer-npm') 
		})
		// Handle errors
		.on('error', $.sass.logError))
		// Post CSS
		.pipe($.postcss([
			// autoprefixer
			require('autoprefixer')({ browsers: ['last 2 versions'] })
		]))
		// also save non minified version
		.pipe($.if(__MINIFY, $.rename({ extname: '.css' })))
		.pipe($.if(__MINIFY, gulp.dest(dist)))
		// (optional) Minify CSS
		.pipe($.if(__MINIFY, $.rename({ extname: '.min.css' })))
		.pipe($.if(__MINIFY, $.cleanCss()))
		// (optional) Write .map file
		.pipe($.if(__SOURCEMAPS, $.sourcemaps.write('./')))
		// Write CSS file
		.pipe(gulp.dest(dist))
}

// CLEAN DIST CSS
gulp.task('css:clean', function (cb) {
	if (!__CLEAN) { return cb() }
	del(__CLEAN_CSS).then(function () { cb() });
});

// Compile Sass
gulp.task('sass', ['css:clean'], function () {
	return sass(__SRC_SASS, __DIST_CSS);
});

// Compile Examples Sass
gulp.task('sass:examples', ['css:examples:clean'], function () {
	return sass(__SRC_EXAMPLES_SASS, __DIST_EXAMPLES_CSS)
});

// CLEAN DIST EXAMPLES CSS
gulp.task('css:examples:clean', function (cb) {
	if (!__CLEAN) { return cb() }
	del(__CLEAN_EXAMPLES_CSS).then(function () { cb() });
});

// Watch Sass
gulp.task('sass:watch', ['watch:set'], function () {
	gulp.watch(__WATCH_SASS, ['sass']);
});

// Watch Examples Sass
gulp.task('sass:examples:watch', ['watch:set'], function () {
	gulp.watch(__WATCH_EXAMPLES_SASS, ['sass:examples']);
});

////////////////
// BROWSERIFY //
////////////////

// BROWSERIFY DEPENDENCIES
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var path = require('path');
var assign = require('lodash.assign');

/**
 * bundleLogger
 * Provides logs for browserify bundles
 */
var prettyHrtime = require('pretty-hrtime');
var _startTime;
var bundleLogger = {
	start: function (filepath) {
		_startTime = process.hrtime();
		$.util.log('Bundling', $.util.colors.green(filepath) + '...');
	},
	end: function (filepath) {
		var taskTime = process.hrtime(_startTime);
		var prettyTime = prettyHrtime(taskTime);
		$.util.log('Bundled', $.util.colors.green(filepath), 'in', $.util.colors.magenta(prettyTime));
	}
}

function compileBrowserify (src, dist, callback) {
	globby(src).then(function (bundles) {
		
		var bundleQueue = bundles.length;
		bundles = bundles.map(function (bundle) {
			return {
				src: bundle,
				dest: dist,
				bundleName: path.basename(bundle)
			}
		});

		var browserifyThis = function (bundleConfig) {
			var opts = assign({}, watchify.args, {
				// Specify the entry point of your app
				entries: bundleConfig.src,
				// Enable source maps!
				debug: __DEBUG,
				paths: [
					// Resolve files from node_modules
					path.resolve(__dirname, 'node_modules')
				]
			});
			var bundler = browserify(opts);

			var bundle = function () {
				// Log when bundling starts
				bundleLogger.start(path.join(bundleConfig.dest, bundleConfig.bundleName));

				return bundler
					.bundle()
					// Report compile errors
					.on('error', $.util.log)
					// Use vinyl-source-stream to make the
					// stream gulp compatible. Specifiy the
					// desired output filename here.
					.pipe(source(bundleConfig.bundleName))
					// buffer file contents
					.pipe(buffer())
					// (optional) sourcemaps
					// loads map from browserify file
					.pipe($.if(__SOURCEMAPS, $.sourcemaps.init({ loadMaps: true })))
					// Add transformation tasks to the pipeline here.
					// (optional) Minify JS
					.pipe($.if(__MINIFY, $.rename({ extname: '.min.js' })))
					.pipe($.if(__MINIFY, $.uglify()))
					// (optional) Write .map file
					.pipe($.if(__SOURCEMAPS, $.sourcemaps.write('./')))
					// Write JS file
					.pipe(gulp.dest(bundleConfig.dest))
					.on('end', reportFinished)
			};

			if (global.__WATCHING) {
				// Wrap with watchify and rebundle on changes
				bundler = watchify(bundler);
				// Rebundle on update
				bundler.on('update', bundle);
			}

			var reportFinished = function () {
				// Log when bundling completes
				bundleLogger.end(path.join(bundleConfig.dest, bundleConfig.bundleName));

				if (bundleQueue) {
					bundleQueue --;
					if (bundleQueue === 0) {
						// If queue is empty, tell gulp the task is complete.
						// https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
						callback();
					}
				}
			};

			return bundle();
		};

		// Start bundling source files with Browserify
		bundles.forEach(browserifyThis);
	});
}

// CLEAN DIST JS BROWSERIFY BUNDLES
gulp.task('browserify:clean', function (cb) {
	if (!__CLEAN) { return cb() }
	del(__CLEAN_BROWSERIFY).then(function () { cb() });
});

// Compile Browserify bundles
gulp.task('browserify', ['browserify:clean'], function (callback) {
	compileBrowserify(__SRC_BROWSERIFY, __DIST_JS, callback);
});

// Watch Browserify Bundles
gulp.task('browserify:watch', ['watch:set'], function () {
	gulp.watch(__WATCH_BROWSERIFY, ['browserify']);
});

/////////////////////////
// BROWSERIFY EXAMPLES //
/////////////////////////

// CLEAN DIST EXAMPLES BROWSERIFY
gulp.task('browserify:examples:clean', function (cb) {
	if (!__CLEAN) { return cb() }
	del(__CLEAN_EXAMPLES_BROWSERIFY).then(function () { cb() });
});

// Compile Examples Browserify bundles
gulp.task('browserify:examples', ['browserify:examples:clean'], function (callback) {
	compileBrowserify(__SRC_EXAMPLES_BROWSERIFY, __DIST_EXAMPLES_JS, callback);
});

// Watch Examples Browserify Bundles
gulp.task('browserify:examples:watch', ['watch:set'], function () {
	gulp.watch(__WATCH_EXAMPLES_BROWSERIFY, ['browserify:examples']);
});

///////////////////
// OTHER SCRIPTS //
///////////////////

function js (src, dist) {
	return gulp.src(src)
		// also save non minified version
		.pipe($.if(__MINIFY, $.rename({ extname: '.js' })))
		.pipe($.if(__MINIFY, gulp.dest(dist)))
		// (optional) sourcemaps
		.pipe($.if(__SOURCEMAPS, $.sourcemaps.init()))
		// (optional) Minify JS
		.pipe($.if(__MINIFY, $.rename({ extname: '.min.js' })))
		.pipe($.if(__MINIFY, $.uglify()))
		// (optional) Write .map file
		.pipe($.if(__SOURCEMAPS, $.sourcemaps.write('./')))
		.pipe(gulp.dest(dist));
}

// CLEAN DIST JS EXCLUDING BROWSERIFY BUNDLES
gulp.task('js:clean', function (cb) {
	if (!__CLEAN) { return cb() }
	del(__CLEAN_JS).then(function () { cb() });
});

// JS
gulp.task('js', ['js:clean'], function () {
	return js(__SRC_JS, __DIST_JS);
});

// Watch JS
gulp.task('js:watch', ['watch:set'], function () {
	gulp.watch(__WATCH_JS, ['js']);
});

////////////////////////////
// OTHER EXAMPLES SCRIPTS //
////////////////////////////

// CLEAN DIST EXAMPLES JS
gulp.task('js:examples:clean', function (cb) {
	if (!__CLEAN) { return cb() }
	del(__CLEAN_EXAMPLES_JS).then(function () { cb() });
});

// EXAMPLES JS
gulp.task('js:examples', ['js:examples:clean'], function () {
	return js(__SRC_EXAMPLES_JS, __DIST_EXAMPLES_JS);
});

// Watch Examples JS
gulp.task('js:examples:watch', ['watch:set'], function () {
	gulp.watch(__WATCH_EXAMPLES_JS, ['js:examples']);
});

//////////
// HTML //
//////////

// CLEAN DIST HTML
gulp.task('html:clean', function (cb) {
	if (!__CLEAN) { return cb() }
	del(__CLEAN_HTML).then(function () { cb() });
});

// Compile Swig
gulp.task('html', ['html:clean'], function () {
	return gulp.src(__SRC_HTML)
		.pipe($.frontMatter({ property: 'data' }))
		.pipe($.swig({
			defaults: {
				cache: false,
				loader: require('fs-resolver')([ 
					path.join(process.cwd(), __SRC, 'html') 
				])
			}
		}))
		.pipe(gulp.dest(__DIST));
});

// Prettify HTML
gulp.task('html:prettify', ['html'], function () {
	return gulp.src(__DIST + '/**/*.html')
		.pipe($.prettify({
			indent: 4,
			indent_inner_html: false,
			preserve_newlines: true,
			max_preserve_newlines: 1,
			brace_style: "condense",
			unformatted: [ "a", "span", "i", "pre", "code" ]
		}))
		.pipe(gulp.dest(__DIST));
});

// Watch Examples JS
gulp.task('html:watch', ['watch:set'], function () {
	gulp.watch(__WATCH_HTML, ['html:prettify']);
});

////////////////////////
// COPY VENDOR ASSETS //
////////////////////////

gulp.task('vendor:clean', function (cb) {
	if (!__CLEAN) { return cb() }
	del(__CLEAN_VENDOR).then(function () { cb() });
});

gulp.task('copy:vendor', ['vendor:clean'], function () {
	return gulp.src(__VENDOR_ASSETS, { cwd: 'node_modules/' })
		.pipe(gulp.dest(__DIST_VENDOR));
});

/////////////////
// COPY IMAGES //
/////////////////

gulp.task('copy:images', function () {
	return gulp.src(__SRC_IMAGES)
		.pipe(gulp.dest(__DIST_IMAGES));
});

/////////////////////
// COPY OTHER DATA //
/////////////////////

gulp.task('data:clean', function (cb) {
	if (!__CLEAN) { return cb() }
	del(__CLEAN_DATA).then(function () { cb() });
});

gulp.task('copy:data', ['data:clean'], function () {
	return gulp.src(__SRC_DATA)
		.pipe(gulp.dest(__DIST_DATA));
});

/////////////
// GENERAL //
/////////////

// Called before running any watcher
// Sets a global __WATCHING flag
gulp.task('watch:set', function (cb) {
	global.__WATCHING = true
	cb()
});

// Watchers
gulp.task('watch', [
	// main tasks
	'sass:watch', 'js:watch', 'browserify:watch', 'html:watch',
	// examples
	'sass:examples:watch', 'js:examples:watch', 'browserify:examples:watch'
]);

// Default
gulp.task('default', [
	// main tasks
	'sass', 'js', 'browserify', 'html', 'html:prettify', 
	// copy
	'copy:vendor', 'copy:images', 'copy:data',
	// examples
	'sass:examples', 'js:examples', 'browserify:examples'
]);
