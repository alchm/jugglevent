/*
  Pour lancer la tache grunt :
  - Placez vous dans bbb/
  - lancez grunt <taskName>, celle utilisée dans   
                grunt.registerTask('<taskName>', ...);
*/

module.exports = function(grunt) {
  "use strict";

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-cssmin");

  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    
    sass: {
      options: {
        debugInfo: true,
        style: 'expanded'
      },
      compile: {
        files: {
          '../public/stylesheets/build/style.css' : ['../public/stylesheets/scss/global.scss']
        }
      }
    }, 

    cssmin: {
      minify: {
        src: ['../public/stylesheets/build/style.css'],
        dest: '../public/stylesheets/build/style.min.css'
      },
      add_banner: {
        options: {
          banner: '/* My minified css file */'
        },
        files: {
          '../public/stylesheets/build/style.min.css': '../public/stylesheets/build/style.min.css'
        }
      }
    },

    watch: {
      files: ['../public/stylesheets/scss/**/*.scss'],
      tasks:['sass']
    }

  });
  grunt.registerTask('dev', ['sass', 'watch']);
  grunt.registerTask('production', ['sass', 'cssmin']);

}