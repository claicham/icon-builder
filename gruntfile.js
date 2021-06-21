module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      svgmin: {
        options: {
          plugins: [
            {
              removeTitle: true,
            },
          ],
        },
        dist: {
          files: [
            {
              expand: true,
              cwd: 'assets',
              src: ['**/*.svg'],
              dest: 'optimised',
            },
          ],
        },
      },
  
      htmlbuild: {
        dist: {
          src: 'icons-template.html',
          dest: 'dist/index.html',
          options: {
            beautify: true,
            relative: true,
            basePath: false,
            sections: {
              icons: 'dist/icons.html',
            },
          },
        },
      },
  
      concat: {
        svgIcons: {
          options: {
            process: function (src, filepath) {
              function replaceWithVar(match) {
                const replaceHash = match.replace(/#/g, `%23`);
                return `var(--icon-override-${iconName}, ${replaceHash})`;
              }
              var path = filepath.split('/');
              var iconName = path[path.length - 1].replace('.svg', '').replace(/\s/g, '-');
              var icon = src
                .replace(/"/g, `'`)
                .replace(`<svg`, `.icon-${iconName} { background-image: url("data:image/svg+xml, <svg`)
                .replace('</svg>', `</svg>"); }`)
                .replace(/</g, `%3c`)
                .replace(/>/g, `%3e`)
                .replace(/#/g, `%23`);
              return icon;
            },
          },
          src: 'optimised/**/*.svg',
          dest: 'dist/svg-icons.css',
        },
        svgIconsHTML: {
          options: {
            process: function (src, filepath) {
              var path = filepath.split('/');
              var iconName = path[path.length - 1].replace('.svg', '').replace(/\s/g, '-');
              const icon = `<li class="col-1-4 icon-with-text"><span class="icon icon-${iconName}"></span> .icon-${iconName}</li>`;
              return icon;
            },
          },
          src: 'optimised/**/*.svg',
          dest: 'dist/icons.html',
        },
      },
    });
  
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html-build');
  
    // icons
    grunt.registerTask('icons', ['svgmin:dist', 'concat:svgIcons', 'concat:svgIconsHTML', 'htmlbuild']);
  
  }; 
  