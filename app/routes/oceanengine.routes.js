const express = require('express');
const router = express.Router();
const oceanengineController = require('../controllers/oceanengine.controller');

// 广告账户信息路由
router.get('/ad-accounts/:account_id', oceanengineController.getAccountInfo);

// 账户列表路由
router.get('/ad-accounts', oceanengineController.getAccountList);

// 广告性能数据路由
router.get('/ad-accounts/:account_id/performance', oceanengineController.getAdPerformance);

// 小时报表路由
router.get('/ad-accounts/:account_id/hourly-report', oceanengineController.getHourlyReport);

// 自定义报表路由
router.post('/ad-accounts/:account_id/custom-report', oceanengineController.getCustomReport);

// 广告主报表数据路由 (与小时报表使用相同的控制器)
router.get('/ad-accounts/:account_id/report/advertiser', oceanengineController.getHourlyReport);

// 项目列表路由
router.get('/ad-accounts/:account_id/projects', oceanengineController.getProjectList);

// 广告列表路由
router.get('/ad-accounts/:account_id/promotions', oceanengineController.getAdList);

module.exports = router; 