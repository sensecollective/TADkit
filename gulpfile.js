// Include gulp
var gulp = require('gulp'); 

// Include Plugins
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
// var dgeni = require('gulp-dgeni');
// var ngdoc = require('dgeni-packages/ngdoc');
// var documentation = require('gulp-documentation');
var header = require('gulp-header');
// var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var ngDocs = require('gulp-ngdocs');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
// var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var opn = require('opn');
var server = {
	host: 'localhost',
	port: '8001'
}

gulp.task('config', function() {
	var config = {
		NAME: require('./package.json').name || 'TADkit',
		VERSION: require('./package.json').version || '1.0.0',
		ENV: require('./package.json').config.env || 'development',
		VERBOSE: require('./package.json').config.verbose || false,
		ONLINE: false
	};
	return ngConstant({
		name: 'TADkit',
		constants: config,
		stream: true,
		deps: false,
		wrap: "(function() {\n'use strict';\n<%= __ngModule %>\n})();"
	})
	.pipe(header("/*\n * This file is generated by Gulp plugin gulp-ng-constant.\n * DO NOT EDIT!\n */\n"))
	.pipe(rename('tadkit.constants.js'))
	.pipe(gulp.dest('src'));
});

// Lint
gulp.task('lint', function() {
	return gulp.src([
		'src/**/*.js',
		'!src/assets/**/*.js'
		])
		// .pipe(jscs())
		// .pipe(jscs.reporter());
		// To check UNUSED use "unused: true"
		.pipe(jshint({ devel: true}))
		.pipe(jshint.reporter('default'));
});

// Documentation Angular sttyle JSDoc (HTML)
gulp.task('doc-html', function() {
	var options = {
		// scripts: ['../app.min.js'],
		html5Mode: true,
		startPage: 'index.html',
		title: "TADkit Docs",
		titleLink: "index.html"
		// image: "docs/image.png",
		// imageLink: "http://my-domain.com",
	}
	return gulp.src(
		[
		'src/*.js',
		'src/**/*.js',
		'!src/assets/**/*.js'
		])
		// .pipe(dgeni({packages: [ngdoc]}))
		.pipe(ngDocs.process(options))
		.pipe(gulp.dest('doc/html'));
});

// Documentation GitHub Markdown (MD)
gulp.task('docs-md', function() {
	return gulp.src(
		[
		'src/*.js',
		'src/**/*.js',
		'!src/assets/**/*.js'
		])
		.pipe(documentation({ format: 'md' }))
		.pipe(gulp.dest('doc'));
});

// Concatenate & Minify TADkit JS
gulp.task('dist-scripts', function() {
	return gulp.src([
		'src/tadkit.js',
		'src/tadkit.constants.js',
		'src/tadkit.config.js',
		'src/tadkit.run.js',
		'src/tadkit.states.js',
		'src/core/*.js',
		'src/datasets/*.module.js',
		'src/datasets/*.service.js',
		'src/layers/*.module.js',
		'src/layers/*.service.js',
		'src/components/**/*.js',
		'src/layout/**/*.js',
		'src/services/*.js'
		])
		.pipe(concat('tadkit.js'))
		.pipe(gulp.dest('dist')) // isolated dist but requires app
		.pipe(gulp.dest('tadkit/assets/js')) // only needed when testing
		.pipe(rename('tadkit.min.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('dist')) // isolated dist but requires app
		.pipe(gulp.dest('tadkit/assets/js'));
});

// Concatenate & Minify Angular Modules
// ¡¡¡ LOADING MODULE BEFORE SERIVCE IS IMPORTANT !!!
gulp.task('dist-modules', function() {
	return gulp.src([
		'src/modules/generic/generic.module.js',
		'src/modules/generic/*.service.js',
		'src/modules/generic/*.directive.js',
		'src/modules/ui/ui.module.js',
		'src/modules/ui/*.service.js',
		'src/modules/ui/*.directive.js',
		'src/modules/bioinformatics/bioinformatics.module.js',
		'src/modules/bioinformatics/*.service.js',
		'src/modules/bioinformatics/*.directive.js',
		'src/modules/browsers/browsers.module.js',
		'src/modules/browsers/*.service.js',
		'src/modules/modeling/modeling.module.js',
		'src/modules/modeling/*.service.js',
		'src/modules/modeling/*.directive.js',
		'src/modules/visualization/visualization.module.js',
		'src/modules/visualization/*.service.js',
		'src/modules/visualization/*.directive.js'
		])
		.pipe(concat('modules.js'))
		.pipe(gulp.dest('tadkit/assets/js')) // only needed when testing
		.pipe(rename('modules.min.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('tadkit/assets/js'));
});

// Transfer Vendor JS
// ¡¡¡ LOAD ORDER IS IMPORTANT !!!
gulp.task('dist-vendor', function() {
	return gulp.src([
		'bower_components/angular/angular.js',
		'bower_components/angular-ui-router/release/angular-ui-router.js',
		'bower_components/angular-aria/angular-aria.js',
		'bower_components/angular-animate/angular-animate.js',
		'bower_components/angular-material/angular-material.js',
		'bower_components/ng-flow/dist/ng-flow-standalone.js',
		'bower_components/angular-uuid4/angular-uuid4.js',
		'bower_components/papaparse/papaparse.js',
		'bower_components/angular-d3js/dist/angular-d3js.js', // an angular module to load d3JS, NOT d3js scripts
		'bower_components/angular-threejs/dist/angular-threejs.js', // an angular module to load threeJS, NOT threeJS scripts
		// 'bower_components/angular-jsorolla/dist/angular-jsorolla.js' // an angular module to load jsorolla, NOT jsorolla scripts
		])
		.pipe(concat('vendors.js'))
		.pipe(gulp.dest('tadkit/assets/js'))
		.pipe(rename('vendors.min.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('tadkit/assets/js'));
});

// Transfer Demo index.html
gulp.task('app-index', function() {
	return gulp.src([
		'src/tadkit-index.html'
		])
		.pipe(rename('index.html'))
		.pipe(gulp.dest('tadkit'));
});
// Transfer Favicon Assets
gulp.task('app-favicon', function() {
	return gulp.src([
		'src/favicon-32x32.png'
		])
		.pipe(gulp.dest('tadkit'));
});

// Transfer Libs used in Services for local offline load
gulp.task('assets-libs', function() {
	return gulp.src([
		'bower_components/angular/angular.min.js.map', //required?
		'bower_components/d3/d3.min.js',
		'bower_components/threejs/build/three.min.js',
		'bower_components/threejs/examples/js/controls/TrackballControls.js',
		'bower_components/threejs/examples/js/controls/OrbitControls.js',
		'bower_components/jsorolla/**/*', // temporary untill module comverted to bower
		'bower_components/genoverse/**/*' // fake bower... copied from github repo
		])
		.pipe(gulp.dest('src/assets/js'))
		.pipe(gulp.dest('tadkit/assets/js'));
});

// Transfer HTML Templates
gulp.task('assets-html', function() {
	return gulp.src([
		'src/**/*.html',
		'!src/assets/templates/*.html'
		])
		.pipe(rename({dirname: ''}))
		.pipe(header("<!-- This file is duplicated to ./templates by Gulp. DO NOT EDIT! -->\n"))
		.pipe(gulp.dest('src/assets/templates'))
		.pipe(gulp.dest('tadkit/assets/templates'));
});

// Compile Sass
// gulp.task('assets-sass', function() {
// 	return gulp.src('src/scss/*.scss')
// 		.pipe(sass({
// 			includePaths: ['src/assets/scss'],
// 			outputStyle: 'nested',
// 			errLogToConsole: true
// 		}))
// 		.pipe(gulp.dest('src/assets/css'));
// });

// Minify and Transfer App CSS
gulp.task('app-css', function() {
	return gulp.src([
		'src/assets/css/tadkit-material.css',
		'src/assets/css/tadkit-core.css',
		'src/assets/css/tadkit-svg.css',
		'src/assets/css/tadkit-typography.css'
		])
		.pipe(concat('tadkit.css'))
		.pipe(gulp.dest('tadkit/assets/css'))
		.pipe(cleanCss())
		.pipe(rename('tadkit.min.css'))
		.pipe(gulp.dest('tadkit/assets/css'));
});

// Transfer CSS Assets
gulp.task('assets-css', function() {
	return gulp.src([
		'src/assets/css/*.css',
		'!src/assets/css/tadkit-*.css'
		])
		.pipe(gulp.dest('tadkit/assets/css'));
});

// // Transfer Modules CSS Assets
// gulp.task('assets-modulescss', function() {
// 	return gulp.src([
// 		'src/modules/*/*.css'
// 		])
// 		.pipe(rename({dirname: ''}))
// 		.pipe(gulp.dest('src/assets/css'))
// 		.pipe(gulp.dest('tadkit/assets/css'));
// });

// Transfer Fonts Assets
gulp.task('assets-fonts', function() {
	return gulp.src([
		'src/assets/fonts/*.*'
		])
		.pipe(gulp.dest('tadkit/assets/fonts'));
});
// Transfer Image Assets
gulp.task('assets-img', function() {
	return gulp.src([
		'src/assets/img/*.*'
		])
		.pipe(gulp.dest('tadkit/assets/img'));
});

// Transfer Defaults
gulp.task('assets-defaults', function() {
	return gulp.src([
		'src/assets/defaults/*.*'
		])
		.pipe(gulp.dest('tadkit/assets/defaults'));
});
// Transfer Offline
gulp.task('assets-offline', function() {
	return gulp.src([
		'src/assets/offline/*.*'
		])
		.pipe(gulp.dest('tadkit/assets/offline'));
});
// Transfer Examples
gulp.task('assets-examples', function() {
	return gulp.src([
		'src/assets/examples/readme.txt',
		'src/assets/examples/tk-example-*.*'
		])
		.pipe(gulp.dest('tadkit/assets/examples'));
});

gulp.task('webserver', function() {
  gulp.src( '.' )
	.pipe(webserver({
	  host:             server.host,
	  port:             server.port,
	  livereload:       false,
	  directoryListing: false
	}));
});

gulp.task('openbrowser', function() {
  opn( 'http://' + server.host + ':' + server.port + '/src/index.html');
});


// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch([
		'src/**/*',
		'!src/assets/css/**/*',
		'!src/assets/fonts/**/*',
		'!src/assets/img/**/*',
		'!src/assets/js/**/*',
		'!src/assets/scss/**/*',
		'!src/assets/templates/**/*'
	], [
		'config',
		'lint',
		'doc-html',
		// 'docs-md',
		// 'sass',
		'dist-scripts',
		'dist-modules',
		'dist-vendor',
		'app-index',
		'app-favicon',
		'assets-libs',
		'assets-html',
		'app-css',
		'assets-css',
		'assets-fonts',
		'assets-img',
		'assets-defaults',
		'assets-offline',
		'assets-examples'
	]);
	// gulp.watch('src/assets/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', [
	'config',
	'lint',
	'doc-html',
	// 'docs-md',
	'dist-scripts',
	'dist-modules',
	'dist-vendor',
	'app-index',
	'app-favicon',
	'assets-libs',
	'assets-html',
	'app-css',
	'assets-css',
	'assets-fonts',
	'assets-img',
	'assets-defaults',
	'assets-offline',
	'assets-examples',
	'webserver',
	'openbrowser',
	'watch'
]);