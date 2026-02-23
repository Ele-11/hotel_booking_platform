const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// 找到项目根目录 (Monorepo Root)
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. 监控所有工作区文件的变化
config.watchFolders = [workspaceRoot];

// 2. 强制 Metro 优先在当前项目的 node_modules 中查找依赖
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. 解决 pnpm 软链接导致读取目录报错的问题
config.resolver.disableHierarchicalLookup = true;

module.exports = config;