import Head from 'next/head';
import WritingForm from '../components/WritingForm';
import Posts from '../components/Posts';

const IndexPage = ({ posts }) => (
  <>
    <Head>
      <title>86チャンネル</title>
    </Head>
    <Posts posts={posts} />
    <WritingForm />
  </>
);

export async function getServerSideProps(context) {
  const res = await fetch('http://localhost:8888/all', {
    method: 'get',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    redirect: 'follow',
  });
  const posts = await res.json();
  return {
    props: { posts },
  };
}

export default IndexPage;
