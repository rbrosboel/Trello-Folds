module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-contrib-compress");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        manifest: grunt.file.readJSON("extension/manifest.json"),
        mochaTest: {
            test: {
                options: {
                    reporter: "list",
                },
                src: ["test/**/*.tests.js"],
            },
        },
        compress: {
            main: {
                options: {
                    archive: "dist/Trello-Folds-<%= pkg.version %>.zip",
                },
                files: [
                    {expand: true, cwd: "extension/", src: ["**"], dest: "/"},
                ],
            },
        },
    });

    //grunt.registerTask("test", "mochaTest");
    grunt.registerTask("default", "test");
    grunt.registerTask("test", "Runs Mocha tests", function() {
        grunt.task.run("mochaTest");
    });
    grunt.registerTask("zip", "compress");
    grunt.registerTask("version-check", "Checks that package.json and manifest.json version matches", function() {
        let packageVer = grunt.config("pkg").version;
        let manifestVer = grunt.config("manifest").version;
        if (packageVer !== manifestVer) {
            grunt.log.error(`package.json [${packageVer}] and manifest.json [${manifestVer}] versions do not match`);
            return false;
        }
        grunt.log.writeln(`Versions match: ${packageVer}`);
    });
    grunt.registerTask("build", function() {
        grunt.task.run("version-check");
        let packageVersion = grunt.config("pkg").version;
        if (grunt.file.exists(`dist/Trello-Folds-${packageVersion}.zip`)) {
            grunt.fail.warn("File already exists");
        }
        grunt.option("reporter", "progress");
        grunt.task.run("test");
        grunt.task.run("zip");
    });
};
