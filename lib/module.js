var path = require('path')
var fs = require('fs')
var chalk = require('chalk')
var inquirer = require('inquirer')
var Metalsmith = require('metalsmith')
var async = require('async')
var consolidate = require('consolidate')

var ask = require('../util/ask')
var config = require('./init.conf')
var moduleModeConfig = config.getBasicConfig('module')
var updateAttachedContent = require('./updateAttachedContent')

function run (moduleName) {
  var to = path.join(moduleModeConfig.destBasePath, moduleName.toLocaleLowerCase());
  var metalsmith = Metalsmith(moduleModeConfig.templatePath)
  var metadata = metalsmith.metadata()
  metadata.moduleNameUpper = moduleName.substring(0, 1).toUpperCase() + moduleName.substring(1);
  metadata.moduleNameLower = moduleName.substring(0, 1).toLowerCase() + moduleName.substring(1);
  var examplePageName = moduleModeConfig.templatePageName;
  metadata.pageNameUpper = examplePageName.substring(0, 1).toUpperCase() + examplePageName.substring(1);
  metadata.pageNameLower = examplePageName.substring(0, 1).toLowerCase() + examplePageName.substring(1);
  metadata.route = moduleName.toLowerCase();
  
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
