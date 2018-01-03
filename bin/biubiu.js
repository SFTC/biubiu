#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')
const commander = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')

const config = require('../util/config').getConfig()
const moduleModeConfig = config.getBasicConfig('module')

const runGenerateModule = require('../lib/module')
const runGeneratePage = require('../lib/page')

commander
  .version('0.1.0')
  .option('-h, --help', 'show help')
  .option('-m, --module [value]', 'generate a new module')
  .option('-p, --page [value]', 'generate a new page')
  .parse(process.argv);

commander.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new module'))
  console.log('    $ npm run init -m moduleName')
  console.log()
  console.log(chalk.gray('    # create a new page'))
  console.log('    $ npm run init -p moduleName')
  console.log()
})

if (commander.module && !commander.page) {
  generateModule(commander.module)
} else if (commander.page) {
  if (commander.module) {
    generatePage(commander.module, commander.page)
  } else {
    inquirer.prompt([{
      type: 'input',
      message: 'Please enter the parent module name: ',
      name: 'ok'
    }]).then(answers => {
      if (answers.ok) {
        generatePage(answers.ok, commander.page)
      }
    })
  }
}

function generateModule(moduleName) {
  const to = path.join(moduleModeConfig.destBasePath, moduleName.toLowerCase());

  if (fs.existsSync(to)) {
    inquirer.prompt([{
      type: 'confirm',
      message: 'Target directory exists. Continue?',
      name: 'ok'
    }]).then(answers => {
      if (answers.ok) {
        runGenerateModule(moduleName)
      }
    })
  } else {
    runGenerateModule(moduleName)
  }
}

function generatePage(moduleName, pageName) {
  const to = path.join(moduleModeConfig.destBasePath, moduleName.toLowerCase());

  if (!fs.existsSync(to)) {
    console.log('Can not find this module!')
    console.log()
  } else {
    runGeneratePage(moduleName, pageName)
  }
}