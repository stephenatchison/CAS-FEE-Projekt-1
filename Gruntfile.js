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
      },
      styles: {
        files: [
          { src: './styles/projekt1.css', dest: './static/styles/noteApp.css' }
        ]
      }
    },
    concat: {
      options: {
      },
      dist: {
        src: [ './app/**/*.js' ],
        dest: './static/scripts/noteApp.js'
      },
      styles: {
        src: ['./styles/layout.css', './styles/hell.css', './styles/dunkel.css'],
        dest: './static/styles/noteApp.css'
      }
    },
    uglify: {
      main: {
        files:[
          { src: './static/scripts/noteApp.js', dest: './static/scripts/noteApp.min.js' }
        ]
      }
    },
    watch: {
      options: {
        atBegin: true,
        event: ['all']
      },
      src: {
        files: './app/**/*.js',
        tasks: ['concat:dist']
      },
      styles: {
        files: './styles/*.css',
        tasks: ['concat:styles']
      }
      //dist: {
      //  files: './static/scripts/noteApp.js',
      //  tasks: ['uglify']
      //},
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['concat']);
}