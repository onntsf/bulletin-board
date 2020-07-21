import Head from 'next/head';
import Router from 'next/router';
import WritingForm from '../components/WritingForm';
import Posts from '../components/Posts';
import styles from './styles/Index.module.css';

const IndexPage = (props) => {
  const { posts } = props;
  const { reference } = props;

  return (
    <>
      <Head>
        <title>86チャンネル</title>
      </Head>
      <div className={styles.header}>
        <img src="/86ch_logo.png" alt="logo" />
      </div>

      <div className={styles.container}>
        <h1 className={styles.title}>テスト</h1>
        <div className={styles.pagestats}>
          <ul className={styles.menujust}>
            <li className={styles.metastats}>
              {posts.length}
              コメント
            </li>
          </ul>
        </div>
        <Posts posts={posts} reference={reference} />
        <WritingForm
          onSubmit={insertTemp}
          update_data={{}}
          title="レスを投稿する"
        />
      </div>
    </>
  );
};

// 既存投稿取得
const getPosts = async () => {
  const res = await fetch('http://localhost:8888/posts', {
    method: 'get',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    redirect: 'follow',
  });
  const posts = await res.json();

  return posts;
};

// 既存投稿の参照情報取得(アンカー作成のため)
const getReference = async () => {
  const res = await fetch('http://localhost:8888/reference', {
    method: 'get',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    redirect: 'follow',
  });
  const ref = await res.json();
  ref.sort((a, b) => (a.refer_to < b.refer_to ? -1 : 1));

  return ref;
};

// 投稿内容をDBに一時保存、確認ページへ移動
const insertTemp = async (e, state) => {
  e.preventDefault();
  const data = {
    val_name: state.val_name,
    val_email: state.val_email,
    val_body: state.val_body,
  };
  await fetch('http://localhost:8888/temp', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    redirect: 'follow',
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      Router.push(`/confirm/${data.id}`);
    })
    .catch((error) => console.log(error));
};

// リクエスト時に既存投稿情報をページへ送る
export async function getServerSideProps(context) {
  const posts = await getPosts();
  const reference = await getReference();
  const props = { posts, reference };

  return {
    props,
  };
}

export default IndexPage;
