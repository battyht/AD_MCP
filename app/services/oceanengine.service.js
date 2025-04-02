const axios = require('axios');
const { getAccessToken, getDateString } = require('../utils/auth');
const logger = require('../utils/logger');

// 巨量引擎API基础URL
const BASE_URL = 'https://ad.oceanengine.com/open_api';

/**
 * 获取广告账户信息
 * @param {String} accountId - 广告账户ID
 * @param {String} accessToken - 访问令牌
 * @returns {Promise<Object>} 账户信息
 */
exports.getAccountInfo = async (accountId, accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('缺少必要的访问令牌');
    }
    
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/2/advertiser/info/`,
      params: {
        advertiser_ids: JSON.stringify([accountId]),
        fields: JSON.stringify(['id', 'name', 'status', 'balance', 'currency', 'role', 'address'])
      },
      headers: {
        'Access-Token': accessToken
      },
      transformResponse: [
        // 添加自定义转换响应函数，确保ID被作为字符串处理
        (data) => {
          const parsedData = JSON.parse(data);
          
          // 如果有大整数ID，确保它们被作为字符串处理
          if (parsedData.data && parsedData.data.list) {
            parsedData.data.list.forEach(item => {
              if (item.id) item.id = String(item.id);
            });
          }
          
          return parsedData;
        }
      ]
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Error fetching account info: ${error.response?.data || error.message}`);
    throw new Error('获取账户信息失败: ' + (error.response?.data?.message || error.message));
  }
};

/**
 * 获取账户列表
 * @param {Object} options - 查询选项
 * @param {Number} options.page - 页码
 * @param {Number} options.page_size - 每页数量
 * @param {String} accessToken - 访问令牌
 * @returns {Promise<Object>} 账户列表及分页信息
 */
exports.getAccountList = async (options, accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('缺少必要的访问令牌');
    }
    
    const { page, page_size, ...filters } = options;
    
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/2/advertiser/select/`,
      params: {
        page,
        page_size,
        ...filters
      },
      headers: {
        'Access-Token': accessToken
      },
      transformResponse: [
        // 添加自定义转换响应函数，确保ID被作为字符串处理
        (data) => {
          const parsedData = JSON.parse(data);
          
          // 转换账户ID为字符串
          if (parsedData.data && parsedData.data.list) {
            parsedData.data.list.forEach(account => {
              if (account.advertiser_id) account.advertiser_id = String(account.advertiser_id);
              if (account.account_id) account.account_id = String(account.account_id);
              if (account.id) account.id = String(account.id);
            });
          }
          
          return parsedData;
        }
      ]
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Error fetching account list: ${error.response?.data || error.message}`);
    throw new Error('获取账户列表失败: ' + (error.response?.data?.message || error.message));
  }
};

/**
 * 获取引流电商相关的广告数据
 * @param {String} accountId - 广告账户ID
 * @param {Object} options - 查询选项
 * @param {String} accessToken - 访问令牌
 * @returns {Promise<Object>} 广告数据
 */
exports.getAdPerformance = async (accountId, options = {}, accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('缺少必要的访问令牌');
    }
    
    const { 
      start_date = getDateString(-7), 
      end_date = getDateString(0), 
      group_by = 'STAT_GROUP_BY_FIELD_STAT_TIME',  // 默认按日期分组
      ...filters 
    } = options;
    
    // 电商引流相关的关键指标
    const metrics = [
      // 曝光和点击
      'show',                   // 展示数
      'click',                  // 点击数
      'ctr',                    // 点击率
      'cost',                   // 总消耗 
      'conversion',             // 转化数
      'conversion_rate',        // 转化率
      'conversion_cost',        // 转化成本
      
      // 电商相关
      'total_play',             // 播放数
      'valid_play',             // 有效播放数
      'play_duration_3s',       // 3秒播放数
      'form_submit_count',      // 表单提交数
      'form_submit_cost',       // 表单提交成本
      'form_submit_rate',       // 表单提交率
      
      // 电商直接指标  
      'shopping_action',        // 商品点击量
      'shopping_action_cost',   // 商品点击单价
      'shopping_action_rate',   // 商品点击率
      'pay_count',              // 支付订单数
      'pay_amount',             // 支付金额
      'roi'                     // 投资回报率(ROI)
    ];
    
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/2/report/ad/get/`,
      params: {
        advertiser_id: accountId,
        start_date,
        end_date,
        group_by,
        metrics: JSON.stringify(metrics),
        ...filters
      },
      headers: {
        'Access-Token': accessToken
      },
      transformResponse: [
        // 添加自定义转换响应函数，确保ID被作为字符串处理
        (data) => {
          const parsedData = JSON.parse(data);
          
          // 转换报表数据中的ID为字符串
          if (parsedData.data && parsedData.data.list) {
            parsedData.data.list.forEach(item => {
              if (item.ad_id) item.ad_id = String(item.ad_id);
              if (item.campaign_id) item.campaign_id = String(item.campaign_id);
              if (item.advertiser_id) item.advertiser_id = String(item.advertiser_id);
            });
          }
          
          return parsedData;
        }
      ]
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Error fetching ad performance: ${error.response?.data || error.message}`);
    throw new Error('获取广告数据失败: ' + (error.response?.data?.message || error.message));
  }
};

/**
 * 获取小时级别的广告报表数据
 * @param {String} accountId - 广告账户ID
 * @param {Object} options - 查询选项
 * @param {String} accessToken - 访问令牌
 * @returns {Promise<Object>} 小时报表数据
 */
exports.getHourlyReport = async (accountId, options = {}, accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('缺少必要的访问令牌');
    }
    
    const params = {
      advertiser_id: accountId,
      start_date: options.start_date || getDateString(0),
      end_date: options.end_date || getDateString(0),
      group_by: ["STAT_GROUP_BY_FIELD_STAT_TIME", "STAT_GROUP_BY_FIELD_HOUR"],
      time_granularity: "STAT_TIME_GRANULARITY_HOURLY"
    };
    
    // 可选的过滤条件
    if (options.filtering) {
      params.filtering = options.filtering;
    }
    
    logger.info(`Hourly report request params: ${JSON.stringify(params)}`);
    
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/2/report/advertiser/get/`,
      params,
      headers: {
        'Access-Token': accessToken
      },
      transformResponse: [
        // 添加自定义转换响应函数，确保ID被作为字符串处理
        (data) => {
          const parsedData = JSON.parse(data);
          
          // 转换报表数据中的ID为字符串
          if (parsedData.data && parsedData.data.list) {
            parsedData.data.list.forEach(item => {
              if (item.advertiser_id) item.advertiser_id = String(item.advertiser_id);
              if (item.campaign_id) item.campaign_id = String(item.campaign_id);
              if (item.ad_id) item.ad_id = String(item.ad_id);
              
              // 处理其他可能的ID字段
              Object.keys(item).forEach(key => {
                if (key.includes('_id') && typeof item[key] === 'number' && String(item[key]).length > 15) {
                  item[key] = String(item[key]);
                }
              });
            });
          }
          
          return parsedData;
        }
      ]
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Error fetching hourly report: ${error.response?.data || error.message}`);
    throw new Error('获取小时报表失败: ' + (error.response?.data?.message || error.message));
  }
};

/**
 * 获取自定义报表数据
 * @param {Object} reportData - 报表请求数据
 * @param {String} accessToken - 访问令牌
 * @returns {Promise<Object>} 报表数据
 */
exports.getCustomReport = async (reportData, accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('缺少必要的访问令牌');
    }
    
    // 处理请求数据
    const requestData = { ...reportData };
    
    // 确保有时间范围
    if (!requestData.start_date) {
      requestData.start_date = getDateString(0);
    }
    
    if (!requestData.end_date) {
      requestData.end_date = getDateString(0);
    }
    
    // 确保有必要的字段
    if (!requestData.advertiser_id) {
      throw new Error('缺少必要的advertiser_id字段');
    }
    
    if (!requestData.metrics) {
      throw new Error('缺少必要的metrics字段');
    }
    
    // 设置默认值
    if (!requestData.time_granularity) {
      requestData.time_granularity = 'STAT_TIME_GRANULARITY_DAILY';
    }
    
    if (!requestData.group_by) {
      requestData.group_by = ['STAT_GROUP_BY_FIELD_STAT_TIME'];
    }
    
    logger.info(`Custom report request params: ${JSON.stringify(requestData)}`);
    
    const response = await axios({
      method: 'GET',
      url: 'https://api.oceanengine.com/open_api/v3.0/report/custom/get/',
      params: requestData,
      headers: {
        'Access-Token': accessToken
      },
      transformResponse: [
        // 添加自定义转换响应函数，确保ID被作为字符串处理
        (data) => {
          const parsedData = JSON.parse(data);
          
          // 转换自定义报表中的ID为字符串
          if (parsedData.data && parsedData.data.list) {
            parsedData.data.list.forEach(item => {
              // 处理常见的ID字段
              if (item.cdp_promotion_id) item.cdp_promotion_id = String(item.cdp_promotion_id);
              if (item.promotion_id) item.promotion_id = String(item.promotion_id);
              if (item.project_id) item.project_id = String(item.project_id);
              if (item.advertiser_id) item.advertiser_id = String(item.advertiser_id);
              
              // 遍历所有字段，将可能的ID字段都转为字符串
              Object.keys(item).forEach(key => {
                if (key.includes('_id') && typeof item[key] === 'number' && String(item[key]).length > 15) {
                  item[key] = String(item[key]);
                }
              });
            });
          }
          
          return parsedData;
        }
      ]
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Error fetching custom report: ${error.response?.data || error.message}`);
    throw new Error('获取自定义报表失败: ' + (error.response?.data?.message || error.message));
  }
};

/**
 * 获取项目列表
 * @param {String} accountId - 广告账户ID
 * @param {Object} options - 查询选项
 * @param {String} accessToken - 访问令牌
 * @returns {Promise<Object>} 项目列表数据
 */
exports.getProjectList = async (accountId, options = {}, accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('缺少必要的访问令牌');
    }
    
    // 构建请求参数
    const params = {
      advertiser_id: accountId,
      ...options
    };
    
    logger.info(`Project list request params: ${JSON.stringify(params)}`);
    
    const response = await axios({
      method: 'GET',
      url: 'https://api.oceanengine.com/open_api/v3.0/project/list/',
      params,
      headers: {
        'Access-Token': accessToken
      },
      transformResponse: [
        // 添加自定义转换响应函数，确保ID被作为字符串处理
        (data) => {
          const parsedData = JSON.parse(data);
          
          // 如果有项目数据，转换项目ID为字符串
          if (parsedData.data && parsedData.data.list) {
            parsedData.data.list.forEach(project => {
              if (project.project_id) project.project_id = String(project.project_id);
              // 其他可能的大整数ID
              if (project.advertiser_id) project.advertiser_id = String(project.advertiser_id);
            });
          }
          
          return parsedData;
        }
      ]
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Error fetching project list: ${error.response?.data || error.message}`);
    throw new Error('获取项目列表失败: ' + (error.response?.data?.message || error.message));
  }
};

/**
 * 获取广告列表
 * @param {String} accountId - 广告账户ID
 * @param {Object} options - 查询选项
 * @param {String} accessToken - 访问令牌
 * @returns {Promise<Object>} 广告列表数据
 */
exports.getAdList = async (accountId, options = {}, accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('缺少必要的访问令牌');
    }
    
    // 构建请求参数
    const params = {
      advertiser_id: accountId,
      ...options
    };
    
    logger.info(`Ad list request params: ${JSON.stringify(params)}`);
    
    const response = await axios({
      method: 'GET',
      url: 'https://api.oceanengine.com/open_api/v1.0/qianchuan/promotion/get/',
      params,
      headers: {
        'Access-Token': accessToken
      },
      transformResponse: [
        // 添加自定义转换响应函数，确保ID被作为字符串处理
        (data) => {
          const parsedData = JSON.parse(data);
          
          // 如果有广告数据，转换广告ID为字符串
          if (parsedData.data && parsedData.data.list) {
            parsedData.data.list.forEach(ad => {
              // 转换所有可能的ID字段为字符串
              if (ad.promotion_id) ad.promotion_id = String(ad.promotion_id);
              if (ad.project_id) ad.project_id = String(ad.project_id);
              if (ad.advertiser_id) ad.advertiser_id = String(ad.advertiser_id);
              // 其他可能的大整数ID
            });
          }
          
          return parsedData;
        }
      ]
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Error fetching ad list: ${error.response?.data || error.message}`);
    throw new Error('获取广告列表失败: ' + (error.response?.data?.message || error.message));
  }
}; 