'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		watch: {
			livereload: {
				options: {
					livereload: '<%= connect.livereload.options.livereload %>'
				},
				files: [
					'experiments/**/*'
				]
			}
		},
		connect: {
			livereload: {
				options: {
					port: 9000,
					livereload: 35729,
					hostname: '*',
					// protocol: 'https',
					base: ['.']
				}
			}
		}
	});

	grunt.registerTask('serve', [
		'connect',
		'watch'
	]);
};
