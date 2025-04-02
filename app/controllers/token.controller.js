const tokenService = require('../services/token.service');
const logger = require('../utils/logger');

/**
 * 设置访问令牌的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.setAccessToken = (req, res) => {
  try {
    const { account_id } = req.params;
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要的token字段'
      });
    }
    
    const result = tokenService.setAccessToken(account_id, token);
    
    if (result) {
      return res.status(200).json({
        status: 'success',
        message: '访问令牌设置成功'
      });
    } else {
      return res.status(500).json({
        status: 'error',
        message: '访问令牌设置失败'
      });
    }
  } catch (error) {
    logger.error(`设置访问令牌错误: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * 检查访问令牌的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.checkAccessToken = (req, res) => {
  try {
    const { account_id } = req.params;
    
    const hasToken = tokenService.hasAccessToken(account_id);
    
    return res.status(200).json({
      status: 'success',
      has_token: hasToken
    });
  } catch (error) {
    logger.error(`检查访问令牌错误: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * 删除访问令牌的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.deleteAccessToken = (req, res) => {
  try {
    const { account_id } = req.params;
    
    const result = tokenService.deleteAccessToken(account_id);
    
    if (result) {
      return res.status(200).json({
        status: 'success',
        message: '访问令牌删除成功'
      });
    } else {
      return res.status(404).json({
        status: 'error',
        message: '未找到该账户的访问令牌'
      });
    }
  } catch (error) {
    logger.error(`删除访问令牌错误: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 