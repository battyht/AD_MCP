// 加载环境变量
require('dotenv').config();

// 设置测试环境
process.env.NODE_ENV = 'test';

// 设置测试超时
jest.setTimeout(10000);

// 如果需要全局的测试设置，可以在这里添加

// 全局清理
afterAll(async () => {
  // 可以添加测试完成后的清理工作
}); 