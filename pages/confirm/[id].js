import Router from "next/router";
import styles from "../../styles/Confirm.module.css";

class ConfirmPage extends React.Component {
  componentDidMount() {
    if (this.props.inquiry.message == "ok") {
      setTimeout(() => {
        Router.push("/");
      }, 2000);
    }
  }

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

  cancelDelete(e) {
    e.preventDefault();
    Router.push("/");
  }

  render() {
    const id = this.props.inquiry.id;
    const message = this.props.inquiry.message;
    const host = this.props.inquiry.host;
    const name = this.props.inquiry.name;
    const email = this.props.inquiry.email;
    const body_text = this.props.inquiry.body_text;

    if (message !== "ok") {
      let title;
      if (message === "delete") {
        title = <span className={styles.delete}>本当に削除しますか？</span>;
      } else {
        title = (
          <span className={styles.error}>
            <b>ERROR: {message}</b>
          </span>
        );
      }
      let button;
      if (message === "delete") {
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
              <li>名前：{name}</li>
              <li> E-mail： {email}</li> <li>内容：{body_text}</li>
            </ul>
          </ul>
          {button}
        </>
      );
    } else {
      return <div>書き込みました。ページは自動遷移します。</div>;
    }
  }
}

const getInquiry = async (id, post_id) => {
  const query = post_id
    ? "http://localhost:8888/confirm?id=" + id + "&postid=" + post_id
    : "http://localhost:8888/confirm?id=" + id;
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
  console.log(inquiry)
  return inquiry;
};

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
  const inquiry = (await res.json())[0];
  return inquiry;
};

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

export async function getServerSideProps(context) {
  const id = context.params.id;
  const post_id = context.query.postid;
  const delete_id = context.query.deleteid;
  console.log("query---", context.query);
  console.log(delete_id)
   console.log(typeof delete_id)
  let inquiry = {};

  if (typeof delete_id !== "undefined") {
    inquiry = await getDetail(id);
    console.log("delete----")
    inquiry.message = "delete";
  } else if (typeof post_id !== "undefined") {
    console.log("update----")
    inquiry = await getInquiry(id, post_id);
    if (inquiry.message === "ok") {
      await updateData(inquiry);
    }
  } else {
    inquiry = await getInquiry(id);
    console.log("isert", inquiry);
    if (inquiry.message === "ok") {
      await registData(inquiry);
    }
  }
  return {
    props: { inquiry }
  };
}

export default ConfirmPage;
