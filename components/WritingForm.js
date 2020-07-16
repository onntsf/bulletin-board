import Router from "next/router";

class WritingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val_name: "",
      val_email: "",
      val_body: ""
    };
  }

  handleNameChange(e) {
    e.preventDefault();
    this.setState({ val_name: e.target.value });
  }

  handleEmailChange(e) {
    e.preventDefault();
    this.setState({ val_email: e.target.value });
  }

  handleBodyChange(e) {
    e.preventDefault();
    this.setState({ val_body: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const data = {
      post_name: "post-form",
      val_name: this.state.val_name,
      val_email: this.state.val_email,
      val_body: this.state.val_body
    };
    const res = await fetch("http://localhost:8888/", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      redirect: "follow",
      body: JSON.stringify(data)
    }).catch(error => console.log(error));
    const result = await res.json();
    if (result.message == "ok") {
      Router.reload();
    }
  }

  render() {
    return (
      <form method="post" onSubmit={e => this.handleSubmit(e)}>
        名前：
        <input
          type="text"
          value={this.state.val_name}
          onChange={e => this.handleNameChange(e)}
        />
        E-mail：
        <input
          type="text"
          value={this.state.val_email}
          onChange={e => this.handleEmailChange(e)}
        />
        <textarea
          value={this.state.val_body}
          onChange={e => this.handleBodyChange(e)}
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default WritingForm;
