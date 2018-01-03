var path = require('path')
var fs = require('fs')
var chalk = require('chalk')
var inquirer = require('inquirer')
var Metalsmith = require('metalsmith')
var async = require('async')
var consolidate = require('consolidate')

var ask = require('../util/ask')
var config = require('../util/config').getConfig()
var moduleModeConfig = config.getBasicConfig('module')
var updateAttachedContent = require('./updateAttachedContent')
var fileName = require('../util/fileName')

function run (moduleName) {
  var to = path.join(moduleModeConfig.destBasePath, fileName.getFullLower(moduleName));

  var metalsmith = Metalsmith(moduleModeConfig.templatePath)
  var metadata = metalsmith.metadata()
  metadata.moduleNameUpper = fileName.getHeadUpper(moduleName);
  metadata.moduleNameLower = fileName.getHeadLower(moduleName);
  var examplePageName = moduleModeConfig.templatePageName;
  metadata.pageNameUpper = fileName.getHeadUpper(examplePageName);
  metadata.pageNameLower = fileName.getHeadLower(examplePageName);
  metadata.route = fileName.getFullLower(moduleName);
  
  var prompts = [{
    key: 'moduleNavChineseName',
    type: 'input',
    message: 'Plesae enter module Chinese name for the navigation：',
  }]

  metalsmith.clean(true)
    .use(ask(prompts))
    .use(filter)
    .use(updateFileName)
    .use(updateContent)
    .source('.')
    .destination(to)
    .build((err, files) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Finish copy')
        updateAttachedContent('module', metadata)
      }
    })
}

function filter(files, metalsmith, callback) {
  var filter = ['.DS_Store', 'pages/.DS_Store'];
  delete files[filter[0]];
  delete files[filter[1]];
  callback()
}

function updateFileName (files, metalsmith, callback) {
  const keys = Object.keys(files)
  const metadata = metalsmith.metadata()

  const newFileName = metadata.moduleNameUpper + '.vue';
  const oldFileName = moduleModeConfig.templateModuleName + '.vue';

  files[newFileName] = {};
  files[newFileName].contents = files[oldFileName].contents.toString();
  delete files[oldFileName];
  callback()
}

function updateContent(files, metalsmith, callback){
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();

  async.each(keys, run, callback);

  function run(file, callback){
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
