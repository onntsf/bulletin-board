import Router from "next/router";
import styles from "../styles/Confirm.module.css";

// 投稿内容の確認ページ。
// 投稿書き込み時、更新内容書き込み時、投稿削除時に遷移してくる。
// 書き込み確認の場合、投稿内容をチェックし、問題ない場合はDBに書き込み、Indexページへ遷移
// 問題があった場合には投稿内容とエラーメッセージを表示する。
// 投稿削除の場合、投稿内容を表示し、削除またはキャンセルの挙動をする。
class ConfirmPage extends React.Component {
  componentDidMount() {
    // 投稿内容に問題がない場合、2秒後にIndexページへ遷移
    if (this.props.inquiry.message == "ok") {
      setTimeout(() => {
        Router.push("/");
      }, 2000);
    }
  }

  // 投稿削除ボタン押下時処理。DBの該当投稿の削除フラグを立て、Indexページへ遷移。
  async deletePost(e) {
    e.preventDefault();
    await fetch("http://localhost:8888/delete", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      redirect: "follow",
      body: JSON.stringify(this.props.inquiry)
    })
      .then(() => Router.push("/"))
      .catch(error => console.log(error));
  }

  // 投稿削除キャンセルボタン押下時処理。Indexページへ戻る。
  cancelDelete(e) {
    e.preventDefault();
    Router.push("/");
  }

  render() {
    const { id } = this.props.inquiry;
    const { message } = this.props.inquiry;
    const { host } = this.props.inquiry;
    const { name } = this.props.inquiry;
    const { email } = this.props.inquiry;
    const { body_text } = this.props.inquiry;

    if (message !== "ok") {
      // 投稿内容に問題があった場合、もしくは投稿削除時

      let title;
      let button;
      if (message === "delete") {
        title = <span className={styles.delete}>本当に削除しますか？</span>;
        button = (
          <div className={styles.wrap_button}>
            <button
              className={styles.button}
              type="submit"
              onClick={e => this.deletePost(e)}
            >
              削除
            </button>
            <button
              className={styles.button}
              type="submit"
              onClick={e => this.cancelDelete(e)}
            >
              キャンセル
            </button>
          </div>
        );
      } else {
        title = (
          <span className={styles.error}>
            <b> ERROR: {message} </b>
          </span>
        );
      }

      return (
        <>
          {title}
          <ul>
            <li>
              問い合わせID：<b>{id}</b>
            </li>
            <li>
              ホスト：<b>{host}</b>
            </li>
            <ul>
              <li>名前：{name} </li>
              <li> E-mail：{email} </li>
              <li>内容：{body_text} </li>
            </ul>
          </ul>
          {button}
        </>
      );
    }
    // 投稿内容に問題なかった場合
    return <div>書き込みました。ページは自動遷移します。</div>;
  }
}

// 一時保存中の投稿内容取得
const getInquiry = async (id, post_id) => {
  // 更新の場合postidが送られてくる
  const query = post_id
    ? `http://localhost:8888/confirm?id=${id}&postid=${post_id}`
    : `http://localhost:8888/confirm?id=${id}`;
  const res = await fetch(query, {
    method: "get",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow"
  }).catch(error => console.log(error));
  const inquiry = (await res.json())[0];
  return inquiry;
};

// 投稿内容取得(削除時)
const getDetail = async id => {
  const res = await fetch(`http://localhost:8888/detail?id=${id}`, {
    method: "get",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow"
  }).catch(error => console.log(error));
  const inquiry = (await res.json())[0];
  return inquiry;
};

// 投稿登録
const registData = async data => {
  await fetch("http://localhost:8888/register", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow",
    body: JSON.stringify(data)
  }).catch(error => console.log(error));
};

// 投稿更新
const updateData = async data => {
  await fetch("http://localhost:8888/update", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow",
    body: JSON.stringify(data)
  }).catch(error => console.log(error));
};

// リクエスト時に投稿内容を取得、ページへ送る
export async function getServerSideProps(context) {
  const { id } = context.params;
  const post_id = context.query.postid;
  const delete_id = context.query.deleteid;
  let inquiry = {};

  if (typeof delete_id !== "undefined") {
    // 投稿削除の場合
    inquiry = await getDetail(id);
    inquiry.message = "delete";
  } else if (typeof post_id !== "undefined") {
    // 投稿更新の場合
    inquiry = await getInquiry(id, post_id);
    if (inquiry.message === "ok") {
      await updateData(inquiry);
    }
  } else {
    // 投稿書き込みの場合
    inquiry = await getInquiry(id);
    if (inquiry.message === "ok") {
      await registData(inquiry);
    }
  }

  return {
    props: { inquiry }
  };
}

export default ConfirmPage;
