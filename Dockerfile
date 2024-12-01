# これだとダメだった。Appleシリコンが影響してるっぽい。
# ベースイメージとしてNode.jsを使用し、"build" という名前のビルドステージを定義
# FROM node:20.12.2-alpine AS build

# ARM64対応のNode.jsイメージを指定
FROM node:20.12.2-alpine AS build

# ARM64対応のNginxイメージを指定
# FROM nginx:stable-alpine

# 作業ディレクトリの設定
WORKDIR /app

# パッケージ情報をコピーして依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# Nginxを使ってビルドしたファイルをホスト
FROM nginx:stable-alpine

# 上記の "build" ステージからファイルをコピー
COPY --from=build /app/build /usr/share/nginx/html

# 必要なポートを公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]