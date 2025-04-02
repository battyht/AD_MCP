const logger = require('./logger');

/**
 * 从环境变量获取巨量引擎API的访问令牌
 * @returns {string} 访问令牌
 */
exports.getAccessToken = () => {
  const accessToken = process.env.OCEANENGINE_ACCESS_TOKEN;
  
  if (!accessToken) {
    logger.error('未找到巨量引擎访问令牌，请检查环境变量设置');
    throw new Error('未找到巨量引擎访问令牌，请检查环境变量设置');
  }
  
  return accessToken;
};

/**
 * 获取相对于今天的日期字符串，格式为YYYY-MM-DD
 * @param {number} days - 相对于今天的天数，正数表示未来，负数表示过去
 * @returns {string} 日期字符串
 */
exports.getDateString = (days = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}; 