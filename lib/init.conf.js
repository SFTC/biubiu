var path = require('path')

var config = {};

var baseConfig = {
  module: {
    destBasePath: path.resolve(process.cwd(), 'src/pages'),
    templatePath: path.resolve(__dirname, '../template'),
    templateModuleName: 'DevExample',// 直接匹配末端路由
    templatePageName: 'CommonExample',
  },
  page: {
    destBasePath: path.resolve(process.cwd(), 'src/pages'),
    templatePath: path.resolve(__dirname, '../template'),
    templatePageName: 'CommonExample',
  },
}

config.getBasicConfig = function(mode) {
  return baseConfig[mode];
}

config.getUpdateData = function(mode, data) {
  if (mode === 'module') {
    return [{
      path: path.resolve(process.cwd(), 'build/webpack.base.conf.js'),
      position: {
        name: 'entry',
        type: 'ObjectExpression',
        only: true,
      },
      content: JSON.stringify({ [data.route]: './src/pages/' + data.route + '/index.js' }),
    }, {
      path: path.resolve(process.cwd(), 'src/common/menu.js'),
      position: {
        name: 'menu',
        type: 'ArrayExpression',
        only: true,
      },
      content: JSON.stringify({
        key: data.route,
        name: data.moduleNavChineseName,
        hash: false,
        icon: 'el-icon-cls-icon_anli',
        children: [{
          key: 'commonexample',
          name: '常用页面示例',
        }],
      }),
    }]
  }
  if (mode === 'page') {
    return [{
      path: path.resolve(process.cwd(), 'src/pages', data.moduleName, 'router/index.js'),
      position: {
        name: 'routes',
        type: 'ArrayExpression',
        only: true,
      },
      content: `{
        path: '/${data.route}',
        component: ${data.pageNameUpper},
      }`,
    }, {
      path: path.resolve(process.cwd(), 'src/pages', data.moduleName, 'router/index.js'),
      position: {
        type: 'ImportDeclaration',
      },
      content: `import ${data.pageNameUpper} from '../pages/${data.pageNameUpper}';`
      ,
    }, {
      path: path.resolve(process.cwd(), 'src/pages', data.moduleName, 'store/index.js'),
      position: {
        name: 'modules',
        type: 'ObjectExpression',
        only: true,
      },
      content: `{${data.pageNameLower}}`,
    }, {
      path: path.resolve(process.cwd(), 'src/pages', data.moduleName, 'store/index.js'),
      position: {
        type: 'ImportDeclaration',
      },
      content: `import ${data.pageNameLower} from './modules/${data.pageNameLower}';`,
    }, {
      path: path.resolve(process.cwd(), 'src/common/menu.js'),
      position: {
        name: 'menu',
        type: 'ArrayExpression',
        only: false,
        flag: function (key) {
          return function(node, parent) {
            if (node.elements) {
              for (let i = 0; i < node.elements.length; i++) {
                if (node.elements[i].properties && node.elements[i].properties[0].value && node.elements[i].properties[0].value.value === key) {
                  const props = node.elements[i].properties;
                  for (let j = 1; j < props.length; j ++) {
                    if (props[j].key && props[j].key.name === 'children' && props[j].value) {
                      return props[j].value.elements;
                    }
                  }
                }
              }
            }
            return [];
          }
        }(data.moduleName)
      },
      content: JSON.stringify({
        key: data.route,
        name: data.pageNavChineseName,
      }),
    }, {
      path: path.resolve(process.cwd(), 'src/pages', data.moduleName, 'api/index.js'),
      position: {
        type: 'Program',
      },
      content: "export const searchMainList = params => Vue.axios.get('/resource/organization/getlclist', { params }).then(res => res.data);export const createMain = params => Vue.axios.post('/resource/organization/getlclist', params).then(res => res.data);export const getMainById = params => Vue.axios.get('/resource/organization/getlclist', { params }).then(res => res.data);",
    }]
  }
}

module.exports = config;
