const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/token.controller');

// 设置访问令牌
router.post('/ad-accounts/:account_id/token', tokenController.setAccessToken);

// 检查访问令牌是否存在
router.get('/ad-accounts/:account_id/token', tokenController.checkAccessToken);

// 删除访问令牌
router.delete('/ad-accounts/:account_id/token', tokenController.deleteAccessToken);

module.exports = router; 