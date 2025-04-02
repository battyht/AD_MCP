const dotenv = require('dotenv');
const oceanengineService = require('../../app/services/oceanengine.service');

// 加载环境变量
dotenv.config();

// 实际账户和令牌
const ACCOUNT_ID = '1819960516826122';
const ACCESS_TOKEN = 'd4b5172a79f174b8cecb4a214ea73f35c8039a68';

// 预期的项目信息，来自图片
const expectedProjects = [
  { name: '0401_自投288_158_4', id: '7488626541330661430' },
  { name: '0402_自投288_158_3', id: '7488547122800492585' },
  { name: '0402_自投288_158_2', id: '7488545768765538315' },
  { name: '0402_自投288_158_01', id: '7488543319339139108' },
  { name: '0401_去垃圾', id: '7488272757035253796' },
  { name: '0401_自投288_158_02', id: '7488270905195708457' },
  { name: '0401_自投268_158_01', id: '7488231055091171379' },
  { name: '0226', id: '7475624516594581531' }
];

// 直接使用服务层方法测试
async function testStringIds() {
  try {
    console.log('开始测试ID字符串转换...');
    
    // 获取项目列表
    const projectResult = await oceanengineService.getProjectList(ACCOUNT_ID, {}, ACCESS_TOKEN);
    
    console.log('成功获取项目列表，共有项目:', projectResult.data.list.length);
    
    // 检查项目ID类型
    const firstProject = projectResult.data.list[0];
    console.log('\n项目ID类型检查:');
    console.log(`项目ID: ${firstProject.project_id}`);
    console.log(`ID类型: ${typeof firstProject.project_id}`);
    console.log(`ID长度: ${firstProject.project_id.length}`);
    
    // 对比项目ID
    console.log('\n项目ID对比:');
    console.log('----------------------------------------');
    console.log('序号 | 项目名称 | API返回ID | 图片中ID');
    console.log('----------------------------------------');
    
    projectResult.data.list.forEach((project, index) => {
      const expectedProject = expectedProjects.find(p => 
        project.name === p.name || project.project_id.substring(0, 10) === p.id.substring(0, 10)
      );
      
      console.log(`${index + 1} | ${project.name} | ${project.project_id} | ${expectedProject ? expectedProject.id : '未知'}`);
    });
    
    // 尝试获取广告列表，检查广告ID
    console.log('\n获取广告列表测试...');
    const adResult = await oceanengineService.getAdList(ACCOUNT_ID, {}, ACCESS_TOKEN);
    
    if (adResult.data && adResult.data.list && adResult.data.list.length > 0) {
      const firstAd = adResult.data.list[0];
      console.log('\n广告ID类型检查:');
      console.log(`广告ID: ${firstAd.promotion_id}`);
      console.log(`ID类型: ${typeof firstAd.promotion_id}`);
      console.log(`ID长度: ${firstAd.promotion_id.length}`);
    } else {
      console.log('没有找到广告数据');
    }
    
    console.log('\n测试完成!');
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 执行测试
testStringIds(); 