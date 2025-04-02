const oceanengineService = require('../services/oceanengine.service');
const logger = require('../utils/logger');

/**
 * 获取广告账户信息的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getAccountInfo = async (req, res) => {
  try {
    const { account_id } = req.params;
    
    // 从请求头获取Access-Token
    const accessToken = req.headers['access-token'];
    if (!accessToken) {
      return res.status(401).json({
        status: 'error',
        message: '缺少必要的Access-Token请求头'
      });
    }
    
    const result = await oceanengineService.getAccountInfo(account_id, accessToken);
    res.json(result);
  } catch (error) {
    logger.error(`获取账户信息错误: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * 获取账户列表的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getAccountList = async (req, res) => {
  try {
    // 从请求头获取Access-Token
    const accessToken = req.headers['access-token'];
    if (!accessToken) {
      return res.status(401).json({
        status: 'error',
        message: '缺少必要的Access-Token请求头'
      });
    }
    
    const options = {
      page: req.query.page || 1,
      page_size: req.query.page_size || 10,
      ...req.query
    };
    const result = await oceanengineService.getAccountList(options, accessToken);
    res.json(result);
  } catch (error) {
    logger.error(`获取账户列表错误: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * 获取广告性能数据的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getAdPerformance = async (req, res) => {
  try {
    const { account_id } = req.params;
    
    // 从请求头获取Access-Token
    const accessToken = req.headers['access-token'];
    if (!accessToken) {
      return res.status(401).json({
        status: 'error',
        message: '缺少必要的Access-Token请求头'
      });
    }
    
    const options = { ...req.query };
    const result = await oceanengineService.getAdPerformance(account_id, options, accessToken);
    res.json(result);
  } catch (error) {
    logger.error(`获取广告性能数据错误: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * 获取小时报表的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getHourlyReport = async (req, res) => {
  try {
    const { account_id } = req.params;
    
    // 从请求头获取Access-Token
    const accessToken = req.headers['access-token'];
    if (!accessToken) {
      return res.status(401).json({
        status: 'error',
        message: '缺少必要的Access-Token请求头'
      });
    }
    
    const options = { ...req.query };
    const result = await oceanengineService.getHourlyReport(account_id, options, accessToken);
    res.json(result);
  } catch (error) {
    logger.error(`获取小时报表错误: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * 获取自定义报表的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getCustomReport = async (req, res) => {
  try {
    const { account_id } = req.params;
    
    // 从请求头获取Access-Token
    const accessToken = req.headers['access-token'];
    if (!accessToken) {
      return res.status(401).json({
        status: 'error',
        message: '缺少必要的Access-Token请求头'
      });
    }
    
    const reportData = {
      advertiser_id: account_id,
      ...req.body
    };
    
    // 验证必要字段
    if (!reportData.metrics) {
      return res.status(400).json({
        status: 'error',
        message: '缺少必要的metrics字段'
      });
    }
    
    // 处理时间范围
    if (reportData.start_date && reportData.end_date) {
      // 确保时间格式正确
      const startDate = new Date(reportData.start_date);
      const endDate = new Date(reportData.end_date);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          status: 'error',
          message: '时间格式错误，应为YYYY-MM-DD格式'
        });
      }
      
      // 确保结束时间不早于开始时间
      if (endDate < startDate) {
        return res.status(400).json({
          status: 'error',
          message: '结束时间不能早于开始时间'
        });
      }
      
      // 确保时间跨度不超过30天
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (daysDiff > 30) {
        return res.status(400).json({
          status: 'error',
          message: '查询时间跨度不能超过30天'
        });
      }
    }
    
    // 处理分页参数
    if (reportData.page) reportData.page = parseInt(reportData.page);
    if (reportData.page_size) reportData.page_size = parseInt(reportData.page_size);
    
    // 验证分页参数
    if (reportData.page && (reportData.page < 1 || reportData.page > 99999)) {
      return res.status(400).json({
        status: 'error',
        message: '页码必须在1-99999之间'
      });
    }
    
    if (reportData.page_size && (reportData.page_size < 1 || reportData.page_size > 1000)) {
      return res.status(400).json({
        status: 'error',
        message: '每页数量必须在1-1000之间'
      });
    }
    
    logger.info(`Custom report request: ${JSON.stringify(reportData)}`);
    
    const result = await oceanengineService.getCustomReport(reportData, accessToken);
    res.json(result);
  } catch (error) {
    logger.error(`获取自定义报表错误: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * 获取项目列表的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getProjectList = async (req, res) => {
  try {
    const { account_id } = req.params;
    
    // 从请求头获取Access-Token
    const accessToken = req.headers['access-token'];
    if (!accessToken) {
      return res.status(401).json({
        status: 'error',
        message: '缺少必要的Access-Token请求头'
      });
    }
    
    const options = { ...req.query };
    
    // 如果传入了filtering参数，确保它是对象格式
    if (options.filtering && typeof options.filtering === 'string') {
      try {
        options.filtering = JSON.parse(options.filtering);
      } catch (error) {
        return res.status(400).json({
          status: 'error',
          message: 'filtering参数格式错误，应为JSON对象'
        });
      }
    }
    
    const result = await oceanengineService.getProjectList(account_id, options, accessToken);
    res.json(result);
  } catch (error) {
    logger.error(`获取项目列表错误: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * 获取广告列表的控制器
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getAdList = async (req, res) => {
  try {
    const { account_id } = req.params;
    
    // 从请求头获取Access-Token
    const accessToken = req.headers['access-token'];
    if (!accessToken) {
      return res.status(401).json({
        status: 'error',
        message: '缺少必要的Access-Token请求头'
      });
    }
    
    const options = { ...req.query };
    
    // 如果传入了filtering参数，确保它是对象格式
    if (options.filtering && typeof options.filtering === 'string') {
      try {
        options.filtering = JSON.parse(options.filtering);
      } catch (error) {
        return res.status(400).json({
          status: 'error',
          message: 'filtering参数格式错误，应为JSON对象'
        });
      }
    }
    
    // 处理分页参数
    if (options.page) options.page = parseInt(options.page);
    if (options.page_size) options.page_size = parseInt(options.page_size);
    if (options.cursor) options.cursor = parseInt(options.cursor);
    if (options.count) options.count = parseInt(options.count);
    
    const result = await oceanengineService.getAdList(account_id, options, accessToken);
    res.json(result);
  } catch (error) {
    logger.error(`获取广告列表错误: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 