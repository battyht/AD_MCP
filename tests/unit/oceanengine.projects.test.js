const request = require('supertest');
const express = require('express');
const app = require('../../index');
const oceanengineService = require('../../app/services/oceanengine.service');

// 模拟oceanengineService.getProjectList方法
jest.mock('../../app/services/oceanengine.service');

describe('项目列表 API 测试', () => {
  const mockToken = 'd4b5172a79f174b8cecb4a214ea73f35c8039a68';
  const mockAccountId = '1819960516826122';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('成功获取项目列表', async () => {
    // 模拟服务返回数据
    const mockResponse = {
      code: 0,
      message: 'OK',
      request_id: '202504021830449F6248928F03F713DC3E',
      data: {
        list: [
          {
            project_id: '7488331055091171379',
            project_name: '0402_自投268',
            budget: 268.00,
            budget_mode: 'BUDGET_MODE_DAY',
            status: 'PROJECT_STATUS_ENABLE',
            opt_status: 'ENABLE',
            stat_cost: 115.37,
            roi: '0.0000'
          }
        ],
        page_info: {
          page: 1,
          page_size: 10,
          total_number: 1,
          total_page: 1
        }
      }
    };
    
    // 设置模拟返回
    oceanengineService.getProjectList.mockResolvedValue(mockResponse);
    
    // 发送请求
    const response = await request(app)
      .get(`/api/oceanengine/ad-accounts/${mockAccountId}/projects`)
      .set('Access-Token', mockToken)
      .expect('Content-Type', /json/)
      .expect(200);
    
    // 验证结果
    expect(response.body).toEqual(mockResponse);
    expect(oceanengineService.getProjectList).toHaveBeenCalledWith(
      mockAccountId,
      expect.any(Object),
      mockToken
    );
  });
  
  test('没有Access-Token时返回401', async () => {
    const response = await request(app)
      .get(`/api/oceanengine/ad-accounts/${mockAccountId}/projects`)
      .expect('Content-Type', /json/)
      .expect(401);
    
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', '缺少必要的Access-Token请求头');
    expect(oceanengineService.getProjectList).not.toHaveBeenCalled();
  });
  
  test('服务抛出错误时返回500', async () => {
    // 模拟服务抛出错误
    const errorMessage = '获取项目列表失败: API请求错误';
    oceanengineService.getProjectList.mockRejectedValue(new Error(errorMessage));
    
    const response = await request(app)
      .get(`/api/oceanengine/ad-accounts/${mockAccountId}/projects`)
      .set('Access-Token', mockToken)
      .expect('Content-Type', /json/)
      .expect(500);
    
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', errorMessage);
  });
  
  test('过滤条件参数处理', async () => {
    // 模拟成功响应
    oceanengineService.getProjectList.mockResolvedValue({
      code: 0,
      message: 'OK',
      data: { list: [] }
    });
    
    // 发送带过滤参数的请求
    const filtering = { status: 'PROJECT_STATUS_ENABLE' };
    
    await request(app)
      .get(`/api/oceanengine/ad-accounts/${mockAccountId}/projects`)
      .query({ filtering: JSON.stringify(filtering) })
      .set('Access-Token', mockToken)
      .expect(200);
    
    // 验证过滤参数被正确解析
    expect(oceanengineService.getProjectList).toHaveBeenCalledWith(
      mockAccountId,
      expect.objectContaining({
        filtering
      }),
      mockToken
    );
  });
  
  test('过滤条件格式错误时返回400', async () => {
    const invalidFiltering = '{status:"PROJECT_STATUS_ENABLE"}'; // 无效的JSON
    
    const response = await request(app)
      .get(`/api/oceanengine/ad-accounts/${mockAccountId}/projects`)
      .query({ filtering: invalidFiltering })
      .set('Access-Token', mockToken)
      .expect(400);
    
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'filtering参数格式错误，应为JSON对象');
    expect(oceanengineService.getProjectList).not.toHaveBeenCalled();
  });
}); 