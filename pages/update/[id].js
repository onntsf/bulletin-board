import WritingForm from "../../components/WritingForm";
import Router from "next/router";

class UpdatePage extends React.Component {
  render() {
    const init_data = {
      name: this.props.detail.name,
      email: this.props.detail.email,
      bodytext: this.props.detail.bodytext
    };

    return (
      <WritingForm
        onSubmit={insertUpdate}
        init={init_data}
        update_data={this.props.detail}
      />
    );
  }
}

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
    .then(result=> {
      Router.push("/confirm/" + result.id + "?postid=" + data.post_id);
    })
    .catch(error => console.log(error));
};

const getDetail = async id => {
  const res = await fetch("http://localhost:8888/detail/?id=" + id, {
    method: "get",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow"
  }).catch(error => console.log(error));
  const detail = (await res.json())[0];
  return detail;
};

export async function getServerSideProps(context) {
  const id = context.params.id;
  const detail = await getDetail(id);

  return {
    props: { detail } 
  };
}

export default UpdatePage;
