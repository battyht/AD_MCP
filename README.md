# MCP (Microservice Control Panel)

## 项目概述

MCP是一个集成巨量API并对外提供服务的平台。该项目旨在简化API的管理、监控和使用，为开发人员和业务提供一站式服务解决方案。特别适合引流电商业务场景。

## 主要功能

- **巨量引擎API集成**：集成巨量引擎广告平台的API，提供统一访问接口
- **广告账户管理**：查询广告账户信息、获取账户列表
- **广告数据报表**：支持多维度数据查询，包括广告主报表、小时报表和自定义报表
- **项目和广告管理**：获取项目列表和广告列表，支持多种过滤条件
- **灵活的认证机制**：Access-Token管理，支持按广告账户设置和管理Token
- **完善的API文档**：详细的接口说明、参数定义和使用示例
- **错误处理和日志**：提供错误码和详细日志，方便调试和问题定位

## 集成API

### 已计划集成的API

1. **巨量引擎开放平台**
   - 广告账户服务API - [文档链接](https://open.oceanengine.com/labels/7/docs/1696710550620160)
   - 主要功能：查询广告账户信息、获取账户列表、获取广告性能数据等
   - 已实现接口：
     - `GET /api/oceanengine/ad-accounts/{account_id}` - 获取广告账户详情
     - `GET /api/oceanengine/ad-accounts` - 获取广告账户列表
     - `GET /api/oceanengine/ad-accounts/{account_id}/performance` - 获取广告关键指标(展示、点击、转化、消耗等)
     - `GET /api/oceanengine/ad-accounts/{account_id}/hourly-report` - 获取广告主按小时统计的报表数据
     - `POST /api/oceanengine/ad-accounts/{account_id}/custom-report` - 获取自定义报表
     - `GET /api/oceanengine/ad-accounts/{account_id}/report/advertiser` - 获取广告主报表
     - `GET /api/oceanengine/ad-accounts/{account_id}/projects` - 获取项目列表
     - `GET /api/oceanengine/ad-accounts/{account_id}/promotions` - 获取广告列表
     - `POST /api/ad-accounts/{account_id}/token` - 设置账户的Access-Token
     - `GET /api/ad-accounts/{account_id}/token` - 检查账户的Access-Token状态
     - `DELETE /api/ad-accounts/{account_id}/token` - 删除账户的Access-Token

## 技术栈

- 后端：Node.js/Express
- API调用：Axios
- 容器化：Docker
- API网关：Kong/Nginx

## 项目结构

```
/
├── app/                 # 应用主目录
│   ├── controllers/     # 控制器
│   ├── models/          # 数据模型
│   ├── services/        # 服务
│   ├── routes/          # 路由
│   └── utils/           # 工具函数
├── config/              # 配置文件
├── docs/                # 文档
├── scripts/             # 部署和维护脚本
├── tests/               # 测试文件
└── docker/              # Docker相关文件
```

## 开发与部署

### 环境要求

- Node.js 16+
- Docker (用于容器化部署)

### 环境变量配置

在项目根目录创建一个 `.env` 文件，可参考 `.env.example`：

```bash
# 服务器配置
PORT=3000
NODE_ENV=development

# 巨量引擎API Token
OCEANENGINE_ACCESS_TOKEN=your_access_token_here

# 日志级别
LOG_LEVEL=debug
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 测试

```bash
# 运行单元测试
npm test
```

### 生产部署

```bash
# 构建Docker镜像
docker build -t mcp-server .

# 运行容器
docker run -d -p 3000:3000 --env-file .env --name mcp-api mcp-server
```

## API文档

API文档请参考 [docs/api.md](docs/api.md)

## 引流电商应用场景

本项目特别适合引流电商业务场景，提供了以下功能：

1. 获取广告账户基本信息：包括账户ID、名称、状态、余额等
2. 批量获取账户列表：用于管理多个广告账户
3. 获取广告关键指标：包括展示量、点击量、转化量、点击率、转化率等，帮助引流电商评估广告效果
4. 获取广告主小时报表：按小时查看广告表现，及时调整策略
5. 自定义报表：根据需求定制报表，支持多维度分析

## 路线图

- [x] 项目初始化
- [x] 基础框架搭建
- [x] API管理实现
  - [x] 巨量引擎广告账户服务API集成
    - [x] 获取账户信息接口
    - [x] 获取账户列表接口
    - [x] 获取广告关键指标接口
    - [x] 获取广告主小时报表接口
    - [x] 获取自定义报表接口
    - [x] 获取广告主报表接口
    - [x] 获取项目列表接口
    - [x] 获取广告列表接口
- [x] 认证管理
  - [x] Access-Token 管理接口
  - [ ] 用户认证与授权
- [ ] 服务监控模块
- [ ] 高级特性
  - [ ] 缓存机制
  - [ ] 请求限流
  - [ ] 错误重试
- [ ] 单元测试覆盖
- [x] 完整API文档

## 贡献指南

1. Fork 该仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request 