const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./app/utils/logger');
const oceanengineRoutes = require('./app/routes/oceanengine.routes');
const tokenRoutes = require('./app/routes/token.routes');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// 路由
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Service is running'
  });
});

// 巨量引擎API路由
app.use('/api/oceanengine', oceanengineRoutes);

// Token管理路由
app.use('/api', tokenRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({
    status: 'error',
    message: err.message
  });
});

// 启动服务器
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app; // 导出应用实例供测试使用 