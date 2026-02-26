### 安装所有依赖
```
# 安装根目录依赖
pnpm install

# 安装所有子项目依赖
pnpm install:all



### 全局安装 NestJS 命令行工具（CLI）

```
npm i -g  @nestjs/cli

nest --version
//命令检测NestJS 命令行工具是否安装成功
```



### 配置数据库

```
# 进入 server 目录
cd apps/server

# 复制环境变量
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
# 使用你喜欢的编辑器编辑 .env 文件

# 生成 Prisma 客户端
pnpm prisma:generate

# 运行数据库迁移（需要先启动 PostgreSQL 数据库）
pnpm prisma:migrate
```





### 启动开发环境

```
# 回到根目录
cd ../..

# 终端1：启动移动端
pnpm dev:mobile

# 终端2：启动后端
pnpm dev:server

# 终端3：启动 Web 前端
pnpm dev:web
```



我们不降级 Node.js 24。针对 Node.js 24 的 ESM 模块问题，我们来修复配置。问题在于 Node.js 24 默认使用 ES Modules，而 NestJS 默认使用 CommonJS。

对于 Node.js 24，最简化的方案是：

1. 使用 `"type": "module"` 在 package.json 中
2. 使用 `tsx` 作为 TypeScript 执行器    安装：pnpm add -D tsx

```
# 修改 package.json scripts
# 将 "dev": "nest start --watch" 改为：

 "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js"
  }
```


1. 配置 tsconfig.json 使用 `"module": "ESNext"`

这样既不需要降级 Node.js，也不需要复杂的配置。

**关键点**：

- Node.js 24 默认支持 ES Modules
- 使用 `tsx` 替代 `ts-node`（更好的 ESM 支持）
- 在 package.json 中明确指定 `"type": "module"`





web端为  http://localhost:5173/



服务端为

🚀 服务已启动: http://localhost:3001/api
📚 API文档: http://localhost:3001/api/docs



移动端为  http://localhost:19000/

› Metro waiting on exp://127.0.0.1:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu

› Press ? │ show all commands

Logs for your project will appear below.
