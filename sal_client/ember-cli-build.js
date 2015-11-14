/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
        // Add options here
    });

    // Use `app.import` to add additional libraries to the generated
    // output files.
    //
    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    /*
     * Import Fonts for theme
     */

    app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf', {
        destDir: 'fonts'
    });

    app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', {
        destDir: 'fonts'
    });

    app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', {
        destDir: 'fonts'
    });

    app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf', {
        destDir: 'fonts'
    });

    app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff', {
        destDir: 'fonts'
    });

    app.import('bower_components/weather-icons/font/weathericons-regular-webfont.ttf', {
        destDir: 'fonts'
    });

    app.import('bower_components/weather-icons/font/weathericons-regular-webfont.woff', {
        destDir: 'fonts'
    });

    app.import('bower_components/weather-icons/font/weathericons-regular-webfont.woff2', {
        destDir: 'fonts'
    });

    app.import('bower_components/datatables-plugins/i18n/German.lang', {
        destDir: 'i18n'
    });

    /*
     * Import CSS for theme
     */

    // Bootstrap
    app.import({
        development: 'bower_components/bootstrap/dist/css/bootstrap.css',
        production:  'bower_components/bootstrap/dist/css/bootstrap.min.css',
    });

    // Timeline
    app.import('bower_components/startbootstrap-sb-admin-2/dist/css/timeline.css');

    // Font Awesome
    app.import({
        development: 'bower_components/font-awesome/css/font-awesome.css',
        production:  'bower_components/font-awesome/css/font-awesome.min.css',
    });

    // Weather Icons
    app.import({
        development: 'bower_components/weather-icons/css/weather-icons-wind.css',
        production:  'bower_components/weather-icons/css/weather-icons-wind.min.css',
    });

    app.import({
        development: 'bower_components/weather-icons/css/weather-icons.css',
        production:  'bower_components/weather-icons/css/weather-icons.min.css',
    });

    // Metis Menu
    app.import({
        development: 'bower_components/metisMenu/dist/metisMenu.css',
        production:  'bower_components/metisMenu/dist/metisMenu.min.css',
    });

    // Datatables.js
    app.import('bower_components/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.css');

    // Bootstrap Template
    app.import('bower_components/startbootstrap-sb-admin-2/dist/css/sb-admin-2.css');

    // Bootstrap datepicker
    app.import({
        development: 'bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.css',
        production:  'bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
    });

    // Bootstrap Select
    app.import({
        development: 'bower_components/bootstrap-select/dist/css/bootstrap-select.css',
        production:  'bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
    });

    /*
     *  Import JS for theme
     */

    // Bootstrap
    app.import({
        development: 'bower_components/bootstrap/dist/js/bootstrap.js',
        production:  'bower_components/bootstrap/dist/js/bootstrap.min.js',
    });

    // jQuery
    app.import({
        development: 'bower_components/jquery/dist/jquery.js',
        production:  'bower_components/jquery/dist/jquery.min.js',
    });

    // Metis Menu
    app.import({
        development: 'bower_components/metisMenu/dist/metisMenu.js',
        production:  'bower_components/metisMenu/dist/metisMenu.min.js',
    });

    // Highchart
    app.import({
        development: 'bower_components/highcharts/highcharts.src.js',
        production:  'bower_components/highcharts/highcharts.js',
    });

    // Highstock
    // app.import({
    //     development: 'bower_components/highstock/highstock.src.js',
    //     production:  'bower_components/highstock/highstock.js',
    // });

    // Datatables jQuery
    app.import({
        development: 'bower_components/datatables/media/js/jquery.dataTables.js',
        production:  'bower_components/datatables/media/js/jquery.dataTables.min.js'
    });

    // Datatables.js
    app.import({
        development: 'bower_components/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.js',
        production:  'bower_components/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.min.js'
    });

    app.import('bower_components/datatables-plugins/sorting/datetime-moment.js');

    // Bootstrap Template
    app.import('bower_components/startbootstrap-sb-admin-2/dist/js/sb-admin-2.js');

    // CrpytoJS Sha3 Lib
    app.import('bower_components/cryptojslib/rollups/sha3.js');

    // Language of Datepicker
    app.import('bower_components/bootstrap-datepicker/dist/locales/bootstrap-datepicker.de.min.js');

    // Big.js
    app.import({
        development: 'bower_components/big.js/big.js',
        production:  'bower_components/big.js/big.min.js',
    });

    // Decimal.js
    app.import({
        development: 'bower_components/decimal.js/decimal.js',
        production:  'bower_components/decimal.js/decimal.min.js',
    });

    // Bootstrap datepicker
    app.import({
        development: 'bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
        production:  'bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
    });

    // Bootstrap Select
    app.import({
        development: 'bower_components/bootstrap-select/dist/js/bootstrap-select.js',
        production:  'bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
    });

    return app.toTree();
};