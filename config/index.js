require('dotenv').config();

const config = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // 巨量引擎API配置
  oceanengine: {
    accessToken: process.env.OCEANENGINE_ACCESS_TOKEN,
    baseUrl: 'https://ad.oceanengine.com/open_api'
  },
  
  // 日志配置
  log: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'dev',
  }
};

module.exports = config; 