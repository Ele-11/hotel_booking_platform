## 项目架构亮点：

项目是基于 

前端：React 18 + React Native + TypeScript + Axios + React Router + Redux Toolkit 

后端：Nest.js + TypeScript + Prisma + PostgreSQL 

架构：整体采用 Monorepo + pnpm + Workspace 架构的全栈应用。

本项目的架构以 TypeScript 全栈 为核心，利用 Monorepo + pnpm Workspace 实现代码的高效复用、依赖的精准管理和开发体验的一致性。对于前后端分离的全栈项目，此套架构的核心价值在于：**通过代码物理上的集中，换来了开发体验、协作效率、代码质量和一致性上的巨大提升。**

下面我们将从**技术选型、架构设计以及架构优点**三个方面进行阐述。

1. #### 技术栈概览

前端：

- React 18 与 React Native 共用一套 TypeScript 代码基础，实现跨平台（Web、Android）开发。
- 状态管理采用 Redux Toolkit（RTK），简化了 Redux 样板代码，开发体验良好。
- 路由使用 React Router v6，支持嵌套路由与数据加载。
- 网络请求使用 Axios，并基于 Axios 统一封装请求拦截、响应处理和错误处理。

后端：

- 基于 Nest.js 框架，模块化架构清晰，可扩展性强。
- 使用 TypeScript 全栈类型安全，前后端共享类型定义。
- ORM 选用 Prisma，支持 PostgreSQL，通过 Prisma Client 提供类型安全的数据库操作，并借助 Migrate 管理数据库版本。

1. #### Monorepo 架构设计

采用 Monorepo 模式将所有前后端代码、共享库、工具脚本统一存放在一个 Git 仓库中，并使用 pnpm Workspace 管理多包依赖。项目结构大致如下：

```Plain
hotel-booking-platform/
├── .vscode/                    # VSCode工作区配置
├── apps/
│   ├── web/                   # PC端商户管理平台
│   │   ├── src/
│   │   │   ├── api/          # API调用封装
│   │   │   ├── assets/       # 静态资源
│   │   │   ├── components/   # 公共组件
│   │   │   │   ├── common/   # 通用组件
│   │   │   │   ├── layout/   # 布局组件
│   │   │   │   └── ui/       # UI基础组件
│   │   │   ├── features/     # 功能模块（按业务划分）
│   │   │   │   ├── auth/     # 认证模块
│   │   │   │   ├── hotel-management/
│   │   │   │   └── review/
│   │   │   ├── hooks/        # 自定义hooks
│   │   │   ├── pages/        # 页面组件
│   │   │   ├── store/        # Redux状态管理
│   │   │   │   ├── slices/   # Redux切片
│   │   │   │   └── index.ts  # 统一导出
│   │   │   ├── types/        # TypeScript类型定义
│   │   │   ├── utils/        # 工具函数  
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts    # 或vite配置
│   │
│   ├── mobile/                # 移动端用户预订平台
│   │   ├── src/
│   │   │   ├── navigation/   # React Navigation配置
│   │   │   ├── screens/      # 屏幕组件
│   │   │   ├── components/   # 移动端专用组件
│   │   │   ├── services/     # API服务
│   │   │   ├── store/        # Redux状态
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   └── app.json
│   │
│   └── server/               # 后端NestJS服务
│       ├── src/
│       │   ├── common/       # 通用模块
│       │   ├── config/       # 配置文件
│       │   ├── modules/      # 业务模块
│       │   │   ├── auth/     # 认证模块   里面每一个具体的模块就是 写 Controller Servers DAO这种
│       │   │   ├── hotels/   # 酒店模块
│       │   │   ├── bookings/ # 预订模块
│       │   │   └── users/    # 用户模块
│       │   ├── prisma/       # Prisma配置
│       │   ├── shared/       # 共享代码
│       │   └── main.ts
│       ├── prisma/
│       │   ├── schema.prisma # Prisma Schema
│       │   └── migrations/   # 数据库迁移   这个就是刚开始配置的时候比较麻烦  之后用起来就很好用
│       ├── package.json
│       └── nest-cli.json
│
├── packages/                 # 共享包
│   ├── shared-types/        # 共享TypeScript类型
│   │   ├── src/
│   │   │   ├── api/         # API接口类型
│   │   │   ├── domain/      # 领域模型
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared-utils/        # 共享工具函数
│   │   ├── src/
│   │   │   ├── validation/  # 验证工具
│   │   │   ├── formatting/  # 格式化工具
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── eslint-config/       # 共享ESLint配置
│       └── package.json
│
├── package.json             # 根package.json
├── pnpm-workspace.yaml      # pnpm workspace配置
├── .eslintrc.js            # ESLint配置
├── .prettierrc             # Prettier配置
├── tsconfig.json           # TypeScript基础配置
├── tsconfig.base.json      # 共享TypeScript配置
└── README.md
```

1. #### 架构优点与特色

- 全栈 TypeScript 类型安全：前后端共用 `shared` 包中的接口定义，确保数据结构一致，开发阶段即可发现类型错误。
- 代码高效复用：公共工具、组件、配置统一放在 `shared` 和 `config` 包中，Web 与 Mobile 共享，维护成本低，修改后热更新。
- 依赖管理高效：pnpm 全局存储 + 硬链接节省磁盘，严格依赖结构避免幽灵依赖，Workspace 批量操作提升构建速度。
- 开发体验一致：前后端均采用模块化架构、相同工具链，通过 `shared` 类型实现并行开发，联调顺畅。

## 协同分工与Git相关：

#### 成员分工：

- **组长：DengXiangYu：**

负责**Mobile端预订平台（用户侧）开发**及**整体架构设计**。基于业务需求与技术栈，设计**前后端分离 + Monorepo**全栈架构，选用 React 18、React Native、Nest.js、Prisma 等技术，决策采用 **pnpm Workspace** 实现多包管理，确保项目可扩展、易维护。从零搭建 Monorepo 仓库，划分 mobile、web、server 等模块，统一 TypeScript、ESLint、Prettier 工具链，保证代码风格一致。编写**开发规范（Git 分支、提交规范、命名约定）、接口定义及环境搭建手册,** 提升团队协作效率。

**开发手册链接：**

[NewCode队 组队开发手册](https://my.feishu.cn/docx/VeDediFTUoQ1N2xhrHKcFv4QnQh?from=from_copylink)

- **组员:  ZhangYuXin** ：

负责Web端管理平台（商家端） 的完整设计与实现，涵盖商户角色的酒店信息录入、编辑、修改以及相关的用户认证模块。基于React在Monorepo架构下完成了所有商家端页面的开发，并与后端紧密协作，确保了数据的实时性与一致性。

- **组员:  ZhangYang****：**

负责**Server端** 和 **数据库设计**。使用 **PostgreSQL** 作为主数据库，通过 **Prisma ORM** 进行数据访问，设计了完整的酒店预订平台数据模型，包括**用户系统（User）、酒店信息（Hotel）、房型管理（RoomType）**等8项核心实体。后端功能实现了**用户认证与授权、酒店管理系统、预订管理系统、支付集成、广告管理系统**等项目所需功能。实现了软删除机制保护数据，优化数据库索引提升查询性能，响应式设计支持高并发访问。

#### Git相关：

采用Git Flow的简化版，主要分支：

- `main`：主分支，用于生产环境
- `develop`：开发分支，用于集成测试
- `feature/*`：功能分支，从develop分支创建，合并回develop

## 完整项目一键启动：

```Python
# 1. 安装所有依赖
pnpm install:all

# 2. 启动所有服务（并行）
pnpm dev

# 或者分别启动
pnpm dev:web      # 启动Web前端
pnpm dev:server   # 启动后端API
pnpm dev:mobile   # 启动移动端
```

## 移动端亮点：

#### 酒店首页：

顶部 Banner: 酒店的广告,点击后直接跳转该酒店的详情页，**实现了轮播图的效果，5张广告图片。**

并都支持并完成了 要求的内容 和 功能

##### **日历组件亮点**

这个自定义日历组件基于 `react-native-calendars` 开发，主要用于酒店预订中的 **入住-离店日期选择** 。

- 实现了标准的入住离店交互，支持自动计算晚数，数据返回格式包含日期 和 晚数，便于上层直接使用。
- 完全替换了默认日历头部：显示中文星期、当前年月，并添加左右箭头切换月份，更符合国内用户习惯。
- 点击结束日期后，延迟 300ms 再确认，让用户能短暂看到选中的范围，提升操作确认感。
- 使用 `useMemo` 缓存 `markedDates` 计算，避免每次渲染都重新生成区间标记对象。
- 所有回调函数（如日期点击、月份切换）均用 `useCallback` 包裹，减少子组件（如 `dayComponent`）的不必要重绘。
- 限制可选日期范围：从今天起至一年后，避免选择过去日期或过远日期。
- 基于 `Modal` 封装，可独立控制显示隐藏，与业务解耦，即插即用。

#### 酒店列表页：

完成了 要求的内容 和 功能

##### 上滑自动加载功能亮点

1. 利用 `FlatList` 的 `onEndReached` 结合自定义的分页逻辑（`page`、`hasMore`、`loading` 状态），当用户滑动到底部时自动触发下一页数据请求，避免一次性加载全部数据，显著提升列表性能并节省流量。
2. 通过 `hasMore` 和 `loading` 双重判断，在数据加载完成前阻止额外请求，防止并发重复调用，同时确保已无更多数据时不再触发无效请求。
3. 底部添加了 `ListFooterComponent`，在加载更多时显示 `ActivityIndicator` 加载指示器，让用户明确知道正在获取数据；加载完成后自动隐藏，交互反馈及时。
4. 使用 `useCallback` 缓存加载函数，避免因父组件渲染导致 FlatList 的 `onEndReached` 被重复创建。

#### 酒店详情页：

完成了 要求的内容 和 功能

##### 用户体验、性能优化亮点

1.  沉浸式滚动动画导航，利用 `Animated` 实现导航栏背景透明度、标题可见性及返回按钮颜色的平滑渐变，滚动时动态变化，既保留了顶部功能入口，又增强了页面沉浸感。
2. 优雅的图片轮播与指示器，采用 `FlatList` 实现横向滑动浏览酒店大图，配合 `pagingEnabled` 和自定义 `onScroll` 计算当前索引，动态更新圆点指示器。
3. 房型数据使用 `useMemo` 复用，避免组件重复渲染时的无用计算，逻辑清晰。
4. 日历组件的无缝集成，复用自定义的 `Calendar_My` 日历组件，实现入住离店日期选择，日期状态（`dateInfo`）集中管理，修改日期后实时更新页面显示的“入住-离店-晚数”。

## web端亮点： 

#### 酒店信息录入/编辑/修改页面

1. 动态表单字段管理
   1. 房型数量不固定，采用动态表单数组（基于React Hook Field Array或自定义状态）实现房型的增删改。
   2. 使用Redux Toolkit的`createEntityAdapter`管理房型列表，通过`ids`和`entities`结构优化更新性能，避免全量重绘。
   3. 每个房型支持图片上传、价格、库存等字段，且可独立展开/折叠，提升长表单的操作体验。
2. 实时保存与草稿机制
   1. 利用防抖（`lodash/debounce`）结合Redux的本地存储中间件，在用户填写过程中自动保存草稿至`localStorage`或IndexedDB。
   2. 页面刷新或意外关闭后，重新进入编辑页可自动恢复未提交内容，防止数据丢失，大幅提升编辑体验。
   3. 支持“保存草稿”与“提交审核”分离，草稿状态在列表中特殊标记。
3. 图片上传优化
   1. 对接后端对象存储服务（如OSS），实现多图预览、上传进度条、图片顺序拖拽调整。
   2. 采用异步任务队列控制并发上传数量（默认3个），避免瞬间过多请求阻塞主线程。
   3. 图片压缩：前端使用`canvas`对过大的图片进行压缩后再上传，减少带宽消耗。
4. 表单验证与类型安全
   1. 使用Zod定义与后端共享的表单验证规则（与Prisma模型字段约束对齐），客户端提交前实时校验并给出明确错误提示。
   2. 验证规则通过Monorepo的共享包导出，保证前后端校验逻辑完全一致，杜绝因校验差异导致的数据错误。

#### 酒店信息审核/发布/下线列表页面

1. 软删除与状态管理
   1. 下线操作并非物理删除，仅将数据库`status`字段标记为`offline`（可恢复），列表页默认隐藏下线酒店，管理员可通过筛选“已下线”查看并恢复。
   2. 状态流转清晰：待审核、审核通过、审核不通过（含原因）、已下线，每种状态在列表中以不同颜色的标签展示。
2. 列表性能优化
   1. 针对可能的大量酒店数据，采用虚拟滚动（`react-window`）搭配无限加载，仅渲染可视区域数据，保持页面流畅。
   2. 请求分页参数与后端配合（`page`、`pageSize`），通过`hasMore`字段控制加载更多按钮的显示，避免一次性加载全部记录。
3. 操作反馈与乐观更新
   1. 执行审核、发布、下线操作时，采用乐观更新策略：先更新本地Redux列表状态，同时发送API请求；若失败则回滚状态并弹出错误提示，让用户感知即时响应。
   2. 审核不通过时，弹出对话框要求填写原因，原因会显示在酒店详情中。
4. 多维度筛选与URL状态同步
   1. 支持按酒店星级、审核状态、开业时间范围等多条件组合筛选，所有筛选条件同步至URL query参数，刷新页面后自动还原筛选结果，便于分享与书签。

#### 登录/注册与权限控制

1. 角色识别与路由守卫
   1. 登录后后端返回角色（商户/管理员），前端动态生成可访问路由表，利用React Router v6的`loader`函数进行权限校验，未授权时跳转至403页面或重定向登录。
   2. 封装`ProtectedRoute`高阶组件，对特定路由进行权限拦截，同时支持角色粒度控制（如商户只能看到自己的酒店，管理员看到所有）。
2. JWT持久化与自动刷新
   1. 封装Axios拦截器，自动在请求头附加Token，并实现Token过期自动刷新机制：当接口返回401时，静默调用刷新Token接口，获取新Token后重试原请求，用户无感知。
   2. 刷新Token过程中，利用请求队列避免并发刷新。
3. 注册流程优化
   1. 注册时通过下拉选择角色，前端实时校验用户名唯一性（防抖请求，500ms延迟），减少提交失败率。
   2. 密码强度实时提示，符合安全规范。

#### 数据实时同步机制

1. WebSocket广播更新
   1. 商户保存酒店信息后，通过WebSocket向所有在线客户端广播“酒店数据变更”事件（包含酒店ID）。
   2. 用户端（移动端）监听事件后主动请求最新数据并更新Redux缓存，实现价格、房态实时同步，满足评分标准中“实时更新价格”的要求。
   3. WebSocket连接状态由Redux管理，断线自动重连，重连后自动重新订阅。

#### 类型安全与代码复用（Monorepo亮点）

1. 前后端类型共享
   1. 在Monorepo的`packages/shared`中导出Prisma生成的数据库模型类型（如`Hotel`、`RoomType`）及API请求/响应接口定义。
   2. 前端直接引用这些类型，彻底消除手动定义接口的冗余工作，保证字段一致性，同时利用TypeScript的提示提升开发效率。
2. 通用组件抽离
   1. 提取`HotelForm`（酒店表单）、`ImageUploader`（图片上传）、`StatusBadge`（状态标签）等通用组件至共享包，商户端与管理端（审核列表）复用，减少重复代码，便于统一维护和视觉迭代。
3. 编码规范与项目结构
   1. 遵循ESLint + Prettier统一代码风格，采用分层架构：页面层（`pages`）、组件层（`components`）、状态层（`store`）、API层（`services`），每个功能模块独立文件夹，清晰易扩展。
   2. 根目录提供详细README，包含环境配置、启动命令、API文档及项目结构说明，方便后续接手。

## 服务端亮点：

#### 架构设计与技术选型

- 模块化架构：采用 Nest.js 的模块化设计，将业务功能按领域划分（Auth、Hotels、Bookings、Banners、Users、Location），便于团队协作和后期维护。
- ORM 优化：基于 Prisma ORM 实现类型安全的数据库访问，通过自动生成的客户端减少手写 SQL，提高开发效率并降低错误率。
- 全局依赖注入：使用 `@Global()` 装饰器将 PrismaService 注册为全局服务，避免各模块重复导入，简化依赖管理。

#### 认证与安全机制

- JWT 双令牌策略：实现 access_token（短期）和 refresh_token（长期）双令牌机制，平衡安全性与用户体验，减少频繁登录。
- 多策略认证：集成 LocalStrategy（用户名密码）和 JwtStrategy（令牌验证），支持多种登录方式，扩展性强。
- 角色权限控制：基于 RBAC 模型，通过装饰器  (@UseGuards(AuthGuard('jwt'))  实现接口级权限控制，确保管理员、商户、客户各司其职。

#### API 设计与性能优化

- RESTful 规范：严格遵循 REST 设计原则，统一接口命名和响应格式，返回数据包含 `data` 和 `meta` 两部分，meta 提供分页信息，便于前端实现分页组件。
- 数据库查询优化：使用 `Promise.all` 并行执行数据查询和计数查询，减少数据库往返次数；合理设计索引（如 hotel 表的 status、deletedAt、city 等字段），提升查询效率；实现软删除机制（deletedAt 字段），保护历史数据。
- 分页加载机制：支持 page/limit 参数，结合 skip/take 实现 SQL 级别分页，避免全表扫描，支持大数据量场景。

#### 业务功能亮点

- 多条件动态筛选：酒店查询支持关键词、城市、星级、价格区间、入住离店日期、标签等多维度筛选，通过动态构建 where 条件实现灵活查询。
- 数据完整性保障：使用 TypeScript 类型系统确保数据结构一致性；DTO 验证（class-validator）确保输入数据合法性；数据库事务处理关键业务（如预订创建），保证数据一致性
