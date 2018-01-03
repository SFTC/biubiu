var inquirer = require('inquirer')
var Metalsmith = require('metalsmith')
var async = require('async')

var ask = function (prompts) {
  return function (files, metalsmith, callback){
    var metadata = metalsmith.metadata();
  
    async.eachSeries(prompts, run, callback);
  
    function run(item, callback){
      inquirer.prompt([{
        type: item.type,
        message: item.message,
        name: 'ok'
      }]).then(answers => {
        if (answers.ok) {
          metadata[item.key] = answers.ok;
          callback();
        }
      })
    }
  }
}

module.exports = ask;
