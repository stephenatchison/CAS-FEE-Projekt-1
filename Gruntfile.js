module.exports = function(grunt){
  grunt.initConfig({
    copy: {
      fonts: {
        files: [
          { expand: true, flatten: true, src: './node_modules/font-awesome/fonts/*.*', dest: './static/fonts/' },
        ]
      },
      fontawesome: {
        files: [
          { src: './node_modules/font-awesome/css/font-awesome.min.css', dest: './static/styles/font-awesome.min.css' },
        ]
      },
      jquery: {
        files: [
          { src: './node_modules/jquery/dist/jquery.min.js', dest: './static/scripts/jquery-3.2.1.min.js'},
        ]
      },
      handlebars: {
        files: [
          { src: './node_modules/handlebars/dist/handlebars.min.js', dest: './static/scripts/handlebars-4.0.8.min.js' }
        ]
      },
      moment: {
        files: [
          { src: './node_modules/moment/min/moment.min.js', dest: './static/scripts/moment-2.18.1.min.js' }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy']);
}