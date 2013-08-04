/*
  Pour lancer la tache grunt :
  - Placez vous dans bbb/
  - lancez grunt <taskName>, celle utilisée dans   
                grunt.registerTask('<taskName>', ...);
*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-contrib-sass");

  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    
    sass: {
      
      options: {
        debugInfo: true,
        style: 'expanded'
      },

      compile: {
        files: {
          '../public/stylesheets/build/style.css' : ['../public/stylesheets/scss/foundation.scss']
        }
      }
    }, 

    watch: {
      files: ['../public/stylesheets/scss/**/*.scss'],
      tasks:['sass']
    }

  });

  grunt.registerTask('dev', ['sass', 'watch']);

}