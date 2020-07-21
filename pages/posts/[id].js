import { useRouter } from "next/router";
import IndexPage from "../index.js";

// 詳細確認ページ
const DetailPage = ({ posts, reference }) => {
  return IndexPage({ posts, reference });
};

// 投稿IDに紐づく投稿内容詳細取得
const getDetail = async id => {
  const res = await fetch("http://localhost:8888/detail?id=" + id, {
    method: "get",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow"
  }).catch(error => console.log(error));
  const detail = await res.json();
  return detail;
};

// 投稿IDに紐づく投稿の参照情報取得
const getDetailRef = async id => {
  const res = await fetch("http://localhost:8888/detail/reference?id=" + id, {
    method: "get",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow"
  }).catch(error => console.log(error));
  const detail_ref = await res.json();
  return detail_ref;
};

// リクエスト時に投稿IDに紐づく投稿情報をページへ送る
export async function getServerSideProps(context) {
  const id = context.params.id;
  const posts = await getDetail(id);
  const reference = await getDetailRef(id);

  return {
    props: { posts, reference }
  };
}

export default DetailPage;
