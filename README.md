# model_rocket_simulator
ウェブ上でモデルロケットの簡易的な設計から飛行シミュレーションまで行います。  
飛行シミュレーションにはBarrowman法を用いていますが、あくまでも社会事業用として多少ゆるくしている部分があります。


# 使い方
データベースを使わないシングルモードなら、github pagesを経由して遊べます。
[このリンク](https://kuma003.github.io/model_rocket_simulator/)からアクセスできます。

マルチプレイをする場合には、誰かがdockerを使って立ち上げたウェブページへアクセスする必要があります (方法は後述).


# for Developer

## 開発環境
- Docker (Docker Desktop)
- React router v7
- Storybook
- Mantine

## サーバーを立てるには
1. コードをすべてgithubからクローンします：
```{bash}
git clone https://github.com/kuma003/model_rocket_simulator
cd model_rocket_simulator
```

2. DB用のパスワード等を設定します。
   下記の例ではコンソールでやっていますが、任意の方法で構いません。
```{bash}
cp .env.example .env
# .envファイルの書き換え (適宜)
```

3. dockerを起動します：
```{bash}
docker-compose up --build
```
このとき、docker desktopが起動していないと失敗します。

4. 次に、LAN内でアクセスできるように適切なポートを開放します。
なお、ポート開放には管理者権限がいるため、必要に応じて権限を昇格します。
```{bash}
open_ports
```


5. 終了する際は `Ctrl + C`でDockerは停止します。
ポートを閉じるには以下のコマンドを実行します：
```{bash}
close_ports
```


また、何らかの事情でdockerをリセット (再ビルド) するときには、`Ctrl + C`で停止させた後に以下のコマンドを実行します。
```{bash}
docker-compose down
docker-compose build frontend
docker-compose up
```

## コードを編集するには
node.jsが入っていることが前提です。  
フロントエンドの依存関係をインストールします。
```{bash}
cd frontend
npm install
```

バックエンドも同様です。
```{bash}
cd backend
npm install
```


## Storyboookを起動するには
Storybookはウェブ上でコンポーネント単体でチェックできるツールです。
作成したコンポーネントは適宜AIにでも投げて、storybookを作っておくと見た目を確認できるので何かと便利です。

storybookを起動するには以下のコマンドを実行します
```{bash}
cd frontend
npm install (まだなら)
npm run storybook
```

## 諸注意
- Github Actionsによってmainブランチにプッシュされた変更は自動でgithub pagesにデプロイされます。  
github pagesには制限がある[^1] + 時間がかかるので、開発時はブランチを切って作業するのを推奨します。

[^1]: 2000~3000 min/month です (参照：[GitHub Actions の課金について](https://docs.github.com/ja/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions))。変な使い方をしない限り超えないとは思います。
