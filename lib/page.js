var path = require('path')
var inquirer = require('inquirer')
var Metalsmith = require('metalsmith')
var async = require('async')
var consolidate = require('consolidate')
var utils = require('./utils')

var config = require('./init.conf')
var pageModeConfig = config.getBasicConfig('page')

var updateAttachedContent = require('./updateAttachedContent')
var ask = utils.ask;

function run (moduleName, pageName) {
  var to = path.join(pageModeConfig.destBasePath, moduleName.toLowerCase());
  var metalsmith = Metalsmith(pageModeConfig.templatePath)

  var metadata = metalsmith.metadata()
  metadata.moduleName = moduleName.toLowerCase();
  metadata.pageNameUpper = pageName.substring(0, 1).toUpperCase() + pageName.substring(1);
  metadata.pageNameLower = pageName.substring(0, 1).toLowerCase() + pageName.substring(1);
  metadata.route = pageName.toLowerCase();

  var prompts = [{
    key: 'pageNavChineseName',
    type: 'input',
    message: 'Plesae enter page Chinese name for the navigation：',
  }]

  metalsmith.clean(false)
    .use(ask(prompts))
    .use(filterAndReplace)
    .use(updateContent)
    .source('.')
    .destination(to)
    .build((err, files) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Finish copy')
        updateAttachedContent('page', metadata)
      }
    })
}

function filterAndReplace(files, metalsmith, callback) {
  const keys = Object.keys(files)
  const keeps = ['pages/CommonExample.vue', 'pages/commonExample', 'store/modules/commonExample.js'];
  const metadata = metalsmith.metadata();
  async.each(keys, run, callback);
  
  function run(file, callback) {
    for (var i = 0; i < keeps.length; i++) {
      if (file.indexOf(keeps[i]) !== -1) {
        let newFileName = '';
        if (file.match('CommonExample')) {
          newFileName = file.replace('CommonExample', metadata.pageNameUpper);
        } else {
          newFileName = file.replace('commonExample', metadata.pageNameLower);
        }
        files[newFileName] = {};
        files[newFileName].contents = files[file].contents.toString();
        break;
      }
    }
    delete files[file];
    callback();
  }
}

function updateContent(files, metalsmith, callback){
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();
  async.each(keys, run, callback);

  function run(file, callback) {
    var str = files[file].contents.toString();
    consolidate.handlebars.render(str, metadata, function(err, res){
      if (err) {
        console.log('wrong', file, err);
        return callback(err);
      }
      console.log('success', file);
      files[file].contents = new Buffer(res);
      callback();
    });
  }
}

module.exports = run;
