var path = require('path')
var inquirer = require('inquirer')
var Metalsmith = require('metalsmith')
var async = require('async')
var consolidate = require('consolidate')

var ask = require('../util/ask')
var config = require('../util/config').getConfig()

var pageModeConfig = config.getBasicConfig('page')
var updateAttachedContent = require('./updateAttachedContent')
var fileName = require('../util/fileName')

function run (moduleName, pageName) {
  var to = path.join(pageModeConfig.destBasePath, fileName.getFullLower(moduleName));
  var metalsmith = Metalsmith(pageModeConfig.templatePath)

  var metadata = metalsmith.metadata()
  metadata.moduleName = fileName.getFullLower(moduleName);
  metadata.pageNameUpper = fileName.getHeadUpper(pageName);
  metadata.pageNameLower = fileName.getHeadLower(pageName);
  metadata.route = fileName.getFullLower(pageName);

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
  const templatePageName = pageModeConfig.templatePageName
  const reg = new RegExp(templatePageName, 'i');
  const metadata = metalsmith.metadata();
  async.each(keys, run, callback);

  function run(file, callback) {
    // ['pages/CommonExample.vue', 'pages/commonExample', 'store/modules/commonExample.js']
    if (file.match(reg)) {
      let newFileName = '';
      newFileName = file.replace(fileName.getHeadUpper(templatePageName), metadata.pageNameUpper);
      newFileName = newFileName.replace(fileName.getHeadLower(templatePageName), metadata.pageNameLower);
      files[newFileName] = {};
      files[newFileName].contents = files[file].contents.toString();
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
