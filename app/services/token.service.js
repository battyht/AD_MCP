const logger = require('../utils/logger');

// 存储不同账户的token
const tokenStore = new Map();

/**
 * 设置账户的访问令牌
 * @param {string} accountId - 广告账户ID
 * @param {string} token - 访问令牌
 * @returns {boolean} 设置是否成功
 */
exports.setAccessToken = (accountId, token) => {
  if (!accountId || !token) {
    logger.error('账户ID和token都不能为空');
    return false;
  }
  
  try {
    tokenStore.set(accountId, token);
    logger.info(`已设置账户 ${accountId} 的访问令牌`);
    return true;
  } catch (error) {
    logger.error(`设置访问令牌出错: ${error.message}`);
    return false;
  }
};

/**
 * 获取账户的访问令牌
 * @param {string} accountId - 广告账户ID
 * @returns {string|null} 访问令牌，如果不存在则返回null
 */
exports.getAccessToken = (accountId) => {
  if (!accountId) {
    logger.error('账户ID不能为空');
    return null;
  }
  
  const token = tokenStore.get(accountId);
  
  if (!token) {
    logger.error(`未找到账户 ${accountId} 的访问令牌`);
    return null;
  }
  
  return token;
};

/**
 * 删除账户的访问令牌
 * @param {string} accountId - 广告账户ID
 * @returns {boolean} 删除是否成功
 */
exports.deleteAccessToken = (accountId) => {
  if (!accountId) {
    logger.error('账户ID不能为空');
    return false;
  }
  
  try {
    const result = tokenStore.delete(accountId);
    if (result) {
      logger.info(`已删除账户 ${accountId} 的访问令牌`);
    } else {
      logger.warn(`账户 ${accountId} 没有存储的访问令牌`);
    }
    return result;
  } catch (error) {
    logger.error(`删除访问令牌出错: ${error.message}`);
    return false;
  }
};

/**
 * 检查账户是否已设置访问令牌
 * @param {string} accountId - 广告账户ID
 * @returns {boolean} 是否已设置访问令牌
 */
exports.hasAccessToken = (accountId) => {
  if (!accountId) {
    return false;
  }
  
  return tokenStore.has(accountId);
}; 