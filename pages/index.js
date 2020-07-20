import Head from "next/head";
import WritingForm from "../components/WritingForm";
import Posts from "../components/Posts";
import Router from "next/router";

const IndexPage = ({ posts, reference }) => (
  <>
    <Head>
      <title>86チャンネル</title>
    </Head>
    <Posts posts={posts} reference={reference} />
    <WritingForm onSubmit={insertTemp} init={{}} />
  </>
);

const insertTemp=  async (e, state)=> {
    e.preventDefault();
    const data = {
      val_name: state.val_name,
      val_email: state.val_email,
      val_body: state.val_body
    };
    await fetch("http://localhost:8888/temp", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      redirect: "follow",
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        Router.push("/confirm/" + data.id);
      })
      .catch(error => console.log(error));
  }

const getPosts = async () => {
  const res = await fetch("http://localhost:8888/posts", {
    method: "get",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow"
  });
  const posts = await res.json();
  return posts;
};

const getReference = async () => {
  const res = await fetch("http://localhost:8888/reference", {
    method: "get",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow"
  });
  let ref = await res.json();
  ref.sort((a, b) => (a.refer_to < b.refer_to ? -1 : 1));
  return ref;
};

export async function getServerSideProps(context) {
  const posts = await getPosts();
  const reference = await getReference();
  return {
    props: { posts, reference }
  };
}

export default IndexPage;
