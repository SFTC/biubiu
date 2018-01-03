var esprima = require('esprima');
var estraverse = require('estraverse')

var ObjItem = {
  createObjectExpression: function(content) {
    var ast = esprima.parseScript('var a = ' + content)
    var result = [];
    estraverse.traverse(ast, {
      enter: function (node, parent) {
        if (node.type == 'ObjectExpression' && parent) {
          if (parent.id && parent.id.name === 'a') {
            result = node.properties;
            estraverse.VisitorOption.Break;
          }
        }
      }
    });
    return result;
  },
  createArrayExpression: function(content) {
    var ast = esprima.parseScript('var a = ' + content)
    var result;
    estraverse.traverse(ast, {
      enter: function (node, parent) {
        if (node.type == 'ObjectExpression' && parent) {
          if (parent.id && parent.id.name === 'a') {
            result = node;
            estraverse.VisitorOption.Break;
          }
        }
      }
    });
    return result;
  },
  createImportDeclaration: function(content) {
    return esprima.parseModule(content);
  },
}

module.exports = ObjItem;
