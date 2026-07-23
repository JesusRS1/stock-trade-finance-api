[English](README.md) | [简体中文](README.zh-CN.md) | **日本語**

# Stock Trade MCP サーバー

複数の [Tiingo API](https://www.tiingo.com/documentation/general/overview) エンドポイントをツールとして公開する Model Context Protocol (MCP) サーバーです。このサーバーを使用すると、MCP プロトコル経由で株価、ニュース、外国為替、ファンダメンタルズ、コーポレートアクションなどの金融データにプログラムからアクセスできます。

## 前提条件

- Node.js（v18 以降を推奨）
- npm（Node.js に同梱）
- Tiingo API キー
- MCP 互換のクライアントまたはランナー（VSCode 拡張機能、CLI など）

## セットアップ

1.  **リポジトリをクローンするか、プロジェクトディレクトリ内にいることを確認します。**

2.  **依存関係をインストールします：**
    ```bash
    npm install
    ```

3.  **Tiingo API キーを取得します：**
    このサーバーを使用するには、Tiingo API トークンが必要です。
    1.  Tiingo アカウントを持っていない場合は登録します。
    2.  Tiingo のアカウントページで API Token セクションに移動します（https://www.tiingo.com/account/api/token に直接アクセスすることもできます）。
    3.  API Token をコピーします。Tiingo API で認証するため、このトークンを MCP クライアントに指定する必要があります。
*注：Tiingo ではプログラムによる登録やログインはサポートされていません。API トークンが唯一の認証方法です。*

4.  **Tiingo API キーを設定します：**
    このサーバーには Tiingo API キーが必要です。通常、MCP クライアントの設定で API キーを指定できます（例については、下記の「サーバーの実行」を参照してください）。

5.  **サーバーをビルドします：**
    ```bash
    npm run build
    ```
    コンパイル済みの JavaScript コードを含む `build` ディレクトリが作成されます。

## サーバーの実行

- **MCP ランナーを使用する場合：**
  stdio トランスポートを使用してサーバーを実行するよう MCP クライアントを設定します。設定で `TIINGO_API_TOKEN` を指定し、`env` ブロック内に配置できます。
  MCP 設定エントリの例：
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
  *（`/path/to/mcp-tiingo` と `YOUR_API_KEY_HERE` は適宜置き換えてください）*

## 利用可能なツール

このサーバーは、次の Tiingo API エンドポイントを MCP 経由でツールとして公開します：

### **get_end_of_day_prices**
- **説明：** 指定したティッカーシンボルの日次終値を、任意の日付範囲と形式で取得します。
- **主な入力：** `ticker`、`startDate`、`endDate`、`resampleFreq`

### **get_news**
- **説明：** 各種フィルターオプションを指定してニュース記事を取得します。
- **主な入力：** `tickers`、`tags`、`sources`、`startDate`、`endDate`、`limit`

### **get_forex_prices**
- **説明：** 指定したティッカーシンボルの過去の外国為替日中価格を、任意の日付範囲と頻度で取得します。
- **主な入力：** `ticker`、`startDate`、`endDate`、`resampleFreq`

### **get_forex_top_of_book**
- **説明：** 1 つ以上のティッカーシンボルについて、リアルタイムの外国為替トップ・オブ・ブック／最終取引データを取得します。
- **主な入力：** `ticker` または `tickers`

### **get_fundamentals_definitions**
- **説明：** 利用可能なファンダメンタル指標とその定義を取得します。
- **主な入力：** なし

### **get_fundamentals_statements**
- **説明：** 指定したティッカーの過去の財務諸表データ（貸借対照表、損益計算書、キャッシュフロー、概要）を取得します。
- **主な入力：** `ticker`、`startDate`、`endDate`、`year`、`quarter`

### **get_fundamentals_daily_metrics**
- **説明：** 指定したティッカーの日次ファンダメンタル指標を取得します。
- **主な入力：** `ticker`、`startDate`、`endDate`、`columns`

### **get_fundamentals_meta**
- **説明：** 企業のファンダメンタルメタデータを取得します。
- **主な入力：** なし

### **get_dividend_distributions**
- **説明：** 指定したティッカーの過去の配当および分配データを取得します。
- **主な入力：** `ticker`、`startExDate`、`endExDate`

### **get_dividend_yield**
- **説明：** 指定したティッカーの過去の配当利回りデータを取得します。
- **主な入力：** `ticker`、`startDate`、`endDate`、`columns`

### **get_splits**
- **説明：** 指定したティッカーの過去の株式分割データを取得します。
- **主な入力：** `ticker`、`startExDate`、`endExDate`

## 拡張

Tiingo API エンドポイントをツールとして追加するには：
1. `src/tools/` に新しい TypeScript ファイルを作成し、ツール名、説明、入力スキーマ（Zod を使用）、Tiingo API を呼び出すハンドラー関数を定義します。
2. ツール定義オブジェクトをインポートし、`tiingoTools` 配列に追加します。この配列は `src/tools/index.ts` にあります。
3. サーバーを再ビルドします（`npm run build`）。
