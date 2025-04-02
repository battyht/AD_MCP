# MCP API 文档

## 功能概览

MCP(Marketing Cloud Platform)是一个连接巨量引擎广告平台的中间服务层，提供以下核心功能：

| 功能类别 | API接口 | 用途 |
|---------|--------|------|
| **认证管理** | Token设置/检查/删除 | 管理广告账户的Access-Token |
| **账户管理** | 账户信息/账户列表 | 获取广告账户基本信息 |
| **广告监控** | 广告性能数据 | 获取电商引流相关广告指标 |
| **报表服务** | 广告主报表/小时报表/自定义报表 | 灵活查询各维度广告数据 |
| **项目管理** | 项目列表 | 获取广告项目信息 |
| **广告管理** | 广告列表 | 获取广告创意信息 |

### 快速上手指南

1. **设置Access-Token**：
   所有API调用都需要在请求头中包含`Access-Token`。该token需要从巨量引擎开放平台获取。

2. **常用场景**：
   - 获取账户基本信息: `GET /oceanengine/ad-accounts/{account_id}`
   - 查询广告性能数据: `GET /oceanengine/ad-accounts/{account_id}/performance`
   - 获取自定义报表: `POST /oceanengine/ad-accounts/{account_id}/custom-report`
   - 获取项目列表: `GET /oceanengine/ad-accounts/{account_id}/projects`
   - 获取广告列表: `GET /oceanengine/ad-accounts/{account_id}/promotions`

3. **数据分析建议**：
   - 使用自定义报表API可以灵活组合维度和指标
   - 小时报表适合实时监控广告表现
   - 对于大量数据，建议使用分页参数控制响应大小

## 基本信息

- 基础URL: `http://localhost:3000/api`
- 所有响应格式均为JSON
- 认证方式：Access-Token 请求头认证

## 认证

所有 MCP API 请求都需要在请求头中包含 `Access-Token` 字段。该token需要从巨量引擎开放平台获取。

**示例:**

```
GET /api/oceanengine/ad-accounts/1234567
Headers: 
  Access-Token: your_access_token_here
```

**错误响应:**

如果请求中没有提供 Access-Token，将返回 401 状态码：

```json
{
  "status": "error",
  "message": "缺少必要的Access-Token请求头"
}
```

## Token管理

### 设置账户Access-Token

**请求:**

```
POST /ad-accounts/{account_id}/token
```

**参数:**

- `account_id` (路径参数): 广告账户ID
- 请求体:
  ```json
  {
    "token": "your_access_token_here"
  }
  ```

**响应:**

```json
{
  "status": "success",
  "message": "访问令牌设置成功"
}
```

### 检查账户Access-Token状态

**请求:**

```
GET /ad-accounts/{account_id}/token
```

**参数:**

- `account_id` (路径参数): 广告账户ID

**响应:**

```json
{
  "status": "success",
  "has_token": true
}
```

### 删除账户Access-Token

**请求:**

```
DELETE /ad-accounts/{account_id}/token
```

**参数:**

- `account_id` (路径参数): 广告账户ID

**响应:**

```json
{
  "status": "success",
  "message": "访问令牌删除成功"
}
```

## 健康检查

**请求:**

```
GET /api/health
```

**响应:**

```json
{
  "status": "ok",
  "message": "Service is running"
}
```

## 巨量引擎API

基础路径: `/oceanengine`

### 获取广告账户信息

**请求:**

```
GET /oceanengine/ad-accounts/{account_id}
```

**参数:**

- `account_id` (路径参数): 广告账户ID

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "123456",
    "name": "账户名称",
    "status": "账户状态",
    "balance": 1000.00,
    "currency": "CNY",
    "role": "ADVERTISER",
    "communication_region": "中国大陆"
  }
}
```

### 获取账户列表

**请求:**

```
GET /oceanengine/ad-accounts
```

**查询参数:**

- `page` (可选): 页码，默认为1
- `page_size` (可选): 每页数量，默认为10

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "123456",
        "name": "账户1",
        "status": "STATUS_ENABLE",
        "balance": 1000.00,
        "currency": "CNY",
        "role": "ADVERTISER",
        "company": "公司名称"
      }
    ],
    "page_info": {
      "total_number": 100,
      "page": 1,
      "page_size": 10
    }
  }
}
```

### 获取广告性能数据 (电商引流专用)

**请求:**

```
GET /oceanengine/ad-accounts/{account_id}/performance
```

**参数:**

- `account_id` (路径参数): 广告账户ID
- `start_date` (查询参数, 可选): 开始日期, 格式为YYYY-MM-DD, 默认为7天前
- `end_date` (查询参数, 可选): 结束日期, 格式为YYYY-MM-DD, 默认为今天
- `group_by` (查询参数, 可选): 分组方式, 默认为"STAT_GROUP_BY_FIELD_STAT_TIME"(按日期分组)
- `filtering` (查询参数, 可选): 过滤条件
- `campaign_id` (查询参数, 可选): 广告组ID
- `ad_id` (查询参数, 可选): 广告计划ID
- `creative_id` (查询参数, 可选): 创意ID
- `material_id` (查询参数, 可选): 素材ID

**支持的电商引流指标:**

此接口针对电商引流业务，提供以下关键指标:

1. **曝光和点击指标**
   - `show`: 展示数
   - `click`: 点击数
   - `ctr`: 点击率
   - `average_show_cost`: 平均千次展示费用(CPM)
   - `average_click_cost`: 平均点击单价(CPC)

2. **成本指标**
   - `cost`: 总消耗
   - `convert_cost`: 转化成本

3. **转化指标**
   - `convert`: 转化数
   - `convert_rate`: 转化率
   - `convert_cost`: 转化成本
   - `attribution_convert`: 归因转化

4. **电商内容互动指标**
   - `total_play`: 播放数
   - `valid_play`: 有效播放数
   - `play_duration_3s`: 3秒播放数
   - `form_count`: 表单提交数
   - `form_cost`: 表单提交成本
   - `form_rate`: 表单提交率

5. **电商直接交易指标**
   - `shopping`: 商品点击量
   - `shopping_cost`: 商品点击单价
   - `shopping_rate`: 商品点击率
   - `pay_order_count`: 支付订单数
   - `pay_order_amount`: 支付金额
   - `deal_cpa`: 成交成本
   - `return_on_investment`: 投资回报率(ROI)
   - `income_roi`: 收入ROI

6. **用户活跃度指标**
   - `total_active`: 活跃度
   - `active_cost`: 活跃成本
   - `active_rate`: 活跃率
   - `phone_cnt`: 电话拨打量
   - `deep_convert`: 深度转化量
   - `deep_convert_rate`: 深度转化率

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "show": 10000,               // 展示数
        "click": 500,                // 点击数
        "ctr": 0.05,                 // 点击率
        "cost": 1000.00,             // 总消耗
        "convert": 50,               // 转化数
        "convert_rate": 0.1,         // 转化率
        "convert_cost": 20.00,       // 转化成本
        "shopping": 200,             // 商品点击量
        "pay_order_count": 30,       // 支付订单数
        "pay_order_amount": 3000.00, // 支付金额
        "return_on_investment": 3.0  // 投资回报率(ROI)
        // 其他指标...
      }
    ],
    "page_info": {
      "total_number": 7,  // 如果按日期分组，这里表示总天数
      "page": 1,
      "page_size": 10
    }
  }
}
```

### 获取广告主报表数据

**请求:**

```
GET /oceanengine/ad-accounts/{account_id}/report/advertiser
```

**参数:**

- `account_id` (路径参数): 广告账户ID
- `advertiser_id` (查询参数, 必填): 广告主ID，数字类型
- `start_date` (查询参数, 必填): 开始日期，格式为YYYY-MM-DD，支持查询2016-10-26及以后的日期
- `end_date` (查询参数, 必填): 结束日期，格式为YYYY-MM-DD，查询时间跨度不能超过30天
- `fields` (查询参数, 可选): 指定需要的指标名称，字符串数组，可选值包括：
  - `cost`: 消耗
  - `show`: 展示数
  - `avg_show_cost`: 平均千次展示费用
  - `click`: 点击数
  - `ctr`: 点击率
  - `avg_click_cost`: 平均点击单价
  - `convert`: 转化数
  - `convert_rate`: 转化率
  - `convert_cost`: 转化成本
- `time_granularity` (查询参数, 可选): 时间粒度，字符串类型，可选值：
  - `STAT_TIME_GRANULARITY_DAILY`: 按天维度
  - `STAT_TIME_GRANULARITY_HOURLY`: 按小时维度
- `order_field` (查询参数, 可选): 排序字段，所有的统计指标均可参与排序
- `order_type` (查询参数, 可选): 排序方式，可选值：`ASC`(升序)或`DESC`(降序)
- `page` (查询参数, 可选): 页码，默认值为1
- `page_size` (查询参数, 可选): 页面大小，默认值为20，取值范围1-1000

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "cost": 1000.00,         // 消耗
        "show": 10000,           // 展示数
        "click": 200,            // 点击数
        "ctr": 0.02,             // 点击率
        "convert": 50,           // 转化数
        "convert_rate": 0.25,    // 转化率
        "convert_cost": 20.00    // 转化成本
        // 其他请求的指标...
      }
    ],
    "page_info": {
      "page": 1,               // 页码
      "page_size": 20,         // 页面大小
      "total_number": 100,     // 总数
      "total_page": 5          // 总页数
    }
  },
  "request_id": "202404151234567890"  // 请求日志id
}
```

### 获取广告主小时报表

**请求:**

```
GET /oceanengine/ad-accounts/{account_id}/hourly-report
```

**参数:**

- `account_id` (路径参数): 广告账户ID
- `start_date` (查询参数, 可选): 开始日期, 格式为YYYY-MM-DD, 默认为今天
- `end_date` (查询参数, 可选): 结束日期, 格式为YYYY-MM-DD, 默认为今天
- `filtering` (查询参数, 可选): 过滤条件

**说明:**
此API专门用于获取小时级别的广告数据，固定使用 `STAT_TIME_GRANULARITY_HOURLY` 时间粒度。如果需要按日期、广告主、广告组等其他维度获取数据，请使用自定义报表API。

**响应:**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "stat_datetime": "2025-04-02",
        "hour": 0,
        "show": 100,
        "click": 5,
        "cost": 10.5,
        // ...其他指标
      },
      {
        "stat_datetime": "2025-04-02",
        "hour": 1,
        "show": 150,
        "click": 8,
        "cost": 15.2,
        // ...其他指标
      }
      // ...更多小时数据
    ],
    "page_info": {
      "total_number": 48,  // 总记录数，通常是天数*24小时
      "page": 1,
      "page_size": 100
    }
  }
}
```

### 获取自定义报表

**请求:**

```
POST /oceanengine/ad-accounts/{account_id}/custom-report
```

**参数:**

- `account_id` (路径参数): 广告账户ID

**请求体:**

```json
{
  "metrics": ["stat_cost", "show_cnt", "click_cnt", "ctr", "conversion", "conversion_cost", "conversion_rate"],
  "start_date": "2025-04-02",
  "end_date": "2025-04-02",
  "time_granularity": "STAT_TIME_GRANULARITY_DAILY",
  "group_by": ["STAT_GROUP_BY_FIELD_STAT_TIME"],
  "page": 1,
  "page_size": 20,
  "order_field": "cost",
  "order_type": "DESC",
  "filters": [
    {
      "field_name": "campaign_id",
      "filter_value": ["1234567"],
      "operator": "IN"
    }
  ]
}
```

**请求体参数说明:**

- `metrics` (必填): 需要查询的指标，如 "stat_cost"(消耗), "show_cnt"(展示), "click_cnt"(点击) 等
- `start_date` (必填): 开始日期，格式为YYYY-MM-DD
- `end_date` (必填): 结束日期，格式为YYYY-MM-DD，与start_date的时间跨度不能超过30天
- `time_granularity` (可选): 时间粒度，可选值:
  - `STAT_TIME_GRANULARITY_DAILY` - 按天（默认）
  - `STAT_TIME_GRANULARITY_HOURLY` - 按小时
- `group_by` (可选): 分组方式，可选值:
  - `STAT_GROUP_BY_FIELD_STAT_TIME` - 按日期分组（默认）
  - `STAT_GROUP_BY_FIELD_ID` - 按广告ID分组
  - `STAT_GROUP_BY_FIELD_CAMPAIGN_ID` - 按广告组ID分组
  - `STAT_GROUP_BY_FIELD_AD_ID` - 按广告计划ID分组
  - 等其他分组方式
- `page` (可选): 页码，默认为1，范围1-99999
- `page_size` (可选): 每页数量，默认为20，范围1-1000
- `order_field` (可选): 排序字段，如"cost"、"show"等
- `order_type` (可选): 排序方式，可选值："ASC"(升序)或"DESC"(降序)
- `filters` (可选): 过滤条件，数组格式，每个过滤条件包含:
  - `field_name`: 字段名称
  - `filter_value`: 过滤值，数组格式
  - `operator`: 操作符，如"IN"、"EQUALS"、"GREATER_THAN"等

**响应:**

```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "list": [
      {
        "stat_datetime": "2025-04-02",
        "stat_cost": "288.58",        // 消耗(元)
        "show_cnt": "26356",          // 展示数
        "click_cnt": "24",            // 点击数
        "ctr": "0.0911",              // 点击率(%)
        "conversion": "0",            // 转化数
        "conversion_cost": "0.00",    // 转化成本(元)
        "conversion_rate": "0.0000"   // 转化率(%)
      }
    ],
    "page_info": {
      "total_number": 1,  // 总记录数
      "page": 1,
      "page_size": 20,
      "total_page": 1     // 总页数
    }
  }
}
```

**可能的错误:**

- 400: 请求参数错误，如缺少必要字段、时间格式错误、日期范围超过30天等
- 401: 缺少Access-Token
- 500: 服务器内部错误

### 获取项目列表

**请求:**

```
GET /oceanengine/ad-accounts/{account_id}/projects
```

**参数:**

- `account_id` (路径参数): 广告账户ID
- `filtering` (查询参数, 可选): 过滤条件，JSON对象格式
  - `ids` (可选): 按广告项目ID过滤，范围为1-100
  - `status` (可选): 广告项目状态过滤，可选值：
    - `PROJECT_STATUS_ENABLE`: 启用
    - `PROJECT_STATUS_DISABLE`: 暂停
    - `PROJECT_STATUS_DELETE`: 删除
    - `PROJECT_STATUS_ALL`: 所有（包含已删除）
    - `PROJECT_STATUS_NOT_DELETE`: 所有（不包含已删除）
    - `PROJECT_STATUS_BUDGET_EXCEED`: 项目超出预算
    - `PROJECT_STATUS_BUDGET_PRE_OFFLINE_BUDGET`: 项目接近预算
    - `PROJECT_STATUS_NOT_START`: 未达投放时间
    - `PROJECT_STATUS_DONE`: 已完成
    - `PROJECT_STATUS_NO_SCHEDULE`: 不在投放时段

**响应:**

```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "list": [
      {
        "project_id": "7488231055091171379",
        "project_name": "测试项目",
        "status": "PROJECT_STATUS_ENABLE",
        "create_time": "2025-04-02 16:17:56",
        "modify_time": "2025-04-02 16:17:56",
        "budget": 1000.00,
        "budget_mode": "BUDGET_MODE_TOTAL",
        "landing_type": "LANDING_TYPE_APP",
        "app_id": "123456789",
        "app_name": "测试应用"
      }
    ],
    "page_info": {
      "page": 1,
      "page_size": 10,
      "total_number": 1,
      "total_page": 1
    }
  }
}
```

**注意事项:**
1. filtering参数需要以JSON对象格式传入，例如：`?filtering={"status":"PROJECT_STATUS_ENABLE"}`
2. 如果不传入filtering参数，将返回所有项目（不包含已删除的项目）
3. 项目状态会实时反映项目的运行状态，包括预算、投放时间等条件

### 获取广告列表

**请求:**

```
GET /oceanengine/ad-accounts/{account_id}/promotions
```

**参数:**

- `account_id` (路径参数): 广告账户ID
- `filtering` (查询参数, 可选): 过滤条件，JSON对象格式
  - `ids` (可选): 按广告ID过滤，范围为1-20
  - `name` (可选): 广告名称，长度是1-50个字（两个英文字符占1个字，该字段采取模糊查询的方式）
  - `project_id` (可选): 按项目id过滤
  - `status` (可选): 广告状态过滤，可选值：
    - `NOT_DELETED`: 不限
    - `ALL`: 不限（包含已删除）
    - `OK`: 投放中
    - `DELETED`: 已删除
    - `PROJECT_OFFLINE_BUDGET`: 项目超出预算
    - `PROJECT_PREOFFLINE_BUDGET`: 项目接近预算
    - `TIME_NO_REACH`: 未到达投放时间
    - `TIME_DONE`: 已完成
    - `NO_SCHEDULE`: 不在投放时段
    - `AUDIT`: 新建审核中
    - `REAUDIT`: 修改审核中
    - `FROZEN`: 已终止
    - `AUDIT_DENY`: 审核不通过
    - `OFFLINE_BUDGET`: 广告超出预算
    - `OFFLINE_BALANCE`: 账户余额不足
    - `PREOFFLINE_BUDGET`: 广告接近预算
    - `DISABLED`: 已暂停
    - `PROJECT_DISABLED`: 已被项目暂停
    - `LIVE_ROOM_OFF`: 关联直播间不可投
    - `PRODUCT_OFFLINE`: 关联商品不可投
    - `AWEME_ACCOUNT_DISABLED`: 关联抖音账号不可投
    - `AWEME_ANCHOR_DISABLED`: 锚点不可投
    - `DISABLE_BY_QUOTA`: 已暂停（配额达限）
  - `reject_reason_type` (可选): 拒绝原因类型
- `page` (查询参数, 可选): 页数，默认值：1，范围为[1,99999]
- `page_size` (查询参数, 可选): 页面大小，默认值：10，范围为[1,100]
- `cursor` (查询参数, 可选): 页码游标值：第一次拉取，传入0。cursor 翻页形式不支持与筛选参数ids同时传入
- `count` (查询参数, 可选): 页面数据量，count范围为[1,20]

**响应:**

```json
{
  "code": 0,
  "message": "OK",
  "request_id": "202504021830449F6248928F03F713DC3E",
  "data": {
    "cursor_info": null,
    "list": [
      {
        "ad_download_status": "OFF",
        "advertiser_id": 1819960516826122,
        "promotion_id": 7488627090193088575,
        "promotion_name": "0402_自投288_158_4",
        "promotion_create_time": "2025-04-02 16:17:56",
        "status": "OK",
        "status_first": "PROMOTION_STATUS_ENABLE",
        "source": "迪奥旷野香水"
      }
    ],
    "page_info": {
      "page": 1,
      "page_size": 10,
      "total_number": 6,
      "total_page": 1
    }
  }
}
```

**注意事项:**
1. filtering参数需要以JSON对象格式传入，例如：`?filtering={"status":"OK"}`
2. 如果不传入filtering参数，将返回所有广告（不包含已删除的广告）
3. page与cursor同时传入时，cursor优先级大于page
4. page+page_size与cursor+count为两种分页方式，返回参数只返回与入参对应的分页参数
5. 2024年4月1日后支持同时返回手动+自动投放模式的广告
6. 多品投放项目下的广告，暂不支持获取自定义素材相关的商品信息

## 错误响应

所有API遇到错误时都会返回以下格式的响应:

```json
{
  "status": "error",
  "message": "错误信息"
}
```

常见HTTP状态码:

- `200 OK`: 请求成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 认证失败
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误 