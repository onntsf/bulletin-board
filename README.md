# 5ちゃんねるを真似た掲示板 
Next.js（React） + Node.js（express） + MySQLで5ちゃんねるの１スレッドを実装しました


## 実装事項
### 本家にあるもの
* レスの閲覧機能
* レスの書込機能
* 外部リンク機能（http[s]から始まる文章はリンクとして機能）
* アンカー機能（ >>17 など。popoverも再現）
* 見栄え（配色やレイアウト、ページ遷移）


### オリジナルのもの
* レスの削除機能
* レスの更新機能（既に書き込んだ記事を編集できる機能）


## MySQL テーブル構造
t_post (投稿管理)

| Field        | Type       | Null | Key | Default | Extra          |
| ------------ | ---------- | ---- | --- | ------- | -------------- |
| id           | smallint   | NO   | PRI | NULL    | auto_increment |
| thread_id    | smallint   | NO   |     | NULL    |                |
| user_id      | smallint   | NO   | MUL | NULL    |                |
| body_text    | text       | NO   |     | NULL    |                |
| created_date | datetime   | NO   |     | NULL    |                |
| updated_date | datetime   | NO   |     | NULL    |                |
| deleted      | tinyint(1) | NO   |     | 0       |                |


t_referene (参照情報管理)

| Field         | Type       | Null | Key | Default | Extra          |
| ------------- | ---------- | ---- | --- | ------- | -------------- |
| id            | smallint   | NO   | PRI | NULL    | auto_increment |
| referred_from | smallint   | NO   | MUL | NULL    |                |
| refer_to      | smallint   | NO   | MUL | NULL    |                |
| created_date  | datetime   | NO   |     | NULL    |                |
| updated_date  | datetime   | NO   |     | NULL    |                |
| deleted       | tinyint(1) | NO   |     | 0       |                |


t_inquiry (投稿内容一時保存)


| Field        | Type       | Null | Key | Default | Extra          |
| ------------ | ---------- | ---- | --- | ------- | -------------- |
| id           | smallint   | NO   | PRI | NULL    | auto_increment |
| host         | text       | YES  |     | NULL    |                |
| name         | text       | YES  |     | NULL    |                |
| email        | text       | YES  |     | NULL    |                |
| body_text    | text       | YES  |     | NULL    |                |
| message      | text       | YES  |     | NULL    |                |
| created_date | datetime   | NO   |     | NULL    |                |
| updated_date | datetime   | NO   |     | NULL    |                |
| deleted      | tinyint(1) | NO   |     | 0       |                |


t_update (更新内容一時保存)

| Field        | Type       | Null | Key | Default | Extra          |
| ------------ | ---------- | ---- | --- | ------- | -------------- |
| id           | smallint   | NO   | PRI | NULL    | auto_increment |
| post_id      | smallint   | NO   |     | NULL    |                |
| user_id      | smallint   | NO   |     | NULL    |                |
| host         | text       | YES  |     | NULL    |                |
| name         | text       | YES  |     | NULL    |                |
| email        | text       | YES  |     | NULL    |                |
| body_text    | text       | YES  |     | NULL    |                |
| message      | text       | YES  |     | NULL    |                |
| created_date | datetime   | NO   |     | NULL    |                |
| updated_date | datetime   | NO   |     | NULL    |                |
| deleted      | tinyint(1) | NO   |     | 0       |                |


m_user (ユーザ管理)

| Field        | Type       | Null | Key | Default | Extra          |
| ------------ | ---------- | ---- | --- | ------- | -------------- |
| id           | smallint   | NO   | PRI | NULL    | auto_increment |
| user_name    | text       | NO   |     | NULL    |                |
| user_email   | text       | YES  |     | NULL    |                |
| created_date | datetime   | NO   |     | NULL    |                |
| updated_date | datetime   | NO   |     | NULL    |                |
| deleted      | tinyint(1) | NO   |     | 0       |                |



## 制作の過程で学んだこと、感じたこと
### 学んだこと
- 後から見た時に分かりやすい変数名を付けることの重要さを改めて学びました。(idという変数名を使いすぎていて、自分でも混乱した場面がありました。)
- 1人で作業していると、朝一と食後、一区切りついた後にモチベーションが下がることを学びました。そして仮眠を取る、または少し部屋の外に出ることで、ほぼ対処できることがわかりました。


### 感じたこと
- JavaScriptはWebページのUIをいい感じにするための言語だと思っていましたが、Node.jsやNext.jsに触れて、世界が広がりました。
- やはりプログラミングや優れた技術に触れるのは楽しく、もっと学びたいと感じました。
- 都度的確に教えていただけたので、最初はとても難しく感じましたが、何とか一応形にでき嬉しく思いました。

