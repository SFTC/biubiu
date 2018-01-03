var esprima = require('esprima');
var estraverse = require('estraverse')
var escodegen = require('escodegen')
var chalk = require('chalk')
var format = require("prettier-eslint");
var path = require('path')
var fs = require('fs')

var ObjItem = require('../util/astGenerate')
var config = require('../util/config').getConfig()

function updateContent(mode, data) {
  var insertArray = config.getUpdateData(mode, data)
  for (var i = 0; i < insertArray.length; i++) {
    var docPath = insertArray[i].path;
    if (!fs.existsSync(docPath)) {
      console.log(chalk.red('Can not find path: ' + docPath));
      console.log(chalk.red('更新失败', 'skiped'));
      continue;
    }
      
    var position = insertArray[i].position;

    var content  = fs.readFileSync(docPath, 'utf-8')
    var ast = esprima.parseModule(content)

    if (position.type === 'ArrayExpression') {
      var insertContent = ObjItem['create' + position.type](insertArray[i].content)
      estraverse.traverse(ast, {
        enter: function (node, parent) {
          if (node.type === position.type && parent && ((parent.id && parent.id.name === position.name) || (parent.key && parent.key.name === position.name))) {
            let searchArray = node.elements;
            if (position.flag) {
              searchArray = position.flag(node, parent);
            }
            searchArray.push(insertContent);
            return estraverse.VisitorOption.Break;
          }
        }
      });
    } else if (position.type === 'ObjectExpression') {
      var insertContent = ObjItem['create' + position.type](insertArray[i].content)
      estraverse.traverse(ast, {
        enter: function (node, parent) {
          if (node.type === position.type && parent && parent.key && parent.key.name === position.name) {
            if (node.properties) {
              node.properties = node.properties.concat(insertContent);
            }
            return estraverse.VisitorOption.Break;
          }
        }
      });
    } else if (position.type === 'ImportDeclaration') {
      var insertContent = ObjItem['create' + position.type](insertArray[i].content);
      var importCount = 0;
      estraverse.traverse(ast, {
        enter: function (node, parent) {
          if (node.type === position.type) {
            importCount++;
          }
          if (node.type !== position.type && parent && parent.body) {
            parent.body.splice(importCount, 0, insertContent);
            return estraverse.VisitorOption.Break;
          }
        }
      });
    } else if (position.type === 'Program') {
      var insertContent = ObjItem.createImportDeclaration(insertArray[i].content);
      estraverse.traverse(ast, {
        enter: function (node, parent) {
          if (node.type === position.type) {
           node.body = node.body.concat(insertContent);
           return estraverse.VisitorOption.Break;
          }
        }
      });
    }
    const result = escodegen.generate(ast)
    const options = {
      text: result
    };
    try {
      const formatted = format(options);
      fs.writeFileSync(docPath, formatted)
      console.log('更新成功', docPath)
  } catch (error) {
      console.log(chalk.red('更新失败，请手动更新', docPath));
    }
  }
}

module.exports = updateContent;
