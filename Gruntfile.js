/*jshint node:true */
module.exports = function( grunt ) {
    
    grunt.loadNpmTasks( 'grunt-webpack' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-header' );
    grunt.loadNpmTasks( 'grunt-replace' );

    /*var applyTemplate = function (template, options) {
        return template.replace(/<%=\s*(.*?)\s*%>/g, function (match, name) {
            var parts = name.split('.');
            var item = options;
            parts.forEach(function (x) {
                item = item[x]
            });
            return item;
        });
    };*/
    
    const banner = [
      '/*!',
      ' * <%= pkg.name %> <%= pkg.version %>',
      ' * <%= pkg.repository.url %>',
      ' */\n'
    ].join('\n');
    
    grunt.initConfig({
        pkg: require('./package.json')
        , webpack: {
            dist: {
                // webpack options
                entry: './src/index.js'

                , output: {
                    path: 'dist/'
                    , filename: 'jquery.dropzone.js'
                    , libraryTarget: 'umd'
                }

                , module: {
                    loaders: [
                        {
                            test: /\.js$/
                            , exclude: /(node_modules|bower_components)/
                            , loader: 'babel'
                            
                            , query: {
                                sourceMap: false
                                , presets: ['es2015']
                                , plugins: [
                                    'transform-es3-property-literals'
                                    , 'transform-es3-member-expression-literals'
                                ]
                                , compact: false
                            }
                        }
                    ]
                }

                , externals: {
                    'jquery': {
                        commonjs: 'jquery'
                        , commonjs2: 'jquery'
                        , amd: 'jquery'
                        , root: 'jQuery'
                    }
                }
            }
        }

        , replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /return __webpack_require__\(0\)/g,
                            replacement: 'return __webpack_require__(0).default'
                        }
                    ]
                },
                files: [
                    { expand: true, flatten: true, src: ['dist/jquery.dropzone.js'], dest: 'dist/'}
                ]
            }
        }

        , uglify: {
            dist: {
                files: {
                    'dist/jquery.dropzone.min.js': ['dist/jquery.dropzone.js']
                }
            }
        }
            
        , header: {
            dist: {
                options: {
                    text: banner
                },
                files: {
                    'dist/jquery.dropzone.js': 'dist/jquery.dropzone.js'
                    , 'dist/jquery.dropzone.min.js': 'dist/jquery.dropzone.min.js'
                }
            }
        }
    });
    
    grunt.registerTask( 'build', [ 'webpack', 'replace', 'uglify', 'header' ] );
    grunt.registerTask( 'default', [ 'build' ] );

};