import Router from "next/router";
import WritingForm from "../../components/WritingForm";
import { getDetail } from "../confirm/[id].js";

// 投稿内容更新ページ。
// 更新対象の投稿詳細を取得し、書き込んだ内容を更新内容一時保存テーブルへ登録する
class UpdatePage extends React.Component {
  render() {
    return (
      <WritingForm
        onSubmit={insertUpdate}
        update_data={this.props.detail}
        title="レスを更新する"
      />
    );
  }
}

// 更新内容を一時保存テーブルへ登録
const insertUpdate = async (e, state, update_data) => {
  e.preventDefault();
  const data = {
    post_id: update_data.id,
    user_id: update_data.user_id,
    val_name: state.val_name,
    val_email: state.val_email,
    val_body: state.val_body
  };

  await fetch("http://localhost:8888/temp/update", {
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
    .then(result => {
      Router.push("/confirm/" + result.id + "?postid=" + data.post_id);
    })
    .catch(error => console.log(error));
};

// リクエスト時に投稿IDに紐づく投稿の詳細をページへ送る
export async function getServerSideProps(context) {
  const id = context.params.id;
  const detail = await getDetail(id);

  return {
    props: { detail }
  };
}

export default UpdatePage;
