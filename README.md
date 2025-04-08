## アプリケーション名
衝動買いストップ

## 想定用途
購買意欲が高まり衝動買いが多い時に、一度落ち着いて検討する為に活用。  
リストに登録することで、それまでに登録した「欲しいもの」と比較する事で優先度等見直す。

## 開発目的
React Nativeの技術習得

## スクリーンショット
<img src="https://github.com/user-attachments/assets/46bbb549-c144-4676-ab6b-e1a87e00e802" width="25%">
<img src="https://github.com/user-attachments/assets/2b67af76-2fb2-4bb1-afb6-3e12fca48366" width="25%">
<img src="https://github.com/user-attachments/assets/3f51fb7f-3976-4f9b-9711-234711a5c759" width="25%">

## 機能
- サインアップ/ログイン
- 一覧表示/ソート
- 作成/編集/削除
- アカウント設定(メールアドレス変更、パスワード変更、パスワード再発行、退会)
- お試し体験モード(アカウント登録なしで、一覧表示と詳細表示可能)

## 技術スタック
- **フレームワーク**
  - React Native (0.76.6)
  - Expo (52.0.30)
  - Expo Router (4.0.17)

- **バックエンド/データベース**
  - Firebase (11.3.0)
    - Authentication (@react-native-async-storage/async-storage 1.23.1による認証状態の永続化)
    - Firestore

- **UI/UXコンポーネント**
  - Expo Vector Icons
  - React Native Dialog
  - React Native Popup Menu
  - React Native Safe Area Context
  - React Native SVG
  - Expo Checkbox

- **開発ツール**
  - TypeScript
  - ESLint
  - Babel
  - Expo Go(iPhone SE2実機でアプリの挙動を確認)
  - Android Studio(エミュレータAndroidでアプリの挙動を確認)

※バージョンは開発時点のものです。

## 環境

<details><summary>[構築方法 Firebase]</summary>

```
1. Firebaseに登録 → プロジェクトを作成する
2. Firebaseでマイアプリを登録  
   ※ウェブアプリとして登録(アプリのニックネームは任意、このアプリの Firebase Hosting も設定します:OFF)
3. Firebase Firestoreでデータベースを作成  
   ※ロケーションは任意、セキュリティルール 本番環境モードで作成 → ルールにfirestore.rulesの内容を転記する
4. Firebase Authenticationでログインプロバイダに'メール/パスワード'を追加  
   ※ログイン方法タブ → メール / パスワード(有効)、メールリンク（パスワードなしでログイン(有効にしない)
5. Firebase Authenticationでログインプロバイダに'匿名'を追加  
   ※ログイン方法タブ → 匿名(有効)
6. Firebase Authenticationでテンプレートタブを反映  
   設定値はfirebase-templatesフォルダ内の各ファイルに記載、設定項目との対応は以下  
    * メールアドレスの変更設定( EmailChange.md )
    * メールアドレスの確認設定( EmailConfirmation.md )
    * パスワードの再設定設定( PasswordChange.md )
7. Firebase Admin PanelAuthenticationで設定タブを反映
    *「ユーザーアクション」  
      作成（登録）を許可する(ON)
      作成（登録）を許可する(ON)
      メール列挙保護(ON)

      パスワードポリシー含めApp Storeリリース行う際、再検討予定
8. Firebase Firestore Databaseルール設定変更  
    * firebase-rules → firestore.rules参照  
9. Firebase Firestore Databaseに優先度マスタコレクションを追加  
    * firebase-database-data → priorityType参照  
10. Firebase Firestore Databaseに匿名ログイン用サンプルデータ追加  
    * firebase-database-data → buyItem参照  
　※9、10についてはimport、Exportを検証して効率化実施するか検討必要(優先度的にはApp Storeリリースの方が高い)  
```
</details>

<details><summary>[構築方法 フロント]</summary>

1. クローン取得
2. `.env.sample` をコピー/リネームして`.env`とする
3. Firebaseで作成したプロジェクト情報を`.env`に追記
   (対応は下記Firebaseプロジェクト情報と'.env'の対応参照) 
4. npm installを実行
5. npx expo startを実行
6. iPhone実機で確認する際はQAコードをスキャンしてExpo Go起動  
   Androidで確認する際はAndroid studioをインストール → エミュレータ作成 → npx expo startでビルド完了後 → a などで実行

・Firebaseプロジェクト情報と'.env'の対応  
```
EXPO_PUBLIC_FB_API_KEY  
  ※ プロジェクト → ウェブ API キー  
EXPO_PUBLIC_FB_AUTH_DOMAIN  
  ※ プロジェクト → プロジェクト ID + 'firebaseapp.com'  
    プロジェクトIDがtestAPP123なら'testAPP123.firebaseapp.com'  
EXPO_PUBLIC_FB_PROJECT_ID  
  ※ プロジェクト → プロジェクト ID  
EXPO_PUBLIC_FB_STORAGE_BUCKET  
  ※ プロジェクト → プロジェクト ID + '.firebasestorage.app'  
    プロジェクトIDがtestAPP123なら'testAPP123.firebasestorage.app'  
EXPO_PUBLIC_FB_MESSAGINGSENDER  
  ※ プロジェクト → プロジェクト番号  
EXPO_PUBLIC_FB_APP_ID  
  ※ マイアプリ → アプリID  
```
</details>


## 課題や今後の改善点
App StoreへのOTA updateを経験する為に、リリースに向けた対応実施。  
※セキュリティ面の見直し(現状メールアドレス認証のみなので、OAuth 2.0の実装等)
 
## 参照
React Native, Firebase, Expo でアプリ開発をゼロから始めよう！  
https://www.udemy.com/course/react-native-ios-android/

→ベースはudemyの上記教材で作成した成果物。教材一通り完了後に対して、以下の機能を追加

「追加機能」
1. 優先度登録
2. 一覧表示データのソート
3. アカウント設定(メールアドレス変更、パスワード変更、パスワード再発行、退会)
4. お試し体験モード(アカウント登録なしで、一覧表示と詳細表示可能)
