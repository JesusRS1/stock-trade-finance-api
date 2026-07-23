[English](README.md) | **简体中文** | [日本語](README.ja.md)

# Stock Trade MCP 服务器

这是一个 Model Context Protocol (MCP) 服务器，它将多个 [Tiingo API](https://www.tiingo.com/documentation/general/overview) 端点作为工具公开。通过本服务器，可以使用 MCP 协议以编程方式访问金融数据，包括股票价格、新闻、外汇、基本面数据和公司行为。

## 前置要求

- Node.js（建议使用 v18 或更高版本）
- npm（随 Node.js 一同提供）
- Tiingo API 密钥
- 兼容 MCP 的客户端或运行器（例如 VSCode 扩展、CLI）

## 设置

1.  **克隆仓库，或确保你位于项目目录中。**

2.  **安装依赖项：**
    ```bash
    npm install
    ```

3.  **获取 Tiingo API 密钥：**
    要使用本服务器，你需要 Tiingo API 令牌。
    1.  如果你还没有 Tiingo 账户，请注册一个。
    2.  前往 Tiingo 账户页面并导航至 API Token 部分（也可以直接访问：https://www.tiingo.com/account/api/token）。
    3.  复制你的 API Token。你需要向 MCP 客户端提供此令牌，以便通过 Tiingo API 进行身份验证。
*注意：Tiingo 不支持以编程方式注册或登录；API 令牌是唯一的身份验证方式。*

4.  **设置 Tiingo API 密钥：**
    本服务器需要你的 Tiingo API 密钥。通常可以在 MCP 客户端的配置中提供该 API 密钥（示例请参阅下面的“运行服务器”）。

5.  **构建服务器：**
    ```bash
    npm run build
    ```
    此命令会创建一个包含已编译 JavaScript 代码的 `build` 目录。

## 运行服务器

- **通过 MCP 运行器：**
  配置 MCP 客户端，使其使用 stdio 传输运行本服务器。你可以在配置中提供 `TIINGO_API_TOKEN`，并将其放在 `env` 块内。
  MCP 设置条目示例：
  ```json
  "mcp-tiingo": {
    "transportType": "stdio",
    "command": "node",
    "args": [
      "/path/to/mcp-tiingo/build/index.js"
    ],
    "env": {
      "TIINGO_API_TOKEN": "YOUR_API_KEY_HERE"
    }
    // ... other optional settings ...
  }
  ```
  *（请相应替换 `/path/to/mcp-tiingo` 和 `YOUR_API_KEY_HERE`）*

## 可用工具

服务器通过 MCP 将以下 Tiingo API 端点作为工具公开：

### **get_end_of_day_prices**
- **说明：** 获取指定股票代码在可选日期范围内的日终价格，并可指定格式。
- **主要输入：** `ticker`、`startDate`、`endDate`、`resampleFreq`

### **get_news**
- **说明：** 获取新闻文章，并支持多种筛选选项。
- **主要输入：** `tickers`、`tags`、`sources`、`startDate`、`endDate`、`limit`

### **get_forex_prices**
- **说明：** 获取指定交易品种在可选日期范围和频率下的历史日内外汇价格。
- **主要输入：** `ticker`、`startDate`、`endDate`、`resampleFreq`

### **get_forex_top_of_book**
- **说明：** 获取一个或多个交易品种的实时外汇最优报价/最新成交数据。
- **主要输入：** `ticker` 或 `tickers`

### **get_fundamentals_definitions**
- **说明：** 获取可用的基本面指标及其定义。
- **主要输入：** 无

### **get_fundamentals_statements**
- **说明：** 获取指定股票代码的历史基本面报表数据（资产负债表、利润表、现金流量表、概览）。
- **主要输入：** `ticker`、`startDate`、`endDate`、`year`、`quarter`

### **get_fundamentals_daily_metrics**
- **说明：** 获取指定股票代码的每日基本面指标。
- **主要输入：** `ticker`、`startDate`、`endDate`、`columns`

### **get_fundamentals_meta**
- **说明：** 获取公司的基本面元数据。
- **主要输入：** 无

### **get_dividend_distributions**
- **说明：** 获取指定股票代码的历史股息和分配数据。
- **主要输入：** `ticker`、`startExDate`、`endExDate`

### **get_dividend_yield**
- **说明：** 获取指定股票代码的历史股息收益率数据。
- **主要输入：** `ticker`、`startDate`、`endDate`、`columns`

### **get_splits**
- **说明：** 获取指定股票代码的历史拆股数据。
- **主要输入：** `ticker`、`startExDate`、`endExDate`

## 扩展

要将更多 Tiingo API 端点添加为工具：
1. 在 `src/tools/` 中创建新的 TypeScript 文件，定义工具名称、说明、输入模式（使用 Zod）以及调用 Tiingo API 的处理函数。
2. 导入工具定义对象，并将其添加到 `tiingoTools` 数组；该数组位于 `src/tools/index.ts`。
3. 重新构建服务器（`npm run build`）。
