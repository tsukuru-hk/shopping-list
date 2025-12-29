# nodeの最新安定版をベースにする
FROM node:20-slim

# コンテナ内の作業ディレクトリを /app に設定
WORKDIR /app

# パッケージ管理ツールを最新にする
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# 3000番ポート（Nuxtのデフォルト）を開放
EXPOSE 3000

# サーバー起動コマンド
CMD ["npm", "run", "dev"]